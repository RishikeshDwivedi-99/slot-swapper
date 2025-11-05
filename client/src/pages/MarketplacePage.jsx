import React, { useState, useEffect } from 'react';
import api from '../api/api.js';

const MarketplacePage = () => {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [myOfferSlotId, setMyOfferSlotId] = useState(''); 

  const fetchMarketplace = async () => {
    try {
      const res = await api.get('/swaps/swappable-slots');
      setSwappableSlots(res.data);
    } catch (err) {
      console.error('Failed to fetch swappable slots', err);
    }
  };

  useEffect(() => {
    fetchMarketplace();

    const fetchMySwappableSlots = async () => {
      try {
        const res = await api.get('/events');
        setMySlots(res.data.filter((event) => event.status === 'SWAPPABLE'));
      } catch (err) {
        console.error('Failed to fetch my slots', err);
      }
    };
    fetchMySwappableSlots();
  }, []);

  const handleOpenRequest = (slot) => {
    setSelectedSlot(slot);
    setMyOfferSlotId('');
  };

  const handleRequestSwap = async (e) => {
    e.preventDefault();
    if (!myOfferSlotId) {
      alert('Please select one of your slots to offer.');
      return;
    }
    
    try {
      await api.post('/swaps/request', {
        mySlotId: myOfferSlotId,
        theirSlotId: selectedSlot._id,
      });
      alert('Swap request sent!');
      setSelectedSlot(null);
      fetchMarketplace();
    } catch (err) {
      alert('Failed to send swap request: ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Marketplace</h3>
          <p className="mt-1 text-sm text-gray-500">Here are all the slots available for swapping.</p>
          <ul className="mt-4 divide-y divide-gray-200">
            {swappableSlots.length > 0 ? swappableSlots.map((slot) => (
              <li key={slot._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
                <div>
                  <p className="text-md font-medium text-gray-900">{slot.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Owner: {slot.owner?.name || 'Unknown'}</p>
                </div>
                <button 
                  onClick={() => handleOpenRequest(slot)}
                  className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Request Swap
                </button>
              </li>
            )) : <p className="py-4 text-sm text-gray-500">No swappable slots available right now.</p>}
          </ul>
        </div>
      </div>

      {/* --- Modal --- */}
      {selectedSlot && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900">Request a Swap</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                You want to swap for: <strong className="text-gray-900">{selectedSlot.title}</strong>
              </p>
            </div>
            <form className="mt-4 space-y-4" onSubmit={handleRequestSwap}>
              <div>
                <label htmlFor="offerSlot" className="block text-sm font-medium text-gray-700">
                  Which of your slots do you want to offer?
                </label>
                <select
                  id="offerSlot"
                  className="mt-1 block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  value={myOfferSlotId}
                  onChange={(e) => setMyOfferSlotId(e.target.value)}
                  required
                >
                  <option value="">-- Select your slot --</option>
                  {mySlots.map((slot) => (
                    <option key={slot._id} value={slot._id}>
                      {slot.title} ({new Date(slot.startTime).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;