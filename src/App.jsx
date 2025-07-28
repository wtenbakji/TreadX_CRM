import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/leads/LeadsList';
import AddLead from './pages/leads/AddLead';
import LeadDetail from './pages/leads/LeadDetail';

import VendorsList from './pages/vendors/VendorsList';
import AddVendor from './pages/vendors/AddVendor';
import VendorDetail from './pages/vendors/VendorDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Leads routes */}
              <Route path="leads" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','SALES_MANAGER', 'SALES_AGENT','admin', 'manager', 'sales_rep']}>
                  <LeadsList />
                </ProtectedRoute>
              } />
              <Route path="leads/add" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','SALES_MANAGER', 'SALES_AGENT','admin', 'manager', 'sales_rep']}>
                  <AddLead />
                </ProtectedRoute>
              } />
              <Route path="leads/:id" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','SALES_MANAGER', 'SALES_AGENT','admin', 'manager', 'sales_rep']}>
                  <LeadDetail />
                </ProtectedRoute>
              } />
              <Route path="leads/:id/edit" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','SALES_MANAGER', 'SALES_AGENT','admin', 'manager', 'sales_rep']}>
                  <AddLead />
                </ProtectedRoute>
              } />

              
              {/* Vendors routes */}
              <Route path="vendors" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','admin','SALES_MANAGER', 'SALES_AGENT', 'manager', 'sales_rep']}>
                  <VendorsList />
                </ProtectedRoute>
              } />
              <Route path="vendors/new" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','SALES_MANAGER', 'SALES_AGENT','admin', 'manager', 'sales_rep']}>
                  <AddVendor />
                </ProtectedRoute>
              } />
              <Route path="vendors/:id" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','SALES_MANAGER', 'SALES_AGENT','admin', 'manager', 'sales_rep']}>
                  <VendorDetail />
                </ProtectedRoute>
              } />
              
              {/* Placeholder routes for future implementation */}
              <Route path="inventory" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','admin', 'manager', 'mechanic']}>
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tire Inventory</h2>
                    <p className="text-gray-600">Inventory management feature coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="reports" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','admin', 'manager']}>
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
                    <p className="text-gray-600">Reporting features coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="settings" element={
                <ProtectedRoute roles={['PLATFORM_ADMIN','admin']}>
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">System Settings</h2>
                    <p className="text-gray-600">Settings panel coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Page not found</p>
                  <a href="/dashboard" className="text-blue-600 hover:underline">
                    Return to Dashboard
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

