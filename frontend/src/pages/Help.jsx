import React from 'react'

function Help() {
  return (
    <div className="relative min-h-screen bg-[#050b14] text-white px-4 py-16 overflow-hidden">

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black">
            Help <span className="text-cyan-400">Center</span>
          </h1>

          <p className="text-gray-400 mt-4">
            Find answers to common questions.
          </p>
        </div>

        <div className="space-y-5">

          <div className="bg-[#071426] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              How do I place an order?
            </h2>

            <p className="text-gray-400 leading-7">
              Browse our products, select the product you want, add it to
              your cart, and proceed to checkout.
            </p>
          </div>

          <div className="bg-[#071426] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              How can I check my orders?
            </h2>

            <p className="text-gray-400 leading-7">
              After logging in, open your profile and use the Orders section
              to view your orders.
            </p>
          </div>

          <div className="bg-[#071426] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              How do I update my profile?
            </h2>

            <p className="text-gray-400 leading-7">
              Go to your Profile page after logging in and update your
              personal information.
            </p>
          </div>

          <div className="bg-[#071426] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              I forgot my password.
            </h2>

            <p className="text-gray-400 leading-7">
              Use the password recovery option available on the login page.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Help