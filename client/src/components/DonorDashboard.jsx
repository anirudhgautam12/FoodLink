import React, { useState } from 'react';
import { Package, MapPin, Clock } from 'lucide-react';
import api from '../api/axios';

const DonorDashboard = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expiryTime, setExpiryTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Get location
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation is not supported by your browser' });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          await api.post('/food', {
            name,
            quantity: Number(quantity),
            expiryTime,
            latitude,
            longitude
          });

          setMessage({ type: 'success', text: 'Food listing added successfully!' });
          setName('');
          setQuantity(1);
          setExpiryTime('');
        } catch (error) {
          setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add food' });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setMessage({ type: 'error', text: 'Failed to get your location. Please allow location access.' });
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Package className="mr-2 text-purple-600" />
          Add Surplus Food
        </h2>
        
        {message.text && (
          <div className={`p-4 rounded-md mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Item Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border-gray-300 border p-2.5 shadow-sm focus:border-purple-500 focus:ring-purple-500 outline-none transition-all"
                placeholder="e.g., 5 Boxes of Rice and Curry"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (people it can serve)</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-md border-gray-300 border p-2.5 shadow-sm focus:border-purple-500 focus:ring-purple-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-500" /> Expiry Time
              </label>
              <input
                type="datetime-local"
                required
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                className="w-full rounded-md border-gray-300 border p-2.5 shadow-sm focus:border-purple-500 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
            
            <div className="col-span-2 bg-purple-50 p-4 rounded-md flex items-start">
              <MapPin className="text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-purple-800">
                Your current location will be automatically attached to this listing so nearby receivers can find it. 
                Please ensure you are at the pickup location when submitting.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Adding Listing...' : 'Publish Food Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonorDashboard;
