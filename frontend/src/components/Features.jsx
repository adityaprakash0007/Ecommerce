import React from 'react'
import {
  Truck,
  ShieldCheck,
  Headphones,
  Sparkles,
} from 'lucide-react'

function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description:
        'Fast and reliable delivery on your orders.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      description:
        'Your transactions are protected and secure.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description:
        'Our team is here whenever you need help.',
    },
    {
      icon: Sparkles,
      title: 'Best Deals',
      description:
        'Exclusive offers on the latest technology.',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-24 text-white">

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/10 blur-[120px]" />

        <div className="absolute top-1/2 -left-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px]" />

        <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px]" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">

        <div className="text-center mb-12 md:mb-14">

          <p className="text-cyan-400 uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-4">
            Why Choose MyStore
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
            Everything You{' '}
            <span className="text-cyan-400">
              Need
            </span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Shop confidently with secure payments, fast
            delivery and dedicated customer support.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {features.map((feature, index) => {

            const Icon = feature.icon

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-[#071426]/80 border border-white/10 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-[#0a1c31] hover:shadow-[0_20px_60px_rgba(34,211,238,0.10)]"
              >

                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/15" />

                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]">

                  <Icon className="w-6 h-6 text-cyan-400 transition-all duration-300 group-hover:text-black group-hover:scale-110" />

                </div>

                <h3 className="relative text-lg md:text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>

                <p className="relative text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 h-[2px] w-0 bg-cyan-400 transition-all duration-500 group-hover:w-10" />

              </div>
            )
          })}

        </div>

        <div className="mt-14 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      </div>

    </section>
  )
}

export default Features