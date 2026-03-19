import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema ({
        code : {
            type : String,
            required : true,
            unique : true // means that this code should be unique and if we try to create a coupon with same code then it will throw an error
        },
        discountPercentage : {
            type : Number,
            required : true,
            min : 0,
            max : 100
        },
        expirationDate : {
            type : Date,
            required : true
        },
        isActive : {
            type : Boolean,
            default : true
        }, // once the user used the code then it will set to false
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
            unique : true
        }
    },
    {
        timestamps : true // to get createdAt and updatedAt
    }
);

const Coupon = mongoose.model('Coupon', couponSchema); // model is a function that returns the mongoose model
export default Coupon;