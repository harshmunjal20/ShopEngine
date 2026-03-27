import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
const API = import.meta.env.VITE_API_URL;

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const res = await axios.post(`${API}/api/auth/signup`, { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

   login : async ({email, password}) => {
      set({loading : true});

      try {
         const res = await axios.post(`${API}/api/auth/login`, {email, password});
         set({user : res.data, loading : false});
      }
      catch (error) {
         set({loading : false});
         toast.error(error.response.data.message || 'An error occured');
      }
   },

   checkAuth : async () => {
      set({checkingAuth : true});

      try {
         const response = await axios.get(`${API}/api/auth/profile`); // it will return the user profile to us
         set({user : response.data, checkingAuth : false});
      }
      catch (error) {
         console.log(error.message);
         set({checkingAuth : false, user : null});
      }
   },
   
   logout : async() => {
      try {
         set({user : null});
         await axios.post(`${API}/api/auth/logout`);
      }
      catch (error) {
         toast.error(error.response?.data?.message || "An error occured during logout");
      }
   }
}));

// TODO : Implementing the axios interceptors for the refreshing the access token as access token => expires in 15 minutes