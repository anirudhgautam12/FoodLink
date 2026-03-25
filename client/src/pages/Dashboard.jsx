import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import DonorDashboard from '../components/DonorDashboard';
import ReceiverDashboard from '../components/ReceiverDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user?.role === 'Donor' ? <DonorDashboard /> : <ReceiverDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
