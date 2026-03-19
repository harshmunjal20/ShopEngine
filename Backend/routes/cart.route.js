import express from 'express';
import {getCartProducts, addToCart, removeAllFromCart, updateQuantity} from '../controllers/cart.controller.js';
import {protectRoute} from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', protectRoute, getCartProducts); // get all the products in tha cart.
router.post('/', protectRoute, addToCart); // add a product to cart generally post means in api we are sending data
router.delete('/', protectRoute, removeAllFromCart); // removeAllFromCart will remove all products if productId not matched, else remove the specific product
router.put('/:id', protectRoute, updateQuantity) // either incrementing or decrementing the quantity
export default router;