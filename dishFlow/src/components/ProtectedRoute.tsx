import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useSelector(selectCurrentToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}