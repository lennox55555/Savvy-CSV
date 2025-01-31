import './App.css'
import SavvyService from './features/SavvyService/SavvyService';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import SignInPage from './pages/SignInPage/SignInPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import { Routes, Route, Navigate } from 'react-router-dom'
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import { useEffect, useState } from 'react';
import UserServiceAPI from './api/userServiceAPI';
import ProtectedRouteProps from './interfaces/ProtectedRouteProps';
import { ThemeProvider } from './themes/ThemeContext';
import React from 'react';
import LandingPage from './pages/LandingPage/LandingPage';
import TeamPage from './pages/TeamPage/TeamPage';


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isLoggedIn = await UserServiceAPI.getInstance().isLoggedIn();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error("Error in checking auth status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div>Loading...</div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};


function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/team' element={<TeamPage />} />
      <Route path='/signin' element={<SignInPage />} />
      <Route path='/register' element={<RegistrationPage />} />
      <Route
        path='/savvycsv/:conversationId?'
        element={
          <ProtectedRoute>
            <ThemeProvider>
              <SavvyService />
            </ThemeProvider>
          </ProtectedRoute>
        }
      />
      <Route path='/feedback' element={<FeedbackPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default App
