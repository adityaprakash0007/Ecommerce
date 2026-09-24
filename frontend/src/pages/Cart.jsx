import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import userLogo from "../assets/user.jpg";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = `${import.meta.env.VITE_URL}/api/v1/cart`;
  const accessToken = localStorage.getItem("accessToken");

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const loadCart = async () => {
    try {
      const res = await axios.get(API, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.data.success) dispatch(setCart(res.data.cart));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success(type === "increase" ? "Quantity increased" : "Quantity decreased");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, { data: { productId }, headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to remove product");
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  const hasItems = cart?.items?.length > 0;

  return (
    <div className="relative min-h-screen bg-[#050b14] text-white pt-8 pb-16 overflow-x-hidden">

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {hasItems ? (
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Shopping <span className="text-cyan-400">Cart</span></h1>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mt-2">{cart.items.length} item{cart.items.length > 1 ? "s" : ""} in your cart</p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          <div className="flex flex-col lg:flex-row gap-7 mt-10">

            <div className="flex flex-col gap-4 flex-1 min-w-0">

              {cart.items.map((product, index) => (
                <Card key={index} className="group relative overflow-hidden bg-[#071426] border border-white/10 rounded-2xl p-4 transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(34,211,238,0.10)]">

                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-cyan-400/10" />

                  <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6">

                    <div className="flex items-center gap-4 flex-1 min-w-0">

                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-[#050b14] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={product?.productId?.productImg?.[0]?.url || userLogo} alt="" className="w-full h-full object-contain p-1.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h1 className="font-bold text-white truncate">{product?.productId?.productName}</h1>
                        <p className="text-sm text-gray-500 mt-0.5 truncate">₹{Number(product?.productId?.productPrice).toLocaleString("en-IN")} each</p>
                      </div>

                    </div>

                    <div className="flex items-center justify-between md:justify-start gap-2 shrink-0">

                      <button onClick={() => handleUpdateQuantity(product?.productId?._id, "decrease")} className="w-9 h-9 rounded-xl bg-[#050b14] border border-white/10 flex items-center justify-center text-white hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all cursor-pointer">
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-10 text-center font-bold text-white">{product?.quantity}</span>

                      <button onClick={() => handleUpdateQuantity(product?.productId?._id, "increase")} className="w-9 h-9 rounded-xl bg-[#050b14] border border-white/10 flex items-center justify-center text-white hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all cursor-pointer">
                        <Plus className="w-4 h-4" />
                      </button>

                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 shrink-0 md:ml-4">

                      <p className="text-lg font-black text-white text-right">
                        ₹{(product?.productId?.productPrice * product?.quantity).toLocaleString("en-IN")}
                      </p>

                      <button onClick={() => handleRemove(product?.productId?._id)} className="flex items-center gap-1.5 text-red-400 hover:text-red-500 text-sm font-medium transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>

                    </div>

                  </div>

                </Card>
              ))}

            </div>

            <div className="w-full lg:w-[400px] shrink-0">

              <Card className="relative overflow-hidden bg-[#071426] border border-white/10 rounded-2xl lg:sticky lg:top-24">

                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

                <CardHeader className="relative">
                  <CardTitle className="text-white text-lg font-bold">
                    Order <span className="text-cyan-400">Summary</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative space-y-4">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal ({cart?.items?.length})</span>
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

                  <div className="flex gap-2 pt-2">
                    <Input placeholder="Promo Code" className="bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/40" />
                    <Button variant="outline" className="bg-transparent border border-white/15 text-white hover:bg-white hover:text-black rounded-xl h-11 transition-all">
                      Apply
                    </Button>
                  </div>

                  <Button onClick={() => navigate('/address')} className="w-full h-12 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 hover:scale-[1.01] transition-all cursor-pointer shadow-[0_0_25px_rgba(34,211,238,0.15)] mt-2">
                    Place Order
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                  <Button variant="outline" className="w-full h-11 bg-transparent border border-white/15 text-white hover:bg-white hover:text-black rounded-xl transition-all" asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>

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
      ) : (

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">

          <div className="w-24 h-24 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.15)]">
            <ShoppingCart className="w-12 h-12 text-cyan-400" />
          </div>

          <h2 className="mt-8 text-3xl font-black text-white">
            Your Cart is <span className="text-cyan-400">Empty</span>
          </h2>

          <p className="mt-3 text-gray-400 max-w-md">
            Looks like you haven't added anything yet. Start exploring our collection!
          </p>

          <Button onClick={() => navigate("/products")} className="mt-8 h-12 px-8 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 hover:scale-[1.02] transition-all shadow-[0_0_25px_rgba(34,211,238,0.15)]">
            Start Shopping
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

        </div>
      )}

    </div>
  );
};

export default Cart;