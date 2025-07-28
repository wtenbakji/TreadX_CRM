import React, { useEffect, useState } from 'react';
import { leadsService } from '../../services/leadsApiService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { formatPostalCode, formatPhoneNumber } from '../../utils/formatters';

const LeadsApproval = () => {
  const { user } = useAuth();
  const [pendingLeads, setPendingLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notes, setNotes] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingLeads = async () => {
      setLoading(true);
      try {
        // Check if user is an agent (SALES_AGENT role)
        const isAgent = user?.roleName === 'SALES_AGENT';
        
        let leads;
        if (isAgent) {
          leads = await leadsService.getMyLeads({ status: 'PENDING' });
        } else {
          leads = await leadsService.getLeadsByStatus('PENDING');
        }
        setPendingLeads(leads);
      } catch (err) {
        setError('Failed to fetch pending leads.');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingLeads();
  }, [user]);

  const handleAction = async (leadId, status) => {
    setActionLoading(leadId + status);
    setError(null);
    try {
      await leadsService.validateLead(leadId, {
        status,
        notes: notes[leadId] || ''
      });
      setPendingLeads((prev) => prev.filter((l) => l.id !== leadId));
    } catch (err) {
      setError('Failed to update lead status.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="text-center py-8">Loading pending leads...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Pending Leads for Approval</h2>
      {pendingLeads.length === 0 ? (
        <div className="text-center text-gray-500">No pending leads to review.</div>
      ) : (
        pendingLeads.map((lead) => (
          <Card key={lead.id} className="mb-8">
            <CardHeader>
              <CardTitle>{lead.businessName}</CardTitle>
              <Badge variant="secondary">Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div><strong>Contact:</strong> {lead.contactName} {lead.phoneNumber && `| ${formatPhoneNumber(lead.phoneNumber)}`}</div>
                  <div><strong>Address:</strong> {lead.streetNumber} {lead.streetName} {lead.aptUnitBldg && `, ${lead.aptUnitBldg}`}, {formatPostalCode(lead.postalCode)}</div>
                  <div><strong>Source:</strong> {lead.source} {lead.sourceUrl && <a href={lead.sourceUrl} className="text-blue-600 underline ml-2" target="_blank" rel="noopener noreferrer">(link)</a>}</div>
                                      {lead.addedByName && <div><strong>Added by:</strong> {lead.addedByName}</div>}
                  <div><strong>Notes:</strong> {lead.notes}</div>
                </div>
                <div>
                  <div className="mb-2"><strong>Image Preview:</strong></div>
                  <img
                    src={`/api/v1/leads/${lead.id}/preview`}
                    alt="Lead Preview"
                    className="w-full max-w-xs rounded border"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
              <div className="mb-2">
                <Textarea
                  placeholder="Add notes (required if denying)"
                  value={notes[lead.id] || ''}
                  onChange={e => setNotes({ ...notes, [lead.id]: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="success"
                  disabled={actionLoading === lead.id + 'APPROVED'}
                  onClick={() => handleAction(lead.id, 'APPROVED')}
                >
                  {actionLoading === lead.id + 'APPROVED' ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                  variant="destructive"
                  disabled={actionLoading === lead.id + 'DENIED'}
                  onClick={() => handleAction(lead.id, 'DENIED')}
                >
                  {actionLoading === lead.id + 'DENIED' ? 'Denying...' : 'Deny'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default LeadsApproval; 