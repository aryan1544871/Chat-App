import {create} from 'zustand';
import axios from 'axios';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';
export const useChatStore = create((set, get) => ({
messages: [],
users: [],
selectedUser: null,
isUsersLoading:false,
isMessagesLoading:false,
getUsers: async ()=>{
    set({isUsersLoading:true});
    try {
        const response = await axiosInstance.get('message/users');
        set({users: response.data});
    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({isUsersLoading:false});
    }
},
getMessages: async (userId) =>{
    set({isMessagesLoading:true});
    try {
        const response = await axiosInstance.get(`message/${userId}`);
        set({messages: response.data});
    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({isMessagesLoading:false});
    }
},
sendMessages : async (messageData) =>{ 
    const { selectedUser, messages } = get();
    try {
        const response = await axiosInstance.post(`message/send/${selectedUser._id}`, messageData);
        set({messages: [...messages, response.data]});
    } catch (error) {
        toast.error(error.response.data.message);
    }
},
 
setSelectedUser: (user) =>{
    set({selectedUser: user});  
},

subscribeToMessages:() =>{
    const {selectedUser} = get();
    if(!selectedUser) return;
    const socket = useAuthStore.getState().socket; 
    socket.on("newMessage", (newMessage)=>{
        const isMessageSentForSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentForSelectedUser) return;
        set({
            messages: [...get().messages, newMessage]
        })
    })
},

unsubscribeFromMessages: () =>{
 const socket = useAuthStore.getState().socket;
 socket.off("newMessage");
}
}));