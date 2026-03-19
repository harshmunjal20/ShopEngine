import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "name is required"]
    },
    description : {
        type : String,
        required : true // description should be there for a product :)
    },
    price : {
        type : Number,
        min : 0,
        required : true
    },
    image : {
        type : String,
        required : [true, "image is required"]
    },
    category : {
        type : String, 
        required : true
    },
    isFeatured : {
        type : Boolean,
        required : false // by default , product is not featured and admin can change this
    }// whether product will show in the isFeatured slider or not
}, {timestamps : true}); // second optional object for getting timestamps =>give createdAt and updatedAt fields

const product = mongoose.model('Product', productSchema); // first argument is the name of model , second argument is the name of schema
export default product;