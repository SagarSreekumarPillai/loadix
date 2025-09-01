import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  shipper: {
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  consignee: {
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  cargo: {
    description: string;
    weight: number;
    volume: number;
    pieces: number;
    hazardous: boolean;
    temperatureControlled: boolean;
    specialInstructions?: string;
  };
  incoterms: string;
  totalValue: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  },
  shipper: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  consignee: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  cargo: {
    description: { type: String, required: true },
    weight: { type: Number, required: true, min: 0 },
    volume: { type: Number, required: true, min: 0 },
    pieces: { type: Number, required: true, min: 1 },
    hazardous: { type: Boolean, default: false },
    temperatureControlled: { type: Boolean, default: false },
    specialInstructions: { type: String }
  },
  incoterms: {
    type: String,
    required: true,
    enum: ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']
  },
  totalValue: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'EUR'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'shipper.country': 1, 'consignee.country': 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
