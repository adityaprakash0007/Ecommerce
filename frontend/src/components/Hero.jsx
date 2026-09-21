import React from 'react'
import {
  ArrowRight,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">

      <img
        src="/home.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 min-h-screen flex flex-col">

        <div className="flex-1 flex items-center">

          <div className="w-full grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">

            <div className="relative z-20 max-w-2xl">

              <p className="text-cyan-400 uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-5">
                Premium Electronics Collection
              </p>

              <p className="mt-7 max-w-xl text-gray-200 text-base md:text-lg leading-relaxed">
                Discover the latest smartphones, powerful laptops
                and premium headphones designed for work,
                entertainment and everyday life.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <Button onClick={() => navigate("/products")} className="h-12 px-7 rounded-lg bg-cyan-400 text-black font-bold hover:bg-cyan-300">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

               

              </div>

            </div>

            <div className="relative flex items-center justify-center lg:justify-end">

              <div className="absolute w-[300px] h-[250px] md:w-[500px] md:h-[400px] rounded-full bg-cyan-400/15 blur-[90px]" />

             <img src="/home.png" alt="Smartphone, laptop and headphones" className="relative z-10 w-[520px] sm:w-[650px] md:w-[800px] lg:w-[950px] max-w-none object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.9)] transition-transform -translate-y-29 translate-x-20 duration-500 hover:scale-[1.02]" />

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero