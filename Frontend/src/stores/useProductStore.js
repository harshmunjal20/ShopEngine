import {create} from 'zustand';
import axios from '../lib/axios.js';
import {toast} from 'react-hot-toast';

// it will have states initially and then setters function
export const useProductStore = create((set, get) => ({
   products : [], // states
   loading : false ,
   setProducts : (products) => set({products}),

   createProduct : async (productData) => {
      set({loading : true});

      try {
         const res = await axios.post(`api/products`, productData);

         // now we want to add product to the previous state of products array , ie update the setter
         set((prevState) => ({
            loading : false,
            products : [...prevState.products, res.data]
         }));

         console.log(productData);
      }
      catch (error) {
         set({loading : false});
         toast.error(error.response.data.message || 'An error occured');
      }
   },

   // fetchAllProducts is simple , just call the endpoint to be able to fetch the product
   fetchAllProducts : async() => {
      set({loading : true});
      try {
         const response = await axios.get(`api/products`);
         set({products : response.data.products, loading : false}); // as in backend we are returning {products}
      }
      catch (error) {
         set({error : "Falied to fetch Products", loading : false});
         toast.error(error.response.data.message || "Failed to fetch products");
      }
   },

   fetchFeaturedProducts : async () => {
      set({loading : true});
      try {
         const response = await axios.get(`api/products/featured`);
         set({products : response.data.products, loading : false});
      }
      catch (error) {
         set({error : "failed to fetch products", loading : false});
         console.log("Error fetching featured products : ", error);
      }
   },

   fetchProductsByCategory : async (category) => {
      set({loading : true});

      try {
         const response = await axios.get(`api/products/category/${category}`);
         set({products : response.data.products, loading : false});
      }
      catch (error) {
         set({loading : false});
         toast.error(error.response.data.message || 'Failed to fetch category items');
      }
   },

   deleteProduct : async (productId) => {
      set({loading : true});
      try {
         await axios.delete(`api/products/${productId}`);
         set((prevState) => ({
            products : prevState.products.filter((product) => product._id !== productId),
            loading : false
         }))
      }
      catch (error) {
         set({ loading : false });
         toast.error(error.response?.data.message || 'Failed to delete product');
      }
   },
   toggleFeaturedProduct : async (productId) => {
      set({loading : true});

      try {
         const response = await axios.patch(`api/products/${productId}`);
         // now we will be filter out this response from the previous  , this will update the isFeatured property of the product
         set((prevState) => ({
            products : prevState.products.map((product) => 
            product._id === productId ? {...product, isFeatured : response.data.isFeatured} : product
         ), loading : false})); 
      }
      catch (error) {
         set({loading : false});
         toast.error(error.response?.data.message || 'Failed to update featured product');
      }
   }

}));