import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  MapPin,
  Users,
  CheckCircle,
  Clock,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import vendorsService from '../../services/vendorsApiService';
import apiClient from '../../services/apiClient';
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
import { formatPostalCode, formatPhoneNumber } from '../../utils/formatters';

const statusColors = {
  ACTIVE: { backgroundColor: '#28A745', color: '#fff' },
  INACTIVE: { backgroundColor: '#DC3545', color: '#fff' },
};

const VendorsList = () => {
  const { hasAnyRole } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [activeVendors, setActiveVendors] = useState(0);
  const [vendorsLastWeek, setVendorsLastWeek] = useState(0); // Placeholder
  const [subscribedStandard, setSubscribedStandard] = useState(0); // Placeholder
  const navigate = useNavigate();

  useEffect(() => {
    loadVendors();
    // Fetch total vendors
    apiClient.get('/api/v1/vendors?page=0&size=1').then(res => {
      setTotalVendors(res.data.totalElements || 0);
    });
    // Fetch active vendors
    vendorsService.getVendorsByStatus('ACTIVE', { page: 0, size: 1 }).then(res => {
      setActiveVendors(res.totalElements || 0);
    });
    // Placeholder for vendors added in last week
    setVendorsLastWeek(0);
  }, [searchTerm, typeFilter, statusFilter, currentPage, pageSize]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        page: currentPage,
        size: pageSize
      };
      let data;
      if (statusFilter !== 'all') {
        data = await vendorsService.getVendorsByStatus(statusFilter, params);
      } else {
        data = await vendorsService.getVendors(params);
      }
      setVendors(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      setVendors([]);
      setTotalPages(0);
      setTotalElements(0);
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

  const handleRefresh = () => {
    loadVendors();
    // Optionally re-fetch stats
    apiClient.get('/api/v1/vendors?page=0&size=1').then(res => {
      setTotalVendors(res.data.totalElements || 0);
    });
    vendorsService.getVendorsByStatus('ACTIVE', { page: 0, size: 1 }).then(res => {
      setActiveVendors(res.totalElements || 0);
    });
    // Placeholder for vendors added in last week
    setVendorsLastWeek(0);
  };

  const canManageVendors = hasAnyRole(['PLATFORM_ADMIN','SALES_MANAGER', 'SALES_AGENT', 'admin', 'manager']);
  const canEditVendors = hasAnyRole(['PLATFORM_ADMIN','admin', 'manager', 'sales_rep']);

  console.log('Vendors to render:', vendors);
  return (
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl px-6 py-4 min-w-[120px] min-h-[90px]">
            <Users className="h-6 w-6 text-blue-600 mb-1" />
            <div className="text-xs text-gray-500">Total Vendors</div>
            <div className="font-bold text-xl text-blue-900">{totalVendors}</div>
          </div>
          <div className="flex flex-col items-center justify-center bg-green-50 rounded-xl px-6 py-4 min-w-[120px] min-h-[90px]">
            <CheckCircle className="h-6 w-6 text-green-600 mb-1" />
            <div className="text-xs text-gray-500">Active Vendors</div>
            <div className="font-bold text-xl text-green-900">{activeVendors}</div>
          </div>
          <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-xl px-6 py-4 min-w-[120px] min-h-[90px]">
            <Clock className="h-6 w-6 text-yellow-600 mb-1" />
            <div className="text-xs text-gray-500">Added Last Week</div>
            <div className="font-bold text-xl text-yellow-900">{vendorsLastWeek}</div>
          </div>
          <div className="flex flex-col items-center justify-center bg-purple-50 rounded-xl px-6 py-4 min-w-[150px] min-h-[90px]">
            <UserPlus className="h-6 w-6 text-purple-600 mb-1" />
            <div className="text-xs text-gray-500">Subscribed in Standard Plan</div>
            <div className="font-bold text-xl text-purple-900">{subscribedStandard}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>Refresh</Button>
          {canManageVendors && (
            <Button asChild>
              <Link to="/vendors/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Vendor
              </Link>
            </Button>
          )}
        </div>
      </div>
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vendors by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Vendors Table */}
      <Card className="overflow-x-auto">
        <CardContent className="p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Loading vendors...</td></tr>
              ) : vendors.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No vendors found</td></tr>
              ) : vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/vendors/${vendor.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    <Link to={`/vendors/${vendor.id}`} className="hover:underline">
                      {vendor.businessName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{vendor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatPhoneNumber(vendor.phoneNumber)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge style={{...statusColors[vendor.status], fontWeight: 600, fontSize: 13, borderRadius: 999, padding: '2px 12px'}}>
                      {vendor.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {vendor.streetNumber} {vendor.streetName} {vendor.aptUnitBldg || ''} {formatPostalCode(vendor.postalCode)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="icon" title="View Vendor">
                        <Link to={`/vendors/${vendor.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/vendors/${vendor.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                          </DropdownMenuItem>
                          {canManageVendors && (
                            <DropdownMenuItem onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsList;

