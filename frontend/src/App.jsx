import React from 'react';
import Navbar from './components/Navbar.jsx';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js';
function App() {
  const {authUser, isCheckingAuth, checkAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();
  useEffect(() => {
    checkAuth();
  },[checkAuth])
  
  console.log({authUser});
  console.log({onlineUsers});


  if(isCheckingAuth && !authUser) return (
    <div className="flex justify-center items-center h-screen">
      <Loader className = "size-10 animate-spin"/>
    </div>
  );
  

  return (
    <div data-theme={theme}>
      <Navbar/> 
      <Routes>
        <Route path = "/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path = "/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path = "/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path = "/settings" element={<SettingsPage />} />
        <Route path = "/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
      </Routes> 
      <Toaster />
    </div>
  );
}
export default App;
