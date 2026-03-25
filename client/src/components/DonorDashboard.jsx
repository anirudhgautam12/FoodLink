import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, MapPin, Clock, Info, CheckCircle, Mail, User } from 'lucide-react';
import api from '../api/axios';

const DonorDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorListings = async () => {
      try {
        const { data } = await api.get('/food/donor');
        setListings(data);
      } catch (error) {
        console.error('Error fetching donor listings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorListings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
            <Package className="mr-3 text-green-500 w-8 h-8" />
            Your Donations Dashboard
          </h2>
          <p className="text-gray-500 text-lg">Manage your listings or create a new one to help the community.</p>
        </div>
        <Link 
          to="/add-food"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all flex items-center whitespace-nowrap"
        >
          <Plus className="mr-2" size={20} />
          Post New Food
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Recent Donations</h3>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Package className="text-gray-300 w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-gray-700 mb-2">No active listings yet</h4>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't posted any food recently. When you do, they will appear here to manage.</p>
            <Link 
              to="/add-food"
              className="text-green-600 font-bold bg-green-50 px-6 py-2 rounded-full hover:bg-green-100 transition-colors inline-block"
            >
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {listings.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-2xl p-6 transition-all hover:shadow-md bg-gray-50/50">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      Posted on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold inline-flex items-center shadow-sm ${
                      item.status === 'Claimed' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {item.status === 'Claimed' ? <CheckCircle size={16} className="mr-1.5" /> : <Info size={16} className="mr-1.5" />}
                      {item.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4 bg-white p-4 rounded-xl border border-gray-100">
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong className="text-gray-800">Quantity:</strong> Provides {item.quantity} people</p>
                    <p className="flex items-start">
                      <strong className="text-gray-800 mr-2 mt-0.5 whitespace-nowrap">Expiry:</strong> 
                      <span className={new Date(item.expiryTime) < new Date() ? 'text-red-500 font-bold' : ''}>
                        {new Date(item.expiryTime).toLocaleString()}
                        {new Date(item.expiryTime) < new Date() && item.status !== 'Claimed' ? ' (Expired)' : ''}
                      </span>
                    </p>
                  </div>
                  
                  {item.status === 'Claimed' && item.receiverId && (
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-sm">
                      <h5 className="font-bold text-orange-800 flex items-center mb-2">
                        <User size={16} className="mr-1.5" /> Claimed By:
                      </h5>
                      <p className="text-gray-700 mb-1 font-medium">{item.receiverId.name}</p>
                      <p className="text-gray-600 flex items-center">
                        <Mail size={14} className="mr-1.5 text-gray-400" /> 
                        <a href={`mailto:${item.receiverId.email}`} className="text-orange-600 hover:underline">
                          {item.receiverId.email}
                        </a>
                      </p>
                    </div>
                  )}
                  {item.status !== 'Claimed' && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm flex items-center justify-center text-green-600">
                      Waiting for someone to claim...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
