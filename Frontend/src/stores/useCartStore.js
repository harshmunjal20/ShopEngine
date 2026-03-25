import {create} from 'zustand';
import axios from '../lib/axios.js';
import {toast} from 'react-hot-toast';
const API = import.meta.env.VITE_API_URL;

export const useCartStore = create((set, get) => ({
   cart : [],
   coupon : null,
   total : 0,
   subtotal : 0 ,// with coupon amount
   getCartItems : async () => {
      try {
         const res = await axios.get(`${API}/api/cart`); 
         set({cart : res.data});
         get().calculateSubTotals();
      }
      catch (error) {
         set({cart : []});
         toast.error(error.response.data.message || 'An error occured');
      }
   }, // it's gonna give us all the different items in the cart by calling at the api endpoint

   addToCart : async (product) => {
      try {
         await axios.post(`${API}/api/cart`, {productId : product._id});
         toast.success('Product added to cart');

         set((prevState) => {
            const existingItem = prevState.cart.find((item) => item._id === product._id);
            const newCart = existingItem ? (
               prevState.cart.map((item) => (item._id === product._id ? {...item, quantity : item.quantity + 1} : item))
            ) : [...prevState.cart, {...product, quantity : 1}];
            return {cart : newCart};
         });

         get().calculateSubTotals(); // firstly update the ui then calculate the total :)
      }
      catch (error) {
         toast.error(error?.response?.data.message ,"An error occured");
      }
   },

   calculateSubTotals : () => {
      const {cart, coupon} = get(); // get() will give us all the prevState details like cart, coupon etc.
      const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);// sum is accumulator and 0 is used to set sum = 0 initially
      let total = subTotal;

      if (coupon) {
         const discount = Math.round(total * (coupon.discountPercentage / 100));
         total -= discount;
      }

      set({ subTotal, total });
   }, // whenever we add something to the cart, we can call this function
}));
