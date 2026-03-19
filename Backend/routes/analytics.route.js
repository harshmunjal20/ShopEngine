import express from 'express';
import {protectRoute, adminRoute} from '../middlewares/auth.middleware.js';
import {getAnalytics} from '../controllers/analytics.controller.js';
const router = express.Router();

// we will have only one route => for getting the analytics
router.get('/', protectRoute, adminRoute, getAnalytics);
export default router;