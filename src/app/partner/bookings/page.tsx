"use client"
import { BookingStatus, PaymentStatus } from '@/models/booking.model'
import { IUser } from '@/models/user.model'
import { IVehicle } from '@/models/vehicle.model'
import axios from 'axios'
import { Bike, Calendar, Car, ChevronRightIcon, IndianRupee, Loader2, MapPin, Phone, Truck, User } from 'lucide-react'
import { div } from 'motion/react-client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation'
interface IBooking {
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
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

function page() {
    const [bookings, setBookings] = useState<IBooking[] | []>([])
    const [selectStatus, setSelectStatus] = useState("All")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get("/api/partner/bookings")
                console.log(data)
                setBookings(data)
                setLoading(false)
            } catch (error: any) {
                console.log(error?.response?.data?.message)
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const formatDate = (dateString: string) => {
        if (!dateString) return "—";
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
            confirmed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
            completed: "bg-purple-500/15 text-purple-300 border-purple-500/30",
            requested: "bg-amber-500/15 text-amber-300 border-amber-500/30",
            awaiting_payment: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
            cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
            rejected: "bg-red-500/15 text-red-300 border-red-500/30",
            expired: "bg-white/5 text-gray-400 border-white/10",
        };
        return colors[status] || "bg-white/5 text-gray-300 border-white/10";
    };

    const getVehicleIcon = (vehicleType?: string) => {
        switch (vehicleType?.toLowerCase()) {
            case 'bike':
                return <Bike className="w-4 h-4 text-purple-400" />;
            case 'auto':
                return <Car className="w-4 h-4 text-purple-400" />;
            case 'truck':
                return <Truck className="w-4 h-4 text-purple-400" />;
            case 'loading':
            case 'car':
            default:
                return <Car className="w-4 h-4 text-purple-400" />;
        }
    };

    const filterBookings = selectStatus === "All"
        ? bookings
        : bookings.filter(b => b.bookingStatus === selectStatus.toLowerCase());

    return (
        <div className='min-h-screen bg-[#0b0c10] text-white selection:bg-purple-500 selection:text-white relative overflow-hidden flex flex-col justify-between'>
            <div>
                <Nav />

                {/* Ambient Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

                {/* Header Section */}
                <div className='bg-[#0d0e15]/80 border-b border-white/10 backdrop-blur-xl pt-28 pb-8 relative z-10'>
                    <div className='max-w-5xl mx-auto px-4 sm:px-6'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]'>
                                <Car className="w-6 h-6" />
                            </div>
                            <div>
                                <span className='inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full mb-1'>
                                    Partner Dashboard
                                </span>
                                <h1 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
                                    Partner <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 text-transparent bg-clip-text">Bookings</span>
                                </h1>
                                <p className='text-gray-400 text-sm mt-0.5'>
                                    {bookings.length} {bookings.length === 1 ? 'ride' : 'rides'} assigned to you
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className='max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10 space-y-6'>
                    <div className='flex justify-between items-center bg-[#0d0e15]/90 border border-white/10 backdrop-blur-xl p-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]'>
                        <div className='text-xs sm:text-sm font-semibold text-gray-400'>
                            Showing <span className="text-white font-bold">{filterBookings.length}</span> bookings
                        </div>
                        <select
                            value={selectStatus}
                            onChange={(e) => setSelectStatus(e.target.value)}
                            className='bg-[#161824] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition cursor-pointer'
                        >
                            <option value="All">All Statuses</option>
                            <option value="requested">Requested</option>
                            <option value="awaiting_payment">Awaiting Payment</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="started">Started</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="rejected">Rejected</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>

                    {loading && (
                        <div className='flex justify-center py-20'>
                            <Loader2 className='animate-spin w-8 h-8 text-purple-400' />
                        </div>
                    )}

                    {!loading && filterBookings.length === 0 && (
                        <div className="bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <h2 className='text-lg font-bold text-white'>No bookings found</h2>
                            <p className='text-gray-400 text-sm mt-1'>When customers book rides, they'll appear here</p>
                        </div>
                    )}

                    {!loading && filterBookings.length > 0 && (
                        <div className='space-y-4'>
                            {filterBookings.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className='bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-all hover:border-purple-500/40'>
                                        {/* Card Header */}
                                        <div className='flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-transparent border-b border-white/10'>
                                            <div className='w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold shrink-0'>
                                                <User className="w-5 h-5 text-purple-300" />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center justify-between gap-2'>
                                                    <h3 className='font-bold text-white text-sm sm:text-base truncate'>
                                                        {b.user?.name ? b.user.name.toUpperCase() : "Customer"}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(b.bookingStatus)}`}
                                                    >
                                                        {b.bookingStatus || "-"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                                                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                                                    <span>{b.userMobileNumber || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vehicle Badge */}
                                        <div className='px-4 sm:px-5 pt-4'>
                                            <div className='bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5'>
                                                {getVehicleIcon(b.vehicle?.type)}
                                                <div className='text-xs font-semibold text-gray-300'>
                                                    {b.vehicle?.vehicleModel || "Vehicle"} • <span className="text-purple-300 font-mono">{b.vehicle?.number || "Not assigned"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Addresses */}
                                        <div className='p-4 sm:p-5 space-y-3.5'>
                                            <div className='flex items-start gap-3'>
                                                <div className='shrink-0 w-6 h-6 bg-emerald-500/20 border border-emerald-500/40 rounded-lg flex items-center justify-center mt-0.5'>
                                                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                                </div>
                                                <div className='flex-1'>
                                                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">PICK UP</span>
                                                    <p className='text-sm text-gray-200 mt-0.5 leading-relaxed font-medium'>
                                                        {b.pickUpAddress}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex items-start gap-3'>
                                                <div className='shrink-0 w-6 h-6 bg-rose-500/20 border border-rose-500/40 rounded-lg flex items-center justify-center mt-0.5'>
                                                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                                </div>
                                                <div className='flex-1'>
                                                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">DROP</span>
                                                    <p className='text-sm text-gray-200 mt-0.5 leading-relaxed font-medium'>
                                                        {b.dropAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer: Date & Fare */}
                                        <div className='flex items-center justify-between px-4 sm:px-5 py-3.5 bg-white/5 border-t border-white/10'>
                                            <div className='flex items-center gap-2 text-xs text-gray-400'>
                                                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                                <span>{formatDate(b.createdAt?.toString() || '')}</span>
                                            </div>
                                            <div className="flex items-center gap-1 font-mono font-bold text-base text-white">
                                                <IndianRupee className="w-4 h-4 text-purple-400" />
                                                <span>{b.fare}</span>
                                            </div>
                                        </div>

                                        {/* Payment & Actions */}
                                        <div className='flex items-center justify-between px-4 sm:px-5 py-3 border-t border-white/10'>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-xs text-gray-400'>Payment:</span>
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border uppercase tracking-wider ${b.paymentStatus === 'paid'
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                                    }`}>{b.paymentStatus}</span>
                                            </div>

                                            {(b.bookingStatus === "completed" || b.bookingStatus === "confirmed" || b.bookingStatus === "started") && (
                                                <button
                                                    onClick={() => router.push("/partner/active-ride")}
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 rounded-xl transition shadow-[0_0_12px_rgba(147,51,234,0.4)]"
                                                >
                                                    <span>Active Ride Details</span>
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default page
