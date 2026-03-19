import Coupon from '../Models/coupon.model.js';

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({userId : req.user._id, isActive : true});
        res.json(coupon || null); // if coupon is undefined then send null
    }
    catch (error) {
        console.log("Error in getCoupon Controller", error.message);
        res.status(500).json({message : "Server Error", error : error.message}); // message : Server error , error : error.message
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const {code} = req.body; // user will send the coupon code in the body of the request
        const coupon = await Coupon.findOne({code : code, userId : req.user._id, isActive : true}); // find the coupon in database

        if (!coupon) {
            return res.status(404).json({message : "Coupon not found"});
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({message : "Coupon expired"});
        }   

        res.json({
            message : "Coupon is valid",
            code : coupon.code,
            discountPercentage : coupon.discountPercentage
        });
    }
    catch (error) {
        console.log("Error in validateCoupon Controller", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
}