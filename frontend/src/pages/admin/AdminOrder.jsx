import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AdminOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const accessToken = localStorage.getItem("accessToken")

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
                if (data.success) setOrders(data.orders)
            } catch (error) {
                console.error("❌ Failed to fetch admin orders:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [accessToken])

    const statusClass = (status) =>
        status === "Paid"
            ? "bg-green-500/15 text-green-400 border border-green-500/30"
            : status === "Pending"
            ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
            : "bg-red-500/15 text-red-400 border border-red-500/30"

    return (
        <div className="relative min-h-screen bg-[#050b14] text-white pl-[350px] py-10 pr-20">

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10">

                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">All <span className="text-cyan-400">Orders</span></h1>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mt-2">View and manage all customer orders</p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No orders found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto mt-8 rounded-2xl border border-white/10">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-[#071426]">
                                <tr className="text-[10px] uppercase tracking-wider text-gray-500">
                                    <th className="px-4 py-4 font-semibold">Order ID</th>
                                    <th className="px-4 py-4 font-semibold">User</th>
                                    <th className="px-4 py-4 font-semibold">Products</th>
                                    <th className="px-4 py-4 font-semibold">Amount</th>
                                    <th className="px-4 py-4 font-semibold">Status</th>
                                    <th className="px-4 py-4 font-semibold">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-t border-white/5 hover:bg-white/[0.03] transition-colors">

                                        <td className="px-4 py-4 text-xs text-gray-400 font-mono">
                                            {order._id.slice(-8)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="text-white font-medium">{order.user?.firstName || order.user?.name || "Unknown"} {order.user?.lastName || ""}</p>
                                            <span className="text-xs text-gray-500">{order.user?.email}</span>
                                        </td>

                                        <td className="px-4 py-4">
                                            {order.products?.map((p, idx) => (
                                                <div key={idx} className="text-xs text-gray-300">
                                                    {p.productId?.productName || p.productName} <span className="text-cyan-400">× {p.quantity}</span>
                                                </div>
                                            ))}
                                        </td>

                                        <td className="px-4 py-4 font-bold text-white">
                                            ₹{Number(order.amount).toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${statusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminOrders