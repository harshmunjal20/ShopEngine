import jwt from "jsonwebtoken";
import User from '../Models/user.model.js';

export const protectRoute = async (req, res, next) => {
    // next(); // will call next middleware ie, adminRoute for the product.route
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({message : "Unauthorized : no access token provided"});
        }

        // now we have token and we have to decode and check it

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); //this will check that was it signed using this key and then returns the decoded payload
            const user = await User.findById(decoded.userId).select('-password'); // means de select password from the user document => not going to get the password from the user

            if (!user) {
                return res.status(401).json({message : "Unauthorized : user not found"});
            }


            // we can put the user to the request as we have user now
            req.user = user; // why we are doing this is because we want to use the user in the next middleware
            next();
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({message : "Unauthorized: access token expired"});
            }
            throw error; // this will be catched by below catch block
        }
    }
    catch (error) {
        console.log("Error in protectedRoute middleware", error.message);
        return res.status(401).json({message : "Unauthorized : invalid access token"});
    }
}; // will check that the user is authenticated by taking a look at accessToken

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({message : "Access denied : For admin only"});
    }
}