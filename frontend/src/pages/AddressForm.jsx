import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAddress, deleteAddress, setSelectedAddress, setCart } from '@/redux/productSlice'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const AddressForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "", country: "" })

    const { cart, addresses = [], selectedAddress } = useSelector((store) => store.product)

    const [showForm, setShowForm] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        const newAddressIndex = addresses.length
        dispatch(addAddress(formData))
        dispatch(setSelectedAddress(newAddressIndex))
        setShowForm(false)
        setFormData({ fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "", country: "" })
    }

    const handleDelete = (e, index) => {
        e.stopPropagation()
        dispatch(deleteAddress(index))
    }

    const subtotal = cart?.totalPrice || 0
    const shipping = subtotal > 299 ? 0 : 10
    const tax = parseFloat((subtotal * 0.05).toFixed(2))
    const total = subtotal + shipping + tax

    const handlePayment = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
                {
                    products: cart?.items?.map(item => ({ productId: item.productId._id, quantity: item.quantity })),
                    tax, shipping, amount: total, currency: "INR"
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )

            if (!data.success) return toast.error("Something went wrong")

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id,
                name: "Ekart",
                description: "Order Payment",
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                            response,
                            { headers: { Authorization: `Bearer ${accessToken}` } }
                        )
                        if (verifyRes.data.success) {
                            toast.success("✅ Payment Successful!")
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            navigate("/order-success")
                        } else {
                            toast.error("❌ Payment Verification failed")
                        }
                    } catch (error) {
                        toast.error("Error verifying payment")
                    }
                },
                modal: {
                    ondismiss: async function () {
                        await axios.post(
                            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                            { razorpay_order_id: data.order.id, paymentFailed: true },
                            { headers: { Authorization: `Bearer ${accessToken}` } }
                        )
                        toast.error("Payment Cancelled or Failed")
                    }
                },
                prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
                theme: { color: "#22d3ee" }
            }

            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", async function (response) {
                await axios.post(
                    `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                    { razorpay_order_id: data.order.id, paymentFailed: true },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                toast.error("Payment Failed. Please try again")
            })

            rzp.open()
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong while processing payment")
        }
    }

    const inputClass = "bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/40 transition-all"
    const labelClass = "text-cyan-400 text-xs uppercase tracking-wider font-semibold"

    return (
        <div className="relative min-h-screen bg-[#050b14] text-white p-6 md:p-10 overflow-hidden">

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">

                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                    Check<span className="text-cyan-400">out</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-6">
                    Choose your delivery address and confirm your order
                </p>
                <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    <Card className="relative overflow-hidden bg-[#071426] border border-white/10 rounded-2xl">

                        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

                        <CardHeader className="relative">
                            <CardTitle className="text-white text-lg font-bold">
                                {showForm ? "Add New" : "Select"} <span className="text-cyan-400">Address</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="relative space-y-5">
                            {showForm ? (
                                <div className="space-y-4">

                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className={labelClass}>Full Name</Label>
                                        <Input id="fullName" name="fullName" required placeholder="John Doe" value={formData.fullName} onChange={handleChange} className={inputClass} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className={labelClass}>Phone Number</Label>
                                        <Input id="phone" name="phone" required placeholder="1234567890" value={formData.phone} onChange={handleChange} className={inputClass} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className={labelClass}>Email</Label>
                                        <Input id="email" name="email" type="email" required placeholder="john@example.com" value={formData.email} onChange={handleChange} className={inputClass} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address" className={labelClass}>Address</Label>
                                        <Input id="address" name="address" required placeholder="123 Street, Area" value={formData.address} onChange={handleChange} className={inputClass} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className={labelClass}>City</Label>
                                            <Input id="city" name="city" required placeholder="Kolkata" value={formData.city} onChange={handleChange} className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state" className={labelClass}>State</Label>
                                            <Input id="state" name="state" required placeholder="West Bengal" value={formData.state} onChange={handleChange} className={inputClass} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="zip" className={labelClass}>Zip Code</Label>
                                            <Input id="zip" name="zip" required placeholder="700001" value={formData.zip} onChange={handleChange} className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="country" className={labelClass}>Country</Label>
                                            <Input id="country" name="country" required placeholder="India" value={formData.country} onChange={handleChange} className={inputClass} />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="outline" className="w-1/3 h-11 bg-transparent border border-white/15 text-white hover:bg-white hover:text-black rounded-xl transition-all" onClick={() => setShowForm(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="button" onClick={handleSave} className="w-2/3 h-11 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                                            Save & Continue
                                        </Button>
                                    </div>

                                </div>
                            ) : (
                                <div className="space-y-4">

                                    {addresses.length === 0 ? (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400 mb-5">No saved addresses found.</p>
                                            <Button type="button" onClick={() => setShowForm(true)} className="h-11 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 hover:scale-[1.01] transition-all">
                                                + Add New Address
                                            </Button>
                                        </div>
                                    ) : (
                                        <>

                                            <div className="space-y-3">
                                                {addresses.map((addr, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => dispatch(setSelectedAddress(index))}
                                                        className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                                                            selectedAddress === index
                                                                ? "border-cyan-400 bg-cyan-400/10 ring-1 ring-cyan-400/50"
                                                                : "border-white/10 bg-[#050b14] hover:border-cyan-400/40"
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="radio"
                                                                checked={selectedAddress === index}
                                                                onChange={() => dispatch(setSelectedAddress(index))}
                                                                className="mt-1 accent-cyan-400"
                                                            />
                                                            <div className="pr-16">
                                                                <p className="font-bold text-white">{addr.fullName}</p>
                                                                <p className="text-sm text-gray-400">{addr.phone}</p>
                                                                <p className="text-sm text-gray-400">{addr.email}</p>
                                                                <p className="text-sm text-gray-400 mt-1">
                                                                    {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDelete(e, index)}
                                                            className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button type="button" variant="outline" className="w-full h-11 bg-transparent border border-white/15 text-white hover:bg-white hover:text-black rounded-xl transition-all" onClick={() => setShowForm(true)}>
                                                + Add New Address
                                            </Button>

                                            <Button
                                                type="button"
                                                disabled={selectedAddress === null || selectedAddress === undefined}
                                                onClick={handlePayment}
                                                className="w-full h-12 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 hover:scale-[1.01] transition-all shadow-[0_0_25px_rgba(34,211,238,0.15)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                            >
                                                Proceed To Checkout
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden bg-[#071426] border border-white/10 rounded-2xl lg:sticky lg:top-24">

                        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

                        <CardHeader className="relative">
                            <CardTitle className="text-white text-lg font-bold">
                                Order <span className="text-cyan-400">Summary</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="relative space-y-4">

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Subtotal ({cart?.items?.length || 0} items)</span>
                                <span className="text-white font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Shipping</span>
                                <span className={shipping === 0 ? "text-green-400 font-semibold" : "text-white font-semibold"}>
                                    {shipping === 0 ? "Free" : `₹${shipping}`}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Tax (5%)</span>
                                <span className="text-white font-semibold">₹{tax.toFixed(2)}</span>
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="flex justify-between text-lg">
                                <span className="text-white font-bold">Total</span>
                                <span className="font-black text-cyan-400">₹{total.toFixed(2)}</span>
                            </div>

                            <div className="text-xs text-gray-500 pt-3 space-y-1">
                                <p>* Free shipping on orders over ₹299</p>
                                <p>* 30-day return policy</p>
                                <p>* Secure checkout with SSL encryption</p>
                            </div>

                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}

export default AddressForm