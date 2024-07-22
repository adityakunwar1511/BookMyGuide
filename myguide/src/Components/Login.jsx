import React, { useRef } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  axios.defaults.withCredentials=true; //token
  const submitHandler = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here, such as sending data to a server
    axios.post('http://localhost:3000/login', formData)
    .then((response) => {
      console.log(response);
      if(response.data=="success"){
        navigate('/home')
        
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
  return (
    <div>
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
   
  
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
  <form onSubmit={submitHandler} className="space-y-6">
    
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
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
          <label htmlFor="exampleInputPassword1" className="form-label">
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
          <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Login
          </button>
        </div>
      </form>

    <p className="mt-10 text-center text-m text-gray-500 px-5">
      Don't have an account? 
      <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 p-1">Create User Account</Link>
    </p>
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
