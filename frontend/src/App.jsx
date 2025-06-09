import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import { Routes , Route , Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import Profile from './pages/Profile.jsx';
import Signup from './pages/Signup.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from './store/useThemeStore.js';
import { useEffect } from 'react';
import {Loader} from 'lucide-react';
import { Toaster } from "react-hot-toast";

const App = () => {
  const {authUser , checkAuth , isCheckingAuth , onlineUsers} =  useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("Online Users:", onlineUsers);
  const {theme} = useThemeStore();

  if(isCheckingAuth && !authUser) {
    return (
      <div className="loading-screen flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser? <Homepage />: <Navigate to="/login" />}/>
        <Route path="/profile" element={authUser? <Profile />: <Navigate to="/login" />}/>
        <Route path="/Signup" element={!authUser? <Signup/>:<Navigate to="/"/>}/>
        <Route path='/login' element={!authUser?<Login />:<Navigate to="/" />} />
        <Route path='/settings' element={authUser? <Settings />: <Navigate to="/login" />} />

      </Routes>
    </div>
  );
};

export default App;
