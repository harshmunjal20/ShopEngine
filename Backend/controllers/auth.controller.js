import {redis} from '../lib/redis.js';
import User from '../Models/user.model.js';
import jwt from 'jsonwebtoken';

const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : '15m'});
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn : '7D'});
    return {accessToken, refreshToken};
};

// now saving the refresh token in redis
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly : true, // this means that this cookie can only be accessed bu the server and not by the client => prevent XSS(cross site scripting) attacks => also cannot be accessed by javascript
        secure : process.env.NODE_ENV === 'production', // this means that this cookie will only be sent over https connection
        sameSite : "strict", // strict means that this cookie will only be sent to the same site => prevent CSRF (Cross site request forgery) attacks => also cannot be accessed by JAVASCRIPT
        maxAge : 15 * 60 * 1000 // in milliseconds
    }); // first accessToken is the key => this is what client will see in cookies and second accessToken is the value and third is the options object to make it more secure

    res.cookie('refreshToken', refreshToken , {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict',
        maxAge : 7 * 24 * 60 * 60 * 1000
    })
}
export const signup = async (req, res) => {
    // to test this out we will desktop app => postman
    const {email, password, name} = req.body;
    // first check if user with same email already exists in database
    try {
        const userExists = await User.findOne({email});

        if (userExists) {
            return res.status(400).json({message : "User with this email already exists"});
        } 
        // else save it to database

        const user = await User.create({
            name,
            email,
            password
        }); // this will trigger pre save hook and password will be hashed before saving to database

        // authentication
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        // also store them in cookies so that client can send them in subsequent requests
        setCookies(res, accessToken, refreshToken);//
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        }); // we don't want to send password that's why user wouldn't have password in response
    }
    catch (error) {
        res.status(500).json({message : error.message});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (user && (await user.comparePassword(password))) {
            const {accessToken, refreshToken} = generateTokens(user._id);

            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);
            res.json({
                _id : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            })
        }
        else {
            res.status(401).json({message : "Invalid email or password"});
        }
    }
    catch (error) {
        console.log("error in login controller", error.message); // for easier debugging
        res.status(500).json({message : error.message});
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken; 
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // if valid token will be returned
            await redis.del(`refreshToken:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");  
        res.json({message : "Logout successful"});
    }
    catch (error) {
        console.log('error in login controller', error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
};

// this will refresh(recreate) the accessToken :)
export const refreshToken = async (req,res) => {
    // they can recreate access token if they provide the refresh token 
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({message : "Refresh token not found"});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // checks that was it signed using this secret key and then returns the decoded payload
        const storedToken = await redis.get(`refreshToken:${decoded.userId}`); // this will get the refresh token from the redis

        if (storedToken !== refreshToken) {
            return res.status(401).json({message : "Invalid refresh token"});
        }

        const accessToken = jwt.sign({userId : decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : '15m'}); // first argument is the payload

        res.cookie('accessToken', accessToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : 'strict',
            maxAge : 15 * 60 * 1000
        });

        res.json({message : "Token refreshed successfully"});
    }
    catch (error) {
        console.log("error in refreshToken controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}

export const getProfile = async (req, res) => {
    try {
        res.json(req.user); // since we protected this route => in protectRoute we put the req.user = user
    }
    catch (error) {
        res.status(500).json({message : "Server error", error : error.message});
    }
}