import React from 'react'

function Verify() {
  return (
    <div className='relative overflow-hidden h-[760px] w-full'>
      <div className='min-h-screen flex items-center justify-center bg-pink-100 px-4'>
       <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
         <h2 className='text-2xl font-semibold text-green-500 mb-4'>Check your email ✅</h2>
         <p className='text-gray-400 text-sm'>We've sent you an email to verify your account.Please check your email and click the link.</p>
       </div>
      </div>
    </div>
  )
}

export default Verify
