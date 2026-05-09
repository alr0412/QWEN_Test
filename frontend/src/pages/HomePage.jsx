import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { barbersApi } from '../api/client';
import BarberCard from '../components/BarberCard';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const { data: barbers, isLoading } = useQuery({
    queryKey: ['barbers', searchQuery],
    queryFn: () => barbersApi.getAll({ search: searchQuery }).then(res => res.data),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Barber in Minsk</h1>
          <p className="text-xl mb-8 opacity-90">Book appointments with top-rated barbers and hairdressers</p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {!user && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50"
            >
              Login to Book
            </button>
          )}
        </div>
      </section>

      {/* Barbers List */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Available Barbers</h2>
        
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : barbers?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No barbers found. Try a different search term.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers?.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>
        )}
      </section>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultRole="customer"
      />
    </div>
  );
}
