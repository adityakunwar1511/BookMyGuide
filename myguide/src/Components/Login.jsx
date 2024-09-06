import React, { useRef } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
 const [isSubmitting,setisSubmitting]=useState(false)
  
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  axios.defaults.withCredentials=true; //token
  const submitHandler = (e) => {
    e.preventDefault();
    setisSubmitting(true)
   // console.log('Form submitted:', formData);
    // Add your form submission logic here, such as sending data to a server
    axios.post('https://bookmyguide.onrender.com/login', formData)
    .then((response) => {
      setisSubmitting(false)
      //console.log(response.data.user,"response");
      if(response.data.user){
     
        navigate('/home',{ state: { userdata: response.data.user } })
        
      }
      else{
        toast.error('Invalid Credentials', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      }
      // Optionally clear the form or show a success message
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
  };

  const [ user, setUser ] = useState(null);
  const [ profile, setProfile ] = useState(null);

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => {
        setUser(codeResponse)
      },
      onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    if (user) {
      axios
        .post('https://bookmyguide.onrender.com/api/get-profile', { access_token: user.access_token }) // Send token to backend
        .then((res) => {
          if(res.data.user){
            navigate('/home',{ state: { userdata: res.data.user } })
          }  
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
      googleLogout();
      setProfile(null);
  };

  return (
    <div className='flex justify-center'>
          <div className="flex min-h-full flex-col justify-center p-4 items-center max-w-[300px] rounded-2xl px-6 mt-10 bg-slate-300">
          <div className="text-white justify-center items-center  text-lg p-1 font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] flex "><svg className='w-6 h-6' viewBox="0 0 384 512">
  <path fill="red" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
</svg>BookMyGuide</div>
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
   
  
    <h2 className="mt-1 text-center text-xl font-bold leading-9 tracking-tight text-gray-700">Login to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
  <form onSubmit={submitHandler} className="space-y-6">
    
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            type="email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            type="password"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
            
          />
        </div>
        <div className="d-grid col-6 mx-auto my-3">
          <button disabled={isSubmitting} type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          {isSubmitting ? 'Submitting...' : 'Login'}
          </button>
        </div>
      </form>

    <div className="mt-10 text-center text-m text-gray-500 px-5">
      Don't have an account? 
      <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 p-1">Create User Account</Link>
      <div className='mt-1'>
      <div className="flex items-center justify-center ">

    <button  onClick={() => login()} className="flex items-center bg-white dark:bg-gray-500 border border-gray-300 rounded-lg shadow-md p-1 text-sm font-medium text-gray-400 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        <svg className="h-6 w-6 mr-2"  width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
        <span>Login with Google</span>
    </button>

</div></div>
    </div>
    <div className='flex my-2 items-center justify-center opacity-50'>OR</div>
    <p className="text-center text-m text-gray-500 px-5 ">
      Looking for Business? 
      <Link to="/guideregister" className="font-semibold text-l leading-6 text-indigo-600 hover:text-indigo-500 p-1">Register as Guide</Link>
    </p>
  </div>
</div>
<ToastContainer/>
    </div>
  )
}

export default Login
