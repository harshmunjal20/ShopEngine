import express from 'express';
import {login , logout, signup, refreshToken, getProfile} from '../controllers/auth.controller.js';
import {protectRoute} from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post('/refresh-token', refreshToken); // as this refreh token expires in 15 mins but is very essential for doing activities like payment , adding more items to cart etc.
router.get('/profile', protectRoute,getProfile) // protected route means that only logged in users can access this route

// above refreshToken is the controller
export default router;