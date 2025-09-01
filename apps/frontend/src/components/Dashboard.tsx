'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Order {
  _id: string;
  orderNumber: string;
  shipper: { name: string; city: string; country: string };
  consignee: { name: string; city: string; country: string };
  cargo: { description: string; weight: number; volume: number };
  status: string;
  priority: string;
  totalValue: number;
  currency: string;
  createdAt: string;
}

interface Shipment {
  _id: string;
  shipmentNumber: string;
  orderId: { orderNumber: string; shipper: { name: string }; consignee: { name: string } };
  carrier: { name: string };
  status: string;
  estimatedDelivery: string;
  route: { totalDistance: number; estimatedCost: number; co2Footprint: number };
}

interface DashboardStats {
  totalOrders: number;
  totalShipments: number;
  activeShipments: number;
  totalValue: number;
  averageDeliveryTime: number;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalShipments: 0,
    activeShipments: 0,
    totalValue: 0,
    averageDeliveryTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'shipments'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await fetch('http://localhost:3001/api/orders?limit=10');
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.orders || []);
      
      // Fetch shipments
      const shipmentsResponse = await fetch('http://localhost:3001/api/shipments?limit=10');
      const shipmentsData = await shipmentsResponse.json();
      setShipments(shipmentsData.shipments || []);
      
      // Calculate stats
      const totalValue = ordersData.orders?.reduce((sum: number, order: Order) => sum + order.totalValue, 0) || 0;
      const activeShipments = shipmentsData.shipments?.filter((s: Shipment) => 
        ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)
      ).length || 0;
      
      setStats({
        totalOrders: ordersData.pagination?.total || 0,
        totalShipments: shipmentsData.pagination?.total || 0,
        activeShipments,
        totalValue,
        averageDeliveryTime: 3.2 // Mock data for now
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'draft': 'bg-gray-100 text-gray-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'pending': 'bg-gray-100 text-gray-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'picked_up': 'bg-yellow-100 text-yellow-800',
      'in_transit': 'bg-purple-100 text-purple-800',
      'out_for_delivery': 'bg-orange-100 text-orange-800',
      'exception': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📊 Logistics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor your orders, shipments, and logistics performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalShipments}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeShipments}</div>
            <p className="text-xs text-gray-600">In progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-600">All orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageDeliveryTime}</div>
            <p className="text-xs text-gray-600">Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('shipments')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'shipments'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Shipments ({shipments.length})
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📋 Recent Orders</CardTitle>
              <CardDescription>Latest order activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">
                        {order.shipper.city} → {order.consignee.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">
                        €{order.totalValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Shipments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🚛 Active Shipments</CardTitle>
              <CardDescription>Shipments in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shipments.filter(s => ['pending', 'assigned', 'picked_up', 'in_transit'].includes(s.status)).slice(0, 5).map((shipment) => (
                  <div key={shipment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{shipment.shipmentNumber}</p>
                      <p className="text-xs text-gray-600">
                        {shipment.orderId.shipper.name} → {shipment.orderId.consignee.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📋 All Orders</CardTitle>
            <CardDescription>Complete order listing with details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{order.shipper.city}, {order.shipper.country}</div>
                        <div className="text-gray-500">→</div>
                        <div>{order.consignee.city}, {order.consignee.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{order.cargo.description}</div>
                        <div className="text-gray-500">
                          {order.cargo.weight}kg, {order.cargo.volume}m³
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {order.currency} {order.totalValue.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'shipments' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🚛 All Shipments</CardTitle>
            <CardDescription>Complete shipment listing with tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment #</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment._id}>
                    <TableCell className="font-medium">{shipment.shipmentNumber}</TableCell>
                    <TableCell>{shipment.orderId.orderNumber}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{shipment.orderId.shipper.name}</div>
                        <div className="text-gray-500">→</div>
                        <div>{shipment.orderId.consignee.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{shipment.carrier.name}</TableCell>
                    <TableCell>{shipment.route.totalDistance.toFixed(1)} km</TableCell>
                    <TableCell>€{shipment.route.estimatedCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <Button onClick={() => window.location.href = '/orders/new'}>
          📋 Create New Order
        </Button>
        <Button variant="outline" onClick={fetchDashboardData}>
          🔄 Refresh Data
        </Button>
      </div>
    </div>
  );
}
