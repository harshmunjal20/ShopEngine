import Product from '../Models/product.model.js';
import User from '../Models/user.model.js';
import Order from '../Models/order.model.js';

export const getAnalytics = async (req, res) => {
    try {
        const analyticsData = getAnalyticsData(); // analytics data will have user, products, sales, revenue
        // now we also need to get the data from the chart

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 1000); // seven days back

        const dailySalesData = getDailySalesData(startDate , endDate);
        res.json({analyticsData, dailySalesData});
    }
    catch (error) {
        console.log("error in getAnalyticsRoute", error);
        res.status(500).json({message : "error in getAnalyticsRoute", error : error.message});
    }
}

// this will get the totalUsers, totalProducts, sales, Revenue
async function getAnalyticsData() {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        // firstly grouping the data which we will get
        {
            $group : {
                _id : null, // _id means grouping key , null means group all documents in group
                totalSales : {$sum : 1}, // means we will add 1 for each order
                totalRevenue : {$sum : '$totalAmount'}
            }
        } // in group _id is the key you group by
    ]); // aggregate is a method of mongoose

    const {totalSales, totalRevenue} = salesData[0] || {totalSales : 0, totalRevenue : 0};

    return {
        users : totalUsers,
        products : totalProducts,
        totalSales,
        totalRevenue
    }
}

// this function is also called aggregation pipeline
async function getDailySalesData(startDate, endDate) {
    try {
        const dailySalesData = Order.aggregate([
            {
                $match : {
                    gte : startDate,
                    lte : endDate
                }
            },
            {
                _id : {
                    $dateToString : {
                        format : "%y-%m-%d",
                        date : '$createdAt'
                    }
                },
                totalSales : {$sum : 1},
                totalRevenue : {$sum : '$totalAmount'}
            },
            {
                sort : {
                    _id : 1
                }
            }
        ]);

        // now need to get the dates as well
        const dateArray = getDatesInrange(startDate, endDate);

        // now just getting the aggregated result
        return dateArray.map((date) => {
            const foundDate = dailySalesData.find((item) => item._id === date); // in foundDate , we will have one object containing date , totalSales, totalRevenue

            return {
                date,
                sales : foundDate ? foundDate.totalSales : 0,
                revenue : foundDate ? foundDate.totalRevenue : 0
            }
        });
    }
    catch (error) {
        console.log("Error in getDailySalesData Function", error.message);
    }
};

async function getDatesInRange(startDate, endDate) {
    const dateArray = [];
    let currentDate = startDate;

    while (startDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}