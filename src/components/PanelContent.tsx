'use client'
import { Bike, Car, Clock, IndianRupee, MessageCircle, Phone, Truck, User } from 'lucide-react'
import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import RideChat from './RideChat'

const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
        case 'bike':
            return <Bike size={18} className="text-purple-400" />;
        case 'auto':
            return <Car size={18} className="text-purple-400" />;
        case 'truck':
            return <Truck size={18} className="text-purple-400" />;
        case 'loading':
        case 'car':
        default:
            return <Car size={18} className="text-purple-400" />;
    }
};

interface PanelContentProps {
    isActive: boolean;
    displayDistance?: number;
    displayEta: number;
    cfg?: unknown;
    status?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    booking: any;
    paymentStatus?: { label: string };
    canChat?: boolean;
    chatOpen?: boolean;
    onChatToggle?: () => void;
    currentRole: "user" | "driver";
}

function PanelContent({ isActive, displayEta, booking, paymentStatus, canChat, chatOpen, onChatToggle, currentRole }: PanelContentProps) {
    return (
        <div className='flex flex-col pt-5 pb-4 gap-3 bg-[#0e0f17] text-white min-h-full'>
            {isActive && (
                <div className='mx-5 lg:mx-6 grid grid-cols-2 gap-2.5'>
                    <div className='bg-[#181926] border border-white/10 rounded-2xl p-4 flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center flex-shrink-0'>
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] text-zinc-400 uppercase tracking-wider font-bold'>ETA</p>
                            <p className='text-lg font-black text-white leading-none mt-0.5'>{Math.round(displayEta)} <span className='text-xs font-normal text-zinc-400 ml-0.5'>min</span></p>
                        </div>
                    </div>

                    <div className='bg-[#181926] border border-white/10 rounded-2xl p-4 flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center flex-shrink-0'>
                            <IndianRupee size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] text-zinc-400 uppercase tracking-wider font-bold'>Upfront Fare</p>
                            <p className='text-lg font-black text-amber-400 leading-none mt-0.5'>{booking.fare || "-"}</p>
                        </div>
                    </div>
                </div>
            )}

            {booking?.user && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mx-5 lg:mx-6"
                >
                    <div className='bg-[#13141f] border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-lg'>
                        <div className='relative flex-shrink-0'>
                            <div className='w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30'>
                                <User size={24} />
                            </div>
                            <div className='absolute -bottom-1 -right-1 bg-emerald-400 w-3.5 h-3.5 rounded-full border-2 border-[#13141f]' />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between gap-2'>
                                <p className='text-white font-bold text-base truncate'>{booking?.user?.name || "Customer"}</p>
                                <div className='flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full flex-shrink-0'>
                                    <IndianRupee size={10} className="text-amber-400" />
                                    <span className='text-amber-400 text-xs font-bold'>{booking.fare}</span>
                                </div>
                            </div>

                            {booking.paymentStatus && (
                                <div className='flex items-center gap-2 mt-1.5'>
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                                        booking.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    }`}>{paymentStatus?.label || booking.paymentStatus}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {isActive && (() => {
                        const targetPhone = currentRole === "user"
                            ? (booking.driverMobileNumber || booking.driver?.mobileNumber)
                            : (booking.userMobileNumber || booking.user?.mobileNumber);
                        const phoneLabel = currentRole === "user" ? "Call Driver" : "Call Customer";
                        return (
                            <div className='flex gap-2.5 mt-3'>
                                {targetPhone ? (
                                    <a
                                        href={`tel:${targetPhone}`}
                                        className={`flex items-center justify-center gap-2 bg-[#181926] hover:bg-[#202233] border border-white/10 text-white py-3 rounded-xl text-xs font-bold transition-all ${canChat ? "flex-1" : "w-full"}`}
                                    >
                                        <Phone size={14} className="text-emerald-400" /> {phoneLabel}
                                    </a>
                                ) : (
                                    <button
                                        disabled
                                        className={`flex items-center justify-center gap-2 bg-[#181926] border border-white/10 text-zinc-500 py-3 rounded-xl text-xs font-bold opacity-60 cursor-not-allowed ${canChat ? "flex-1" : "w-full"}`}
                                    >
                                        <Phone size={14} className="text-zinc-500" /> {phoneLabel} (N/A)
                                    </button>
                                )}
                                {canChat && (
                                    <button
                                        onClick={onChatToggle}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold transition-all ${
                                            chatOpen ? "bg-white text-black" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                                        }`}
                                    >
                                        <MessageCircle size={14} />
                                        {chatOpen ? "Close Chat" : "Live Chat"}
                                    </button>
                                )}
                            </div>
                        );
                    })()}
                </motion.div>
            )}

            <AnimatePresence>
                {chatOpen && canChat && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="mx-5 lg:mx-6 overflow-hidden"
                    >
                        <div className='rounded-2xl overflow-hidden border border-white/10 h-[440px] bg-[#12131c]'>
                            <RideChat currentRole={currentRole as "user" | "driver"} bookingId={booking._id} userName={booking?.user?.name || "Customer"} driverName={booking?.driver?.name || "Driver"} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {booking?.vehicle && (
                <div className='mx-5 lg:mx-6'>
                    <div className='bg-[#13141f] border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-md'>
                        <div className='w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0'>
                            {getVehicleIcon(booking.vehicle.type)}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-[9px] text-zinc-400 uppercase tracking-widest font-bold'>Vehicle Assigned</p>
                            <p className='text-xs font-bold text-white truncate mt-0.5'>{booking.vehicle.vehicleModel ?? "Vehicle"}</p>
                        </div>
                        <div className='flex-shrink-0 bg-[#181926] border border-white/15 px-3 py-1.5 rounded-lg'>
                            <p className='text-purple-300 text-xs font-mono font-bold tracking-widest uppercase'>{booking.vehicle.number ?? "No Plate"}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className='mx-5 lg:mx-6 mb-4'>
                <div className='bg-[#13141f] border border-white/10 rounded-2xl overflow-hidden shadow-md'>
                    <div className='flex gap-3 p-4 border-b border-white/10'>
                        <div className='flex flex-col items-center flex-shrink-0 pt-1'>
                            <div className='w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' />
                            <div className='w-px bg-white/20 my-1' style={{ height: 16 }} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5'>Pickup Location</p>
                            <p className='text-xs text-white leading-snug font-medium'>{booking?.pickUpAddress}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4'>
                        <div className='flex flex-col items-center flex-shrink-0 pt-1'>
                            <div className='w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5'>Dropoff Destination</p>
                            <p className='text-xs text-white leading-snug font-medium'>{booking?.dropAddress}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PanelContent
