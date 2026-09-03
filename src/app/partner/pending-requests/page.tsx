'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import axios from 'axios'
import { BookingStatus,  PaymentStatus } from '@/models/booking.model'
import { Clock, IndianRupee, Loader2, MapPin, Navigation } from 'lucide-react'
import { div } from 'motion/react-client'
import { useRouter } from 'next/navigation'
import { getSocket } from '@/lib/socket'

 interface IBooking {
    _id:string
    user: string
    driver: string
    vehicle:string
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
    paymentDeadline:Date
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

    const [bookings, setBookings] = useState<IBooking[]>([])
    const [loading, setLoading] = useState(false)
    const router=useRouter()

    const fetchPendingRequests = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get("/api/partner/bookings/pending")
            setBookings(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const handleAccept=async (id:string)=>{
        try {
           const {data}=await axios.get(`/api/partner/bookings/${id}/accept`) 
           router.push("/partner/bookings")

        } catch (error) {
            console.log(error)
        }
    }

    const handleReject=async (id:string)=>{
        try {
           const {data}=await axios.get(`/api/partner/bookings/${id}/reject`) 
           window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPendingRequests()
    }, [])

    useEffect(()=>{
     const socket=getSocket()
     console.log(socket)
     socket.on("new-booking",(data)=>{
       setBookings((prev)=>[...prev,data])
     })
     return ()=>{
        socket.off("new-booking")
     }
    },[])

    return (
        <div className='min-h-screen bg-[#0b0c10] text-white selection:bg-purple-500 selection:text-white relative overflow-hidden flex flex-col justify-between'>
            <div>
                <Nav />

                {/* Ambient Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

                {/* Header Banner */}
                <div className='bg-[#0d0e15]/80 border-b border-white/10 backdrop-blur-xl pt-28 pb-8 relative z-10'>
                    <div className='max-w-5xl mx-auto px-4 sm:px-6'>
                        <span className='inline-block text-[11px] font-semibold tracking-widest uppercase text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full mb-2'>
                            Real-Time Radar
                        </span>
                        <h1 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight'>
                            Pending Ride <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 text-transparent bg-clip-text">Requests</span>
                        </h1>
                        <p className='mt-1 text-gray-400 text-sm'>Respond to incoming customer ride requests in real time.</p>
                    </div>
                </div>

                {/* Main Section */}
                <div className='max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10'>
                    {loading ? (
                        <div className='flex justify-center py-20'>
                            <Loader2 className="animate-spin w-8 h-8 text-purple-400" />
                        </div>
                    ) : bookings.length == 0 ? (
                        <div className='bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]'>
                            <p className='text-gray-400 text-base font-semibold'>No pending ride requests available right now.</p>
                            <p className='text-gray-500 text-xs mt-1'>Stay on this page—new requests will appear automatically.</p>
                        </div>
                    ) : (
                        <div className='space-y-5'>
                            {bookings.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all hover:border-purple-500/40"
                                >
                                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>

                                        <div className="flex-1 space-y-4">

                                            <div className='flex items-start gap-3.5'>
                                                <div className='bg-emerald-500/20 border border-emerald-500/40 p-2.5 rounded-xl text-emerald-400 shrink-0 mt-0.5'>
                                                    <MapPin size={18} />
                                                </div>
                                                <div>
                                                    <p className='text-[11px] uppercase tracking-wider text-emerald-400 font-bold mb-0.5'>Pickup Location</p>
                                                    <p className='text-white font-semibold text-sm sm:text-base leading-snug'>{b.pickUpAddress}</p>
                                                </div>
                                            </div>

                                            <div className='flex items-start gap-3.5'>
                                                <div className='bg-rose-500/20 border border-rose-500/40 p-2.5 rounded-xl text-rose-400 shrink-0 mt-0.5'>
                                                    <Navigation size={18} />
                                                </div>
                                                <div>
                                                    <p className='text-[11px] uppercase tracking-wider text-rose-400 font-bold mb-0.5'>Drop Location</p>
                                                    <p className='text-white font-semibold text-sm sm:text-base leading-snug'>{b.dropAddress}</p>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-2 text-xs text-gray-400 pt-1'>
                                                <Clock size={14} className="text-purple-400" />
                                                <span className='font-medium'>
                                                    {b.createdAt ? new Date(b.createdAt).toLocaleString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }) : "Just now"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className='flex flex-col justify-between lg:items-end gap-6 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10'>

                                            <div className='text-left lg:text-right'>
                                                <p className='text-[11px] tracking-wider text-gray-400 uppercase font-semibold mb-1'>Estimated Fare</p>
                                                <div className='flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-white lg:justify-end font-mono'>
                                                    <IndianRupee size={22} className="text-purple-400" />
                                                    {b.fare}
                                                </div>
                                            </div>

                                            <div className='flex gap-3 w-full lg:w-auto'>
                                                <button
                                                    onClick={()=>handleReject(b._id)}
                                                    className='flex-1 lg:flex-none
                                                        px-6 py-2.5
                                                        rounded-xl
                                                        border border-rose-500/30
                                                        bg-rose-500/10
                                                        text-rose-300
                                                        text-xs sm:text-sm font-semibold
                                                        hover:bg-rose-500/20
                                                        transition-all duration-200
                                                        active:scale-[0.98]'
                                                >
                                                    Reject
                                                </button>
                                                <button 
                                                    onClick={()=>handleAccept(b._id)}
                                                    className='flex-1 lg:flex-none
                                                        px-7 py-2.5
                                                        rounded-xl
                                                        bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700
                                                        text-white
                                                        text-xs sm:text-sm font-semibold
                                                        shadow-[0_0_20px_rgba(147,51,234,0.4)]
                                                        hover:from-purple-500 hover:to-indigo-500
                                                        transition-all duration-200
                                                        active:scale-[0.98]
                                                        flex items-center justify-center'
                                                >
                                                    Accept Ride
                                                </button>
                                            </div>

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
