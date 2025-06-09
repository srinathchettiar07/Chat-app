import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const URL = import.meta.env.MODE === "developent" ?"http://localhost:3000":"/"; // Ensure this matches your backend URL

export const useAuthStore = create((set , get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },


    signup: async(data)=>{
         set({ isSigningUp: true });
    try {
      console.log("Signup data:", data);
      const res = await axiosInstance.post("/auth/signup", data);
      console.log("Signup response:", res);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message + " in signup");
    } finally {
      set({ isSigningUp: false });
    }
    },
     logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  login: async(data)=>{
    set({ isLoggingIn: true,

     });
    try {

      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error.response.data.message);
      
    }finally{
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-Profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket:()=>{
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      return;
    }
    const socket = io(URL, {
      query:{
        userId: authUser._id // Assuming userId is available in authUser
      }
    });

    socket.connect();
    set({ socket:socket });

    socket.on("getOnlineUsers" , (uID)=>{
      set({onlineUsers:uID})
    });
  },
  disconnectSocket:(
  )=>{

    if(get().socket?.connected)
    {
      get().socket.disconnect();
      set({ socket: null });
    }
  }
}))