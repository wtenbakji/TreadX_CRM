import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Mail, Phone, MapPin, User, Edit, Trash2, Building2 } from 'lucide-react';
import { formatPostalCode, formatPhoneNumber } from '../../utils/formatters';
import vendorsService from '../../services/vendorsApiService';

const statusColors = {
  ACTIVE: { backgroundColor: '#28A745', color: '#fff' },
  INACTIVE: { backgroundColor: '#DC3545', color: '#fff' },
};

const VendorDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadVendor();
    // eslint-disable-next-line
  }, [id]);

  const loadVendor = async () => {
    try {
      setLoading(true);
      const vendorData = await vendorsService.getVendor(id);
      setVendor(vendorData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorsService.deleteVendor(id);
        navigate('/vendors', {
          state: {
            message: 'Vendor has been deleted successfully',
            type: 'success'
          }
        });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading vendor...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!vendor) return <div className="p-8 text-center">Vendor not found.</div>;

  return (
    <div className="flex flex-col items-center min-h-[60vh] bg-gray-50 py-8">
      <div className="w-full max-w-2xl mb-4">
        <Button variant="outline" onClick={() => navigate('/vendors')}>
          &larr; Back to Vendors
        </Button>
      </div>
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl border-0">
        <CardHeader className="flex flex-row items-center justify-between bg-white rounded-t-2xl border-b p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full h-14 w-14 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold mb-1">{vendor.businessName}</CardTitle>
              <Badge style={{...statusColors[vendor.status], fontWeight: 600, fontSize: 13, borderRadius: 999, padding: '2px 12px'}}>
                {vendor.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(`/vendors/${vendor.id}/edit`)} title="Edit Vendor">
              <Edit className="h-5 w-5" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleDelete} title="Delete Vendor">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white rounded-b-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-semibold">Legal Name:</span>
                <span>{vendor.legalName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="font-semibold">Email:</span>
                <span>{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="font-semibold">Phone:</span>
                <span>{formatPhoneNumber(vendor.phoneNumber)}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="font-semibold">Address:</span>
                <span>{vendor.streetNumber} {vendor.streetName} {vendor.aptUnitBldg || ''} {formatPostalCode(vendor.postalCode)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-semibold">Vendor ID:</span>
                <span>{vendor.vendorUniqueId}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDetailView; 