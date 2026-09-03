'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Search, Bike, Car, Truck, ShieldCheck, MapPin, CheckCircle } from 'lucide-react'

const MOBILITY_FEATURES = [
  {
    num: '1',
    title: 'Multi-Vendor Fleet Engine',
    description: 'Book bikes for quick solo commutes, budget autos, comfortable family sedans, or heavy commercial freight trucks in seconds.',
  },
  {
    num: '2',
    title: 'Real-Time Socket GPS',
    description: 'Track your assigned driver live on interactive maps with instant dispatch alerts, route calculation, and zero surge manipulation.',
  },
  {
    num: '3',
    title: 'Verified Partner Network',
    description: 'Every driver undergoes background verification, vehicle document review, Video KYC, and instant daily bank payouts.',
  },
]

const LIVE_DISPATCH_RIDES = [
  { driver: 'Rahul Sharma (Bike)', rider: 'Amit Patel', vehicle: 'Honda Shine (DHA METRO-HA-1234)', fare: '৳85', status: 'En Route' },
  { driver: 'Vikram Singh (Car)', rider: 'Priya Roy', vehicle: 'Hyundai Swift (DHAKA METRO-GA-5678)', fare: '৳340', status: 'On Trip' },
  { driver: 'Suresh Kumar (Auto)', rider: 'Karan Mehra', vehicle: 'Bajaj RE Auto (DHAKA-CHA-9012)', fare: '৳140', status: 'Assigned' },
  { driver: 'Ramesh Verma (Truck)', rider: 'Logistics Co.', vehicle: 'Tata Ace Freight (CHATTO METRO-TA-3456)', fare: '৳1,250', status: 'Loading' },
  { driver: 'Anil Gupta (Car)', rider: 'Sneha Kapur', vehicle: 'Maruti Dzire (SYLHET METRO-GA-7890)', fare: '৳420', status: 'Arriving' },
]

export default function HowItWorks() {
  return (
    <section id="core-features" className="py-20 md:py-28 px-4 bg-[#0b0c10] text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Centered Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Core features
          </h2>
          <p className="mt-3 text-zinc-400 text-base font-normal">
            Everything you need for seamless ride-hailing & vehicle dispatch.
          </p>
        </div>

        {/* 2-Column Grid matching Image 3 layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Numbered Mobility Features */}
          <div className="lg:col-span-5 space-y-10">
            {MOBILITY_FEATURES.map((item) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-5"
              >
                {/* Outlined Circle Number (1), (2), (3) */}
                <div className="w-9 h-9 rounded-full border border-zinc-400 text-white font-mono text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {item.num}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: RoadMate Live Ride Dispatch Panel Frame */}
          <div className="lg:col-span-7">
            <div className="w-full rounded-2xl border-4 border-zinc-700 bg-[#12131c] shadow-2xl overflow-hidden">
              {/* Top Bar Header */}
              <div className="bg-[#181926] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>RoadMate Live Dispatch Panel</span>
                </div>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  Live real-time GPS tracking & driver dispatch dashboard.
                </p>
              </div>

              {/* Panel Content */}
              <div className="grid grid-cols-12 min-h-[380px] bg-[#12131c]">
                {/* Sidebar */}
                <div className="col-span-4 sm:col-span-3 bg-[#0d0e14] border-r border-white/10 p-3 flex flex-col justify-between text-xs text-zinc-400">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-1.5 rounded-md bg-white/5 text-white">
                      <Search size={14} />
                      <span className="text-[11px]">Filter Fleet</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 px-1">Active Fleet</p>
                      <div className="flex items-center gap-2 p-1.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px]">
                        <Bike size={14} className="text-amber-400" />
                        <span className="truncate">Bike Commutes</span>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded-md text-zinc-400 text-[11px] hover:bg-white/5">
                        <Car size={14} className="text-emerald-400" />
                        <span className="truncate">Autos & Sedans</span>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded-md text-zinc-400 text-[11px] hover:bg-white/5">
                        <Truck size={14} className="text-purple-400" />
                        <span className="truncate">Commercial Freight</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switches */}
                  <div className="pt-3 border-t border-white/10 space-y-2 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span>Live Socket GPS</span>
                      <div className="w-7 h-4 bg-purple-600 rounded-full relative p-0.5 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full translate-x-3 transition" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Instant Payouts</span>
                      <div className="w-7 h-4 bg-purple-600 rounded-full relative p-0.5 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full translate-x-3 transition" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Table: Live Active Rides */}
                <div className="col-span-8 sm:col-span-9 p-4 flex flex-col justify-between overflow-x-auto">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs">
                      <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
                        <span className="text-white border-b-2 border-white pb-1 font-semibold">Active Trips</span>
                        <span>Pending Requests</span>
                        <span>Partners</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle size={12} /> 124 Rides Live
                      </span>
                    </div>

                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="text-zinc-500 border-b border-white/10">
                          <th className="py-1.5 font-normal">Driver</th>
                          <th className="py-1.5 font-normal">Rider</th>
                          <th className="py-1.5 font-normal">Vehicle</th>
                          <th className="py-1.5 font-normal">Fare</th>
                          <th className="py-1.5 font-normal">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300">
                        {LIVE_DISPATCH_RIDES.map((r, i) => (
                          <tr key={i} className="hover:bg-white/5 transition">
                            <td className="py-1.5 font-medium text-white">{r.driver}</td>
                            <td className="py-1.5 text-zinc-400">{r.rider}</td>
                            <td className="py-1.5 text-zinc-400 font-mono text-[10px]">{r.vehicle}</td>
                            <td className="py-1.5 text-amber-300 font-bold">{r.fare}</td>
                            <td className="py-1.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-semibold">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
