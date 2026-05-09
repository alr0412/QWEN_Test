import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function MyBookingsPage() {
  const { user, loading } = useAuth();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsApi.getMy().then(res => res.data),
    enabled: !!user,
  });

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : bookings?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't made any bookings yet</p>
            <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Find a barber →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{booking.barber?.salonName}</h3>
                    <p className="text-gray-600">{booking.service?.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium">{booking.startTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">{booking.service?.durationMinutes} min</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">{booking.price} BYN</p>
                  </div>
                </div>

                {booking.eripCode && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">ERIP Payment Code</p>
                    <p className="font-mono text-lg font-bold">{booking.eripCode}</p>
                    {booking.status === 'RESERVED' && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Please complete payment to confirm your booking
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
