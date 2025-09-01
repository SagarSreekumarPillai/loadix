import { Router, Request, Response } from 'express';
import { Carrier } from '../models/Carrier';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/carriers - Get all carriers with pagination and filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, country, service, isActive } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build filter object
    const filter: any = {};
    if (country) filter['contactInfo.country'] = country;
    if (service) filter[`services.${service}`] = true;
    if (isActive !== undefined) filter['availability.isActive'] = isActive === 'true';
    
    const carriers = await Carrier.find(filter)
      .sort({ 'performance.rating': -1, 'performance.totalShipments': -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const total = await Carrier.countDocuments(filter);
    
    res.json({
      carriers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    throw createError('Failed to fetch carriers', 500);
  }
});

// POST /api/carriers - Create new carrier
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      companyType,
      contactInfo,
      services,
      vehicles,
      serviceAreas,
      certifications,
      pricing,
      compliance
    } = req.body;
    
    // Validate required fields
    if (!name || !companyType || !contactInfo || !pricing || !compliance) {
      throw createError('Missing required fields', 400);
    }
    
    // Create new carrier
    const carrier = new Carrier({
      name,
      companyType,
      contactInfo,
      services: services || {
        domestic: true,
        international: false,
        express: false,
        standard: true,
        temperatureControlled: false,
        hazardous: false,
        oversized: false
      },
      vehicles: vehicles || [],
      serviceAreas: serviceAreas || [],
      certifications: certifications || [],
      pricing,
      compliance,
      performance: {
        rating: 5.0,
        totalShipments: 0,
        onTimeDelivery: 100,
        damageRate: 0,
        lastUpdated: new Date()
      },
      availability: {
        isActive: true,
        operatingHours: {
          start: '08:00',
          end: '18:00',
          timezone: 'Europe/Brussels'
        },
        holidays: [],
        maxLeadTime: 24
      }
    });
    
    await carrier.save();
    
    res.status(201).json({
      message: 'Carrier created successfully',
      carrier: {
        id: carrier._id,
        carrierId: carrier.carrierId,
        name: carrier.name,
        companyType: carrier.companyType,
        isActive: carrier.availability.isActive
      }
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to create carrier', 500);
  }
});

// GET /api/carriers/:id - Get specific carrier
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const carrier = await Carrier.findById(id).lean();
    if (!carrier) {
      throw createError('Carrier not found', 404);
    }
    
    res.json({ carrier });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to fetch carrier', 500);
  }
});

// PUT /api/carriers/:id - Update carrier
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData.carrierId;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    const carrier = await Carrier.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!carrier) {
      throw createError('Carrier not found', 404);
    }
    
    res.json({
      message: 'Carrier updated successfully',
      carrier
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to update carrier', 500);
  }
});

// DELETE /api/carriers/:id - Delete carrier
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const carrier = await Carrier.findByIdAndDelete(id);
    if (!carrier) {
      throw createError('Carrier not found', 404);
    }
    
    res.json({
      message: 'Carrier deleted successfully',
      carrierId: id
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to delete carrier', 500);
  }
});

// PATCH /api/carriers/:id/status - Update carrier availability status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      throw createError('isActive must be a boolean', 400);
    }
    
    const carrier = await Carrier.findByIdAndUpdate(
      id,
      { 'availability.isActive': isActive, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!carrier) {
      throw createError('Carrier not found', 404);
    }
    
    res.json({
      message: 'Carrier status updated successfully',
      carrier: {
        id: carrier._id,
        carrierId: carrier.carrierId,
        name: carrier.name,
        isActive: carrier.availability.isActive,
        updatedAt: carrier.updatedAt
      }
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to update carrier status', 500);
  }
});

// GET /api/carriers/:id/performance - Get carrier performance metrics
router.get('/:id/performance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const carrier = await Carrier.findById(id)
      .select('name performance totalShipments')
      .lean();
    
    if (!carrier) {
      throw createError('Carrier not found', 404);
    }
    
    res.json({
      carrierId: carrier._id,
      name: carrier.name,
      performance: carrier.performance
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to fetch carrier performance', 500);
  }
});

// POST /api/carriers/:id/performance - Update carrier performance
router.post('/:id/performance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, onTimeDelivery, damageRate } = req.body;
    
    const updateData: any = { 'performance.lastUpdated': new Date() };
    if (rating !== undefined) updateData['performance.rating'] = rating;
    if (onTimeDelivery !== undefined) updateData['performance.onTimeDelivery'] = onTimeDelivery;
    if (damageRate !== undefined) updateData['performance.damageRate'] = damageRate;
    
    const carrier = await Carrier.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!carrier) {
      throw createError('Carrier not found', 404);
    }
    
    res.json({
      message: 'Carrier performance updated successfully',
      performance: carrier.performance
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError('Failed to update carrier performance', 500);
  }
});

export default router;
