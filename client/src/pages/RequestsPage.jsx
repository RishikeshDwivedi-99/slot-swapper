import React, { useState, useEffect } from 'react';
import api from '../api/api.js';

const RequestsPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchRequests = async () => {
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        api.get('/swaps/incoming'),
        api.get('/swaps/outgoing'),
      ]);
      setIncoming(incomingRes.data);
      setOutgoing(outgoingRes.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, accepted) => {
    try {
      await api.post(`/swaps/respond/${requestId}`, { accepted });
      alert(`Request ${accepted ? 'accepted' : 'rejected'}!`);
      fetchRequests();
    } catch (err) {
      alert('Failed to respond: ' + (err.response?.data?.message || 'Error'));
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-green-600 font-bold';
      case 'REJECTED':
        return 'text-red-600 font-bold';
      case 'PENDING':
      default:
        return 'text-yellow-600 font-bold';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Incoming Requests (Pending)</h3>
          {incoming.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No pending incoming requests.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-200">
              {incoming.map((req) => (
                <li key={req._id} className="py-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      <strong>{req.requester.name}</strong> wants to swap:
                    </p>
                    <p className="text-sm text-gray-700"><strong>Their Slot:</strong> {req.requesterSlot.title}</p>
                    <p className="text-sm text-gray-700"><strong>For Your Slot:</strong> {req.recipientSlot.title}</p>
                  </div>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() => handleResponse(req._id, true)}
                      className="rounded-md bg-green-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleResponse(req._id, false)}
                      className="rounded-md bg-red-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Outgoing Requests (All)</h3>
          {outgoing.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No outgoing requests.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-200">
              {outgoing.map((req) => (
                <li key={req._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Request to <strong>{req.recipient.name}</strong>
                    </p>
                    <p className="text-sm text-gray-700"><strong>You offered:</strong> {req.requesterSlot.title}</p>
                    <p className="text-sm text-gray-700"><strong>For their:</strong> {req.recipientSlot.title}</p>
                  </div>
                  <p className={`text-sm ${getStatusClass(req.status)}`}>
                    {req.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;