import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#050b14] text-white p-6 overflow-hidden">

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 bg-[#071426] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.40)] p-10 max-w-md w-full text-center overflow-hidden">

                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

                <div className="relative">

                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.20)]">
                            <CheckCircle className="h-12 w-12 text-cyan-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-black mt-6 text-white tracking-tight">
                        Payment <span className="text-cyan-400">Successful</span> 🎉
                    </h1>

                    <p className="text-gray-400 mt-3 leading-relaxed">
                        Thank you for your purchase! Your order has been placed successfully.
                    </p>

                    <div className="mt-8 flex flex-col gap-3">

                        <button
                            onClick={() => navigate("/products")}
                            className="w-full h-12 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 hover:scale-[1.01] transition-all shadow-[0_0_25px_rgba(34,211,238,0.15)] cursor-pointer flex items-center justify-center gap-2"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => navigate("/orders")}
                            className="w-full h-12 rounded-xl bg-transparent border border-white/15 text-white font-semibold hover:bg-white hover:text-black transition-all cursor-pointer"
                        >
                            View My Orders
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default OrderSuccess;