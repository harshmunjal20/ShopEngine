import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Nmame is required"] // this means that name field is required and if we try to create a user without name then it will throw an error with message "Name is required"
    },
    email : { // when they signup
        type : String,
        required : [true, "Email is required"],
        unique : true ,// this means that email should be unique and if we try to create a user with same email then it will throw an error
        lowercase : true,  // this means that email will be stored in lowercase in database even if the user writes it in uppercase, this is useful because email is case insensitive and it will help in avoiding duplicate emails in database.
        trim : true // this means that any whitespace before or after the email will be removed, this is useful because sometimes users might accidentally add whitespace before or after the email and it will help in avoiding duplicate emails in database.
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : [6, 'Password should be at least 6 characters long']
    },
    // now they will be having some cart items 
    cartItems : [
        {
            quantity : {
                type : Number,
                default : 1
            },
            product : {
                type : mongoose.Schema.Types.ObjectId, // they are going to store the id's of the products of the cart
                ref : 'Product' //
            }
        }
    ], // array of objects 
    role : {
        type : String,
        enum : ['customer', 'admin'],
        default : 'customer'
    }
},
{
    timestamps : true // purpose of timestamps is to automatically add createdAt and updatedAt fields to the user document, so that we can know when the user was created and when it was last updated.
});


// john 123456 => #aagbsh*jk => Hash
// pre save hook =>  
userSchema.pre('save', async function (next) { // next means in simple  
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    catch (error) {
        next(error); // 
    }
});

userSchema.methods.comparePassword = async function (password) { //
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;