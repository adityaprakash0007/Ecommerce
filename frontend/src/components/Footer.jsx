import React from 'react'
import { FaFacebook, FaTwitterSquare, FaInstagram, FaPinterest } from 'react-icons/fa'

function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-300 py-10'>
      <div className='max-w-7xl mx-auto px-4'>

        {/* TOP SECTION */}
        <div className='grid md:grid-cols-4 gap-8'>

          {/* BRAND */}
          <div>
            <h2 className='text-xl font-bold text-white mb-4'>ElectEcommerce</h2>
            <p className='text-sm'>
              Your one-stop shop for the latest electronics at the best prices.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className='text-white font-semibold mb-3'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li className='hover:text-white cursor-pointer'>Home</li>
              <li className='hover:text-white cursor-pointer'>Shop</li>
              <li className='hover:text-white cursor-pointer'>About</li>
              <li className='hover:text-white cursor-pointer'>Contact</li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className='text-white font-semibold mb-3'>Support</h3>
            <ul className='space-y-2 text-sm'>
              <li className='hover:text-white cursor-pointer'>Help Center</li>
              <li className='hover:text-white cursor-pointer'>Returns</li>
              <li className='hover:text-white cursor-pointer'>Privacy Policy</li>
              <li className='hover:text-white cursor-pointer'>Terms</li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className='text-white font-semibold mb-3'>Follow Us</h3>
            <div className='flex gap-4'>
              <FaFacebook className='text-3xl cursor-pointer hover:text-white' />
              <FaTwitterSquare className='text-3xl cursor-pointer hover:text-white' />
              <FaInstagram className='text-3xl cursor-pointer hover:text-white' />
              <FaPinterest className='text-3xl cursor-pointer hover:text-white' />
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className='border-t border-gray-700 mt-8 pt-6 text-center text-sm'>
          © {new Date().getFullYear()} ElectEcommerce. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer