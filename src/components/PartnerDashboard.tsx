'use client'
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { motion } from "motion/react"
import { ArrowRight, Check, Clock, Lock, Video, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    { id: 8, title: "Live" },
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
        <div className="min-h-screen bg-background border-t border-border px-4 py-12 sm:py-16 text-foreground">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header Title */}
                <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-secondary-foreground border border-border text-xs font-semibold uppercase tracking-wider mb-2">
                        <ShieldCheck size={14} />
                        Partner Onboarding Portal
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        Vehicle Partner Onboarding
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Complete your verification steps to start accepting rides and receiving daily payouts.
                    </p>
                </div>

                {/* Progress Stepper Card */}
                <div className="bg-card rounded-xl p-6 sm:p-8 shadow-xs border border-border overflow-x-auto">
                    <div className="relative min-w-[700px]">
                        <div className="absolute top-6 left-0 w-full h-[2px] bg-border rounded-full" />
                        <motion.div
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5 }}
                            className="absolute top-6 left-0 h-[2px] bg-primary rounded-full"
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
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xs transition-all border
                                                     ${completed
                                                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                                    : active
                                                        ? "border-primary bg-background text-primary shadow-xs"
                                                        : "border-border text-muted-foreground bg-muted"
                                                }`}
                                        >
                                            {completed ? (
                                                <Check size={18} />
                                            ) : locked ? (
                                                <Lock size={16} />
                                            ) : (
                                                s.id
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs font-semibold text-center text-foreground">{s.title}</p>
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
                        className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                        <div>
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                                Active Partner
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-2 text-foreground">
                                🚀 Your Vehicle is Live on RoadMate!
                            </h2>
                            <p className="text-muted-foreground text-xs mt-1">
                                You are ready to accept rider requests and earn daily.
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/partner/bookings')}
                            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition shadow-xs shrink-0"
                        >
                            <span>Go to Bookings</span>
                            <ArrowRight size={14} />
                        </button>
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
