import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { ChefHat, User, LogOut, LayoutDashboard } from 'lucide-react';
import { selectCurrentUser } from '../features/authSlice';
import { logout } from '../features/authSlice';

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ChefHat className="w-8 h-8 text-green-600" />
            <span className="font-semibold text-xl text-gray-900">RecipeBox</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 transition"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <img 
                    src={user.image} 
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-700">{user.firstName} {user.lastName}</span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 transition"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}