import {Minus, Plus, Trash} from 'lucide-react';
import { useCartStore } from '../stores/useCartStore.js';

const CartItem = ({item}) => {
   const {removeFromCart, updateQuantity} = useCartStore();

   return (
      <div className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6'>
         <div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
            {/* we would like to show the image so prop of product is needed  as we are getting the item={item} from the cart*/ }
            <div className='w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex-shrink-0'>
               <img
                  src={item.image}
                  alt={item.name}
                  className='w-full h-full object-cover rounded-lg'
               />
            </div>

            <label className='sr-only'>Choose quantity:</label> {/* we are not gonna see this text => only for screen readers */}

            <div className='flex items-center justify-between md:order-3 md:justify-end'>
            {/* two buttons => for updating quantity and in between the text writen */}
               <div className='flex items-center gap-2'>
                  <button
                     className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500' onClick = {() => updateQuantity(item._id , item.quantity - 1)}
                  >
                     <Minus className='text-gray-300'/>
                  </button>

                  <p>{item.quantity}</p>

                  <button className='inline-flex h-5 w-5 shrink-0 items-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500' onClick = {() => updateQuantity(item._id, item.quantity + 1)}>
                     <Plus className='text-gray-300'/>
                  </button>
               </div>

               <div className='text-end md:order-4 md:w-32'>
                  <p className='text-base font-bold text-emerald-400'>${item.price * item.quantity}</p>
               </div>
            </div>

            {/* now we want to have item name and item price and trash icon for deleting that all quantities of that item */}
            <div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
               <p className='text-base font-medium text-white hover:text-emerald-400 hover:underline'>
                  {item.name}
               </p>
               <p className='text-sm text-gray-400'> {item.description} </p>

               <div className='flex items-center gap-4'>
                  <button
                     className='inline-flex items-center text-sm font-medium text-red-400
                     hover:text-red-300 hover:underline'
                     onClick={() => removeFromCart(item._id)}
                     >
                        <Trash/>
                     </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default CartItem;
