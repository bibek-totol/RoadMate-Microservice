'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Bike, Car, MapPin, Navigation, RefreshCcw, Search, Truck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
const SearchMap = dynamic(() => import("@/components/SearchMap"), { ssr: false })
import axios from 'axios'
import { vehicleType } from '@/models/vehicle.model'
import VehicleCard from '@/components/VehicleCard'

const VEHICLE_META: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
    bike: { label: "Bike", Icon: Bike },
    auto: { label: "Auto", Icon: Car },
    car: { label: "Car", Icon: Car },
    loading: { label: "Loading", Icon: Truck },
    truck: { label: "Truck", Icon: Truck },
};

interface IVehicle {
    _id: string
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

function SearchPage() {
    const router = useRouter()
    const params = useSearchParams()
    const [pickUp, setPickUp] = useState(params.get("pickup") || "")
    const [drop, setDrop] = useState(params.get("drop") || "")
    const [km, setKm] = useState<number>(0)
    const mobile = params.get("mobile")
    const pickUpLat = Number(params.get("pickuplat"))
    const pickUpLon = Number(params.get("pickuplon"))
    const dropLat = Number(params.get("droplat"))
    const dropLon = Number(params.get("droplon"))
    const vehicle = params.get("vehicle") || ""
    const [vehicles, setVehicles] = useState<IVehicle[]>([])
    const [loading, setLoading] = useState(false)
    const meta = VEHICLE_META[vehicle]

    const getNearByVehicles = useCallback(async (latitude: number, longitude: number, vehicleType: string | null) => {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/vehicles/near-by", {
                latitude, longitude, vehicleType
            })
            setVehicles(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        getNearByVehicles(pickUpLat, pickUpLon, vehicle)
    }, [pickUpLat, pickUpLon, pickUp, vehicle, getNearByVehicles])

    return (
        <div className='min-h-screen bg-[#090a0f] text-white overflow-x-hidden relative'>
            {/* Back Button */}
            <div className='absolute top-5 left-5 z-50'>
                <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => router.back()}
                    className="w-11 h-11 rounded-2xl bg-[#12131c]/90 border border-white/15 backdrop-blur-xl shadow-xl flex items-center justify-center hover:bg-white/15 transition-colors text-white"
                >
                    <ArrowLeft size={18} />
                </motion.button>
            </div>

            {/* Map Header Box */}
            <div className='relative w-full h-[50vh] z-0'>
                <SearchMap
                    pickUp={pickUp}
                    drop={drop}
                    onChange={(p, d) => { setPickUp(p); setDrop(d) }}
                    onDistance={setKm}
                />
            </div>

            {/* Main Sheet Container */}
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                className="relative z-20 -mt-10 bg-[#0e0f17] rounded-t-[32px] border-t border-white/15 shadow-[0_-15px_50px_rgba(0,0,0,0.8)] pt-6 pb-24 min-h-[52vh]"
            >
                <div className='px-5 lg:px-8 max-w-6xl mx-auto'>
                    {/* Route Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className="bg-[#13141f]/90 border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-xl backdrop-blur-md"
                    >
                        <div className='flex gap-3 px-4 py-3.5 border-b border-white/10'>
                            <div className='flex flex-col items-center pt-1.5 flex-shrink-0'>
                                <div className='w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' />
                                <div className="w-px flex-1 bg-white/20 my-1" style={{ minHeight: 14 }} />
                            </div>

                            <div className='flex-1 min-w-0'>
                                <p className='text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-0.5'>Pickup</p>
                                <p className='text-sm text-white font-bold leading-snug truncate'>{pickUp || "-"}</p>
                            </div>
                            <MapPin size={15} className="text-emerald-400 flex-shrink-0 mt-1.5" />
                        </div>
                        <div className='flex gap-3 px-4 py-3.5'>
                            <div className='flex flex-col items-center pt-1.5 flex-shrink-0'>
                                <div className='w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' />
                            </div>

                            <div className='flex-1 min-w-0'>
                                <p className='text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-0.5'>Dropoff</p>
                                <p className='text-sm text-white font-bold leading-snug truncate'>{drop || "-"}</p>
                            </div>
                            <Navigation size={15} className="text-purple-400 flex-shrink-0 mt-1.5" />
                        </div>
                    </motion.div>

                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between mb-5"
                    >
                        <div>
                            <h2 className='text-white text-xl font-black tracking-tight'>
                                {loading
                                    ? "Scanning Drivers Near You..."
                                    : vehicles.length > 0
                                        ? "Available Rides"
                                        : "No Nearby Drivers"
                                }
                            </h2>
                            {meta && (
                                <div className='text-zinc-400 text-xs mt-0.5 font-medium'>
                                    Showing {meta.label} options near your pickup
                                </div>
                            )}
                        </div>

                        <AnimatePresence mode='wait'>
                            {loading ? (
                                <motion.div
                                    key="searching"
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    className="flex items-center gap-2 bg-[#181926] border border-white/10 px-3.5 py-1.5 rounded-full"
                                >
                                    <div className='w-3.5 h-3.5 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin' />
                                    <span className='text-zinc-300 text-xs font-semibold'>Matching...</span>
                                </motion.div>
                            ) : vehicles.length > 0 ? (
                                <motion.div
                                    key="live"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-1.5  px-3.5 py-1.5 rounded-full"
                                >
                                    
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty State */}
                    <AnimatePresence>
                        {!loading && vehicles.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <div className='w-20 h-20 rounded-full bg-[#181926] border border-white/10 flex items-center justify-center mb-4 text-purple-400'>
                                    <Search size={28} />
                                </div>
                                <p className='text-white font-bold text-lg mb-1'>No Vehicles Found</p>
                                <p className='text-zinc-400 text-sm max-w-xs leading-relaxed'>No active drivers found near your current location right now.</p>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => getNearByVehicles(pickUpLat, pickUpLon, vehicle)}
                                    className="mt-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-lg hover:opacity-90 transition-all"
                                >
                                    <RefreshCcw size={14} /> Retry Search
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Vehicles Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {vehicles.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <VehicleCard
                                    vehicle={v}
                                    distance={km}
                                    onBook={() => {
                                        const url = new URLSearchParams({
                                            pickUp,
                                            drop,
                                            vehicle: v.type,
                                            driverId: v.owner,
                                            vehicleId: String(v._id),
                                            fare: String(Math.round((v.baseFare || 0) + ((v.pricePerKM || 0) * km))),
                                            pickUpLat: String(pickUpLat),
                                            pickUpLon: String(pickUpLon),
                                            dropLat: String(dropLat),
                                            dropLon: String(dropLon),
                                            mobile: String(mobile)
                                        })
                                        router.push(`/user/checkout?${url.toString()}`)
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SearchPage
