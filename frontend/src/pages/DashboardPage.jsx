import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { barberProfileApi, servicesApi, availabilityApi, bookingsApi } from '../api/client';
import { useAuth } from '../hooks/useAuth';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('services');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.role !== 'barber') {
      navigate('/');
    }
  }, [user, navigate]);

  if (user?.role !== 'barber') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Barber Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.phone}</span>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'services'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'availability'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Availability
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'bookings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Bookings
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'availability' && <AvailabilityTab />}
        {activeTab === 'bookings' && <BookingsTab />}
      </main>
    </div>
  );
}

function ServicesTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: services } = useQuery({
    queryKey: ['barber-services'],
    queryFn: () => Promise.resolve([]), // Will be populated from profile
  });

  const createService = useMutation({
    mutationFn: (data) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['barber-services']);
      setShowForm(false);
      reset();
    },
  });

  const updateService = useMutation({
    mutationFn: ({ id, data }) => servicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['barber-services']);
      setEditingService(null);
      reset();
    },
  });

  const deleteService = useMutation({
    mutationFn: (id) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['barber-services']);
    },
  });

  const onSubmit = (data) => {
    if (editingService) {
      updateService.mutate({ id: editingService.id, data });
    } else {
      createService.mutate(data);
    }
  };

  const startEdit = (service) => {
    setEditingService(service);
    reset({
      name: service.name,
      price: service.price,
      durationMinutes: service.durationMinutes,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Services</h2>
        <button
          onClick={() => {
            setEditingService(null);
            reset({ name: '', price: '', durationMinutes: '' });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-bold mb-4">{editingService ? 'Edit Service' : 'New Service'}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Name</label>
              <input
                type="text"
                {...register('name', { required: 'Required' })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (BYN)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Required', min: 0 })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  {...register('durationMinutes', { required: 'Required', min: 1 })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.durationMinutes && <p className="text-red-500 text-sm">{errors.durationMinutes.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={createService.isPending || updateService.isPending}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {editingService ? 'Update' : 'Create'} Service
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services?.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4">{service.name}</td>
                <td className="px-6 py-4">{service.price} BYN</td>
                <td className="px-6 py-4">{service.durationMinutes} min</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => startEdit(service)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteService.mutate(service.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!services?.length && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No services yet. Add your first service!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AvailabilityTab() {
  const [schedule, setSchedule] = useState(
    DAYS.map((day, index) => ({
      dayOfWeek: index,
      startTime: '10:00',
      endTime: '18:00',
      isWorking: index < 5, // Mon-Fri by default
    }))
  );

  const setAvailability = useMutation({
    mutationFn: (data) => availabilityApi.set(data),
    onSuccess: () => {
      alert('Availability saved!');
    },
  });

  const toggleDay = (index) => {
    setSchedule(prev => prev.map((day, i) => 
      i === index ? { ...day, isWorking: !day.isWorking } : day
    ));
  };

  const updateTimes = (index, field, value) => {
    setSchedule(prev => prev.map((day, i) => 
      i === index ? { ...day, [field]: value } : day
    ));
  };

  const handleSave = () => {
    const payload = schedule
      .filter(day => day.isWorking)
      .map(({ dayOfWeek, startTime, endTime }) => ({
        dayOfWeek,
        startTime,
        endTime,
      }));
    setAvailability.mutate(payload);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Weekly Availability</h2>
        <button
          onClick={handleSave}
          disabled={setAvailability.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Save Schedule
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Working</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedule.map((day, index) => (
              <tr key={day.dayOfWeek}>
                <td className="px-6 py-4 font-medium">{DAYS[day.dayOfWeek]}</td>
                <td className="px-6 py-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={day.isWorking}
                      onChange={() => toggleDay(index)}
                      className="mr-2"
                    />
                    Working Day
                  </label>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="time"
                    value={day.startTime}
                    onChange={(e) => updateTimes(index, 'startTime', e.target.value)}
                    disabled={!day.isWorking}
                    className="border rounded px-2 py-1 disabled:opacity-50"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="time"
                    value={day.endTime}
                    onChange={(e) => updateTimes(index, 'endTime', e.target.value)}
                    disabled={!day.isWorking}
                    className="border rounded px-2 py-1 disabled:opacity-50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingsTab() {
  const { data: bookings } = useQuery({
    queryKey: ['barber-bookings'],
    queryFn: () => bookingsApi.getBarberBookings().then(res => res.data),
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Upcoming Bookings</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ERIP Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings?.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{booking.startTime}</td>
                <td className="px-6 py-4">{booking.service?.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm">{booking.eripCode}</td>
              </tr>
            ))}
            {!bookings?.length && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No bookings yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simple useQuery implementation for local state
function useQuery(options) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await options.queryFn();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading };
}
