import Coupon from '../Models/coupon.model.js';
import {stripe} from '../lib/stripe.js';
import Order from '../Models/order.model.js';

export const createCheckoutSession = async (req, res) => {
    try {
        const {products, couponCode} = req.body;

        // checking if products is an array
        if (!Array.isArray(products) || products.length == 0) {
            return res.status(400).json({error : "Invalid or empty Products Array"});
        }

        let totalAmount = 0;

        const lineItems = products.map((product) => { // its fancy name for stripe , it just means products
            const amount = Math.round(product.price * 100); // because stripe takes amount in cents
            totalAmount += amount * product.quantity;
            return {
                price_data : {
                    currency : "usd",
                    product_data : {
                        name : product.name,
                        images : [product.image]
                    },
                    unit_amount : amount
                },
                quantity : product.quantity || 1
            }
        });  // because lineitems is an array of objects

        let coupon = null;

        if (couponCode) {
            coupon = await Coupon.findOne({code : couponCode, userId : req.user._id, isActive : true}); // finding in database
            if (coupon) {
                totalAmount -= Math.round(totalAmount * (coupon.discountPercentage) / 100);
            }
        }

        // now we can create a session
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card','amazon_pay'],
            line_items : lineItems,
            mode : "payment", // it can be subscription mode also
            success_url : `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`, // this is the url that will be redirected after payment is successful {CHECKOUT_SESSION_ID} will be given by stripe
            cancel_url : `${process.env.CLIENT_URL}/purchase-cancel`, // we have use env variable here because it will change when we would be deploying the application
            discounts : coupon ? [
                {coupon : await createStripeCoupon(coupon.discountPercentage)}]  // we will create this function createStripeCoupon by ourself
                : [],
            metadata : {
                userId : req.user._id.toString(), // because it's an object id by default as it's coming from mongodb
                couponCode : couponCode || "",
                products : JSON.stringify(
                    products.map((product) => ({
                        id : product._id,
                        quantity : product.quantity,
                        price : product.price
                    }))
                )
            }
        });

        if ( totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        } // 200 dollars in cents => 20000 we want that we should give discount 10% to the user in next purchase
        //  if he purchase more than 200 dollars in total

        res.status(200).json({url : session.url, totalAmount : totalAmount / 100}) // to get in dollars => totalAmount / 100 => we have sent sessionId here because it will be used in the frontend to display
    }
    catch (error) {
        console.log('Error in createCheckoutSession', error.message);
        res.status(500).json({message : 'Error processing Checkout', error : error.message});
    }
};

// create one time use coupon
async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off : discountPercentage,
        duration : "once", // means this coupon can be used only once
    })

    return coupon.id;
}

// storing coupon in mongo database
async function createNewCoupon(userId) {
    await  Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
        code:"GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),  // toString(36) means it will be in base 36 => (0 to 9, a to z), substring(2,8) removes the 0. part
        discountPercentage : 30,
        expirationDate : Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        userId : userId
    }) 

    await newCoupon.save();

    return newCoupon; // why we are returning it because it will be used in createCheckoutSession
}

export const checkoutSuccessController = async (req, res) => {
    try {
        const {sessionId} = req.body;
        // now we have to retrieve that session from the stripe
        
        const session = await stripe.checkout.sessions.retrieve(sessionId); // this will get the metadata from the session
        // now we need to check if the payment was successful or not

        if (session.payment_status === 'paid') {
            // now we will decativate the used coupon
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({
                    code : session.metadata.couponCode,
                    userId : session.metadata.userId
                }, {
                    isActive : false
                }); // in the second argument we will update
            }

            // now as the payment is paid, we will create a new order
            const products = JSON.parse(session.metadata.products); // so in metadata products should also be there and we will parse it to become the json object

            // Atomic Operation => no duplicates possible

            const newOrder = await Order.findOneAndUpdate({stripeSessionId : sessionId},// filter
                {
                user: session.metadata.userId,
                products : products.map((product) => ({
                    product : product.id,
                    quantity : product.quantity,
                    price : product.price
                })), //:) exact format in products of order Model
                totalAmount : session.amount_total / 100, // amount_total field is not created by us , it is coming from stripe session ie we haven't wrote the amount_total => it is the name of the function in stripe session => also we have to convert cents to dollars
                stripeSessionId : sessionId
            },
            {
                new : true, upsert: true  }) // upsert true means that create if not exists

            await newOrder.save(); // saving newOrder to database
            res.status(200).json({
                success : true,
                message : "Payment successful, order created and coupon deactivated, if any",
                orderId : newOrder._id
            })
        }
    }
    catch (error) {
        console.error("Error processing successful checkout", error);
        res.status(500).json({message : "Error processing successful checkout", error : error.message});
    }
}