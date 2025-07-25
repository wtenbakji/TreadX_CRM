import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { leadsService } from '../../services/leadsApiService';
import { LeadStatus, defaultVendorRequest } from '../../types/api';
import vendorsService from '../../services/vendorsApiService';

const getSteps = (hasLeadId) => hasLeadId ? [
  {
    id: 'business',
    title: 'Business Information',
    description: 'Enter the legal and business name',
    fields: ['legalName', 'businessName']
  },
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Add email and phone number',
    fields: ['email', 'phoneNumber']
  },
  {
    id: 'address',
    title: 'Address',
    description: 'Provide the business address',
    fields: ['streetNumber', 'streetName', 'aptUnitBldg', 'postalCode']
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review all information before submitting',
    fields: ['status']
  }
] : [
  {
    id: 'select-lead',
    title: 'Select Contacted Lead',
    description: 'Choose a contacted lead to convert to a vendor',
    fields: []
  },
  {
    id: 'business',
    title: 'Business Information',
    description: 'Enter the legal and business name',
    fields: ['legalName', 'businessName']
  },
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Add email and phone number',
    fields: ['email', 'phoneNumber']
  },
  {
    id: 'address',
    title: 'Address',
    description: 'Provide the business address',
    fields: ['streetNumber', 'streetName', 'aptUnitBldg', 'postalCode']
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review all information before submitting',
    fields: ['status']
  }
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VendorWizard = ({ onClose, onSuccess }) => {
  const query = useQuery();
  const leadIdFromQuery = query.get('leadId');
  const [currentStep, setCurrentStep] = useState(0);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({ ...defaultVendorRequest });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const WIZARD_STEPS = getSteps(!!leadIdFromQuery);

  // Fetch leads for selection (CONTACTED only)
  useEffect(() => {
    if (currentStep === 0 && !leadIdFromQuery) {
      fetchLeads();
    }
    // eslint-disable-next-line
  }, [currentStep, searchTerm, currentPage]);

  // If leadId is present in query, auto-select and skip to vendor details
  useEffect(() => {
    if (leadIdFromQuery) {
      (async () => {
        setLoading(true);
        try {
          const lead = await leadsService.getLead(leadIdFromQuery);
          setSelectedLead(lead);
          setFormData({
            ...formData,
            leadId: lead.id,
            legalName: lead.businessName,
            businessName: lead.businessName,
            streetNumber: lead.streetNumber,
            streetName: lead.streetName,
            aptUnitBldg: lead.aptUnitBldg,
            postalCode: lead.postalCode,
            email: '',
            phoneNumber: lead.phoneNumber,
            status: 'ACTIVE'
          });
          setCurrentStep(1);
        } catch (err) {
          setError('Could not load lead.');
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, [leadIdFromQuery]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        search: searchTerm
      };
      // Only fetch CONTACTED leads
      const data = await leadsService.getLeadsByStatus(LeadStatus.CONTACTED, params);
      setLeads(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setFormData({
      ...formData,
      leadId: lead.id,
      legalName: lead.businessName,
      businessName: lead.businessName,
      streetNumber: lead.streetNumber,
      streetName: lead.streetName,
      aptUnitBldg: lead.aptUnitBldg,
      postalCode: lead.postalCode,
      email: '',
      phoneNumber: lead.phoneNumber,
      status: 'ACTIVE'
    });
  };

  const handleNext = () => {
    if (currentStep === 0 && !selectedLead) return;
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await vendorsService.createVendor(formData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    const step = WIZARD_STEPS[currentStep];
    const requiredFields = [];
    if (step.id === 'business') requiredFields.push('legalName', 'businessName');
    if (step.id === 'contact') requiredFields.push('email', 'phoneNumber');
    if (step.id === 'address') requiredFields.push('streetNumber', 'streetName', 'postalCode');
    return requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
  };

  const renderStepContent = () => {
    const step = WIZARD_STEPS[currentStep];
    if (step.id === 'select-lead') {
      return (
        <div>
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Search leads by business name or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          {loading ? (
            <div className="text-center py-8">Loading leads...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map(lead => (
                  <TableRow key={lead.id} className={selectedLead?.id === lead.id ? 'bg-blue-50' : ''}>
                    <TableCell>{lead.businessName}</TableCell>
                    <TableCell>{lead.phoneNumber}</TableCell>
                    <TableCell>{`${lead.streetNumber} ${lead.streetName} ${lead.aptUnitBldg || ''} ${lead.postalCode}`}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={selectedLead?.id === lead.id ? 'default' : 'outline'}
                        onClick={() => {
                          setSelectedLead(lead);
                          setFormData({
                            ...formData,
                            leadId: lead.id,
                            legalName: lead.businessName,
                            businessName: lead.businessName,
                            streetNumber: lead.streetNumber,
                            streetName: lead.streetName,
                            aptUnitBldg: lead.aptUnitBldg,
                            postalCode: lead.postalCode,
                            email: '',
                            phoneNumber: lead.phoneNumber,
                            status: 'ACTIVE'
                          });
                          setCurrentStep(1);
                        }}
                      >
                        {selectedLead?.id === lead.id ? 'Selected' : 'Select'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex justify-between items-center mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      );
    }
    if (step.id === 'review') {
      // Review step: show summary
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Review Vendor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><b>Legal Name:</b> {formData.legalName}</div>
            <div><b>Business Name:</b> {formData.businessName}</div>
            <div><b>Email:</b> {formData.email}</div>
            <div><b>Phone Number:</b> {formData.phoneNumber}</div>
            <div><b>Street Number:</b> {formData.streetNumber}</div>
            <div><b>Street Name:</b> {formData.streetName}</div>
            <div><b>Apt/Unit/Bldg:</b> {formData.aptUnitBldg}</div>
            <div><b>Postal Code:</b> {formData.postalCode}</div>
            <div><b>Status:</b> {formData.status}</div>
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="flex justify-end">
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Finish'}
            </Button>
          </div>
        </div>
      );
    }
    // For other steps, render only the fields for this step
    return (
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {step.fields.includes('legalName') && (
            <div>
              <label className="block text-sm font-medium">Legal Name</label>
              <Input
                value={formData.legalName}
                onChange={e => setFormData({ ...formData, legalName: e.target.value })}
                required
              />
            </div>
          )}
          {step.fields.includes('businessName') && (
            <div>
              <label className="block text-sm font-medium">Business Name</label>
              <Input
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>
          )}
          {step.fields.includes('email') && (
            <div>
              <label className="block text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <Input
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                type="email"
                required
              />
            </div>
          )}
          {step.fields.includes('phoneNumber') && (
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <Input
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
          )}
          {step.fields.includes('streetNumber') && (
            <div>
              <label className="block text-sm font-medium">Street Number</label>
              <Input
                value={formData.streetNumber}
                onChange={e => setFormData({ ...formData, streetNumber: e.target.value })}
                required
              />
            </div>
          )}
          {step.fields.includes('streetName') && (
            <div>
              <label className="block text-sm font-medium">Street Name</label>
              <Input
                value={formData.streetName}
                onChange={e => setFormData({ ...formData, streetName: e.target.value })}
                required
              />
            </div>
          )}
          {step.fields.includes('aptUnitBldg') && (
            <div>
              <label className="block text-sm font-medium">Apt/Unit/Bldg</label>
              <Input
                value={formData.aptUnitBldg}
                onChange={e => setFormData({ ...formData, aptUnitBldg: e.target.value })}
              />
            </div>
          )}
          {step.fields.includes('postalCode') && (
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <Input
                value={formData.postalCode}
                onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                required
              />
            </div>
          )}
          {step.fields.includes('status') && (
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!isStepValid()}>Next</Button>
        </div>
      </form>
    );
  };

  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{WIZARD_STEPS[currentStep].title}</CardTitle>
        <div className="text-gray-500 text-sm">{WIZARD_STEPS[currentStep].description}</div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        {renderStepContent()}
        <div className="flex justify-between mt-6">
          <Button onClick={handlePrevious} disabled={currentStep === 0}>Previous</Button>
          {/* Only show Next in the footer for select-lead step, not for form steps */}
          {WIZARD_STEPS[currentStep].id === 'select-lead' && (
            <Button onClick={handleNext} disabled={currentStep === 0 && !selectedLead}>Next</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorWizard; 