import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { Users, Package, ShoppingBag, IndianRupee } from 'lucide-react'

const AdminSales = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
        sales: []
    })

    const fetchStats = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken")
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )
            if (res.data.success) {
                setStats(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users },
        { label: 'Total Products', value: stats.totalProducts, icon: Package },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
        { label: 'Total Sales', value: `₹${Number(stats.totalSales).toLocaleString('en-IN')}`, icon: IndianRupee },
    ]

    return (
        <div className="relative min-h-screen bg-[#050b14] text-white pl-[350px] py-10 pr-20">

            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10">

                <div className="mb-8">

                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        Sales <span className="text-cyan-400">Dashboard</span>
                    </h1>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mt-2">
                        Overview of your store performance
                    </p>

                    <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

                </div>

                <div className="grid gap-6 lg:grid-cols-4">

                    {statCards.map(({ label, value, icon: Icon }) => (
                        <Card key={label} className="relative overflow-hidden bg-[#071426] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.30)] transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(34,211,238,0.10)]">

                            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

                            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">

                                <CardTitle className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                                    {label}
                                </CardTitle>

                                <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-cyan-400" />
                                </div>

                            </CardHeader>

                            <CardContent className="relative">

                                <p className="text-2xl font-black text-white tracking-tight">
                                    {value}
                                </p>

                                <div className="mt-3 h-[2px] w-8 bg-cyan-400 rounded-full" />

                            </CardContent>

                        </Card>
                    ))}

                    <Card className="lg:col-span-4 bg-[#071426] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.30)]">

                        <CardHeader>
                            <CardTitle className="text-white text-lg font-bold">
                                Sales <span className="text-cyan-400">(Last 30 Days)</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent style={{ height: 320 }}>

                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.sales}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <XAxis
                                        dataKey="date"
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280', fontSize: 11 }}
                                        axisLine={{ stroke: '#1f2937' }}
                                        tickLine={{ stroke: '#1f2937' }}
                                    />

                                    <YAxis
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280', fontSize: 11 }}
                                        axisLine={{ stroke: '#1f2937' }}
                                        tickLine={{ stroke: '#1f2937' }}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            background: '#071426',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                        labelStyle={{ color: '#22d3ee', fontWeight: 600 }}
                                        itemStyle={{ color: '#fff' }}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#22d3ee"
                                        strokeWidth={2}
                                        fill="url(#salesGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>
    )
}

export default AdminSales