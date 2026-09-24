import Breadcrumbs from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { setProducts } from '@/redux/productSlice'

const SingleProduct = () => {
    const { id } = useParams()
    const dispatch = useDispatch()

    const { products } = useSelector((store) => store.product)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_URL}/api/v1/product/getAllProducts`
                )

                if (res.data.success) {
                    dispatch(setProducts(res.data.products))
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        if (!products || products.length === 0) {
            getProducts()
        } else {
            setLoading(false)
        }
    }, [dispatch, products])

    const product = products?.find(
        (item) => item._id === id
    )

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#050b14] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading product...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="relative min-h-screen bg-[#050b14] flex items-center justify-center text-center px-4">
                <div>
                    <p className="text-gray-400 text-lg mb-4">Product not found</p>
                    <a href="/products" className="inline-block px-6 py-2.5 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all">
                        Back to Products
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen bg-[#050b14] text-white pt-8 pb-16">

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">

                <Breadcrumbs product={product} />

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    <ProductImg images={product?.productImg || []} />

                    <ProductDesc product={product} />

                </div>

            </div>

        </div>
    )
}

export default SingleProduct