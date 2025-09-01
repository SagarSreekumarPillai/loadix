import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/orders - Get all orders with pagination and filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, priority, country } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (country) {
      filter.$or = [
        { 'shipper.country': country },
        { 'consignee.country': country }
      ];
    }
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const total = await Order.countDocuments(filter);
    
    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    throw createError('Failed to fetch orders', 500);
  }
});

// POST /api/orders - Create new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      shipper,
      consignee,
      cargo,
      incoterms,
      totalValue,
      currency,
      priority
    } = req.body;
    
    // Validate required fields
    if (!shipper || !consignee || !cargo || !incoterms || !totalValue) {
      throw createError('Missing required fields', 400);
    }
    
    // Create new order
    const order = new Order({
      shipper,
      consignee,
      cargo,
      incoterms,
      totalValue,
      currency: currency || 'EUR',
      priority: priority || 'medium',
      status: 'draft'
    });
    
    await order.save();
    
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to create order', 500);
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id).lean();
    if (!order) {
      throw createError('Order not found', 404);
    }
    
    res.json({ order });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to fetch order', 500);
  }
});

// PUT /api/orders/:id - Update order
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData.orderNumber;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    const order = await Order.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!order) {
      throw createError('Order not found', 404);
    }
    
    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to update order', 500);
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      throw createError('Order not found', 404);
    }
    
    res.json({
      message: 'Order deleted successfully',
      orderId: id
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to delete order', 500);
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      throw createError('Status is required', 400);
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!order) {
      throw createError('Order not found', 404);
    }
    
    res.json({
      message: 'Order status updated successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to update order status', 500);
  }
});

export default router;
