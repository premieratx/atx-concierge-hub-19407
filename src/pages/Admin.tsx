import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '@/components/AdminDashboard';

export function Admin() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <AdminDashboard onBack={handleBack} />;
}