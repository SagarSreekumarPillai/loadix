'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TrackingEvent {
  status: string;
  location: {
    address: string;
    city: string;
    country: string;
    timestamp: string;
  };
  timestamp: string;
  notes?: string;
  updatedBy: string;
}

interface ShipmentData {
  _id: string;
  shipmentNumber: string;
  orderId: {
    orderNumber: string;
    shipper: { name: string; city: string; country: string };
    consignee: { name: string; city: string; country: string };
  };
  carrier: { name: string; contactPerson: string; phone: string };
  status: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  route: {
    totalDistance: number;
    estimatedDuration: number;
    estimatedCost: number;
    co2Footprint: number;
  };
  trackingEvents: TrackingEvent[];
}

export default function ShipmentTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchShipment = async () => {
    if (!trackingNumber.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // First, try to find shipment by tracking number
      const response = await fetch(`http://localhost:3001/api/shipments?limit=100`);
      const data = await response.json();
      
      const foundShipment = data.shipments?.find((s: any) => 
        s.shipmentNumber === trackingNumber || s.orderId?.orderNumber === trackingNumber
      );
      
      if (foundShipment) {
        // Get detailed tracking info
        const trackingResponse = await fetch(`http://localhost:3001/api/shipments/${foundShipment._id}/tracking`);
        const trackingData = await trackingResponse.json();
        
        setShipment({
          ...foundShipment,
          trackingEvents: trackingData.trackingEvents || []
        });
      } else {
        setError('Shipment not found. Please check your tracking number.');
        setShipment(null);
      }
    } catch (error) {
      setError('Failed to fetch shipment information. Please try again.');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'pending': 'bg-gray-100 text-gray-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'picked_up': 'bg-yellow-100 text-yellow-800',
      'in_transit': 'bg-purple-100 text-purple-800',
      'out_for_delivery': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'exception': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const statusIcons: { [key: string]: string } = {
      'pending': '⏳',
      'assigned': '📋',
      'picked_up': '📦',
      'in_transit': '🚛',
      'out_for_delivery': '🚚',
      'delivered': '✅',
      'exception': '⚠️'
    };
    return statusIcons[status] || '❓';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = () => {
    if (!shipment) return 0;
    
    const statusOrder = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(shipment.status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">🚛 Shipment Tracking</h1>
        <p className="text-gray-600 mt-2">
          Track your shipments in real-time with detailed status updates
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🔍 Track Shipment</CardTitle>
          <CardDescription>
            Enter your shipment number or order number to track your delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="tracking-number">Tracking Number / Order Number</Label>
              <Input
                id="tracking-number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter shipment number or order number"
                onKeyPress={(e) => e.key === 'Enter' && searchShipment()}
              />
            </div>
            <Button 
              onClick={searchShipment} 
              disabled={loading || !trackingNumber.trim()}
              className="mt-6"
            >
              {loading ? 'Searching...' : 'Track'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Shipment Information */}
      {shipment && (
        <div className="space-y-6">
          {/* Shipment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 Shipment {shipment.shipmentNumber}
              </CardTitle>
              <CardDescription>
                Order: {shipment.orderId.orderNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Route Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">From:</span> {shipment.orderId.shipper.name}, {shipment.orderId.shipper.city}, {shipment.orderId.shipper.country}
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {shipment.orderId.consignee.name}, {shipment.orderId.consignee.city}, {shipment.orderId.consignee.country}
                    </div>
                    <div>
                      <span className="font-medium">Distance:</span> {shipment.route.totalDistance.toFixed(1)} km
                    </div>
                    <div>
                      <span className="font-medium">Estimated Cost:</span> €{shipment.route.estimatedCost.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">CO₂ Footprint:</span> {shipment.route.co2Footprint.toFixed(2)} kg
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Carrier Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Carrier:</span> {shipment.carrier.name}
                    </div>
                    <div>
                      <span className="font-medium">Contact:</span> {shipment.carrier.contactPerson}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {shipment.carrier.phone}
                    </div>
                    <div>
                      <span className="font-medium">Estimated Delivery:</span> {formatDate(shipment.estimatedDelivery)}
                    </div>
                    {shipment.actualDelivery && (
                      <div>
                        <span className="font-medium">Actual Delivery:</span> {formatDate(shipment.actualDelivery)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Delivery Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Current Status: {shipment.status}</span>
                  <span>{calculateProgress().toFixed(0)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Pending</span>
                <span>Assigned</span>
                <span>Picked Up</span>
                <span>In Transit</span>
                <span>Out for Delivery</span>
                <span>Delivered</span>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(shipment.status)} Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className={`text-lg px-4 py-2 ${getStatusColor(shipment.status)}`}>
                  {shipment.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-600">
                  Last updated: {shipment.trackingEvents.length > 0 ? formatDate(shipment.trackingEvents[shipment.trackingEvents.length - 1].timestamp) : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>📍 Tracking Timeline</CardTitle>
              <CardDescription>
                Complete history of shipment status updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipment.trackingEvents.length > 0 ? (
                  shipment.trackingEvents.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        {index < shipment.trackingEvents.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                        
                        <div className="text-sm">
                          <div className="font-medium">{event.location.address}</div>
                          <div className="text-gray-600">
                            {event.location.city}, {event.location.country}
                          </div>
                          {event.notes && (
                            <div className="text-gray-700 mt-1 italic">"{event.notes}"</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Updated by: {event.updatedBy}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📭</div>
                    <p>No tracking events available yet.</p>
                    <p className="text-sm">Tracking information will appear here once the shipment is processed.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      {!shipment && !error && (
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Track Your Shipment</h3>
            <p className="text-gray-600">
              Enter your shipment number or order number above to start tracking your delivery.
              You'll see real-time updates, estimated delivery times, and detailed status information.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
