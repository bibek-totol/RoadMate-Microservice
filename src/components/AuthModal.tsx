'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { CircleDashed, Lock, Mail, User, X } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'

type propType = {
    open: boolean,
    onClose: () => void
}
type stepType = "login" | "signup" | "otp"

function AuthModal({ open, onClose }: propType) {
    const [step, setStep] = useState<stepType>("login")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])

    const session = useSession()

    const handleSignUp = async () => {
        setLoading(true)
        try {
            await axios.post("/api/auth/register", {
                name, email, password
            })
            setErr("")
            setStep("otp")
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            setErr(error.response?.data?.message ?? "Something went wrong")
        }
    }

    const handleVerifyEmail = async () => {
        setLoading(true)
        try {
            await axios.post("/api/auth/verify-email", {
                email, otp: otp.join("")
            })
            setOtp(["", "", "", "", "", ""])
            setErr("")
            setStep("login")
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            setErr(error.response?.data?.message ?? "Something went wrong")
        }
    }

    const handleLogin = async () => {
        setLoading(true)
        const res = await signIn("credentials", {
            email, password, redirect: false
        })
        setLoading(false)
        if (res?.error) {
            setErr("Invalid email or password")
        } else {
            onClose()
        }
    }

    const handleGoogleLogin = async () => {
        await signIn("google", {
            callbackUrl: "/"
        })
    }

    const handleChangeOtp = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return
        const updated = [...otp]
        updated[index] = value
        setOtp(updated)

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`)?.focus()
        }
        if (!value && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-md"
                    />

                    {/* Modal Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-md bg-[#12131c] border border-white/15 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(168,85,247,0.15)] p-6 sm:p-8 text-white">
                            {/* Close Button */}
                            <button
                                className="absolute right-4 top-4 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
                                onClick={onClose}
                            >
                                <X size={16} />
                            </button>

                            {/* Header */}
                            <div className="mb-6 text-center">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-2.5 border border-purple-500/30 shadow-xs">
                                    RoadMate Account
                                </span>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {step === "login" ? "Welcome Back" : step === "signup" ? "Create Account" : "Verify Email"}
                                </h2>
                                <p className="mt-1 text-xs text-zinc-400 font-normal">
                                    {step === "login" ? "Sign in to access your bookings & rides" : step === "signup" ? "Join RoadMate for instant multi-vendor vehicle booking" : "Enter the verification code sent to your email"}
                                </p>
                            </div>

                            {step !== "otp" && (
                                <>
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-full h-10 rounded-xl border border-white/15 bg-[#1a1b28] hover:bg-[#232538] flex items-center justify-center gap-2.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                                    >
                                        <Image src="/google.png" alt="Google" width={16} height={16} />
                                        Continue with Google
                                    </button>

                                    <div className="flex items-center gap-3 my-5">
                                        <div className="flex-1 h-px bg-white/10" />
                                        <span className="text-[10px] uppercase font-bold text-zinc-400">or email</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>
                                </>
                            )}

                            {/* Forms */}
                            {step === "login" && (
                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2.5 border border-white/15 rounded-xl px-3.5 py-2.5 bg-[#1a1b28] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/40 transition">
                                            <Mail size={16} className="text-zinc-400 shrink-0" />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                className="w-full bg-transparent outline-none text-xs font-medium text-white placeholder:text-zinc-500"
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2.5 border border-white/15 rounded-xl px-3.5 py-2.5 bg-[#1a1b28] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/40 transition">
                                            <Lock size={16} className="text-zinc-400 shrink-0" />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className="w-full bg-transparent outline-none text-xs font-medium text-white placeholder:text-zinc-500"
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                            />
                                        </div>

                                        {err && <p className="text-red-400 text-xs font-semibold px-1">*{err}</p>}

                                        <button
                                            onClick={handleLogin}
                                            disabled={loading}
                                            className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center justify-center shadow-lg shadow-purple-600/30 mt-1 cursor-pointer"
                                        >
                                            {!loading ? "Sign In" : <CircleDashed size={16} className="animate-spin text-white" />}
                                        </button>
                                    </div>

                                    <p className="mt-5 text-center text-xs text-zinc-400 font-normal">
                                        Don’t have an account?{" "}
                                        <button onClick={() => { setErr(""); setStep("signup"); }} className="text-purple-400 font-semibold hover:underline cursor-pointer">
                                            Sign Up
                                        </button>
                                    </p>
                                </motion.div>
                            )}

                            {step === "signup" && (
                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2.5 border border-white/15 rounded-xl px-3.5 py-2.5 bg-[#1a1b28] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/40 transition">
                                            <User size={16} className="text-zinc-400 shrink-0" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                className="w-full bg-transparent outline-none text-xs font-medium text-white placeholder:text-zinc-500"
                                                onChange={(e) => setName(e.target.value)}
                                                value={name}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2.5 border border-white/15 rounded-xl px-3.5 py-2.5 bg-[#1a1b28] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/40 transition">
                                            <Mail size={16} className="text-zinc-400 shrink-0" />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                className="w-full bg-transparent outline-none text-xs font-medium text-white placeholder:text-zinc-500"
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2.5 border border-white/15 rounded-xl px-3.5 py-2.5 bg-[#1a1b28] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/40 transition">
                                            <Lock size={16} className="text-zinc-400 shrink-0" />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className="w-full bg-transparent outline-none text-xs font-medium text-white placeholder:text-zinc-500"
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                            />
                                        </div>

                                        {err && <p className="text-red-400 text-xs font-semibold px-1">*{err}</p>}

                                        <button
                                            onClick={handleSignUp}
                                            disabled={loading}
                                            className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center justify-center shadow-lg shadow-purple-600/30 mt-1 cursor-pointer"
                                        >
                                            {!loading ? "Send OTP Code" : <CircleDashed size={16} className="animate-spin text-white" />}
                                        </button>
                                    </div>

                                    <p className="mt-5 text-center text-xs text-zinc-400 font-normal">
                                        Already have an account?{" "}
                                        <button onClick={() => { setErr(""); setStep("login"); }} className="text-purple-400 font-semibold hover:underline cursor-pointer">
                                            Sign In
                                        </button>
                                    </p>
                                </motion.div>
                            )}

                            {step === "otp" && (
                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="mt-2 flex justify-center gap-2">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                id={`otp-${i}`}
                                                value={digit}
                                                maxLength={1}
                                                className="w-10 h-12 text-center text-base font-bold rounded-xl bg-[#1a1b28] border border-white/15 text-white focus:border-purple-500 outline-none transition"
                                                onChange={(e) => handleChangeOtp(i, e.target.value)}
                                            />
                                        ))}
                                    </div>

                                    {err && <p className="text-red-400 text-xs font-semibold text-center mt-3">*{err}</p>}

                                    <button
                                        onClick={handleVerifyEmail}
                                        disabled={loading}
                                        className="mt-5 w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex justify-center items-center transition shadow-lg shadow-purple-600/30 cursor-pointer"
                                    >
                                        {!loading ? "Verify OTP & Create Account" : <CircleDashed size={16} className="animate-spin text-white" />}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default AuthModal
