import React from 'react'
import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="relative min-h-screen bg-[#050b14] text-white px-4 py-16 overflow-hidden">

      {/* Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            About <span className="text-cyan-400">ElectEcommerce</span>
          </h1>

          <p className="text-gray-400 mt-4">
            Your destination for modern electronics shopping.
          </p>
        </div>

        <div className="bg-[#071426] border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.30)]">

          <h2 className="text-2xl font-bold mb-4">
            Who We Are
          </h2>

          <p className="text-gray-400 leading-7 mb-6">
            ElectEcommerce is an online electronics store created to make
            shopping for electronic products simple, convenient, and enjoyable.
          </p>

          <p className="text-gray-400 leading-7 mb-6">
            Browse products, view product details, add items to your cart,
            place orders, and manage your account from one convenient place.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-8">
            Our Goal
          </h2>

          <p className="text-gray-400 leading-7">
            Our goal is to provide a clean and easy-to-use shopping experience
            for customers looking for electronics online.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 px-6 py-3 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 hover:scale-[1.02] transition-all shadow-[0_0_25px_rgba(34,211,238,0.15)]"
          >
            Explore Products
          </Link>

        </div>
      </div>
    </div>
  )
}

export default About