'use client'
import React from 'react'
import { motion } from 'motion/react'
import { ExternalLink, Star, Bike, Car, Truck, MapPin, Navigation, ArrowRight } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-[#0b0c10] text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Centered Showcase Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Book something real, travel faster
          </h2>
          <p className="mt-3 text-zinc-400 text-base font-normal">
            A showcase of real-world mobility & cargo solutions powered by RoadMate.
          </p>
        </div>

        {/* 2-Column Showcase matching Image 1 layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Metric & Mobility Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-2xl sm:text-3xl font-bold text-white hover:text-amber-400 transition"
              >
                <span>roadmate.app</span>
                <ExternalLink size={20} className="text-zinc-400" />
              </a>
              <p className="mt-3 text-zinc-300 text-sm leading-relaxed font-normal">
                A multi-vendor ride sharing & cargo transport platform to manage bike commuters, auto rides, family sedans, and heavy commercial freight from a single dashboard. Built for speed & safety.
              </p>
            </div>

            {/* Massive 88% Metric */}
            <div className="pt-4 border-t border-white/10">
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-7xl sm:text-8xl font-black text-white tracking-tight"
              >
                88%
              </motion.p>
              <p className="mt-2 text-zinc-400 text-sm font-medium">
                Of all rides matched in under 60 seconds with verified drivers
              </p>
            </div>
          </div>

          {/* Right Column: Mobile Frame Ride Command Card matching Image 1 */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-sm rounded-[2.5rem] border-[8px] border-zinc-700 bg-[#12131c] shadow-2xl p-4 text-xs">
              {/* Top Header */}
              <div className="pt-2 pb-4 text-center border-b border-white/10">
                <p className="italic text-zinc-400 text-[11px]">Select vehicle class or enter location</p>
              </div>

              {/* Ride Option Pills */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold flex items-center justify-center gap-1">
                  <Bike size={12} className="text-amber-400" />
                  <span>Bike Ride</span>
                </div>
                <div className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/5 text-zinc-300 border border-white/10 text-[11px] font-semibold flex items-center justify-center gap-1">
                  <Car size={12} className="text-zinc-400" />
                  <span>Auto / Car</span>
                </div>
                <div className="flex-1 py-1.5 px-2.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-semibold flex items-center justify-center gap-1">
                  <Truck size={12} className="text-purple-400" />
                  <span>Cargo Truck</span>
                </div>
              </div>

              {/* Ride Booking Inputs */}
              <div className="mt-4 space-y-2">
                <div className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-[11px] flex items-center gap-2">
                  <MapPin size={12} className="text-emerald-400" />
                  <span>📍 Set Pickup Location</span>
                </div>
                <div className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-[11px] flex items-center gap-2">
                  <Navigation size={12} className="text-purple-400" />
                  <span>🏁 Set Dropoff Destination</span>
                </div>
                <div className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-amber-300 font-bold text-[11px] flex items-center justify-between">
                  <span>Upfront Estimated Fare:</span>
                  <span>₹140.00</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <button className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition shadow-sm flex items-center justify-center gap-1">
                  <span>Confirm Booking</span>
                  <ArrowRight size={12} />
                </button>
                <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs transition border border-white/10">
                  Cancel
                </button>
              </div>

              {/* Live Driver Activity Stream */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <Star size={12} className="fill-amber-400 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Driver Assigned: Honda Shine (DH-1234) • 2 min away ...
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Rahul S. ★ 4.9</span>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[9px]">L</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Start Trip</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start gap-2">
                    <Truck size={12} className="text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Freight Driver Assigned: Tata Ace (DL-5678) • Loading goods ...
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Ramesh V. ★ 4.8</span>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-[9px]">T</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">Track GPS</span>
                    </div>
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
