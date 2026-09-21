import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const AddProduct = () => {
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch()
    const { products } = useSelector((state) => state.product)

    const [loading, setLoading] = useState(false)

    const [productData, setProductData] = useState({
        productName: "",
        productPrice: 0,
        productDescription: "",
        productImg: [],
        brand: "",
        category: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append("productName", productData.productName);
        formData.append("productPrice", productData.productPrice);
        formData.append("productDescription", productData.productDescription);
        formData.append("category", productData.category);
        formData.append("brand", productData.brand);

        if (productData.productImg.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        productData.productImg.forEach((img) => {
            formData.append("files", img)
        })

        try {
            setLoading(true)
            const res = await axios.post(`http://localhost:8000/api/v1/product/add`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                dispatch(setProducts([...products, res.data.product]))
                toast.success(res.data.message)

                setProductData({
                    productName: "",
                    productPrice: 0,
                    productDescription: "",
                    productImg: [],
                    brand: "",
                    category: ""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to add product")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-xl outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/40 transition-all"

    return (
        <div className="relative min-h-screen bg-[#050b14] text-white pl-[350px] py-10 pr-20">

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl">

                <div className="mb-8">

                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        Add <span className="text-cyan-400">Product</span>
                    </h1>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mt-2">
                        Create a new product in your store
                    </p>

                    <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

                </div>

                <Card className="relative overflow-hidden bg-[#071426] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.30)]">

                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

                    <CardHeader className="relative">
                        <CardTitle className="text-white text-xl font-bold">
                            Product Details
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Fill in the details below to add a new product
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="relative">

                        <div className="flex flex-col gap-5">

                            <div className="grid gap-2">
                                <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">
                                    Product Name
                                </Label>
                                <Input
                                    type="text"
                                    name="productName"
                                    value={productData.productName}
                                    onChange={handleChange}
                                    placeholder="Ex-Iphone"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">
                                    Price
                                </Label>
                                <Input
                                    type="number"
                                    value={productData.productPrice}
                                    onChange={handleChange}
                                    name="productPrice"
                                    placeholder="0"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="grid gap-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">
                                        Brand
                                    </Label>
                                    <Input
                                        type="text"
                                        value={productData.brand}
                                        onChange={handleChange}
                                        name="brand"
                                        placeholder="Ex-apple"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">
                                        Category
                                    </Label>
                                    <Input
                                        type="text"
                                        value={productData.category}
                                        onChange={handleChange}
                                        name="category"
                                        placeholder="Ex-mobile"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="grid gap-2">
                                <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">
                                    Description
                                </Label>
                                <Textarea
                                    name="productDescription"
                                    value={productData.productDescription}
                                    onChange={handleChange}
                                    placeholder="Enter brief description of the product"
                                    className={`${inputClass} min-h-28`}
                                />
                            </div>

                            <ImageUpload productData={productData} setProductData={setProductData} />

                        </div>

                    </CardContent>

                    <CardFooter className="relative flex-col gap-2">

                        <Button
                            disabled={loading}
                            onClick={submitHandler}
                            type="submit"
                            className="w-full h-12 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 hover:scale-[1.01] transition-all duration-300 shadow-[0_0_25px_rgba(34,211,238,0.15)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {
                                loading
                                    ? <span className="flex gap-2 items-center"><Loader2 className="animate-spin w-5 h-5" />Adding...</span>
                                    : 'Add Product'
                            }
                        </Button>

                    </CardFooter>

                </Card>

            </div>

        </div>
    )
}

export default AddProduct