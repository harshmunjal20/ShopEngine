import {motion} from 'framer-motion';
import {useState, useEffect} from 'react';
import {useCartStore} from '../stores/useCartStore.js';

const GiftCouponCard = () => {
   const [userInputCode, setUserInputCode] = useState("");
   const {coupon, isCouponApplied, removeCoupon, applyCoupon, getMyCoupon} = useCartStore();

   const [success, setSuccess] = useState(false);

   useEffect(() => {
      getMyCoupon();
   },[getMyCoupon]);

   useEffect(() => {
      if (coupon && isCouponApplied) setUserInputCode(coupon.code);
   },[coupon, isCouponApplied]); // useeffect for setting the code

   const handleApplyCoupon = async () => {
      if (!userInputCode || isCouponApplied) return;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      await applyCoupon(userInputCode);
   }

   const handleRemoveCoupon = async () => {
      await removeCoupon();
      await getMyCoupon();
      setUserInputCode("");
   }
   return (
      <motion.div
         className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
         initial = {{opacity : 0, y : 20}}
         animate = {{opacity : 1, y : 0}}
         transition={{duration : 0.8 , delay : 0.2}}
      >
         <div className='space-y-4'>
            <div>
               <label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
                  Do you have voucher or gift card?
               </label>

               <input 
                  type='text'
                  id='voucher'
                  className='block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text:sm
                  text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500' 
                  placeholder='Enter code here'
                  value={userInputCode}
                  onChange={(e) => setUserInputCode(e.target.value)}
                  required
               />
            </div>

            <motion.button
            type="button"
            onClick={handleApplyCoupon}
            animate={success ? { scale: [1, 1.1, 1] } : {}}
            className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white
            ${success ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
               {success ? "Coupon Applying 🎉" : "Apply Code"}
            </motion.button>
         </div>

         {isCouponApplied && coupon && (
            <div className='mt-4'>
               <h3 className='text-lg font-medium text-gray-300'>
                  Applied Coupon
               </h3>

               <p className='mt-2 text-sm text-gray-400'>
                  {coupon.code} - {coupon.discountPercentage}% off
               </p>

               <motion.button 
                  type='button'
                  className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'
                  whileHover={{scale : 1.05}}
                  whileTap={{scale : 0.95}}
                  onClick={handleRemoveCoupon}
               >
                  Remove Coupon
               </motion.button>
            </div>
         )}

         {/* to show Available coupons */}
         {coupon && <div className='mt-4'>
            <h3 className='text-lg font-medium text-gray-300'>Your Available Coupon:</h3>
            <p className='mt-2 text-sm text-gray-400'>
               {coupon.code}- {coupon.discountPercentage}% off
            </p>
         </div>
         }
      </motion.div>
   )
}

export default GiftCouponCard;