import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/common/auth/providers/AuthProvider';
import { LoginPage } from '@/pages/login/LoginPage';
import { MessengerPage } from '@/pages/messenger/MessengerPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MessengerPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
