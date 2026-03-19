import Mongoose from 'mongoose';

const orderSchema = new Mongoose.Schema (
    {
        user : {
            type : Mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }, // owner of this order is the user
        products : [
            {
                product : {
                    type : Mongoose.Schema.Types.ObjectId,
                    ref : 'Product',
                    required : true
                },
                quantity : {
                    type : Number,
                    required : true
                },
                price : {
                    type : Number,
                    required : true,
                    min : 0
                }
            }
        ], // array of products
        totalAmount : {
            type : Number,
            required : true,
            min : 0
        },
        stripeSessionId : {
            type : String,
            unique : true
        }
    },
    {timestamps : true}
);

const Order = Mongoose.model('Order', orderSchema); // first argument is the name of the model and second is the schema that we have created above
export default Order;