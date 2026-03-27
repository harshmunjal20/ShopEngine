import express from 'express';
import {protectRoute} from '../middlewares/auth.middleware.js';
import {getCoupon, validateCoupon} from '../controllers/coupon.controller.js';
const router = express.Router();

router.get('/', protectRoute, getCoupon);
router.post('/validate', protectRoute, validateCoupon); // it is get because the route is only checking / reading the coupon
export default router;