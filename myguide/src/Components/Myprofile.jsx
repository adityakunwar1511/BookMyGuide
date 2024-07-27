import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer ,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Myprofile = () => {
    let profiledata;
   
    const navigate=useNavigate()
    const location = useLocation();
    const [state,setstate]=useState(false);
    let {customerdata}=location.state || {};
    let { userdata } = location.state || {};
    console.log("profile of in userdata",userdata)
    console.log("i am customerdata",customerdata)
    if(userdata==undefined){
        profiledata=customerdata
    }
    else{
        profiledata=userdata  
    }
    
    useEffect(()=>{
      axios.post("https://bookmyguide.onrender.com/profile",{profiledata})
      .then(res=>{
        if(!res.data.valid){
          navigate('/')
        }
       
      })
      .catch(err=>console.log(err))
  
    },[])

    // axios.post('https://bookmyguide.onrender.com/updateuserdata',{useremail})
    // .then(res=>{
       
    //     updateddata=res.data;
    //     console.log(updateddata,"i am updated")
    //   })
    //   .catch(err=>console.log("error in updateuserdata! ",err))

    const handleBack=()=>{
        navigate('/home' ,{ state: { userdata: profiledata } })
      }
      const handleLogout=()=>{
        // Cookies.remove('token');
        axios.post("https://bookmyguide.onrender.com/logout",{profiledata})
         .then(res=>{
           if(res.data.status){
             navigate('/')
           } 
         })
         .catch(err=>console.log("error logging out! ",err))
       }

       const handleDone=async(e)=>{
       // console.log(profiledata,"m yaha")
       setstate(true)
        await axios.post("https://bookmyguide.onrender.com/delete",{e,profiledata})
        .then(res=>{
            //console.log("responseradata",res.data)
            if(res.data=="deleted"){
                toast.success('Updated successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        })
       }
      
  return (
   <>
   {console.log("mai hu profiledata,",profiledata)}
        <div className=" flex gap-2 justify-around p-1 max-sm:justify-center bg-blue-400 items-center">
    <svg type="submit" onClick={handleBack} className='bg-blue-700 hover:bg-indigo-400 p-1.5 absolute rounded-lg hover:cursor-pointer left-2' height="30px" viewBox="0 -960 960 960" width="30px" fill="#e8eaed"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
      <div className="text-white text-lg p-2 font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] max-sm:font-normal flex"><svg className='w-6 h-6' viewBox="0 0 384 512">
  <path fill="red" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
</svg>BookMyGuide</div>
      <nav className='items-center flex justify-center '>
        <ul className="flex space-x-2 items-center text-white">
          <li><p  className="hover:text-black underline hover:font-bold font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]  hover:bg-blue-100 rounded-lg p-1">My Profile</p></li>
          <li><button className="justify-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" onClick={handleLogout} >Logout</button></li>
        </ul>
      </nav>
    </div>
    <div className="container mx-auto p-4">
   
    <div className="bg-white shadow-xl border-solid border-black rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
        <div className="flex flex-col md:flex-row  items-start md:space-x-4">
           
            <div>
                <h3 className="text-l  font-semibold">Name</h3>
                <p className="text-gray-600 mb-2">{profiledata.name}</p>
                <h3 className="text-l font-semibold">Email</h3>
                <p className="text-gray-600 mb-2">{profiledata.email}</p>
                <h3 className="text-l font-semibold ">Account-type:</h3>
                {profiledata.location==undefined?(
                <p className="text-gray-600">User-Account</p>):(<p className="text-gray-600">Guide-Account</p>)}
            </div>
        </div>
    </div>
   
 {profiledata.customers==undefined ?(
    <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
       
        <ul className='flex flex-col gap-1'>
            {profiledata.bookings && profiledata.bookings.length > 0?profiledata.bookings.map((result) => (
            <li className='font-semibold border-black border bg-slate-100 rounded-lg p-2 flex flex-col relative' key={result.email}>
              <p>Name: {result.name}</p>
              <p>Email: {result.email}</p>
              <p>Location: {result.location}</p>
              <p>Booked for Date: {result.date}</p>
              <p>Hourly Rate: {`\u20B9`} {result.rate}</p>
              {state?(<p className='bg-red-500 absolute right-1 text-white rounded-lg p-1' >Cancelled!</p>):(
              <p className='bg-red-600 hover:cursor-pointer hover:bg-red-400 absolute right-1 text-white rounded-lg p-1' onClick={()=>handleDone(result)}>Cancel Booking</p>)}
              </li>)
      ):(<p className='font-semibold'>No Bookings to show</p>)}</ul>
               
         
       
    </div>):(
       <div className="bg-white shadow-md rounded-lg p-6">
       <h2 className="text-2xl font-semibold mb-4">My Customers</h2>
       <ul className='flex flex-col gap-1'>
           {profiledata.customers && profiledata.customers.length > 0?profiledata.customers.map((result) => (
             <li className='font-semibold border-black border bg-slate-100 rounded-lg p-2 flex gap-2 flex-col relative' key={result.email}>
           <p>Name: {result.name}</p>
               <p>Email: {result.email}</p>
               <p>Booked for Date: {result.date}</p>
               {!state?(
               <p className='bg-blue-500 absolute right-2 w-fit p-1 rounded-lg hover:cursor-pointer hover:bg-green-400 text-white sm:font-semibold' onClick={()=>handleDone(result)}>Mark as Done</p>):(
                <p className='bg-green-500 absolute right-2 w-fit p-1 rounded-lg  text-white sm:font-semibold' >Completed!</p>
               )}</li>)
     ):(<p className='font-semibold'>No Customers to show</p>)}</ul>
              
   </div> 
    )}
</div>
<ToastContainer/>

    </>
  )
}

export default Myprofile
