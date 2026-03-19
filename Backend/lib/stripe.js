import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // this will create a stripe object and we would be able to create discounts and create sesssions