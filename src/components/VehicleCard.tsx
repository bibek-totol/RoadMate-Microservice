'use client'
import { vehicleType } from '@/models/vehicle.model'
import React from 'react'
import { motion } from "motion/react"
import { ArrowRight, Bike, Car, Clock, Gauge, IndianRupee, Star, Truck } from 'lucide-react';

const TYPE_CONFIG: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
    bike: { label: "Bike", Icon: Bike },
    auto: { label: "Auto", Icon: Car },
    car: { label: "Car", Icon: Car },
    loading: { label: "Loading Truck", Icon: Truck },
    truck: { label: "Heavy Truck", Icon: Truck },
};

interface IVehicle {
    owner: string
    type: vehicleType,
    vehicleModel: string,
    number: string,
    imageUrl?: string,
    baseFare?: number,
    pricePerKM?: number,
    waitingCharge?: number,
    status: "approved" | "pending" | "rejected",
    rejectionReason?: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
}

function VehicleCard({ vehicle, distance, onBook }: { vehicle: IVehicle, distance: number | undefined, onBook: () => void }) {
    const config = TYPE_CONFIG[vehicle.type] || { label: vehicle.type, Icon: Car }
    const { Icon, label } = config

    let estimated: number = 0
    if (vehicle.baseFare && vehicle.pricePerKM && distance) {
        estimated = Math.round(vehicle.baseFare + vehicle.pricePerKM * distance)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="bg-[#13141f]/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col group cursor-default shadow-xl hover:border-purple-500/50 transition-all text-white"
        >
            {/* Image Box */}
            <div className="relative h-44 bg-[#181926] flex items-center justify-center p-4">
                <motion.img
                    src={vehicle.imageUrl || '/heroImage.jpg'}
                    alt={vehicle.vehicleModel}
                    className="relative z-10 h-28 w-full object-contain"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Type Badge */}
                <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 bg-purple-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md border border-purple-400/20">
                    <Icon size={12} />
                    {label}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 bg-[#12131c] border border-white/15 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Card Body */}
            <div className="flex flex-col flex-1 p-5 gap-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="text-white text-base font-bold tracking-tight truncate">
                            {vehicle.vehicleModel}
                        </h3>
                        <div className="mt-1 inline-flex items-center bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                            <span className="text-zinc-300 text-[11px] font-mono font-medium uppercase">
                                {vehicle.number}
                            </span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <Icon size={16} />
                    </div>
                </div>

                {/* Rates Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#181926] border border-white/10 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-1 mb-0.5">
                            <Gauge size={12} className="text-zinc-400" />
                            <p className="text-zinc-400 text-[9px] uppercase font-bold">Per KM</p>
                        </div>
                        <p className="text-white text-xs font-bold flex items-center">
                            <IndianRupee size={11} />{vehicle.pricePerKM ?? 0}
                        </p>
                    </div>

                    <div className="bg-[#181926] border border-white/10 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-1 mb-0.5">
                            <Clock size={12} className="text-zinc-400" />
                            <p className="text-zinc-400 text-[9px] uppercase font-bold">Waiting</p>
                        </div>
                        <div className="text-white text-xs font-bold flex items-center">
                            <IndianRupee size={11} />{vehicle.waitingCharge ?? 0}
                            <span className="text-[9px] text-zinc-400 ml-0.5">/min</span>
                        </div>
                    </div>
                </div>

                {/* Footer Est. Fare & Action Button */}
                <div className="flex items-end justify-between pt-3 border-t border-white/10 mt-auto">
                    <div>
                        <p className="text-zinc-400 text-[9px] uppercase font-bold mb-0.5">Est. Upfront Fare</p>
                        <div className="flex items-baseline gap-0.5">
                            <IndianRupee size={16} className="text-amber-400" />
                            <span className="text-amber-400 text-2xl font-black tracking-tight">{estimated}</span>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={onBook}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/20"
                    >
                        <span>Confirm Ride</span>
                        <ArrowRight size={14} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default VehicleCard
