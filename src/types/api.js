// API Types based on TreadX OpenAPI specification

// Lead Status Enum
export const LeadStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED', 
  DENIED: 'DENIED',
  CONTACTED: 'CONTACTED',
  ONBOARDED: 'ONBOARDED',
  DONE: 'DONE'
};

// Lead Source Enum
export const LeadSource = {
  GOVERNMENT: 'GOVERNMENT',
  ADS: 'ADS'
};

// Contact Method Enum
export const ContactMethod = {
  MAIL_EMAIL: 'MAIL_EMAIL',
  TEXT: 'TEXT',
  PHONE: 'PHONE',
  OTHER: 'OTHER'
};

// Vendor Status Enum
export const VendorStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

// Territory Level Enum
export const TerritoryLevel = {
  DISTRICT: 'DISTRICT',
  CITY: 'CITY',
  PROVINCE: 'PROVINCE',
  COUNTRY: 'COUNTRY'
};

// User Roles (based on API patterns)
export const UserRole = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  SALES_MANAGER: 'SALES_MANAGER',
  SALES_AGENT: 'SALES_AGENT'
};

// Lead Request DTO
export const defaultLeadRequest = {
  businessName: '',
  phoneNumber: '',
  streetNumber: '',
  streetName: '',
  aptUnitBldg: '',
  postalCode: '',
  source: LeadSource.GOVERNMENT,
  sourceUrl: '',
  uploadedFile: '',
  status: LeadStatus.PENDING,
  notes: '',
  vendorId: null
};

// Lead Response DTO
export const defaultLeadResponse = {
  id: null,
  businessName: '',
  phoneNumber: '',
  streetNumber: '',
  streetName: '',
  aptUnitBldg: '',
  postalCode: '',
  source: LeadSource.GOVERNMENT,
  sourceUrl: '',
  uploadedFile: '',
  previewUrl: '',
  status: LeadStatus.PENDING,
  notes: '',
  vendorId: null,
  vendorUniqueId: '',
  createdAt: '',
  updatedAt: '',
  addedBy: null,
  lastModifiedBy: null,
  validatedBy: null,
  validatedByFirstName: '',
  validatedByLastName: '',
  validatedAt: '',
  contactMethod: null,
  contactMethodDetails: '',
  extensionNumber: '',
  contactName: '',
  position: ''
};

// Vendor Request DTO
export const defaultVendorRequest = {
  leadId: null,
  legalName: '',
  businessName: '',
  streetNumber: '',
  streetName: '',
  aptUnitBldg: '',
  postalCode: '',
  email: '',
  phoneNumber: '',
  status: VendorStatus.ACTIVE
};

// Vendor Response DTO
export const defaultVendorResponse = {
  id: null,
  legalName: '',
  businessName: '',
  email: '',
  phoneNumber: '',
  vendorUniqueId: '',
  status: VendorStatus.ACTIVE,
  streetNumber: '',
  streetName: '',
  aptUnitBldg: '',
  postalCode: ''
};

// User Response DTO
export const defaultUserResponse = {
  id: null,
  email: '',
  firstName: '',
  lastName: '',
  position: '',
  role: null,
  additionalPermissions: [],
  createdAt: '',
  updatedAt: '',
  createdBy: null,
  updatedBy: null,
  active: true,
  system: false
};

// Territory Response DTO
export const defaultTerritoryResponse = {
  id: null,
  code: '',
  name: '',
  level: TerritoryLevel.CITY,
  parentTerritoryCode: '',
  databaseName: '',
  isActive: true,
  description: '',
  timezone: '',
  currency: '',
  createdAt: '',
  updatedAt: '',
  createdBy: null,
  updatedBy: null,
  territoryUniqueId: '',
  parentUniqueId: '',
  childTerritoryCodes: [],
  descendantTerritoryCodes: [],
  ancestorTerritoryCodes: [],
  totalChildTerritories: 0,
  totalDescendantTerritories: 0
};

