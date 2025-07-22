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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
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
          <Badge className={getStatusColor(lead.status)}>
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
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
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
                <Button className="w-full" variant="outline">
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
                <Badge className={getStatusColor(lead.status)}>
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

