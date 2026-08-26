'use client'
import React from 'react'
import { motion } from "motion/react"
import { Send } from 'lucide-react'
import Image from 'next/image'
import BackgroundCurve from './BackgroundCurve'

function Footer() {
  return (
    <footer className="rich-gradient relative w-full text-white pt-28 pb-12 px-4 overflow-hidden border-t border-white/10">
      {/* Exclusive Curved U/V Arch Divider matching Image 2 */}
      <BackgroundCurve position="top" height="clamp(4rem, 10vw, 9rem)" />

      <div className="max-w-6xl mx-auto relative z-10 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Column 1: Riders */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 mb-4">Riders</h4>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li><a href="#" className="hover:text-white transition">Book a Ride</a></li>
              <li><a href="#" className="hover:text-white transition">Bike Commutes</a></li>
              <li><a href="#" className="hover:text-white transition">Autos & Sedans</a></li>
              <li><a href="#" className="hover:text-white transition">Commercial Freight</a></li>
            </ul>
          </div>

          {/* Column 2: Partners */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 mb-4">Partners</h4>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li><a href="/partner/onboarding/vehicle" className="hover:text-white transition">Become a Partner</a></li>
              <li><a href="#" className="hover:text-white transition">Video KYC Verification</a></li>
              <li><a href="#" className="hover:text-white transition">Daily Bank Payouts</a></li>
              <li><a href="#" className="hover:text-white transition">Fleet Management</a></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">24/7 Safety Desk</a></li>
              <li><a href="#" className="hover:text-white transition">Ride Insurance</a></li>
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            </ul>
          </div>

          {/* Column 4: Request Info */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 mb-2">Request Info</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Interested in partner registration or fleet onboarding? Leave your email and our team will contact you.
            </p>
            {/* Input Box matching Image 2 */}
            <div className="relative flex items-center bg-[#13141c] border border-white/15 rounded-xl p-1.5 focus-within:border-white/40 transition">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent outline-none px-3 text-xs text-white placeholder:text-zinc-500"
              />
              <button className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Center Logo Pill & Line matching Image 2 */}
        <div className="flex flex-col items-center justify-center pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center p-1 border border-white/20">
              <Image src="/logo.png" alt="RoadMate" width={18} height={18} priority className="object-contain invert brightness-200" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              roadmate
            </span>
          </div>

          <div className="w-24 h-px bg-white/10 mb-6" />

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms & Safety</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
