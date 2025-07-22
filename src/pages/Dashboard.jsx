import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  Package
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatCurrency, formatDate, LeadStatus } from '../types';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    totalVendors: 0,
    monthlyRevenue: 0,
    recentActivities: []
  });

  useEffect(() => {
    // Mock data for dashboard stats
    setStats({
      totalLeads: 156,
      activeLeads: 42,
      totalVendors: 28,
      monthlyRevenue: 125000,
      recentActivities: [
        {
          id: '1',
          type: 'lead_created',
          description: 'New lead created: Commercial Fleet Tire Order',
          user: 'Sales Rep',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          type: 'lead_updated',
          description: 'Lead status updated to Qualified',
          user: 'Sales Manager',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: '3',
          type: 'vendor_added',
          description: 'New vendor added: Continental Tire',
          user: 'Admin',
          timestamp: new Date(Date.now() - 10800000).toISOString()
        }
      ]
    });
  }, []);

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      description: 'from last month'
    },
    {
      title: 'Active Leads',
      value: stats.activeLeads,
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      description: 'currently in pipeline'
    },
    {
      title: 'Vendors',
      value: stats.totalVendors,
      change: '+3%',
      changeType: 'positive',
      icon: Building2,
      description: 'active partnerships'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      description: 'vs last month'
    }
  ];

  const leadStatusData = [
    { status: 'New', count: 15, color: 'bg-blue-500' },
    { status: 'Contacted', count: 12, color: 'bg-yellow-500' },
    { status: 'Qualified', count: 8, color: 'bg-green-500' },
    { status: 'Proposal Sent', count: 5, color: 'bg-purple-500' },
    { status: 'Closed Won', count: 2, color: 'bg-emerald-500' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead_created':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'lead_updated':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'vendor_added':
        return <Building2 className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-blue-100">
              Here's what's happening with your tire sales today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead status overview */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Overview</CardTitle>
            <CardDescription>
              Current distribution of leads by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and changes in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {activity.user} • {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">Create New Lead</h3>
                  <p className="text-sm text-gray-500">Add a new sales opportunity</p>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-medium">Add Vendor</h3>
                  <p className="text-sm text-gray-500">Register a new tire vendor</p>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-purple-500" />
                <div>
                  <h3 className="font-medium">Inventory Check</h3>
                  <p className="text-sm text-gray-500">Review tire stock levels</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

