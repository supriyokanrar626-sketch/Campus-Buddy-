import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import AIChatPage from './pages/AIChatPage';
import LMSPage from './pages/LMSPage';
import FeesPage from './pages/FeesPage';
import PapersPage from './pages/PapersPage';
import LostFoundPage from './pages/LostFoundPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-animated">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-4 lg:p-8 pt-16 lg:pt-8 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes with Sidebar Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AIChatPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AboutPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lms"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LMSPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/fees"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <FeesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/papers"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PapersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lost-found"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LostFoundPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
