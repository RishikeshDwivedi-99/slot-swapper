import React, { useState, useEffect } from 'react';
import api from '../api/api.js';

const DashboardPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/events');
      setMyEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', { title, startTime, endTime });
      setTitle('');
      setStartTime('');
      setEndTime('');
      fetchMyEvents(); 
    } catch (err) {
      console.error('Failed to create event', err);
    }
  };

  const handleMakeSwappable = async (eventId) => {
    try {
      await api.put(`/events/${eventId}`, { status: 'SWAPPABLE' });
      fetchMyEvents();
    } catch (err) {
      console.error('Failed to update event', err);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SWAPPABLE':
        return 'text-green-600 font-semibold';
      case 'SWAP_PENDING':
        return 'text-yellow-600 font-semibold';
      case 'BUSY':
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Event</h3>
          <form className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4" onSubmit={handleCreateEvent}>
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                id="startTime"
                className="mt-1 block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                id="endTime"
                className="mt-1 block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-4 flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">My Events</h3>
          <ul className="mt-4 divide-y divide-gray-200">
            {myEvents.length > 0 ? myEvents.map((event) => (
              <li key={event._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
                <div>
                  <p className="text-md font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    Status: <span className={getStatusClass(event.status)}>{event.status}</span>
                  </p>
                </div>
                {event.status === 'BUSY' && (
                  <button 
                    onClick={() => handleMakeSwappable(event._id)}
                    className="rounded-md bg-green-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                  >
                    Make Swappable
                  </button>
                )}
              </li>
            )) : <p className="py-4 text-sm text-gray-500">You haven't created any events yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;