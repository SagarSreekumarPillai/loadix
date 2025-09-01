import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  timestamp: Date;
}

export interface ITrackingEvent {
  status: string;
  location: ILocation;
  timestamp: Date;
  notes?: string;
  updatedBy: string;
}

export interface IShipment extends Document {
  shipmentNumber: string;
  orderId: mongoose.Types.ObjectId;
  carrier: {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  origin: ILocation;
  destination: ILocation;
  waypoints: ILocation[];
  route: {
    totalDistance: number;
    estimatedDuration: number;
    estimatedCost: number;
    co2Footprint: number;
    routePolyline: Array<{ lat: number; lng: number }>;
  };
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  trackingEvents: ITrackingEvent[];
  estimatedPickup: Date;
  estimatedDelivery: Date;
  actualPickup?: Date;
  actualDelivery?: Date;
  exceptions: Array<{
    type: string;
    description: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  documents: Array<{
    type: string;
    filename: string;
    url: string;
    uploadedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const TrackingEventSchema = new Schema<ITrackingEvent>({
  status: { type: String, required: true },
  location: { type: LocationSchema, required: true },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String },
  updatedBy: { type: String, required: true }
});

const ShipmentSchema = new Schema<IShipment>({
  shipmentNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => `SHP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  carrier: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  origin: { type: LocationSchema, required: true },
  destination: { type: LocationSchema, required: true },
  waypoints: [{ type: LocationSchema }],
  route: {
    totalDistance: { type: Number, required: true, min: 0 },
    estimatedDuration: { type: Number, required: true, min: 0 },
    estimatedCost: { type: Number, required: true, min: 0 },
    co2Footprint: { type: Number, required: true, min: 0 },
    routePolyline: [{ lat: Number, lng: Number }]
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception'],
    default: 'pending'
  },
  trackingEvents: [{ type: TrackingEventSchema }],
  estimatedPickup: { type: Date, required: true },
  estimatedDelivery: { type: Date, required: true },
  actualPickup: { type: Date },
  actualDelivery: { type: Date },
  exceptions: [{
    type: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false }
  }],
  documents: [{
    type: { type: String, required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
ShipmentSchema.index({ shipmentNumber: 1 });
ShipmentSchema.index({ orderId: 1 });
ShipmentSchema.index({ status: 1 });
ShipmentSchema.index({ 'carrier.id': 1 });
ShipmentSchema.index({ estimatedDelivery: 1 });
ShipmentSchema.index({ createdAt: -1 });

export const Shipment = mongoose.model<IShipment>('Shipment', ShipmentSchema);
