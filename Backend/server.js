import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables from .env file (dotenv.config helps in reading the comtent of .env file)

const app = express();
app.use(express.json()); 
const PORT = process.env.PORT || 5000;

app.use(cookieParser()); // imp. use it before routes => so that we can access cookies in routes
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('.api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
    connectDB();
});