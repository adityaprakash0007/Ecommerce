import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'

const ProductDesc = ({ product }) => {
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch()

    const addToCart = async (productId) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/cart/add`,
                { productId },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )

            if (res.data.success) {
                toast.success('Product added to cart')
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product")
        }
    }

    return (
        <div className="flex flex-col gap-4">

            <h1 className="font-black text-3xl md:text-4xl text-white tracking-tight">
                {product.productName}
            </h1>

            <p className="text-cyan-400 text-[10px] uppercase tracking-[0.18em] font-semibold">
                {product.category} · {product.brand}
            </p>

            <div className="flex items-baseline gap-2">
                <h2 className="text-3xl md:text-4xl font-black text-cyan-400">
                    ₹{Number(product.productPrice).toLocaleString("en-IN")}
                </h2>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent my-2" />

            <p className="line-clamp-12 text-gray-400 leading-relaxed">
                {product.productDescription}
            </p>

            <div className="flex gap-3 items-center mt-2">

                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                    Quantity
                </p>

                <Input
                    type="number"
                    min="1"
                    defaultValue={1}
                    className="w-16 h-10 bg-[#050b14] border border-white/10 text-white rounded-xl text-center outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/40"
                />

            </div>

            <Button
                onClick={() => addToCart(product._id)}
                className="w-max h-12 px-7 mt-3 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 hover:scale-[1.02] transition-all shadow-[0_0_25px_rgba(34,211,238,0.15)] cursor-pointer"
            >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
            </Button>

        </div>
    )
}

export default ProductDesc