import { Router, Request, Response } from 'express';
import { Shipment } from '../models/Shipment';
import { Order } from '../models/Order';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/shipments - Get all shipments with pagination and filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, carrierId, country } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (carrierId) filter['carrier.id'] = carrierId;
    if (country) {
      filter.$or = [
        { 'origin.country': country },
        { 'destination.country': country }
      ];
    }
    
    const shipments = await Shipment.find(filter)
      .populate('orderId', 'orderNumber shipper consignee cargo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const total = await Shipment.countDocuments(filter);
    
    res.json({
      shipments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    throw createError('Failed to fetch shipments', 500);
  }
});

// POST /api/shipments - Create new shipment
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      carrier,
      origin,
      destination,
      waypoints,
      route,
      estimatedPickup,
      estimatedDelivery
    } = req.body;
    
    // Validate required fields
    if (!orderId || !carrier || !origin || !destination || !estimatedPickup || !estimatedDelivery) {
      throw createError('Missing required fields', 400);
    }
    
    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError('Order not found', 404);
    }
    
    // Create new shipment
    const shipment = new Shipment({
      orderId,
      carrier,
      origin,
      destination,
      waypoints: waypoints || [],
      route: route || {
        totalDistance: 0,
        estimatedDuration: 0,
        estimatedCost: 0,
        co2Footprint: 0,
        routePolyline: []
      },
      estimatedPickup: new Date(estimatedPickup),
      estimatedDelivery: new Date(estimatedDelivery),
      status: 'pending',
      trackingEvents: []
    });
    
    await shipment.save();
    
    // Update order status
    await Order.findByIdAndUpdate(orderId, { status: 'processing' });
    
    res.status(201).json({
      message: 'Shipment created successfully',
      shipment: {
        id: shipment._id,
        shipmentNumber: shipment.shipmentNumber,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        createdAt: shipment.createdAt
      }
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to create shipment', 500);
  }
});

// GET /api/shipments/:id - Get specific shipment
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const shipment = await Shipment.findById(id)
      .populate('orderId', 'orderNumber shipper consignee cargo')
      .lean();
    
    if (!shipment) {
      throw createError('Shipment not found', 404);
    }
    
    res.json({ shipment });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to fetch shipment', 500);
  }
});

// PUT /api/shipments/:id - Update shipment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData.shipmentNumber;
    delete updateData.orderId;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    const shipment = await Shipment.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('orderId', 'orderNumber shipper consignee cargo').lean();
    
    if (!shipment) {
      throw createError('Shipment not found', 404);
    }
    
    res.json({
      message: 'Shipment updated successfully',
      shipment
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to update shipment', 500);
  }
});

// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const shipment = await Shipment.findByIdAndDelete(id);
    if (!shipment) {
      throw createError('Shipment not found', 404);
    }
    
    res.json({
      message: 'Shipment deleted successfully',
      shipmentId: id
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to delete shipment', 500);
  }
});

// GET /api/shipments/:id/tracking - Get shipment tracking info
router.get('/:id/tracking', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const shipment = await Shipment.findById(id)
      .select('shipmentNumber status trackingEvents estimatedDelivery actualDelivery')
      .lean();
    
    if (!shipment) {
      throw createError('Shipment not found', 404);
    }
    
    res.json({
      shipmentNumber: shipment.shipmentNumber,
      status: shipment.status,
      trackingEvents: shipment.trackingEvents,
      estimatedDelivery: shipment.estimatedDelivery,
      actualDelivery: shipment.actualDelivery
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to fetch tracking information', 500);
  }
});

// POST /api/shipments/:id/tracking - Add tracking update
router.post('/:id/tracking', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, location, notes, updatedBy } = req.body;
    
    if (!status || !location || !updatedBy) {
      throw createError('Status, location, and updatedBy are required', 400);
    }
    
    const trackingEvent = {
      status,
      location: {
        ...location,
        timestamp: new Date()
      },
      timestamp: new Date(),
      notes,
      updatedBy
    };
    
    const shipment = await Shipment.findByIdAndUpdate(
      id,
      {
        $push: { trackingEvents: trackingEvent },
        status,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).lean();
    
    if (!shipment) {
      throw createError('Shipment not found', 404);
    }
    
    res.status(201).json({
      message: 'Tracking update added successfully',
      trackingEvent,
      newStatus: status
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to add tracking update', 500);
  }
});

// PATCH /api/shipments/:id/status - Update shipment status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      throw createError('Status is required', 400);
    }
    
    const shipment = await Shipment.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!shipment) {
      throw createError('Shipment not found', 404);
    }
    
    res.json({
      message: 'Shipment status updated successfully',
      shipment: {
        id: shipment._id,
        shipmentNumber: shipment.shipmentNumber,
        status: shipment.status,
        updatedAt: shipment.updatedAt
      }
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to update shipment status', 500);
  }
});

export default router;
