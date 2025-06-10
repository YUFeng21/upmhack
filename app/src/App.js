import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './hooks/useAuth';

// Layout Components
import Layout from './components/layout/Layout';

// Auth Screens
import SignIn from './screens/auth/SignIn';
import SignUp from './screens/auth/SignUp';

// Main Screens
import Home from './screens/Home';
import Profile from './screens/Profile';
import MyFarm from './screens/MyFarm';
import MyCrops from './screens/MyCrops';
import SmartIrrigation from './screens/SmartIrrigation';
import PestControl from './screens/PestControl';
import CropHealth from './screens/CropHealth';
import Chat from './screens/Chat';
import Community from './screens/Community';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Box>Loading...</Box>;
  }
  
  if (!user) {
    return <Navigate to="/sign-in" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="farm" element={<MyFarm />} />
        <Route path="crops" element={<MyCrops />} />
        <Route path="smart-irrigation" element={<SmartIrrigation />} />
        <Route path="pest-control" element={<PestControl />} />
        <Route path="crop-health" element={<CropHealth />} />
        <Route path="chat" element={<Chat />} />
        <Route path="community" element={<Community />} />
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App; 