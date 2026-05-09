import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ✂️ Beauty Hub
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'barber' && (
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'customer' && (
                  <Link 
                    to="/my-bookings" 
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    My Bookings
                  </Link>
                )}
                <span className="text-sm text-gray-500">{user.phone}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-500">
                Login as Customer or Barber
              </span>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
