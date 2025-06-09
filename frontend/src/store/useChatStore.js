import {create} from 'zustand';
import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set , get) => ({
    messages: [],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    
    
    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const response = await axiosInstance.get('/message/users');
            set({users: response.data, isUsersLoading: false});
        } catch (error) {
            toast.error('Failed to fetch users');
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true});
        try {
            const response = await axiosInstance.get(`/message/${userId}`);
            set({messages: response.data, isMessagesLoading: false});
        } catch (error) {
            toast.error('Failed to fetch messages');
            set({
                isMessagesLoading: false});
        }
        finally{
            set({
                isMessagesLoading: false,
            })
        }
    },
    
    sendMessage: async (messageData)=>{
        set({isSendingMessage: true});
        const {selectedUser, messages} = get();
        try {
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            console.log('Message sent:', response.data);
            set({messages: [...messages, response.data]});
        } catch (error) {
            toast.error('Failed to send message');
            console.error('Error sending message:', error);
        } finally {
            set({isSendingMessage: false});
        }
    },
    subscribeToMessages:()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) =>
        {
            if(newMessage.sender !== selectedUser._id) return;
            set({
                messages:[...get().messages , newMessage]
            })
        })
    },
    unsubscribeToMessages:()=>{
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
        
    },
    setSelectedUser: (user) => set({selectedUser: user}),
}));