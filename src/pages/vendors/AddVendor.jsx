import React from 'react';
import { useNavigate } from 'react-router-dom';
import VendorWizard from '../../components/vendors/VendorWizard';

const AddVendor = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Show success message and navigate to vendors list
    navigate('/vendors', {
      state: {
        message: `Vendor has been created successfully!`,
        type: 'success'
      }
    });
  };

  const handleCancel = () => {
    navigate('/vendors');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-2 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <VendorWizard
          onSuccess={handleSuccess}
          onClose={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddVendor; 