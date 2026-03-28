import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

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
			const res = await axios.post(`api/auth/signup`, { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

   login : async ({email, password}) => {
      set({loading : true});

      try {
         const res = await axios.post(`api/auth/login`, {email, password});
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
         const response = await axios.get(`api/auth/profile`); // it will return the user profile to us
         set({user : response.data, checkingAuth : false});
      }
      catch (error) {
         console.log(error.message);
         set({checkingAuth : false, user : null});
      }
   },

   refreshToken : async() => {
      // prevent multiple simultaneous refresh attempts
      if (get().checkingAuth) return;

      set({checkingAuth : true});
      try {
         const response = await axios.post(`api/auth/refresh-token`);
         set({checkingAuth : false});
         return response.data;
      }
      catch (error) {
         set({user : null, checkingAuth : false});
         throw error;
      }
   },
   
   logout : async() => {
      try {
         set({user : null});
         await axios.post(`api/auth/logout`);
      }
      catch (error) {
         toast.error(error.response?.data?.message || "An error occured during logout");
      }
   }
}));

// TODO : Implementing the axios interceptors for the refreshing the access token as access token => expires in 15 minutes
// axios interceptor for token refresh

let refreshPromise = null;

axios.interceptors.response.use(
   (response) => response, // if we don't have any errors we would be returning the response as it is 
   async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) { // 401 is checking authorization error
         originalRequest._retry = true;
         try {
            // if a refresh is already in the progress , wait for it to complete
            if (refreshPromise) {
               await refreshPromise;
               return axios(originalRequest);
            }

            // start a new refresh process
            refreshPromise = useUserStore.getState().refreshToken();
            await refreshPromise;

            return axios(originalRequest);
         }
         catch (refreshError) {
            // if a refresh fails redirect to login or handle as needed
            useUserStore.getState().logout();
            return Promise.reject(refreshError)
         }
         finally {
            refreshPromise = null; // why this ? => this will allow the next request to be sent
         }
      }
      return Promise.reject(error);
   }
);