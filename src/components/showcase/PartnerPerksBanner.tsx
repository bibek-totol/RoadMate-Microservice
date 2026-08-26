'use client'
import React from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { Wallet, Clock, ShieldCheck, ArrowRight, Car } from 'lucide-react'

export default function PartnerPerksBanner() {
  const router = useRouter()

  return (
    <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto border-b border-border">
      <div className="bg-card border border-border rounded-xl p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-secondary-foreground border border-border text-xs font-semibold uppercase tracking-wider mb-4">
            <Car size={14} />
            Partner Opportunity
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Turn Your Vehicle Into Daily Revenue
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
            Become a verified RoadMate vehicle partner today. Register your car, bike, auto, or commercial truck to earn on your own schedule with zero hidden commissions.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 bg-muted/60 border border-border rounded-lg p-3">
              <Wallet className="text-foreground shrink-0" size={18} />
              <div>
                <p className="text-xs font-semibold text-foreground">Daily Payouts</p>
                <p className="text-[11px] text-muted-foreground">Direct to Bank</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/60 border border-border rounded-lg p-3">
              <Clock className="text-foreground shrink-0" size={18} />
              <div>
                <p className="text-xs font-semibold text-foreground">Flexible Hours</p>
                <p className="text-[11px] text-muted-foreground">Drive Anytime</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/60 border border-border rounded-lg p-3">
              <ShieldCheck className="text-foreground shrink-0" size={18} />
              <div>
                <p className="text-xs font-semibold text-foreground">Verified Drivers</p>
                <p className="text-[11px] text-muted-foreground">Insured Rides</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/partner/onboarding/vehicle')}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-xs"
            >
              <span>Become a Partner Now</span>
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-background border border-border rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
                  R
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Partner Dashboard</p>
                  <p className="text-[10px] text-muted-foreground">Live Earnings Preview</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Weekly Earning</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">₹18,450</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Trips Done</p>
                  <p className="text-base font-bold text-foreground mt-0.5">42</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Rating</p>
                  <p className="text-base font-bold text-foreground mt-0.5">4.9 ★</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
