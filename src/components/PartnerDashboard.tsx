'use client'
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { motion } from "motion/react"
import { ArrowRight, Check, Clock, Lock, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RejectionCard from './RejectionCard';
import StatusCard from './StatusCard';
import ActionCard from './ActionCard';
import axios from 'axios';
import PricingModal from './PricingModal';
import { IVehicle } from '@/models/vehicle.model';
import PartnerEarning from './PartnerEarning';

type Step = {
    id: number,
    title: string,
    route?: string
};

const STEPS: Step[] = [
    { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
    { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
    { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
    { id: 4, title: "Review" },
    { id: 5, title: "Video KYC" },
    { id: 6, title: "Pricing" },
    { id: 7, title: "Final Review" },
    { id: 8, title: "Live", route: "/partner/bookings" },
];

const TOTAL_STEPS = STEPS.length;

function PartnerDashboard() {
    const [activeStep, setActiveStep] = useState(0)
    const { userData } = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const [requestLoading, setRequestLoading] = useState(false)
    const [showPricing, setShowPricing] = useState(false)
    const [vehicleData, setVehicleData] = useState<IVehicle | null>(null)

    useEffect(() => {
        if (userData) {
            setActiveStep(userData.partnerOnBoardingSteps + 1)
        }
    }, [userData])

    const handleGetPricing = async () => {
        try {
            const { data } = await axios.get("/api/partner/onboarding/pricing")
            setVehicleData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetPricing()
    }, [])

    const goToStep = (step: Step) => {
        if (step.id === 6 && userData?.partnerStatus === "approved" && userData.videoKycStatus === "approved") {
            setShowPricing(true)
            return;
        }
        if (step.route && step.id <= activeStep) {
            router.push(step.route)
        }
    }

    const progressPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100

    return (
        <div className="min-h-screen bg-[#0b0c10] text-white px-4 py-12 sm:py-16 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">
                {/* Header Title */}
                <div>
                   
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Vehicle Partner <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 text-transparent bg-clip-text">Onboarding</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1 max-w-xl">
                        Complete your verification steps to start accepting rides and receiving daily payouts.
                    </p>
                </div>

                {/* Progress Stepper Card */}
                <div className="bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-x-auto">
                    <div className="relative min-w-[700px]">
                        <div className="absolute top-6 left-0 w-full h-[2px] bg-white/10 rounded-full" />
                        <motion.div
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5 }}
                            className="absolute top-6 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.6)] rounded-full"
                        />
                        <div className="relative flex justify-between">
                            {STEPS.map((s) => {
                                const completed = s.id < activeStep
                                const active = s.id === activeStep
                                const locked = s.id > activeStep

                                return (
                                    <motion.div
                                        key={s.id}
                                        whileHover={!locked ? { scale: 1.05 } : {}}
                                        onClick={() => goToStep(s)}
                                        className="flex flex-col items-center z-10 cursor-pointer"
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs transition-all border
                                                     ${completed || activeStep==8
                                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                                    : active
                                                        ? "border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                                                        : "border-white/10 text-gray-500 bg-white/5"
                                                }`}
                                        >
                                            {completed || activeStep==8 ? (
                                                <Check size={18} />
                                            ) : locked ? (
                                                <Lock size={16} />
                                            ) : (
                                                s.id
                                            )}
                                        </div>
                                        <p className={`mt-2 text-xs font-semibold text-center ${active ? "text-purple-300 font-bold" : completed ? "text-white" : "text-gray-500"}`}>
                                            {s.title}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Step Status Cards */}
                {activeStep === 4 && userData?.partnerStatus === "rejected" && (
                    <RejectionCard
                        title="Partner Registration Rejected"
                        reason={userData.rejectionReason}
                        actionLabel="Review & Update Registration"
                        onAction={() => router.push("/partner/onboarding/vehicle")}
                    />
                )}

                {activeStep === 4 && userData?.partnerStatus === "pending" && (
                    <StatusCard
                        icon={<Clock size={18} />}
                        title="Documents Under Verification"
                        desc="Our team is reviewing your vehicle ownership and identity documents."
                    />
                )}

                {activeStep === 5 && (
                    userData?.videoKycStatus === "approved" ? (
                        <StatusCard
                            icon={<Check size={18} />}
                            title="Video KYC Verification Approved"
                            desc="Proceed to set your per-KM fares and waiting rates."
                        />
                    ) : userData?.videoKycStatus === "rejected" ? (
                        <RejectionCard
                            title="Video KYC Verification Rejected"
                            reason={userData?.videoKycRejectionReason}
                            actionLabel={requestLoading ? "Requesting Call..." : "Request Again"}
                            onAction={async () => {
                                setRequestLoading(true)
                                await axios.get("/api/partner/video-kyc/request")
                                setRequestLoading(false)
                            }}
                        />
                    ) : userData?.videoKycStatus === "in_progress" && userData?.videoKycRoomId ? (
                        <ActionCard
                            icon={<Video size={18} />}
                            title="Live Video KYC Started by Admin"
                            button="Join Video KYC Call"
                            onclick={() => router.push(`/video-kyc/${userData.videoKycRoomId}`)}
                        />
                    ) : (
                        <StatusCard
                            icon={<Clock size={20} />}
                            title="Awaiting Video Verification"
                            desc="An admin will initiate your brief Video KYC session shortly."
                        />
                    )
                )}

                {activeStep === 7 && vehicleData?.status === "pending" && (
                    <StatusCard
                        icon={<Clock size={20} />}
                        title="Vehicle Pricing Under Review"
                        desc="Admin is reviewing your pricing strategy."
                    />
                )}

                {activeStep === 7 && vehicleData?.status === "rejected" && (
                    <RejectionCard
                        title="Vehicle Pricing Rejected"
                        reason={vehicleData.rejectionReason}
                        actionLabel="Edit & Resubmit Fares"
                        onAction={() => setShowPricing(true)}
                    />
                )}

                {activeStep === 8 && vehicleData?.status === "approved" && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-[#0d0e15] border border-purple-500/30 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(147,51,234,0.25)] flex flex-col sm:flex-row items-center justify-between gap-6"
                    >
                        <div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold uppercase tracking-wider">
                                Active Partner
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
                                 Your Vehicle is Live on RoadMate!
                            </h2>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                You are ready to accept rider requests and earn daily.
                            </p>
                        </div>

                        <Link
                            href="/partner/bookings"
                            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-[0_0_20px_rgba(147,51,234,0.4)] shrink-0 cursor-pointer"
                        >
                            <span>Go to Bookings</span>
                            <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                )}

                {/* Earnings Section */}
                <PartnerEarning />
            </div>

            <PricingModal
                open={showPricing}
                onClose={() => setShowPricing(false)}
                data={vehicleData}
            />
        </div>
    )
}

export default PartnerDashboard
