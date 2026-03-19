import {redis} from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';
import Product from  '../Models/product.model.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // find all products and return them
        res.json({products});
    }
    catch (error) {
        console.log("Error in getAllProductsController", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
};  

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");

        if (featuredProducts) {
            return res.json({products : JSON.parse(featuredProducts)}); // parsing is done because redis stores the data in string format and we have to use it in json format which is good for performance
        }

        // if not in redis , fetch it from mongoDB
        // .lean() is used to get the data in JSON format instead of document format of mongoose
        featuredProducts = await Product.find({isFeatured : true}).lean(); // find all featured products and return them and lean() is used to get the data in JSON format instead of document format of mongoose
        // now storing it in redis for future quick access

        await redis.set("featured_products", JSON.stringify(featuredProducts)); 

        res.json({products : featuredProducts});
    }
    catch (error) {
        console.log("Error in getFeaturedProductsController", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}; // this has to be saved in redis db as well because everyone is going to access them, so making them faster by saving this in redis

// we will storing images in cloudinary
export const createProduct = async (req, res) => {
    try {
        // user will send us 
        const {name, description, price, image , category} = req.body; 

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder : 'products' }); // it will return the url of the image uploaded in cloudinary
        }

        const product = await Product.create({
            name, 
            description, 
            price,
            image : cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });

        res.status(401).json(product);
    }
    catch (error) {
        console.log('Error in createProductController', error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
};

// while deleting the product => delete from database and also its image from the cloudinary
export const deleteProduct = async (req, res) => {
    try {
        const product = Product.findById(req.params.id); 

        if (!product) {
            return res.status(404).json({message : 'Product not Found'});
        }

        if (product.image) {
            // first get the id of the image
            const publicId = product.image.split("/").pop().split('.')[0]; // .pop() will give last element of the array and split('.') will split into two parts 

            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log('image deleted from cloudinary');
            }
            catch (error) {
                console.log("Error deleting image from cloudinary", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({Message : "Product deleted successfully"});
    }
    catch (error) {
        console.log("Error in deleteProductController", error.message);
        res.status(500).json({message : 'Server error', error : error.message});
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample : {size : 3}
            }, // for which purpose $ is used is to use the aggregation pipeline
            {
                $project : {
                    _id : 1,
                    name : 1,
                    description : 1,
                    image : 1,
                    price : 1
                }
            } // project field is used to select the fields that we want to return
        ]); // sample will return random products from the database


        res.json(products);
    }
    catch (error) {
        console.log("error in getRecommendedProductsController", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const getProductsByCategory = async (req, res) => {
    const category = req.params.category;

    try {
        const products = await Product.find({category});
        res.json(products);
    }
    catch (error) {
        console.log("error in getProductsByCategoryController", error.message);
        res.status(500).json({message : 'Server error', error : error.message});
    }
};

// also delete the toggled featured product from the redis as well because we are storing the featured products in redis.
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();// save() is used to save the changes in the database

            // now updating in the redis
            await updateFeaturedProductsCache(); 
            res.json(updatedProduct);
        }
        else {
            res.status(404).json({Message: "No Product found"});
        }
    }
    catch (error) {
        console.log("Error in toggleFeaturedProductsController", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
};

async function updateFeaturedProductsCache() {
    try {
        const FeaturedProducts = Product.find({isFeatured : true}).lean(); //lean () is used to get in plain json format instead of document format of mongoose
        await redis.set("featured_products", JSON.stringify(FeaturedProducts));
    }
    catch (error) {
        console.log("Error in updateFeaturedProductsCache", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}