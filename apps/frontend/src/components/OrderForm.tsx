'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface OrderFormData {
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
    specialInstructions: string;
  };
  incoterms: string;
  totalValue: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const INCOTERMS = [
  'EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF'
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

export default function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    shipper: {
      name: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      contactPerson: '',
      email: '',
      phone: ''
    },
    consignee: {
      name: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      contactPerson: '',
      email: '',
      phone: ''
    },
    cargo: {
      description: '',
      weight: 0,
      volume: 0,
      pieces: 1,
      hazardous: false,
      temperatureControlled: false,
      specialInstructions: ''
    },
    incoterms: 'FCA',
    totalValue: 0,
    currency: 'EUR',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (section: keyof OrderFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage(`✅ Order created successfully! Order #: ${result.order.orderNumber}`);
        // Reset form or redirect
      } else {
        const error = await response.json();
        setSubmitMessage(`❌ Error: ${error.error?.message || 'Failed to create order'}`);
      }
    } catch (error) {
      setSubmitMessage('❌ Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAddressSection = (
    title: string,
    section: 'shipper' | 'consignee',
    data: OrderFormData[typeof section]
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title === 'Shipper' ? '📤' : '📥'} {title}
        </CardTitle>
        <CardDescription>
          {title === 'Shipper' ? 'Origin details' : 'Destination details'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${section}-name`}>Company Name *</Label>
            <Input
              id={`${section}-name`}
              value={data.name}
              onChange={(e) => handleInputChange(section, 'name', e.target.value)}
              placeholder="Company name"
              required
            />
          </div>
          <div>
            <Label htmlFor={`${section}-contact`}>Contact Person *</Label>
            <Input
              id={`${section}-contact`}
              value={data.contactPerson}
              onChange={(e) => handleInputChange(section, 'contactPerson', e.target.value)}
              placeholder="Contact person name"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor={`${section}-address`}>Address *</Label>
          <Input
            id={`${section}-address`}
            value={data.address}
            onChange={(e) => handleInputChange(section, 'address', e.target.value)}
            placeholder="Street address"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`${section}-city`}>City *</Label>
            <Input
              id={`${section}-city`}
              value={data.city}
              onChange={(e) => handleInputChange(section, 'city', e.target.value)}
              placeholder="City"
              required
            />
          </div>
          <div>
            <Label htmlFor={`${section}-country`}>Country *</Label>
            <Input
              id={`${section}-country`}
              value={data.country}
              onChange={(e) => handleInputChange(section, 'country', e.target.value)}
              placeholder="Country"
              required
            />
          </div>
          <div>
            <Label htmlFor={`${section}-postal`}>Postal Code *</Label>
            <Input
              id={`${section}-postal`}
              value={data.postalCode}
              onChange={(e) => handleInputChange(section, 'postalCode', e.target.value)}
              placeholder="Postal code"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${section}-email`}>Email *</Label>
            <Input
              id={`${section}-email`}
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange(section, 'email', e.target.value)}
              placeholder="Email address"
              required
            />
          </div>
          <div>
            <Label htmlFor={`${section}-phone`}>Phone *</Label>
            <Input
              id={`${section}-phone`}
              type="tel"
              value={data.phone}
              onChange={(e) => handleInputChange(section, 'phone', e.target.value)}
              placeholder="Phone number"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📋 Create New Order</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create a new logistics order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipper Section */}
        {renderAddressSection('Shipper', 'shipper', formData.shipper)}
        
        {/* Consignee Section */}
        {renderAddressSection('Consignee', 'consignee', formData.consignee)}
        
        {/* Cargo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📦 Cargo Details</CardTitle>
            <CardDescription>Information about the goods being shipped</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cargo-description">Cargo Description *</Label>
              <Input
                id="cargo-description"
                value={formData.cargo.description}
                onChange={(e) => handleInputChange('cargo', 'description', e.target.value)}
                placeholder="Describe the goods being shipped"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cargo-weight">Weight (kg) *</Label>
                <Input
                  id="cargo-weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cargo.weight}
                  onChange={(e) => handleInputChange('cargo', 'weight', parseFloat(e.target.value) || 0)}
                  placeholder="Weight in kg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cargo-volume">Volume (m³) *</Label>
                <Input
                  id="cargo-volume"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cargo.volume}
                  onChange={(e) => handleInputChange('cargo', 'volume', parseFloat(e.target.value) || 0)}
                  placeholder="Volume in m³"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cargo-pieces">Number of Pieces *</Label>
                <Input
                  id="cargo-pieces"
                  type="number"
                  min="1"
                  value={formData.cargo.pieces}
                  onChange={(e) => handleInputChange('cargo', 'pieces', parseInt(e.target.value) || 1)}
                  placeholder="Number of pieces"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.cargo.hazardous}
                  onChange={(e) => handleInputChange('cargo', 'hazardous', e.target.checked)}
                  className="rounded"
                />
                <span>Hazardous Goods</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.cargo.temperatureControlled}
                  onChange={(e) => handleInputChange('cargo', 'temperatureControlled', e.target.checked)}
                  className="rounded"
                />
                <span>Temperature Controlled</span>
              </label>
            </div>
            
            <div>
              <Label htmlFor="cargo-instructions">Special Instructions</Label>
              <Input
                id="cargo-instructions"
                value={formData.cargo.specialInstructions}
                onChange={(e) => handleInputChange('cargo', 'specialInstructions', e.target.value)}
                placeholder="Any special handling requirements"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📋 Order Details</CardTitle>
            <CardDescription>Order specifications and terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="incoterms">Incoterms *</Label>
                <select
                  id="incoterms"
                  value={formData.incoterms}
                  onChange={(e) => handleInputChange('incoterms', '', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  {INCOTERMS.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="total-value">Total Value *</Label>
                <Input
                  id="total-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalValue}
                  onChange={(e) => handleInputChange('totalValue', '', parseFloat(e.target.value) || 0)}
                  placeholder="Total value"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', '', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label>Priority Level</Label>
              <div className="flex gap-2 mt-2">
                {PRIORITIES.map(priority => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handleInputChange('priority', '', priority.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.priority === priority.value
                        ? priority.color
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Submit Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                * Required fields
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Order...' : 'Create Order'}
                </Button>
              </div>
            </div>
            
            {submitMessage && (
              <div className={`mt-4 p-3 rounded-md ${
                submitMessage.startsWith('✅') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {submitMessage}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
