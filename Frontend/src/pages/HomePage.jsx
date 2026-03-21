import CategoryItem from '../Components/CategoryItem';
const categories = [
    {href : "/jeans", name : "Jeans", imageURL : "/jeans.jpg"},
    {href : "/tshirts", name : "T-Shirts", imageURL : "/tshirts.jpg"},
    {href : "/shoes", name : "Shoes", imageURL : "/shoes.jpg"},
    {href : "/glasses", name : "Glasses", imageURL : "/glasses.jpg"},
    {href: "/jackets", name: "Jackets", imageURL: "/jackets.jpg" },
	{href: "/suits", name: "Suits", imageURL: "/suits.jpg" },
	{href: "/bags", name: "Bags", imageURL: "/bags.jpg" },
];

const HomePage = () => {
    return (
        <div className='relative min-h-screen text-white overflow-hidden'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
                    Explore Our Categories
                </h1>

                <p className='text-center text-xl text-gray-300 mb-12'>
                    Discover the latest trends in eco-friendly fashion
                </p>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {categories.map((category) => (
                        <CategoryItem category={category} key = {category.name} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HomePage;