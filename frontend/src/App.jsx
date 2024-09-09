import React, { useEffect } from 'react'
import FloatingShape from './components/FloatingShape';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import EmailVerification from './pages/EmailVerification';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protect the routes that require the authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if(!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;

}

// Redirect authenticated users to the home page

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified && Route != '/forgot-password') {
		return <Navigate to='/' replace />;
	}

	return children;
};

const App = () => {

  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0}/>
      <FloatingShape color='bg-green-500' size='w-48 h-48' top='70%' left='80%' delay={5}/>
      <FloatingShape color='bg-green-500' size='w-32 h-32' top='40%' left='-10%' delay={2  }/>
      
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
          } />
        <Route path="/signup" element={
          <RedirectAuthenticatedUser>
            <Signup />
          </RedirectAuthenticatedUser>
          } />
        <Route path="/login" element={
          <RedirectAuthenticatedUser>
            <Login />
        </RedirectAuthenticatedUser>
        } />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={
          <RedirectAuthenticatedUser>
            <ForgotPassword />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/reset-password/:token" element={
          <RedirectAuthenticatedUser>
            <ResetPassword />
          </RedirectAuthenticatedUser>
        } />
        {/* Catch all routes */}
        <Route path="*" element={
          <Navigate to='/' replace />
        } />
      </Routes>

      <Toaster />

    </div>
  )
}

export default App
