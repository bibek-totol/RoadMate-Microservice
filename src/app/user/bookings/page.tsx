"use client"
import { BookingStatus, PaymentStatus } from '@/models/booking.model'
import { IUser } from '@/models/user.model'
import { IVehicle } from '@/models/vehicle.model'
import axios from 'axios'
import { ArrowLeft, Bike, Calendar, Car, ChevronRightIcon, IndianRupee, Loader2, MapPin, Navigation, Phone, Truck, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation'

interface IBooking {
    _id: string
    user: IUser
    driver: IUser
    vehicle: IVehicle

    pickUpAddress: string
    dropAddress: string

    pickUpLocation: {
        type: "Point",
        coordinates: [number, number]
    }
    dropLocation: {
        type: "Point",
        coordinates: [number, number]
    }

    fare: number

    userMobileNumber: string
    driverMobileNumber: string

    bookingStatus: BookingStatus
    paymentStatus: PaymentStatus
    paymentDeadline: Date
    adminCommission: number
    partnerAmount: number

    pickUpOtp: string,
    pickUpOtpExpires: Date
    dropOtp: string,
    dropOtpExpires: Date,
    createdAt?: Date
    updatedAt?: Date
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<IBooking[] | []>([])
    const [selectStatus, setSelectStatus] = useState("All")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get("/api/user/bookings")
                setBookings(data)
                setLoading(false)
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.log(error?.response?.data?.message)
                }
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
            completed: "bg-teal-500/10 text-teal-400 border-teal-500/30",
            requested: "bg-amber-500/10 text-amber-400 border-amber-500/30",
            awaiting_payment: "bg-blue-500/10 text-blue-400 border-blue-500/30",
            cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/30",
            rejected: "bg-red-500/10 text-red-400 border-red-500/30",
            expired: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
        };
        return colors[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    };

    const getVehicleIcon = (vehicleType?: string) => {
        switch (vehicleType?.toLowerCase()) {
            case 'bike':
                return <Bike className="w-4 h-4 text-purple-400" />;
            case 'auto':
            case 'car':
                return <Car className="w-4 h-4 text-purple-400" />;
            case 'truck':
            case 'loading':
                return <Truck className="w-4 h-4 text-purple-400" />;
            default:
                return <Car className="w-4 h-4 text-purple-400" />;
        }
    };

    const filterBookings = selectStatus === "All"
        ? bookings
        : bookings.filter(b => b.bookingStatus === selectStatus.toLowerCase());

    return (
        <div className='min-h-screen bg-gradient-to-b from-[#0b0c10] via-[#090a0f] to-[#12131c] text-white px-4 py-10 relative overflow-hidden'>
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

            <div className='max-w-4xl mx-auto relative z-10'>
                {/* Header Navbar */}
                <div className='flex items-center gap-4 mb-8'>
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => router.push("/")}
                        className="w-11 h-11 rounded-2xl bg-[#12131c]/90 border border-white/15 shadow-md flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={17} className='text-white' />
                    </motion.button>
                    <div>
                        <h1 className='text-2xl sm:text-3xl font-black tracking-tight text-white'>My Bookings</h1>
                        <p className='text-zinc-400 text-xs sm:text-sm mt-0.5 font-medium'>
                            {bookings.length} {bookings.length === 1 ? 'ride' : 'rides'} recorded in history
                        </p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className='flex justify-between items-center mb-6 bg-[#12131c]/80 border border-white/10 p-4 rounded-2xl backdrop-blur-md'>
                    <div className='text-xs font-bold text-zinc-400 uppercase tracking-wider'>
                        Showing {filterBookings.length} rides
                    </div>
                    <select
                        value={selectStatus}
                        onChange={(e) => setSelectStatus(e.target.value)}
                        className='bg-[#181926] border border-white/15 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-none focus:border-purple-500 cursor-pointer'
                    >
                        <option value="All">All Statuses</option>
                        <option value="requested">Requested</option>
                        <option value="awaiting_payment">Awaiting Payment</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="started">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className='flex flex-col items-center justify-center py-20 gap-3'>
                        <Loader2 className='animate-spin w-8 h-8 text-purple-400' />
                        <p className='text-zinc-400 text-xs font-semibold'>Loading bookings...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && filterBookings.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#12131c]/90 border border-white/15 rounded-3xl p-12 text-center backdrop-blur-xl shadow-2xl"
                    >
                        <div className='w-16 h-16 rounded-full bg-[#181926] border border-white/10 flex items-center justify-center mx-auto mb-4 text-purple-400'>
                            <Car className="w-8 h-8" />
                        </div>
                        <h2 className='text-lg font-bold text-white'>No Bookings Found</h2>
                        <p className='text-zinc-400 text-xs sm:text-sm mt-1 max-w-xs mx-auto'>
                            You have no ride history matching the selected filter.
                        </p>
                    </motion.div>
                )}

                {/* Bookings List */}
                {!loading && filterBookings.length > 0 && (
                    <div className='space-y-4'>
                        {filterBookings.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className='bg-[#12131c]/90 backdrop-blur-xl rounded-3xl border border-white/15 overflow-hidden shadow-xl hover:border-purple-500/40 transition-all'
                            >
                                {/* Card Header */}
                                <div className='flex items-center gap-3 p-4 bg-[#181926] border-b border-white/10'>
                                    <div className='w-10 h-10 rounded-full overflow-hidden bg-purple-600/20 border border-purple-500/30 flex-shrink-0 flex items-center justify-center text-purple-400'>
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center justify-between gap-2'>
                                            <h3 className='font-bold text-white text-sm truncate'>
                                                {b.driver?.name?.toUpperCase() || "Driver Assigned"}
                                            </h3>
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(b.bookingStatus)}`}>
                                                {b.bookingStatus || "-"}
                                            </span>
                                        </div>
                                        {b.driverMobileNumber && (
                                            <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-400 font-mono">
                                                <Phone className="w-3 h-3 text-zinc-500" />
                                                <span>{b.driverMobileNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Vehicle Badge Info */}
                                <div className='px-5 pt-4'>
                                    <div className='bg-[#181926] border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5'>
                                        {getVehicleIcon(b.vehicle?.type)}
                                        <div className='text-xs text-zinc-300 font-medium'>
                                            {b.vehicle?.vehicleModel || "Standard Vehicle"} • <span className='font-mono uppercase text-purple-400 font-bold'>{b.vehicle?.number || "No Plate"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Locations */}
                                <div className='p-5 space-y-3.5'>
                                    <div className='flex items-start gap-3'>
                                        <div className='flex-shrink-0 w-6 h-6 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mt-0.5'>
                                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">PICKUP</span>
                                            <p className='text-xs text-zinc-200 mt-0.5 leading-relaxed font-medium truncate'>
                                                {b.pickUpAddress}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-start gap-3'>
                                        <div className='flex-shrink-0 w-6 h-6 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mt-0.5'>
                                            <Navigation className="w-3.5 h-3.5 text-purple-400" />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">DROPOFF</span>
                                            <p className='text-xs text-zinc-200 mt-0.5 leading-relaxed font-medium truncate'>
                                                {b.dropAddress}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Bar */}
                                <div className='flex items-center justify-between px-5 py-3.5 bg-[#181926] border-t border-white/10 text-xs'>
                                    <div className='flex items-center gap-2 text-zinc-400 font-medium'>
                                        <Calendar className="w-4 h-4 text-purple-400" />
                                        <span>{b.createdAt ? formatDate(b.createdAt.toString()) : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5 font-black text-amber-400 text-sm">
                                        <IndianRupee className="w-4 h-4" />
                                        <span>{b.fare}</span>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className='flex items-center justify-between px-5 py-3.5 border-t border-white/10 bg-[#12131c]'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-zinc-400 font-medium'>Payment:</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                            b.paymentStatus === 'paid'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                        }`}>
                                            {b.paymentStatus}
                                        </span>
                                    </div>

                                    {(b.bookingStatus == "confirmed" || b.bookingStatus == "started" || b.bookingStatus == "completed") && (
                                        <button
                                            onClick={() => router.push(`/user/ride/${b._id}`)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-purple-600/20"
                                        >
                                            <span>Ride Details</span>
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

