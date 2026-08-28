'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Banknote, Bike, Car, CheckCircle, Clock, CreditCard, DollarSign, IndianRupee, Loader2, MapPin, Navigation, Shield, Truck, Wallet, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getSocket } from '@/lib/socket';

const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },
  auto: { label: "Auto", Icon: Car },
  car: { label: "Car", Icon: Car },
  loading: { label: "Loading", Icon: Truck },
  truck: { label: "Truck", Icon: Truck },
};

type Status = "idle" | "requested" | "awaiting_payment"
  | "rejected" | "expired" 
  | "payment" | "confirmed";

function CheckOutContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [pickUp, setPickUp] = useState(params.get("pickUp") || "")
  const [drop, setDrop] = useState(params.get("drop") || "")
  const mobile = params.get("mobile")
  const pickUpLat = Number(params.get("pickUpLat"))
  const pickUpLon = Number(params.get("pickUpLon"))
  const dropLat = Number(params.get("dropLat"))
  const dropLon = Number(params.get("dropLon"))
  const vehicle = params.get("vehicle") || ""
  const driverId = params.get("driverId") || ""
  const vehicleId = params.get("vehicleId") || ""
  const fare = params.get("fare") || ""
  const { Icon, label } = VEHICLE_META[vehicle] || { Icon: Car, label: "Car" }
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [booking, setBooking] = useState<any>()
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash")

  const handleRequestBooking = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post("/api/booking/create", {
        driverId,
        vehicleId,
        pickUpAddress: pickUp,
        dropAddress: drop,
        pickUpLocation: {
          type: "Point",
          coordinates: [pickUpLon, pickUpLat]
        },
        dropLocation: {
          type: "Point",
          coordinates: [dropLon, dropLat]
        },
        fare,
        mobileNumber: mobile,
      })
      setBooking(data)
      setLoading(false)
      setStatus("requested")
    } catch (error: any) {
      setLoading(false)
      console.log(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    const socket = getSocket()
    socket.on("accept-booking", (data) => {
      setStatus(data)
    })
    socket.on("reject-booking", (data) => {
      setStatus(data)
    })
    return () => {
      socket.off("accept-booking")
      socket.off("reject-booking")
    }
  }, [])

  const handleConfirmPayment = async () => {
    if (!booking || !paymentMethod) return;
    setLoading(true)
    try {
      if (paymentMethod == "online") {
        const { data } = await axios.post("/api/payment/create", {
          bookingId: booking._id
        })

        if (data.sessionUrl) {
          window.location.href = data.sessionUrl;
        } else {
          alert("Failed to initiate Stripe payment session.");
          setLoading(false);
        }
      } else {
        const { data } = await axios.get(`/api/booking/${booking._id}/confirm`)
        setLoading(false)
        if (data.success) {
          setStatus("confirmed")
          window.location.href = `/user/ride/${booking._id}`
        }
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const fetchActiveBooking = async () => {
    try {
      const { data } = await axios.get("/api/booking/active")
      setBooking(data.booking)
      setStatus(data.booking.bookingStatus || data.booking)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = async () => {
    try {
      await axios.get(`/api/booking/${booking._id}/cancel`)
      setStatus("idle")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchActiveBooking()
  }, [])

  useEffect(() => {
    if (status !== "awaiting_payment") return;
    const t = setTimeout(() => {
      setStatus("payment")
    }, 2000)
    return () => { clearTimeout(t) }
  }, [status])

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#0b0c10] via-[#090a0f] to-[#12131c] text-white px-4 py-12 relative overflow-hidden'>
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className='relative max-w-5xl mx-auto z-10'>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className='flex items-center gap-2 mb-2'>
            <div className='h-px w-8 bg-purple-500' />
            <span className='text-[10px] font-black uppercase tracking-[0.2em] text-purple-400'>Secure Checkout</span>
          </div>
          <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-white'>Review & Confirm Ride</h1>
          <p className='text-zinc-400 text-xs sm:text-sm mt-1 font-medium'>Verify route details and choose payment method</p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-6'>
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#12131c]/90 backdrop-blur-xl rounded-3xl border border-white/15 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between"
          >
            <div className='p-8 sm:p-10'>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <div className='text-[10px] font-bold uppercase tracking-[0.18em] text-purple-400 mb-1'>Selected Class</div>
                  <div className='text-3xl font-black tracking-tight text-white capitalize'>{vehicle || label}</div>
                </div>
                <div className='w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30 text-white'>
                  <Icon size={28} />
                </div>
              </div>

              <div className='bg-[#181926] border border-white/10 rounded-2xl overflow-hidden mb-8'>
                <div className='flex gap-4 px-5 py-4 border-b border-white/10'>
                  <div className='flex flex-col items-center flex-shrink-0 pt-0.5'>
                    <div className='w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#181926] shadow-[0_0_8px_rgba(52,211,153,0.6)]' />
                    <div className="w-px flex-1 bg-white/20 my-1" style={{ minHeight: 12 }} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-0.5'>Pickup Location</div>
                    <div className='text-sm font-semibold text-white leading-snug truncate'>{pickUp}</div>
                  </div>
                  <MapPin size={15} className="text-emerald-400 flex-shrink-0 mt-1" />
                </div>

                <div className='flex gap-4 px-5 py-4'>
                  <div className='flex flex-col items-center flex-shrink-0 pt-0.5'>
                    <div className='w-3 h-3 rounded-full bg-purple-500 border-2 border-[#181926] shadow-[0_0_8px_rgba(168,85,247,0.6)]' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-0.5'>Dropoff Destination</div>
                    <div className='text-sm font-semibold text-white leading-snug truncate'>{drop}</div>
                  </div>
                  <Navigation size={15} className="text-purple-400 flex-shrink-0 mt-1" />
                </div>
              </div>

              <div className='flex items-end justify-between pt-6 border-t border-white/10'>
                <div>
                  <p className='text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-1'>Upfront Fixed Fare</p>
                  <p className='text-zinc-400 text-xs font-medium'>Includes distance & driver matching fee</p>
                </div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex items-baseline gap-1"
                >
                  <span className='text-amber-400 text-xl font-bold'><IndianRupee /></span>
                  <span className='text-amber-400 text-5xl font-black tracking-tight leading-none'>{fare}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Action / Payment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#12131c]/90 backdrop-blur-xl rounded-3xl border border-white/15 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col"
          >
            <div className='flex-1 p-8 sm:p-10 flex flex-col'>
              <AnimatePresence mode="wait">

                {(status == "idle" || status == "rejected") && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col flex-1 justify-between"
                  >
                    <div>
                      <p className='text-[10px] font-bold uppercase tracking-[0.18em] text-purple-400 mb-1'>Instant Dispatch</p>
                      <h3 className='text-2xl font-black text-white mb-6'>Request Verified Driver</h3>
                      <div className='bg-[#181926] border border-white/10 rounded-2xl p-5 space-y-3.5'>
                        {[
                          { icon: <Clock size={15} />, text: "Instant driver match response (<60 sec)" },
                          { icon: <Shield size={15} />, text: "Verified, top-rated drivers on call" },
                          { icon: <CreditCard size={15} />, text: "Pay cash or card after acceptance" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className='w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0'>{item.icon}</div>
                            <p className='text-zinc-300 text-xs font-medium'>{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={handleRequestBooking}
                      className="w-full h-14 mt-8 bg-white hover:bg-zinc-200 text-black font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-white/10"
                    >
                      <span>Request Ride Now</span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </motion.div>
                )}

                {status == "requested" && (
                  <motion.div
                    key="requested"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col flex-1 items-center justify-center gap-6 text-center py-8"
                  >
                    <div className='relative'>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-purple-600/40"
                      />
                      <div className='relative w-20 h-20 rounded-full bg-[#181926] border-2 border-purple-500/40 flex items-center justify-center text-purple-400'>
                        <Loader2 size={30} className='animate-spin' />
                      </div>
                    </div>
                    <div>
                      <h3 className='text-xl font-black text-white mb-1'>Contacting Nearby Driver</h3>
                      <p className='text-zinc-400 text-xs sm:text-sm font-medium'>Please hold while driver confirms request…</p>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors border border-white/15 hover:border-white/30 px-5 py-2.5 rounded-xl bg-white/5"
                    >
                      <XCircle size={14} /> Cancel Booking
                    </motion.button>
                  </motion.div>
                )}

                {status == "awaiting_payment" && (
                  <motion.div
                    key="awaiting_payment"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col flex-1 items-center justify-center gap-5 text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                      className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400"
                    >
                      <CheckCircle size={40} />
                    </motion.div>

                    <div>
                      <h3 className='text-xl font-black text-white mb-1'>Driver Accepted!</h3>
                      <p className='text-zinc-400 text-xs sm:text-sm font-medium'>Setting up payment portal…</p>
                    </div>
                    <div className='w-48 h-1.5 bg-[#181926] rounded-full overflow-hidden'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-emerald-400 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}

                {status == "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col flex-1 gap-6"
                  >
                    <div>
                      <p className='text-[10px] font-bold uppercase tracking-[0.18em] text-purple-400 mb-1'>Driver Assigned</p>
                      <h3 className='text-2xl font-black text-white'>Select Payment Option</h3>
                    </div>

                    <div className='space-y-3.5'>
                      {[
                        { id: "cash", Icon: Banknote, title: "Cash Payment", sub: "Pay driver directly after completion" },
                        { id: "online", Icon: Wallet, title: "Online Payment (Stripe)", sub: "Credit/Debit Card · Instant & Automated" }
                      ].map((p) => {
                        const active = paymentMethod == p.id
                        return (
                          <motion.div
                            key={p.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setPaymentMethod(p.id as any)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                              active
                                ? "bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                : "bg-[#181926] border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                              active ? "bg-purple-600 text-white" : "bg-white/5 text-zinc-400"
                            }`}>
                              <p.Icon size={18} />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className={`text-sm font-bold ${active ? "text-white" : "text-zinc-200"}`}>{p.title}</p>
                              <p className='text-xs text-zinc-400 mt-0.5'>{p.sub}</p>
                            </div>

                            {active && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <CheckCircle size={18} className="text-purple-400 flex-shrink-0" />
                              </motion.div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleConfirmPayment}
                      whileHover={paymentMethod ? { scale: 1.02 } : {}}
                      disabled={!paymentMethod}
                      className="w-full h-14 bg-white hover:bg-zinc-200 disabled:opacity-30 text-black font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-white/10 mt-auto"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin text-black" />
                      ) : paymentMethod == "cash" ? (
                        <>
                          <Banknote size={16} />
                          <span>Confirm Cash Ride</span>
                        </>
                      ) : (
                        <>
                          <span>Proceed to Stripe Checkout</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {status == "confirmed" && (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col flex-1 items-center justify-center gap-6 text-center py-6"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.1 }}
                      className="relative"
                    >
                      <div className='w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400'>
                        <CheckCircle size={48} />
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-1">Ride Confirmed!</h3>
                      <p className="text-zinc-400 text-xs sm:text-sm font-medium max-w-xs">
                        Your driver is on the way. Track live ride details from your dashboard.
                      </p>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => { window.location.href = `/user/ride/${booking._id}`; }}
                      className="flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl transition-all shadow-lg shadow-purple-600/30"
                    >
                      Track Your Ride <ArrowRight size={16} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CheckOutContent
