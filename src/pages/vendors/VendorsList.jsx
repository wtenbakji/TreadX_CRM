import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { vendorsService } from '../../services/vendorsService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { VendorType, formatDate } from '../../types';

const VendorsList = () => {
  const { hasAnyRole } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    loadVendors();
  }, [searchTerm, typeFilter]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        type: typeFilter
      };
      const response = await vendorsService.getVendors(params);
      setVendors(response.data.vendors);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVendorTypeBadge = (type) => {
    const typeMap = {
      [VendorType.TIRE_MANUFACTURER]: { label: 'Manufacturer', variant: 'default' },
      [VendorType.TIRE_DISTRIBUTOR]: { label: 'Distributor', variant: 'secondary' },
      [VendorType.EQUIPMENT_SUPPLIER]: { label: 'Equipment', variant: 'outline' },
      [VendorType.SERVICE_PROVIDER]: { label: 'Service', variant: 'destructive' }
    };
    
    const config = typeMap[type] || { label: type, variant: 'secondary' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDeleteVendor = async (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorsService.deleteVendor(vendorId);
        loadVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

  const canManageVendors = hasAnyRole(['admin', 'manager']);
  const canEditVendors = hasAnyRole(['admin', 'manager', 'sales_rep']);

  return (
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage tire vendors, distributors, and service providers</p>
        </div>
        {canEditVendors && (
          <Button asChild>
            <Link to="/vendors/new">
              <Plus className="mr-2 h-4 w-4" />
              New Vendor
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vendors by name, email, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {Object.values(VendorType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors list */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by adding your first vendor.'}
              </p>
              {canEditVendors && (
                <Button asChild>
                  <Link to="/vendors/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vendor
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          vendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {vendor.name}
                          </h3>
                          {getVendorTypeBadge(vendor.type)}
                          {vendor.isActive ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          {vendor.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {vendor.email}
                            </div>
                          )}
                          {vendor.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {vendor.phone}
                            </div>
                          )}
                          {vendor.website && (
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              <a 
                                href={vendor.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                          {vendor.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {vendor.address.city}, {vendor.address.state}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {vendor.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {vendor.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Contacts: {vendor.contacts?.length || 0}</span>
                        <span>Leads: {vendor.leads?.length || 0}</span>
                        <span>Added: {formatDate(vendor.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/vendors/${vendor.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        
                        {canEditVendors && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/vendors/${vendor.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              {canManageVendors && (
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteVendor(vendor.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorsList;

