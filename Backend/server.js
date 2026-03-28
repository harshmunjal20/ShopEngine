import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // 

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
app.use(express.json({limit : "10mb"})); // making size of payload to 10 mb for images
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

const PORT = process.env.PORT || 5000;
const __dirName = path.resolve(); // dirname is going to be the root directory

app.use(cookieParser()); // imp. use it before routes => so that we can access cookies in routes
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirName, "/Frontend/dist"))); // dist => distribution folder => It contains the final optimised version of your app that is ready to be deployed, dist is the folder that users actually download in their browser

    app.use((req, res) => {
        res.sendFile(path.resolve(__dirName, "Frontend", "dist", "index.html"));
    }); // for any request that that doesn't match an API Route, send index.html
}

app.listen(PORT ,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});