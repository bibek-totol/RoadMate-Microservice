'use client'
import { IVehicle } from '@/models/vehicle.model'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ImagePlus, X, CircleDashed, Check } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type PropsType = {
    open: boolean,
    onClose: () => void,
    data: IVehicle | null
}

function PricingModal({ open, onClose, data }: PropsType) {
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [baseFare, setBaseFare] = useState("")
    const [pricePerKM, setPricePerKM] = useState("")
    const [waitingCharge, setWaitingCharge] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (data) {
            setPreview(data?.imageUrl || null)
            setBaseFare(data.baseFare?.toString() || "")
            setPricePerKM(data.pricePerKM?.toString() || "")
            setWaitingCharge(data.waitingCharge?.toString() || "")
        }
    }, [data])

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("baseFare", baseFare)
            formData.append("waitingCharge", waitingCharge)
            formData.append("pricePerKM", pricePerKM)
            if (image) {
                formData.append("image", image)
            }

            const res = await axios.post("/api/partner/onboarding/pricing", formData)
            console.log(res.data)
            setLoading(false)
            onClose()
            router.refresh()
        } catch (error: any) {
            console.log(error.response?.data?.message ?? error)
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white text-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className='px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80'>
                            <div>
                                <h2 className='text-lg font-extrabold text-gray-900 tracking-tight'>Pricing & Vehicle Image</h2>
                                <p className='text-xs text-gray-500 font-medium mt-0.5'>Configure your fare rates and upload vehicle photo</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className='p-6 space-y-5'>
                            <div>
                                <label className='block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2'>
                                    Vehicle Image
                                </label>
                                <label htmlFor='imageLabel' className='relative h-44 border-2 border-dashed border-gray-300 hover:border-purple-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-purple-50/40 transition group overflow-hidden'>
                                    {!preview ? (
                                        <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-purple-600 transition">
                                            <ImagePlus size={32} />
                                            <span className="text-xs font-bold">Click to Upload Vehicle Photo</span>
                                            <span className="text-[10px] text-gray-400">JPG, PNG, WebP up to 5MB</span>
                                        </div>
                                    ) : (
                                        <>
                                            <img src={preview} alt="Vehicle Preview" className='absolute inset-0 w-full h-full object-cover' />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-2">
                                                <ImagePlus size={18} /> Change Photo
                                            </div>
                                        </>
                                    )}

                                    <input
                                        type='file'
                                        accept='image/*'
                                        id='imageLabel'
                                        hidden
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setImage(e.target.files[0])
                                                setPreview(URL.createObjectURL(e.target.files[0]))
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            {/* Base Fare */}
                            <div>
                                <label className='block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5'>
                                    Base Fare (৳)
                                </label>
                                <div className='flex items-center gap-2.5 border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition'>
                                    <span className='font-bold text-gray-500 text-sm'>৳</span>
                                    <input
                                        type="number"
                                        placeholder='Enter base fare'
                                        value={baseFare}
                                        onChange={(e) => setBaseFare(e.target.value)}
                                        className='w-full outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400 bg-transparent'
                                    />
                                </div>
                            </div>

                            {/* Price Per KM */}
                            <div>
                                <label className='block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5'>
                                    Price Per KM (৳)
                                </label>
                                <div className='flex items-center gap-2.5 border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition'>
                                    <span className='font-bold text-gray-500 text-sm'>৳</span>
                                    <input
                                        type="number"
                                        placeholder='Enter price per KM'
                                        value={pricePerKM}
                                        onChange={(e) => setPricePerKM(e.target.value)}
                                        className='w-full outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400 bg-transparent'
                                    />
                                </div>
                            </div>

                            {/* Waiting Charge */}
                            <div>
                                <label className='block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5'>
                                    Waiting Charge (৳ / hour)
                                </label>
                                <div className='flex items-center gap-2.5 border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition'>
                                    <span className='font-bold text-gray-500 text-sm'>৳</span>
                                    <input
                                        type="number"
                                        placeholder='Enter waiting charge'
                                        value={waitingCharge}
                                        onChange={(e) => setWaitingCharge(e.target.value)}
                                        className='w-full outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400 bg-transparent'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='px-6 py-4 border-t border-gray-200 flex gap-3 bg-gray-50/80'>
                            <button
                                className='flex-1 border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-xl py-2.5 text-sm transition cursor-pointer shadow-xs'
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className='flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl py-2.5 text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50'
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <CircleDashed className='animate-spin text-white' size={16} />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Pricing</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PricingModal
