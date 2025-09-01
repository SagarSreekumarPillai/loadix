import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle {
  type: 'truck' | 'van' | 'trailer' | 'container' | 'air_freight' | 'sea_freight';
  capacity: {
    weight: number;
    volume: number;
    pieces: number;
  };
  specializations: string[];
  licensePlate?: string;
  trackingDevice?: string;
}

export interface IServiceArea {
  countries: string[];
  cities: string[];
  radiusKm: number;
  restrictions?: string[];
}

export interface ICarrier extends Document {
  carrierId: string;
  name: string;
  companyType: 'individual' | 'small_company' | 'large_company' | 'enterprise';
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    website?: string;
  };
  services: {
    domestic: boolean;
    international: boolean;
    express: boolean;
    standard: boolean;
    temperatureControlled: boolean;
    hazardous: boolean;
    oversized: boolean;
  };
  vehicles: IVehicle[];
  serviceAreas: IServiceArea[];
  certifications: Array<{
    type: string;
    issuer: string;
    validUntil: Date;
    documentUrl?: string;
  }>;
  pricing: {
    baseRate: number;
    perKmRate: number;
    currency: string;
    minimumCharge: number;
    fuelSurcharge: number;
    specialHandlingFee?: number;
  };
  performance: {
    rating: number;
    totalShipments: number;
    onTimeDelivery: number;
    damageRate: number;
    lastUpdated: Date;
  };
  availability: {
    isActive: boolean;
    operatingHours: {
      start: string;
      end: string;
      timezone: string;
    };
    holidays: Date[];
    maxLeadTime: number; // hours
  };
  compliance: {
    euCompliant: boolean;
    customsCertified: boolean;
    insurance: {
      type: string;
      amount: number;
      validUntil: Date;
    };
    taxId: string;
    vatNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  type: {
    type: String,
    enum: ['truck', 'van', 'trailer', 'container', 'air_freight', 'sea_freight'],
    required: true
  },
  capacity: {
    weight: { type: Number, required: true, min: 0 },
    volume: { type: Number, required: true, min: 0 },
    pieces: { type: Number, required: true, min: 1 }
  },
  specializations: [{ type: String }],
  licensePlate: { type: String },
  trackingDevice: { type: String }
});

const ServiceAreaSchema = new Schema<IServiceArea>({
  countries: [{ type: String, required: true }],
  cities: [{ type: String }],
  radiusKm: { type: Number, required: true, min: 0 },
  restrictions: [{ type: String }]
});

const CarrierSchema = new Schema<ICarrier>({
  carrierId: {
    type: String,
    required: true,
    unique: true,
    default: () => `CAR-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  },
  name: { type: String, required: true },
  companyType: {
    type: String,
    enum: ['individual', 'small_company', 'large_company', 'enterprise'],
    required: true
  },
  contactInfo: {
    primaryContact: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    website: { type: String }
  },
  services: {
    domestic: { type: Boolean, default: true },
    international: { type: Boolean, default: false },
    express: { type: Boolean, default: false },
    standard: { type: Boolean, default: true },
    temperatureControlled: { type: Boolean, default: false },
    hazardous: { type: Boolean, default: false },
    oversized: { type: Boolean, default: false }
  },
  vehicles: [{ type: VehicleSchema }],
  serviceAreas: [{ type: ServiceAreaSchema }],
  certifications: [{
    type: { type: String, required: true },
    issuer: { type: String, required: true },
    validUntil: { type: Date, required: true },
    documentUrl: { type: String }
  }],
  pricing: {
    baseRate: { type: Number, required: true, min: 0 },
    perKmRate: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'EUR' },
    minimumCharge: { type: Number, required: true, min: 0 },
    fuelSurcharge: { type: Number, required: true, min: 0 },
    specialHandlingFee: { type: Number, min: 0 }
  },
  performance: {
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalShipments: { type: Number, default: 0, min: 0 },
    onTimeDelivery: { type: Number, default: 100, min: 0, max: 100 },
    damageRate: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now }
  },
  availability: {
    isActive: { type: Boolean, default: true },
    operatingHours: {
      start: { type: String, required: true, default: '08:00' },
      end: { type: String, required: true, default: '18:00' },
      timezone: { type: String, required: true, default: 'Europe/Brussels' }
    },
    holidays: [{ type: Date }],
    maxLeadTime: { type: Number, required: true, default: 24, min: 1 }
  },
  compliance: {
    euCompliant: { type: Boolean, required: true, default: true },
    customsCertified: { type: Boolean, default: false },
    insurance: {
      type: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
      validUntil: { type: Date, required: true }
    },
    taxId: { type: String, required: true },
    vatNumber: { type: String }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
CarrierSchema.index({ carrierId: 1 });
CarrierSchema.index({ name: 1 });
CarrierSchema.index({ 'contactInfo.country': 1 });
CarrierSchema.index({ 'services.domestic': 1, 'services.international': 1 });
CarrierSchema.index({ 'availability.isActive': 1 });
CarrierSchema.index({ 'performance.rating': -1 });
CarrierSchema.index({ 'pricing.perKmRate': 1 });

export const Carrier = mongoose.model<ICarrier>('Carrier', CarrierSchema);