// Lead Validation Request
export const defaultLeadValidationRequest = {
  status: LeadStatus.PENDING,
  notes: ''
};

// Initiate Contact Request
export const defaultInitiateContactRequest = {
  contactMethod: ContactMethod.PHONE,
  contactMethodDetails: '',
  extensionNumber: '',
  contactName: '',
  position: ''
};

// Authentication Request
export const defaultAuthRequest = {
  email: '',
  password: ''
};

// Authentication Response
export const defaultAuthResponse = {
  token: '',
  email: '',
  firstName: '',
  lastName: '',
  role: ''
};

// Pagination Response
export const defaultPageResponse = {
  totalElements: 0,
  totalPages: 0,
  size: 10,
  content: [],
  number: 0,
  sort: [],
  first: true,
  last: true,
  numberOfElements: 0,
  pageable: null,
  empty: true
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/v1/users/login',
  CURRENT_USER: '/api/v1/users/me',
  
  // Leads
  LEADS: '/api/v1/leads',
  LEAD_BY_ID: (id) => `/api/v1/leads/${id}`,
  LEAD_VALIDATE: (id) => `/api/v1/leads/${id}/validate`,
  LEAD_INITIATE_CONTACT: (id) => `/api/v1/leads/${id}/initiate-contact`,
  LEAD_FILE_PREVIEW: (id) => `/api/v1/leads/${id}/preview`,
  LEAD_FILE_DOWNLOAD: (id) => `/api/v1/leads/${id}/file`,
  LEADS_BY_STATUS: '/api/v1/leads/status',
  
  // Vendors
  VENDORS: '/api/v1/vendors',
  VENDOR_BY_ID: (id) => `/api/v1/vendors/${id}`,
  VENDORS_BY_STATUS: '/api/v1/vendors/status',
  VENDORS_SEARCH: '/api/v1/vendors/search',
  
  // Users
  USERS: '/api/v1/users',
  USER_BY_ID: (id) => `/api/v1/users/${id}`,
  USER_PERMISSIONS: (id) => `/api/v1/users/${id}/permissions`,
  
  // Territories
  TERRITORIES: '/api/v1/territories',
  TERRITORY_BY_CODE: (code) => `/api/v1/territories/${code}`,
  TERRITORY_HIERARCHY: (code) => `/api/v1/territories/${code}/hierarchy`,
  TERRITORY_CHILDREN: (code) => `/api/v1/territories/${code}/children`,
  TERRITORIES_BY_LEVEL: (level) => `/api/v1/territories/level/${level}`,
  TERRITORY_CODES: '/api/v1/territories/codes',
  
  // User Territories
  USER_TERRITORIES: (userId) => `/api/v1/user-territories/users/${userId}/territories`,
  USER_ACCESSIBLE_TERRITORIES: (userId) => `/api/v1/user-territories/users/${userId}/accessible-territories`,
  MY_TERRITORIES: '/api/v1/user-territories/my-territories'
};

// Helper functions
export const getStatusColor = (status) => {
  switch (status) {
    case LeadStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case LeadStatus.APPROVED:
      return 'bg-green-100 text-green-800';
    case LeadStatus.DENIED:
      return 'bg-red-100 text-red-800';
    case LeadStatus.CONTACTED:
      return 'bg-blue-100 text-blue-800';
    case LeadStatus.ONBOARDED:
      return 'bg-purple-100 text-purple-800';
    case LeadStatus.DONE:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status) => {
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const getContactMethodLabel = (method) => {
  switch (method) {
    case ContactMethod.MAIL_EMAIL:
      return 'Email';
    case ContactMethod.TEXT:
      return 'Text Message';
    case ContactMethod.PHONE:
      return 'Phone Call';
    case ContactMethod.OTHER:
      return 'Other';
    default:
      return method;
  }
};

export const formatAddress = (vendor) => {
  const parts = [
    vendor.streetNumber,
    vendor.streetName,
    vendor.aptUnitBldg,
    vendor.postalCode
  ].filter(Boolean);
  return parts.join(', ');
};

export const formatFullName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ');
};

