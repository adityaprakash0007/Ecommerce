import { ShoppingCart, ArrowUpRight } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCart } from '../redux/productSlice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName, brand, category, _id } = product || {}

  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addToCart = async (productId) => {
    try {
      if (!accessToken) {
        toast.error('Please login first')
        return navigate('/login')
      }

      const res = await axios.post(
        'http://localhost:8000/api/v1/cart/add',
        { productId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      if (res.data.success) {
        toast.success('Product added to cart')
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl bg-[#071426] border border-white/10">
        <Skeleton className="w-full aspect-square bg-white/10" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-5 w-full bg-white/10" />
          <Skeleton className="h-5 w-2/3 bg-white/10" />
          <Skeleton className="h-10 w-full bg-white/10" />
        </div>
      </div>
    )
  }

  return (
    <div className="group relative rounded-2xl bg-[#071426] border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(34,211,238,0.10)] p-1.5">

      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#050b14] cursor-pointer" onClick={() => navigate(`/products/${_id}`)}>

        <div className="absolute w-50 h-50 rounded-full bg-cyan-400/10 blur-[70px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        <img
          src={productImg?.[0]?.url}
          alt={productName}
          className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-16 group-hover:translate-y-0 transition-transform duration-400 z-20">
          <div className="flex items-center gap-2 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/30 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            View Product
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>

        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <ArrowUpRight className="w-4 h-4 text-cyan-400" />
        </div>

      </div>

      <div className="p-4">

        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-400 font-semibold">
            {brand || category || 'Premium'}
          </span>
        </div>

        <h2 className="text-sm md:text-base font-semibold text-white leading-snug min-h-[44px] line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
          {productName}
        </h2>

        <div className="flex items-center justify-between gap-3 mt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
              Price
            </p>
            <p className="text-lg md:text-xl font-black text-white">
              ₹{productPrice?.toLocaleString('en-IN')}
            </p>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation()
              addToCart(_id)
            }}
            className="h-10 w-10 p-0 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>

        </div>

      </div>

    </div>
  )
}

export default ProductCard
