import express from 'express';
import {getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct} from '../controllers/product.controller.js';
import {protectRoute, adminRoute} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts); // as in admin dashboard , only admin can see all the products but user will be able to see featured products
router.get('/featured', getFeaturedProducts); // anyone can see the featured products 
router.get('/recommendations', protectRoute, getRecommendedProducts); // get recommended products from the cart
router.get('/category/:category', getProductsByCategory);// now also getting the products by category
router.post('/', protectRoute, adminRoute, createProduct); // adding a product we will need some images => cloudinary
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct); // toggle means in english => switching on and off,
// now router for deleting the product

router.delete('/:id', protectRoute, adminRoute, deleteProduct);

export default router;