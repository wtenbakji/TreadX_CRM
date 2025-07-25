import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Building2,
  Phone,
  MapPin,
  Globe,
  FileText,
  Calendar,
  User,
  Mail,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Download,
  Eye,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { 
  getStatusColor, 
  getStatusLabel, 
  getContactMethodLabel,
  formatAddress,
  formatFullName,
  LeadStatus,
  ContactMethod
} from '../../types/api';
import { leadsService } from '../../services/leadsApiService';
import LeadContactModal from './LeadContactModal';
import LeadValidationModal from './LeadValidationModal';

// Helper to parse backend date arrays
function parseBackendDate(arr) {
  if (!Array.isArray(arr)) return null;
  return new Date(
    arr[0],
    arr[1] - 1,
    arr[2],
    arr[3],
    arr[4],
    arr[5],
    Math.floor(arr[6] / 1000000)
  );
}

const LeadDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const leadData = await leadsService.getLead(id);
      setLead(leadData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSuccess = (updatedLead) => {
    setLead(updatedLead);
    setShowContactModal(false);
  };

  const handleValidationSuccess = (updatedLead) => {
    setLead(updatedLead);
    setShowValidationModal(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsService.deleteLead(id);
        navigate('/leads', {
          state: {
            message: 'Lead has been deleted successfully',
            type: 'success'
          }
        });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatDate = (dateArr) => {
    const date = parseBackendDate(dateArr);
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (businessName) => {
    return businessName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Use backend API base URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  console.log('API_BASE_URL for file preview/download:', API_BASE_URL);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error === 'Forbidden') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-100 rounded-full p-6 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414M5.636 18.364l1.414-1.414M6.343 6.343l1.414 1.414M17.657 17.657l-1.414-1.414M12 8v4m0 4h.01" /></svg>
        </div>
        <h1 className="text-4xl font-bold text-red-600 mb-2">403 Forbidden</h1>
        <p className="text-gray-700 mb-6">You do not have permission to view this lead. Please contact your administrator if you believe this is a mistake.</p>
        <Button onClick={() => navigate('/leads')} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow">Return to Leads</Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertDescription>Lead not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold">{lead.businessName}</h1>
            <p className="text-gray-600">Lead Details</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge style={getStatusColor(lead.status)}>
            {getStatusLabel(lead.status)}
          </Badge>
          
          <Button variant="outline" size="sm" onClick={() => navigate(`/leads/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                    {getInitials(lead.businessName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{lead.businessName}</CardTitle>
                  <CardDescription>
                    Lead ID: {lead.id} • Created {formatDate(lead.createdAt)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Phone:</span>
                        <span>{lead.phoneNumber}</span>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <span className="font-medium">Address:</span>
                          <div className="text-gray-600">
                            {lead.streetNumber} {lead.streetName}
                            {lead.aptUnitBldg && <br />}{lead.aptUnitBldg}
                            <br />{lead.postalCode}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Source:</span>
                        <span>{lead.source}</span>
                      </div>
                      
                      {lead.sourceUrl && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Source URL:</span>
                          <a 
                            href={lead.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Source
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {lead.notes && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{lead.notes}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4">
                  {lead.contactMethod ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Contact Method:</span>
                        <span>{getContactMethodLabel(lead.contactMethod)}</span>
                      </div>
                      
                      {lead.contactMethodDetails && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Contact Details:</span>
                          <span>{lead.contactMethodDetails}</span>
                        </div>
                      )}
                      
                      {lead.contactName && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Contact Person:</span>
                          <span>{lead.contactName}</span>
                          {lead.position && <span className="text-gray-500">({lead.position})</span>}
                        </div>
                      )}
                      
                      {lead.extensionNumber && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Extension:</span>
                          <span>{lead.extensionNumber}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No contact information available</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setShowContactModal(true)}
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Initiate Contact
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-4">
                  {lead.uploadedFile ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium">{lead.uploadedFile}</p>
                            <p className="text-sm text-gray-500">Uploaded document</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(`${API_BASE_URL}/api/v1/leads/${lead.id}/preview`, '_blank')}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => window.open(`${API_BASE_URL}/api/v1/leads/${lead.id}/file`, '_blank')}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <img
                          src={`${API_BASE_URL}/api/v1/leads/${lead.id}/preview`}
                          alt="Lead Preview"
                          className="w-full max-w-xs rounded border"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Lead Created</p>
                        <p className="text-sm text-gray-500">{formatDate(lead.createdAt)}</p>
                      </div>
                    </div>
                    
                    {lead.updatedAt !== lead.createdAt && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Edit className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Last Updated</p>
                          <p className="text-sm text-gray-500">{formatDate(lead.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                    
                    {lead.validatedAt && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium">Lead Validated</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(lead.validatedAt)} by {formatFullName(lead.validatedByFirstName, lead.validatedByLastName)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.status === LeadStatus.PENDING && (
                <Button 
                  className="w-full" 
                  onClick={() => setShowValidationModal(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validate Lead
                </Button>
              )}
              
              {lead.status === LeadStatus.APPROVED && !lead.contactMethod && (
                <Button 
                  className="w-full" 
                  onClick={() => setShowContactModal(true)}
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Initiate Contact
                </Button>
              )}
              
              {lead.status === LeadStatus.CONTACTED && (
                <Button
                  className="w-full"
                  style={{ backgroundColor: '#1E40AF', color: '#fff', fontWeight: 600, borderRadius: 8, boxShadow: '0 2px 8px rgba(30,64,175,0.08)' }}
                  onClick={() => navigate(`/vendors/new?leadId=${lead.id}`)}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Convert to Vendor
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          {/* Lead Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status:</span>
                <Badge style={getStatusColor(lead.status)}>
                  {getStatusLabel(lead.status)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lead Source:</span>
                <span className="text-sm">{lead.source}</span>
              </div>
              
              {lead.vendorId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vendor ID:</span>
                  <span className="text-sm">{lead.vendorUniqueId}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showContactModal && (
        <LeadContactModal
          lead={lead}
          onClose={() => setShowContactModal(false)}
          onSuccess={handleContactSuccess}
        />
      )}
      
      {showValidationModal && (
        <LeadValidationModal
          lead={lead}
          onClose={() => setShowValidationModal(false)}
          onSuccess={handleValidationSuccess}
        />
      )}
    </div>
  );
};

export default LeadDetailView;

