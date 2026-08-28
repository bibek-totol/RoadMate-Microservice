'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { ArrowRight, Car, Copy, Check, ArrowDown, ShieldCheck } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import BackgroundCurve from './BackgroundCurve'

function HeroSection({ onAuthRequired }: { onAuthRequired: () => void }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const [copied, setCopied] = useState(false)

    const dispatchPillText = "Quick Booking • Live Drivers Online"

    const handleCopy = () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section className="rich-gradient relative w-full pt-28 pb-36 md:pt-36 md:pb-44 px-4 overflow-hidden text-white flex flex-col items-center justify-center min-h-[88vh]">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
               

                {/* Hero Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.1] text-white"
                >
                    Book Any Vehicle. <br className="hidden sm:inline" />
                    Travel & Transport Faster.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-6 max-w-2xl text-zinc-300 text-base sm:text-lg font-normal leading-relaxed"
                >
                    <span className="font-semibold text-white">RoadMate</span> is an on-demand mobility platform for <span className="font-semibold text-white">instant ride booking & cargo transport</span> with real-time GPS tracking. Book bikes, autos, sedans & commercial trucks on day one.
                </motion.p>

                {/* Action Buttons Row */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    {/* Primary Booking Pill Button */}
                    <button
                        onClick={() => { !userData ? onAuthRequired() : router.push("/user/book") }}
                        className="px-7 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Car size={16} />
                        <span>Book Your Ride Now</span>
                        <ArrowRight size={14} />
                    </button>

                    {/* Glowing Live Dispatch Status Box */}
                    <div
                        onClick={handleCopy}
                        className="glowing-box relative rounded-full border border-purple-500/50 bg-[#090a0f] px-6 py-3 flex items-center gap-3 text-xs font-mono text-zinc-200 cursor-pointer"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-zinc-300 font-medium">{dispatchPillText}</span>
                    </div>
                </motion.div>

                {/* Read More Sub-link */}
                <motion.a
                    href="#core-features"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="mt-12 text-xs font-normal text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1"
                >
                    <span>Read more about RoadMate mobility</span>
                    <ArrowDown size={12} />
                </motion.a>
            </div>

            {/* Exclusive Curved V/U Arch Divider matching Image 1 */}
            <BackgroundCurve position="bottom" height="clamp(4rem, 10vw, 9rem)" />
        </section>
    )
}

export default HeroSection
