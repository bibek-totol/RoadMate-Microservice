'use client'
import axios from 'axios'
import { BarChart2, Star, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type Earning = {
    date: string,
    earnings: number
}
function PartnerEarning() {
    const [earningData, setEarningData] = useState<Earning[]>([])
    useEffect(() => {
        const fetchEarning = async () => {
            try {
                const { data } = await axios.get("/api/partner/earning")
                const last7DaysData: Earning[] = data.slice(-7)
                setEarningData(last7DaysData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchEarning()
    }, [])


    const total = earningData.reduce((a, d) => a + d.earnings, 0)
    const avg = earningData.length ? Math.round(total / earningData.length) : 0
    const max = earningData.length ? Math.max(...earningData.map((d) => d.earnings)) : 0
    const bestDay = earningData.find(d => d.earnings === max)
    const today = earningData[earningData.length - 1]
    const yesterDay = earningData[earningData.length - 2]
    const delta = today && yesterDay ? today.earnings - yesterDay.earnings : 0
    const deltaPositive = delta >= 0
    const deltaPct = yesterDay ? Math.abs(Math.round((delta / yesterDay.earnings) * 100)) : 0;


    const fmt = (n: number) => {
        return "৳" + n.toLocaleString()
    }

    const metrics = [
        {
            label: "Best Day",
            value: fmt(max),
            sub: bestDay?.date ?? "—",
            icon: <Star size={14} />,
            color: "text-purple-400",
            bg: "bg-purple-500/20 border-purple-500/30",
        },
        {
            label: "Daily Avg",
            value: fmt(avg),
            sub: "per day",
            icon: <BarChart2 size={14} />,
            color: "text-indigo-400",
            bg: "bg-indigo-500/20 border-indigo-500/30",
        },
        {
            label: "Today",
            value: today ? fmt(today.earnings) : "—",
            sub: today && yesterDay
                ? `${deltaPositive ? "+" : ""}${fmt(delta)} vs yesterday`
                : "—",
            icon: <Zap size={14} />,
            color: "text-emerald-400",
            bg: "bg-emerald-500/20 border-emerald-500/30",
        },
    ];


    return (
        <div className='bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 sm:p-8 w-full text-white'>
            <div className='flex items-start justify-between mb-6 flex-wrap gap-4'>
                <div>
                    <span className='inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full mb-2'>
                        Partner Dashboard
                    </span>
                    <h2 className='text-xl sm:text-2xl font-extrabold text-white tracking-tight'>
                        Daily Earnings
                    </h2>
                    <p className='text-xs sm:text-sm text-gray-400 mt-0.5'>
                        Last 7 days performance
                    </p>
                </div>
                <div className='text-right'>
                    <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1'>
                        Weekly total
                    </p>
                    <motion.div
                        key={total}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-extrabold text-white font-mono tracking-tight"
                    >
                        {fmt(total)}
                    </motion.div>

                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold mt-1 ${deltaPositive ? "text-emerald-400" : "text-rose-400"
                        }`}>
                        {deltaPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        <span>{deltaPct}% vs yesterday</span>

                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6'>
                {metrics.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >

                        <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2 ${m.color}`}>
                            <span className={`${m.bg} p-1.5 rounded-lg border ${m.color}`}>{m.icon}</span>
                            {m.label}
                        </div>
                        <p className='text-xl font-bold text-white font-mono leading-none'>{m.value}</p>
                        <p className='text-[11px] text-gray-400 mt-1.5'>{m.sub}</p>

                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scaleY: 0.92 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="h-56"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={earningData}
                            barCategoryGap={"30%"}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => "৳" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)}
                            />
                            <Bar
                                dataKey="earnings" radius={[8, 8, 3, 3]}
                            >
                                {earningData.map((d, i) => {

                                    const isToday = i === earningData.length - 1;
                                    const isBest = d.earnings === max && !isToday;
                                    return (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={
                                                isToday
                                                    ? "#10b981"
                                                    : isBest
                                                        ? "#a855f7"
                                                        : "#6366f1"
                                            }
                                        />
                                    )
                                })}

                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

            </AnimatePresence>


        </div>
    )
}

export default PartnerEarning
