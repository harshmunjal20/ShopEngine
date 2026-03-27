import Product from '../Models/product.model.js';

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({_id : {$in : req.user.cartItems}}); // find all products whose id is in cartItems and the product array will not have quantity, quantity has to get from cart
        
        // add quantity for each product
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product.id);
            return {...product.toJSON(), quantity : item.quantity};
        }) // why is this done
        res.json(cartItems);
    }   
    catch (error) {
        console.log("Error in getCartProductsController", error.message);
        res.json(500).json({message : "Server error", error : error.message});
    }
}
export const addToCart = async (req, res) => {

    try {
        // user will send the product id
        const {productId} = req.body;
        const user = req.user; // as it was protected route , hence protected request will have user
        const existingItem = user.cartItems.find((item) => item.id === productId); // item in function is used in this manner because cartItems is an array
        if (existingItem) {
            existingItem.quantity += 1;
        }

        else {
            user.cartItems.push(productId);
        }

        await user.save();
        res.json(user.cartItems);
    }
    catch (error) {
        console.log("Error in addToCartController", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;

        if (!productId) {
            user.cartItems = []; // empty the cart
        }
        else {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        }

        await user.save();
        res.json(user.cartItems);
    }
    catch (error) {
        res.status(400).json({message : "Server error", error : error.message});
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const {id : productId} = req.params; // aliasing the id to productId , so that it is more readable and we can use productId instead of id in the code
        const {quantity}  = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.id === productId);

        if (existingItem) {
            if (quantity == 0) {
                // that means we can filter out from the cart
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        }
        else {
            res.status(404).json({message : 'Product not found'});
        }
    }
    catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({message : 'Server error', error : error.message});
    }
};