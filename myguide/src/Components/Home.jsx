import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './Home.css'
import './Searchresult'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'




const Home = () => {
  axios.defaults.withCredentials=true;
  // function getCookie(key) {
  //   var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  //   return b ? b.pop() : "";
  // }
  // let cookieValue = getCookie('Token')
  const navigate=useNavigate()
  
  useEffect(()=>{
    axios.get("http://localhost:3000/home")
    .then(res=>{
      if(!res.data.valid){
        navigate('/')
      }
     
    })
    .catch(err=>console.log(err))

  },[])

  return (
    <div className="App">
      <Header />
      <Hero />
      <Features />
      <Footer />
      <ToastContainer/>
    </div>
  );
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
 
  const navigate=useNavigate()
  
  const handleLogout=()=>{
   // Cookies.remove('token');
   axios.get("http://localhost:3000/logout")
    .then(res=>{
      if(res.data.status){
        navigate('/')
      } 
    })
    .catch(err=>console.log("error logging out! ",err))
  }

  return (
    <header className={`fixed top-0 left-0 w-full p-2 z-50 transition-colors duration-300 ${isScrolled ? 'bg-blue-500 opacity-80 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg p-1 font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">BookMyGuide</div>
        <nav className='items-center justify-center '>
          <ul className="flex space-x-2 text-white">
            <li><a href="#home" className="hover:text-black hover:font-bold p-1 font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] hover:bg-blue-100 rounded-lg ">Home</a></li>
            <li><a href="#destinations" className="hover:text-black hover:font-bold font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]  hover:bg-blue-100 rounded-lg p-1">Destinations</a></li>
            <li><button className="justify-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

const Hero = () => {


  const [formData, setFormData] = useState({
    location:""
  });

  const onChangeHandler = (e) => {
    const { name,value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate=useNavigate()
  const submitHandler = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    {formData.location=formData.location.toUpperCase();
      formData.location=formData.location.trim();
    }
    if(formData.location==''){
      toast.warn('Search location cannot be empty!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
    else{
    axios.post("http://localhost:3000/search",formData)
    .then(res=>{
      
      navigate('/searchresult',{ state: { results: res.data } })
      console.log(res.data);
    })
    .catch(err=>console.log("search m error",err))
    }
  };
  return (
    <section className="bg-cover bg-center h-screen text-blue-100 hero"  >
      <div className="container mx-auto h-full flex flex-col justify-center ">
        <h1 className="text-5xl p-2 font-bold mb-4 "><span className='shadow-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>Explore the World with Us</span></h1>
        <p className="text-2xl p-2  "><span className='shadow-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>Book your Guide at cheapest price</span></p>
        
        <form onSubmit={submitHandler} className="w-[80%] xl:w-[45%] mt-4 p-2"> 
    <div className="mb-1 ">
      <label htmlFor="location" className="text-m form-label">
      Search available Guides here
      </label></div>

      <div className='flex gap-2'>
      <input
        name="location"
        value={formData.location}
        onChange={onChangeHandler}
        type="location" placeholder='Where do you want to go? Enter Location'
        className=" w-[120%] md:w-[200%] rounded-md border-0 py-1.5 shadow-sm ring-1 opacity-50 ring-inset placeholder:text-cyan-900 focus:opacity-70 focus:text-blue-950  focus:ring-2 focus:ring-inset focus:ring-indigo-900 sm:text-sm sm:leading-6 p-1"
        
      />
      <button type="submit" className="flex w-[50%]  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Book Now
      </button>
    </div>
  </form>
      </div>
    </section>
  );
}

const Features = () => {
  const features = [
    { title: "Exclusive Deals", description: "Get the best deals available only to our customers." },
    { title: "Top Destinations", description: "We offer trips to the most popular destinations." },
    { title: "Personalized Itineraries", description: "Customize your travel plans according to your preferences." },
  ];

  return (
    <section id="features" className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="flex flex-wrap justify-center">
          {features.map((feature, index) => (
            <div key={index} className="max-w-sm w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white py-6">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 BookMyGuide. All rights reserved.</p>
        <nav className="flex justify-center space-x-4 mt-4">
          <a href="#home" className="hover:underline">Home</a>
          <a href="#destinations" className="hover:underline">Destinations</a>
          <a href="#about" className="hover:underline">About Us</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

export default Home