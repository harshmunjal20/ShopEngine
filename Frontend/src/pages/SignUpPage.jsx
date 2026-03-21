import {useState} from 'react';
import {Link} from 'react-router-dom';
import {UserPlus, Mail, Lock, User, ArrowRight, Loader} from 'lucide-react';
import {motion} from 'framer-motion';
import InputField from '../Components/InputField.jsx';
import {useUserStore} from '../stores/useUserStore.js';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name : "",
        email : '',
        password : '',
        confirmPassword : ''
    });
 
    const {signup, loading} = useUserStore(); // loading will come from actual store

    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log(formData);
        signup(formData);
    }

    return (
        <div className = 'flex flex-col justify-center py-12 sm:px-6 lg:px-8'> {/*sm : px-6 means that it will be 6px on small screens and lg: px-8 means that it will be 8px on large screens */}
            <motion.div 
            className='sm:mx-auto sm:w-full sm:max-w-md'
            initial={{opacity : 0, y: -20}}
            animate = {{opacity : 1, y : 0}}
            transition = {{duration : 0.8}}> {/* opacity : 0 => nothing visible and y : -20 means it will start from top and delay : 0.2 means that it will start after 0.2 seconds*/}
                
                <h2 className = 'mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create Your Account</h2> {/* mt means margin top and 3xl means it will be 3 times the size of normal text */}


            </motion.div>


            <motion.div 
                className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
                initial = {{opacity : 0, y : -20}}
                animate = {{opacity : 1 , y : 0}}
                transition = {{duration : 0.8}}
                >

                <div className= 'bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'> {/* sm means bigger screen of width greater than equal to 640 px , ulta hai tailwind , it use sm for large screen ie. screen width >= 640 px*/}
                    <form onSubmit = {handleSubmit} className = 'space-y-6'> {/*space-y-6 means there will be 6 px vertical space between each element of the form */}

                        <InputField
                        label="Full Name"
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Harsh Munjal"
                        Icon={User}
                        />

                        <InputField
                        label="Email"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="theharsh@gmail.com"
                        Icon={Mail}
                        />

                        <InputField
                        label="Enter Password"
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="pass@123"
                        Icon={Lock}
                        />

                        <InputField
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword : e.target.value })
                        }
                        placeholder="pass@123"
                        Icon={Lock}
                        />

                        {/* we would have button which would do signup or loading*/}

                        <button
                         type = 'submit'
                         className = 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
                         disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true'/>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <UserPlus className='mr-2 h-5 w-5' aria-hidden='true'/>
                                    Sign up
                                </>
                            )}
                        </button>
                    </form>

                    {/*now putting the already have an account ? login now section */}
                    <p className='mt-8 text-center text-sm text-gray-400'>
                        Already have an account?   {""}
                        <Link to={'/login'} className='font-medium text-emerald-400 hover:text-emerald-300'>
                        Login here <ArrowRight className='inline h-4 w-4'/>
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUpPage;