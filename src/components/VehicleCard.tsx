'use client'
import { vehicleType } from '@/models/vehicle.model'
import React from 'react'
import { motion } from "motion/react"
import { ArrowRight, Bike, Car, Clock, Gauge, IndianRupee, Star, Truck } from 'lucide-react';

const TYPE_CONFIG = {
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
            className="bg-card border border-border rounded-lg overflow-hidden flex flex-col group cursor-default shadow-xs hover:border-foreground/30 transition-all"
        >
            {/* Image Box */}
            <div className="relative h-44 bg-muted/40 flex items-center justify-center p-4">
                <motion.img
                    src={vehicle.imageUrl || '/heroImage.jpg'}
                    alt={vehicle.vehicleModel}
                    className="relative z-10 h-28 w-full object-contain"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Type Soft Badge */}
                <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                    <Icon size={12} />
                    {label}
                </div>

                {/* Rating Soft Badge */}
                <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 bg-background border border-border text-foreground text-[10px] font-semibold px-2 py-1 rounded-md shadow-xs">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                </div>
            </div>

            <div className="h-px bg-border" />

            {/* Card Content Body */}
            <div className="flex flex-col flex-1 p-5 gap-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="text-foreground text-base font-bold tracking-tight truncate">
                            {vehicle.vehicleModel}
                        </h3>
                        <div className="mt-1 inline-flex items-center bg-muted px-2 py-0.5 rounded-md border border-border">
                            <span className="text-muted-foreground text-[11px] font-mono font-medium uppercase">
                                {vehicle.number}
                            </span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-md bg-secondary text-secondary-foreground border border-border flex items-center justify-center shrink-0">
                        <Icon size={16} />
                    </div>
                </div>

                {/* Rates Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/40 border border-border rounded-md px-3 py-2">
                        <div className="flex items-center gap-1 mb-0.5">
                            <Gauge size={12} className="text-muted-foreground" />
                            <p className="text-muted-foreground text-[9px] uppercase font-semibold">Per KM</p>
                        </div>
                        <p className="text-foreground text-xs font-bold flex items-center">
                            <IndianRupee size={11} />{vehicle.pricePerKM ?? 0}
                        </p>
                    </div>

                    <div className="bg-muted/40 border border-border rounded-md px-3 py-2">
                        <div className="flex items-center gap-1 mb-0.5">
                            <Clock size={12} className="text-muted-foreground" />
                            <p className="text-muted-foreground text-[9px] uppercase font-semibold">Waiting</p>
                        </div>
                        <div className="text-foreground text-xs font-bold flex items-center">
                            <IndianRupee size={11} />{vehicle.waitingCharge ?? 0}
                            <span className="text-[9px] text-muted-foreground ml-0.5">/min</span>
                        </div>
                    </div>
                </div>

                {/* Footer Est. Fare & Book Button */}
                <div className="flex items-end justify-between pt-3 border-t border-border mt-auto">
                    <div>
                        <p className="text-muted-foreground text-[9px] uppercase font-semibold mb-0.5">Est. Fare</p>
                        <div className="flex items-baseline gap-0.5">
                            <IndianRupee size={16} className="text-foreground" />
                            <span className="text-foreground text-2xl font-bold tracking-tight">{estimated}</span>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={onBook}
                        className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-md hover:opacity-90 transition shadow-xs"
                    >
                        <span>Book</span>
                        <ArrowRight size={14} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default VehicleCard
