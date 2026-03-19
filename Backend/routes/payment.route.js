import express from 'express';
import {protectRoute} from '../middlewares/auth.middleware.js';
import {createCheckoutSession, checkoutSuccessController} from '../controllers/payment.controller.js';
const router = express.Router();

router.post('/create-checkout-session', protectRoute, createCheckoutSession); // post is used because we are sending data
router.post('/checkout-success', protectRoute, checkoutSuccessController);// other endpoint that we need is where user wants to check that the checkout was succcessful => in that case we will be creating the order in the db and maube show a differnt message
export default router;