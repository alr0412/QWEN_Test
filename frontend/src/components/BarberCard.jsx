import { Link } from 'react-router-dom';

export default function BarberCard({ barber }) {
  return (
    <Link 
      to={`/barber/${barber.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {barber.imageUrl ? (
          <img src={barber.imageUrl} alt={barber.salonName} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-4xl">✂️</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{barber.salonName}</h3>
        <p className="text-sm text-gray-600 mb-2">{barber.userName}</p>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-sm font-medium">{barber.rating?.toFixed(1) || 'New'}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{barber.address}</p>
      </div>
    </Link>
  );
}
