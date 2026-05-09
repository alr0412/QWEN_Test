import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { barbersApi } from '../api/client';
import BookingForm from '../components/BookingForm';

export default function BarberProfilePage() {
  const { id } = useParams();

  const { data: barber, isLoading } = useQuery({
    queryKey: ['barber', id],
    queryFn: () => barbersApi.getById(id).then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Barber not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
              {barber.imageUrl ? (
                <img src={barber.imageUrl} alt={barber.salonName} className="w-full h-full object-cover rounded-full" />
              ) : (
                '✂️'
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{barber.salonName}</h1>
              <p className="text-gray-600 mb-2">{barber.userName}</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-1 text-lg">★</span>
                <span className="font-medium">{barber.rating?.toFixed(1) || 'New'}</span>
              </div>
              <p className="text-gray-500">{barber.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Services</h2>
            {barber.services?.length === 0 ? (
              <p className="text-gray-500">No services available</p>
            ) : (
              <div className="space-y-3">
                {barber.services?.map((service) => (
                  <div key={service.id} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.durationMinutes} min</p>
                    </div>
                    <p className="font-bold text-blue-600">{service.price} BYN</p>
                  </div>
                ))}
              </div>
            )}

            {/* Map Placeholder */}
            <div className="mt-6">
              <h3 className="font-bold mb-2">Location</h3>
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-2xl mb-2">📍</p>
                  <p>{barber.address}</p>
                  <p className="text-xs mt-1">(Map would be displayed here)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <BookingForm barberId={id} />
        </div>
      </div>
    </div>
  );
}
