import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
   withCredentials : true // we will send the cookies to the server by default
}); // why to create axiosInstance? because we will be using it to make requests to the backend

export default axiosInstance;

// import.meta.mode === "development" ? "http://localhost:5000/api" : "/api"