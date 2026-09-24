import React from 'react'

function Returns() {
  return (
    <div className="relative min-h-screen bg-[#050b14] text-white px-4 py-16 overflow-hidden">

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black">
            Returns <span className="text-cyan-400">Policy</span>
          </h1>

          <p className="text-gray-400 mt-4">
            Information about returning your order.
          </p>
        </div>

        <div className="bg-[#071426] border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.30)]">

          <h2 className="text-xl font-bold mb-3">
            Return Requests
          </h2>

          <p className="text-gray-400 leading-7 mb-6">
            If you need to return a product, please contact our support team
            with your order information and details about the issue.
          </p>

          <h2 className="text-xl font-bold mb-3">
            Product Condition
          </h2>

          <p className="text-gray-400 leading-7 mb-6">
            Please keep the product, accessories, packaging, and order
            information available when requesting a return.
          </p>

          <h2 className="text-xl font-bold mb-3">
            Refunds
          </h2>

          <p className="text-gray-400 leading-7">
            Return eligibility and refund conditions may depend on the
            product and the specific order.
          </p>

        </div>
      </div>
    </div>
  )
}

export default Returns