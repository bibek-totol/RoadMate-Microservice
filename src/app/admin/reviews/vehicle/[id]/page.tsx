'use client'
import { IUser } from '@/models/user.model'
import { vehicleType } from '@/models/vehicle.model'
import axios from 'axios'
import { ArrowLeft, CheckCircle, CircleDashed, Clock, ImageIcon, IndianRupee, ShieldCheck, Truck, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import AnimatedCard from '@/components/AnimatedCard'

interface IVehicle {
    owner: IUser
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

function page() {
    const { id } = useParams()
    const [data, setData] = useState<IVehicle>()
    const router = useRouter()
    const [showApprove, setShowApprove] = useState(false)
    const [showReject, setShowReject] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const [approveLoading, setApproveLoading] = useState(false)
    const [rejectLoading, setRejectLoading] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const result = await axios.get(`/api/admin/reviews/vehicle/${id}`)
                setData(result.data)
                setLoading(false)
            } catch (error: any) {
                console.log(error.response?.data?.message ?? error)
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center text-gray-700 bg-gray-50 font-medium">
                Loading Vehicle...
            </div>
        )
    }

    const handleApprove = async () => {
        setApproveLoading(true)
        try {
            const { data } = await axios.get(`/api/admin/reviews/vehicle/${id}/approve`)
            console.log(data)
            setApproveLoading(false)
            router.push("/")
        } catch (error) {
            console.log(error)
            setApproveLoading(false)
        }
    }

    const handleReject = async () => {
        setRejectLoading(true)
        try {
            const { data } = await axios.post(`/api/admin/reviews/vehicle/${id}/reject`, {
                reason: rejectionReason
            })
            console.log(data)
            setRejectLoading(false)
            router.push("/")
        } catch (error) {
            console.log(error)
            setRejectLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-900'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>
                    <button className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-800 transition' onClick={() => router.back()}>
                        <ArrowLeft size={18} />
                    </button>
                    <div className='flex-1'>
                        <div className='font-bold text-lg text-gray-900'>{data?.owner.name}</div>
                        <div className='text-xs font-medium text-gray-600'>{data?.owner.email}</div>
                    </div>
                    {
                        data?.status === "approved" ? (
                            <div className='px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200'>
                                <CheckCircle size={14} />
                                Approved
                            </div>
                        ) : data?.status === "rejected" ? (
                            <div className='px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 bg-rose-100 text-rose-800 border border-rose-200'>
                                <XCircle size={14} />
                                Rejected
                            </div>
                        ) : (
                            <div className='px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-200'>
                                <Clock size={14} />
                                Pending Review
                            </div>
                        )
                    }
                </div>
            </div>

            <main className='max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-200"
                >
                    {data?.imageUrl ? (
                        <img src={data.imageUrl} alt="vehicle" className='w-full h-[450px] object-cover' />
                    ) : (
                        <div className='h-[450px] grid place-items-center text-gray-400 font-medium'>
                            <ImageIcon size={32} />
                            <span>No Image Uploaded</span>
                        </div>
                    )}
                </motion.div>
                <div className='space-y-8'>
                    <AnimatedCard title={"Vehicle Details"} icon={<Truck size={18} className="text-purple-600" />}>
                        <div className='flex justify-between text-sm py-1 border-b border-gray-100'>
                            <span className='text-gray-600 font-medium'>Vehicle Type</span>
                            <span className='font-bold text-gray-900 capitalize'>{data?.type || "-"}</span>
                        </div>

                        <div className='flex justify-between text-sm py-1 border-b border-gray-100'>
                            <span className='text-gray-600 font-medium'>Registration Number</span>
                            <span className='font-bold text-gray-900 uppercase font-mono'>{data?.number || "-"}</span>
                        </div>
                        <div className='flex justify-between text-sm py-1'>
                            <span className='text-gray-600 font-medium'>Model</span>
                            <span className='font-bold text-gray-900'>{data?.vehicleModel || "-"}</span>
                        </div>
                    </AnimatedCard>

                    <AnimatedCard title={"Pricing Configuration"} icon={<IndianRupee size={18} className="text-purple-600" />}>
                        <div className='flex justify-between text-sm py-1 border-b border-gray-100'>
                            <span className='text-gray-600 font-medium'>Base Fare</span>
                            <span className='font-bold text-gray-900 flex items-center font-mono'>৳{data?.baseFare || 0}</span>
                        </div>

                        <div className='flex justify-between text-sm py-1 border-b border-gray-100'>
                            <span className='text-gray-600 font-medium'>Price Per KM</span>
                            <span className='font-bold text-gray-900 flex items-center font-mono'>৳{data?.pricePerKM || 0}</span>
                        </div>
                        <div className='flex justify-between text-sm py-1'>
                            <span className='text-gray-600 font-medium'>Waiting Charge</span>
                            <span className='font-bold text-gray-900 flex items-center font-mono'>৳{data?.waitingCharge || "-"}</span>
                        </div>
                    </AnimatedCard>

                    {data?.status == "pending" && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[32px] p-8 shadow-xl space-y-6 text-gray-900 border border-gray-100"
                        >
                            <div className='flex items-center gap-2 font-bold text-gray-900 text-base'>
                                <ShieldCheck size={18} className="text-emerald-600" />
                                Admin Check
                            </div>
                            <p className='text-sm text-gray-600 font-medium'>
                                Verify details carefully before approving.
                            </p>

                            <div className='flex flex-col gap-4'>
                                <button
                                    className='py-3.5 rounded-2xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition shadow-md'
                                    onClick={() => setShowApprove(true)}
                                >
                                    Approve Vehicle
                                </button>

                                <button
                                    className='py-3.5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition shadow-sm'
                                    onClick={() => setShowReject(true)}
                                >
                                    Reject Vehicle
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            <AnimatePresence>
                {showApprove && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white text-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                        >
                            <h2 className='text-lg font-bold text-gray-900'>Approve Vehicle?</h2>
                            <p className='text-sm text-gray-600 mt-2 font-medium'>Confirm all vehicle pricing and details.</p>
                            <div className='flex gap-3 mt-6'>
                                <button className='flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-800 font-semibold hover:bg-gray-100 transition' onClick={() => setShowApprove(false)}>Cancel</button>
                                <button className='flex-1 flex items-center justify-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md'
                                    onClick={handleApprove}
                                    disabled={approveLoading}
                                >{approveLoading ? <CircleDashed className='text-white animate-spin' /> : "Yes, Approve"}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showReject && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white text-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                        >
                            <h2 className='text-lg font-bold text-gray-900'>Reject Vehicle?</h2>
                            <div className='mt-2'>
                                <p className='text-sm text-gray-600 font-medium mb-2'>Provide a reason for rejection:</p>
                                <textarea
                                    placeholder="Enter rejection reason (required)"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows={3}
                                />
                            </div>
                            <div className='flex gap-3 mt-6'>
                                <button className='flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-800 font-semibold hover:bg-gray-100 transition' onClick={() => setShowReject(false)}>Cancel</button>
                                <button className='flex-1 py-2.5 flex items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-md' onClick={handleReject} disabled={rejectLoading}>{rejectLoading ? <CircleDashed className='text-white animate-spin' /> : "Reject"}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default page
