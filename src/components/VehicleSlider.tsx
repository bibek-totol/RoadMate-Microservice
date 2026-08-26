'use client'
import { Bike, Bus, Car, CarTaxiFront, ChevronLeft, ChevronRight, Sparkles, Truck } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { motion } from "motion/react"

const VEHICLE_CATEGORIES = [
  { title: "All Vehicles", desc: "Browse the full multi-vendor fleet", Icon: CarTaxiFront, tag: "Popular" },
  { title: "Bikes", desc: "Fast & affordable solo rides", Icon: Bike, tag: "Quick" },
  { title: "Autos & Cars", desc: "Comfortable city commutes", Icon: Car, tag: "Comfort" },
  { title: "SUVs & Sedans", desc: "Premium & spacious travel", Icon: Car, tag: "Premium" },
  { title: "Vans & Buses", desc: "Group & family transport", Icon: Bus, tag: "Group" },
  { title: "Commercial Trucks", desc: "Heavy freight & cargo transport", Icon: Truck, tag: "Cargo" },
];

function VehicleSlider() {
  const [hovered, setHovered] = useState<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" })
  }

  return (
    <section className="w-full bg-background py-16 md:py-24 px-4 border-b border-border overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-md border border-border inline-block mb-3">
              Fleet Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Explore Vehicle Fleet
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Choose the exact ride class that fits your journey or freight needs.</p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-md border border-border bg-card flex items-center justify-center hover:bg-muted text-foreground transition-all shadow-xs"
            >
              <ChevronLeft size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-md border border-border bg-card flex items-center justify-center hover:bg-muted text-foreground transition-all shadow-xs"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>

        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-3 pt-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {VEHICLE_CATEGORIES.map((c, i) => {
              const isHovered = hovered === i
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ y: -4 }}
                  className="min-w-[220px] sm:min-w-[250px] flex-shrink-0 cursor-pointer"
                >
                  <div
                    className={`rounded-lg border p-5 transition-all h-full flex flex-col justify-between ${isHovered ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border/80 text-card-foreground'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center gap-1 border text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${isHovered ? 'bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20' : 'bg-secondary text-secondary-foreground border-border'}`}>
                          <Sparkles size={8} />
                          {c.tag}
                        </span>
                        <c.Icon size={20} className={isHovered ? 'text-primary-foreground' : 'text-muted-foreground'} />
                      </div>

                      <h3 className={`text-base font-bold tracking-tight mb-1 ${isHovered ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {c.title}
                      </h3>

                      <p className={`text-xs font-normal leading-relaxed ${isHovered ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {c.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
          {[
            { num: "6+", label: "Fleet Categories" },
            { num: "100%", label: "Verified Drivers" },
            { num: "24/7", label: "Instant Booking" },
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-foreground font-bold text-sm">{d.num}</span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VehicleSlider
