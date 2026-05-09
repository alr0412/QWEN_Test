import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barbersApi, bookingsApi, servicesApi } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

export default function BookingForm({ barberId }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch barber details
  const { data: barber } = useQuery({
    queryKey: ['barber', barberId],
    queryFn: () => barbersApi.getById(barberId).then(res => res.data),
  });

  // Fetch available slots
  const { data: slotsData, refetch: refetchSlots } = useQuery({
    queryKey: ['slots', barberId, selectedDate],
    queryFn: () => barbersApi.getSlots(barberId, selectedDate).then(res => res.data),
    enabled: !!selectedDate,
  });

  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: (data) => bookingsApi.create(data),
    onSuccess: (response) => {
      setBookingResult(response.data);
      queryClient.invalidateQueries(['slots', barberId]);
    },
  });

  // Simulate payment mutation
  const simulatePayment = useMutation({
    mutationFn: (eripCode) => bookingsApi.simulatePayment(eripCode),
    onSuccess: () => {
      setBookingResult(prev => ({ ...prev, status: 'CONFIRMED' }));
      queryClient.invalidateQueries(['slots', barberId]);
    },
  });

  const handleBook = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedService || !selectedSlot || !selectedDate) return;

    createBooking.mutate({
      barberId,
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedSlot,
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setMonth(max.getMonth() + 2);
    return max.toISOString().split('T')[0];
  };

  if (!barber) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>

      {/* Service Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Service</label>
        <div className="space-y-2">
          {barber.services?.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`w-full p-3 border rounded-lg text-left transition-colors ${
                selectedService?.id === service.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{service.name}</span>
                <span className="text-gray-600">{service.price} BYN</span>
              </div>
              <div className="text-sm text-gray-500">{service.durationMinutes} min</div>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <input
          type="date"
          min={getMinDate()}
          max={getMaxDate()}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedSlot(null);
          }}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Time Slot Selection */}
      {selectedDate && slotsData && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Available Times</label>
          {slotsData.slots.length === 0 ? (
            <p className="text-gray-500 text-sm">No available slots for this date</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slotsData.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 rounded text-sm transition-colors ${
                    selectedSlot === slot
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Summary */}
      {selectedService && selectedSlot && selectedDate && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Summary</h3>
          <div className="text-sm space-y-1">
            <p>Service: {selectedService.name}</p>
            <p>Date: {selectedDate}</p>
            <p>Time: {selectedSlot}</p>
            <p>Duration: {selectedService.durationMinutes} min</p>
            <p className="font-bold">Price: {selectedService.price} BYN</p>
          </div>
        </div>
      )}

      {/* Book Button */}
      {bookingResult ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-green-800 mb-2">Booking Created!</h3>
          <div className="text-sm space-y-2">
            <p><strong>ERIP Code:</strong> {bookingResult.eripCode}</p>
            <p><strong>Status:</strong> {bookingResult.status}</p>
            <p className="text-xs text-gray-600">
              Pay this code via any Belarusian bank app or ERIP kiosk
            </p>
            
            {bookingResult.status === 'RESERVED' && (
              <button
                onClick={() => simulatePayment.mutate(bookingResult.eripCode)}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
              >
                🧪 Simulate Payment (Demo)
              </button>
            )}

            {bookingResult.status === 'CONFIRMED' && (
              <p className="text-green-600 font-medium mt-2">✓ Payment confirmed!</p>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={handleBook}
          disabled={!selectedService || !selectedSlot || !selectedDate || createBooking.isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createBooking.isPending ? 'Creating...' : 'Book & Pay'}
        </button>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultRole="customer"
      />
    </div>
  );
}
