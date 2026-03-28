import { useState, useEffect } from 'react';
import { Users , Package, ShoppingCart, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../lib/axios.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import AnalyticsCard from './AnalyticsCard.jsx';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const AnalyticsTab = () => {
   // here states would be user , products, totalSales, totalRevenue
   const [analyticsData, setAnalyticsData] = useState({
      users : 0,
      products : 0,
      totalSales : 0,
      totalRevenue : 0
   })

   const [loading , setIsLoading] = useState(true);
   const [dailySalesData, setDailySalesData] = useState([]);

   useEffect(() => {
      const fetchAnalyticsData = async () => {
         try {
            const response = await axios.get(`api/analytics`);
            setAnalyticsData(response.data.analyticsData);
            setDailySalesData(response.data.dailySalesData);
         }
         catch (error) {
            console.error("Error fetching analytics data:", error);
         }
         finally {
            setIsLoading(false);
         }
      };

      fetchAnalyticsData();
   },[]);

   if (loading) {
      return <LoadingSpinner/>
   }

   return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <AnalyticsCard
               title='Total Users'
               value={analyticsData.users.toLocaleString()} 
               icon={Users}
               color='from-emerald-500 to-teal-700'
            />

            <AnalyticsCard
               title='Total Products'
               value={analyticsData.products.toLocaleString()}
               icon={Package}
               color='from-emerald-500 to-green-700'
            />

            <AnalyticsCard
               title='Total Sales'
               value={analyticsData.totalSales.toLocaleString()}
               icon={ShoppingCart}
               color='from-emerald-500 to-cyan-700'
            />

            <AnalyticsCard 
               title='Total Revenue'
               value={`$${analyticsData.totalRevenue.toLocaleString()}`}
               icon={DollarSign}
               color='from-emerald-500 to-lime-700'
            />
         </div>

         {/* recharts library for creating charts*/}
         <motion.div
            className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
            initial={{opacity : 0, y : 20}}
            animate = {{opacity : 1, y : 0}}
            transition = {{duration : 0.5, delay : 0.25}}
         >  
            {/* linechart data contains the data that is going to be initialized , cartesian grid is a grid on the chart having arguments three units line, three units gap ---   ---   ---*/}
            <ResponsiveContainer width = '100%' height = {400}>
               <LineChart data = {dailySalesData} >
                  <CartesianGrid strokeDasharray='3 3'/>
                  <XAxis dataKey='date' stroke='#D1D5DB'/> {/*datakey uses the name field of the object */}
                  <YAxis yAxisId='left' stroke='#D1D5DB' />
                  <YAxis yAxisId ='right' orientation='right' stroke='#D1D5DB' />
                  <Tooltip
                     contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none"
                     }}
                  />
                  <Legend /> {/*Legend is ex . blue line -> sales, green line -> revenue */}
                  {/* now the lines which will be representing the data sales and revenue */}
                  
                  <Line
                     yAxisId='left'
                     type='monotone'
                     dataKey='sales'
                     stroke='#10B981'
                     strokeWidth={4}
                     dot={{r : 4}}
                     activeDot ={{r : 8}}
                     name='Sales'
                  />
                  <Line 
                     yAxisId='right'
                     type='monotone'
                     dataKey='revenue'
                     stroke='#3B82F6'
                     dot={{r:4}}
                     strokeWidth={4}
                     activeDot={{r : 8}}
                     name='Revenue'
                  />
                  {/* monotone means that the line will be smooth and tooltip means that when you hover over the line it will show the value of the line */}
               </LineChart>
            </ResponsiveContainer>
         </motion.div>
      </div>
   );
};

export default AnalyticsTab;