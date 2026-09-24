import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function VerifyEmail() {
    const location = useLocation();
    const token = location.pathname.split('/verify/')[1];
    console.log("TOKEN:", token);
    const [status, setStatus] = useState('verifying....')
    const navigate = useNavigate(); 
    
    const verifyEmail = async ()=>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/verify/${token}`)
          
            if(res.data.success){
                setStatus("Email verified successfully")
                setTimeout(()=>{
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {
    console.log(error.response?.data);  // VERY IMPORTANT
    setStatus(error.response?.data?.message || "Something went wrong");
}
    }
    useEffect(()=>{
        verifyEmail()
    }, [token])
  return (
    <div className='relative w-full h-[760px] bg-pink-100 overflow-hidden'>
      <div className='min-h-screen items-center justify-center flex'>
       <div className='bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md'>
        <h2 className='text-xl font-semibold text-gray-800'>{status}</h2>
       </div>
      </div>
    </div>
  )
}

export default VerifyEmail
