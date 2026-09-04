'use client'
import axios from 'axios'
import React, { useEffect, useState, useCallback } from 'react'
import {
    Calendar, Search, ChevronLeft, ChevronRight,
    Mail, Phone, CheckCircle2, XCircle, Clock, Car,
    TrendingUp, RefreshCw, AlertCircle, MapPin, DollarSign, User, ShieldCheck, Tag
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

type BookingStatus = "all" | "requested" | "awaiting_payment" | "confirmed" | "started" | "completed" | "cancelled" | "rejected" | "expired"

interface BookingRow {
    _id: string
    user: {
        _id: string
        name: string
        email: string
        mobileNumber?: string
    } | null
    driver: {
        _id: string
        name: string
        email: string
        mobileNumber?: string
    } | null
    vehicle: {
        _id: string
        type: string
        vehicleModel: string
        number: string
        imageUrl?: string
        baseFare?: number
        pricePerKM?: number
    } | null
    pickUpAddress: string
    dropAddress: string
    fare: number
    adminCommission: number
    partnerAmount: number
    userMobileNumber: string
    driverMobileNumber: string
    bookingStatus: BookingStatus
    paymentStatus: string
    pickUpOtp?: string
    dropOtp?: string
    createdAt: string
    updatedAt: string
}

const statusBadgeStyle = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        case 'started':
        case 'confirmed':
            return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'requested':
        case 'awaiting_payment':
            return 'bg-amber-100 text-amber-700 border-amber-200'
        case 'cancelled':
        case 'rejected':
        case 'expired':
            return 'bg-red-100 text-red-700 border-red-200'
        default:
            return 'bg-gray-100 text-gray-600 border-gray-200'
    }
}

const StatusIcon = ({ s }: { s: string }) => {
    if (s === 'completed') return <CheckCircle2 size={12} className="text-emerald-600" />
    if (s === 'cancelled' || s === 'rejected' || s === 'expired') return <XCircle size={12} className="text-red-500" />
    return <Clock size={12} className="text-amber-500" />
}

export default function AdminBookings() {
    const [statusFilter, setStatusFilter] = useState<BookingStatus>("all")
    const [bookings, setBookings] = useState<BookingRow[]>([])
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(1)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<BookingRow | null>(null)

    const fetchBookings = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await axios.get('/api/admin/bookings', {
                params: { status: statusFilter, page, search: query }
            })
            setBookings(data.bookings || [])
            setTotal(data.total || 0)
            setPages(data.pages || 1)
        } catch (err) {
            console.error("Failed to fetch admin bookings:", err)
            setBookings([])
            setTotal(0)
            setPages(1)
        } finally {
            setLoading(false)
        }
    }, [statusFilter, page, query])

    useEffect(() => { fetchBookings() }, [fetchBookings])

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setQuery(search); setPage(1) }, 400)
        return () => clearTimeout(t)
    }, [search])

    const handleFilterChange = (status: BookingStatus) => {
        setStatusFilter(status)
        setPage(1)
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="text-purple-600" size={20} />
                        Vehicle Bookings & Rides
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Track every vehicle booking, fare breakdown, customer and partner details across RoadMate
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100 rounded-xl w-fit text-xs font-semibold">
                {(["all", "requested", "confirmed", "started", "completed", "cancelled"] as BookingStatus[]).map((st) => (
                    <button
                        key={st}
                        onClick={() => handleFilterChange(st)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-all ${statusFilter === st
                            ? 'bg-white shadow text-gray-900 font-bold'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {st}
                    </button>
                ))}
            </div>

            {/* Search + Refresh */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by customer, driver, vehicle, address or ID…"
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400/40 placeholder:text-gray-400"
                    />
                </div>
                <button
                    onClick={fetchBookings}
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-500"
                    title="Refresh Bookings"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Bookings Table / List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-[1.8fr_2fr_2fr_1.5fr_1.2fr_1fr] text-[11px] font-bold uppercase tracking-wider text-gray-400 px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <span>Customer & Driver</span>
                    <span>Vehicle & Route</span>
                    <span>Pickup & Drop Address</span>
                    <span>Status & Payment</span>
                    <span>Fare Breakdown</span>
                    <span>Actions</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2 text-sm">
                        <RefreshCw size={16} className="animate-spin" /> Loading vehicle bookings…
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                        <AlertCircle size={32} className="text-gray-300" />
                        <p className="text-sm">No vehicle bookings found matching your search</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${statusFilter}-${page}-${query}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            {bookings.map((b, i) => (
                                <div
                                    key={b._id}
                                    onClick={() => setSelected(b)}
                                    className="grid items-center grid-cols-[1.8fr_2fr_2fr_1.5fr_1.2fr_1fr] px-5 py-4 text-xs cursor-pointer hover:bg-purple-50/60 transition border-b border-gray-50 last:border-0"
                                    style={{ animationDelay: `${i * 25}ms` }}
                                >
                                    {/* Customer & Driver */}
                                    <div className="space-y-1 pr-2 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <User size={12} className="text-blue-500 shrink-0" />
                                            <span className="font-semibold text-gray-800 truncate">{b.user?.name || "Customer"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                            <Car size={12} className="text-purple-500 shrink-0" />
                                            <span className="truncate">{b.driver?.name || "Driver Unassigned"}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-mono">ID: #{b._id.slice(-6)}</p>
                                    </div>

                                    {/* Vehicle Info */}
                                    <div className="space-y-0.5 pr-2 min-w-0">
                                        {b.vehicle ? (
                                            <>
                                                <p className="font-bold text-gray-800 capitalize truncate">
                                                    {b.vehicle.type} · {b.vehicle.vehicleModel}
                                                </p>
                                                <span className="font-mono text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100 w-fit block">
                                                    {b.vehicle.number}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400 italic">No Vehicle Info</span>
                                        )}
                                        <p className="text-[10px] text-gray-400">
                                            {new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>

                                    {/* Pickup & Drop Address */}
                                    <div className="space-y-1 pr-2 min-w-0">
                                        <div className="flex items-center gap-1 text-gray-700">
                                            <MapPin size={12} className="text-green-500 shrink-0" />
                                            <span className="truncate text-[11px] font-medium">{b.pickUpAddress}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-700">
                                            <MapPin size={12} className="text-red-500 shrink-0" />
                                            <span className="truncate text-[11px] font-medium">{b.dropAddress}</span>
                                        </div>
                                    </div>

                                    {/* Status & Payment */}
                                    <div className="space-y-1">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${statusBadgeStyle(b.bookingStatus)}`}>
                                            <StatusIcon s={b.bookingStatus} />
                                            {b.bookingStatus.replace('_', ' ')}
                                        </span>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold">
                                            Payment: <span className={b.paymentStatus === 'paid' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{b.paymentStatus}</span>
                                        </p>
                                    </div>

                                    {/* Fare Breakdown */}
                                    <div>
                                        <p className="font-extrabold text-gray-900 text-sm">৳{b.fare}</p>
                                        <p className="text-[10px] text-gray-400">
                                            Admin: <span className="font-semibold text-purple-600">৳{b.adminCommission || 0}</span>
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    <div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelected(b); }}
                                            className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 font-semibold text-[11px] transition shadow-xs"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} bookings</span>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-7 h-7 rounded-lg border text-[11px] font-semibold transition ${p === page ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            disabled={page >= pages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Slide-In Full Booking Detail Drawer */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            onClick={() => setSelected(null)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            <div className="h-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600" />

                            <div className="p-6 space-y-6 text-gray-800">
                                {/* Header */}
                                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                                            Vehicle Booking Details
                                        </span>
                                        <h3 className="font-bold text-gray-900 text-lg mt-1.5">
                                            Booking #{selected._id}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            Created on {new Date(selected.createdAt).toLocaleString('en-GB')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition font-bold"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Status & Payment Overview */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ride Status</p>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold capitalize mt-1.5 ${statusBadgeStyle(selected.bookingStatus)}`}>
                                            <StatusIcon s={selected.bookingStatus} />
                                            {selected.bookingStatus.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payment Status</p>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold uppercase mt-1.5 ${selected.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                            <ShieldCheck size={13} />
                                            {selected.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer & Driver Info */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                        <User size={14} className="text-purple-600" /> Customer & Driver Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                                        <div className="space-y-1 border-r border-gray-200/60 pr-2">
                                            <p className="text-[10px] text-blue-600 font-bold uppercase">User / Customer</p>
                                            <p className="font-bold text-gray-900">{selected.user?.name || "N/A"}</p>
                                            <p className="text-gray-500 flex items-center gap-1"><Mail size={11} /> {selected.user?.email}</p>
                                            <p className="text-gray-500 flex items-center gap-1"><Phone size={11} /> {selected.userMobileNumber || selected.user?.mobileNumber || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1 pl-1">
                                            <p className="text-[10px] text-purple-600 font-bold uppercase">Partner / Driver</p>
                                            <p className="font-bold text-gray-900">{selected.driver?.name || "Unassigned"}</p>
                                            <p className="text-gray-500 flex items-center gap-1"><Mail size={11} /> {selected.driver?.email || "N/A"}</p>
                                            <p className="text-gray-500 flex items-center gap-1"><Phone size={11} /> {selected.driverMobileNumber || selected.driver?.mobileNumber || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Information */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                        <Car size={14} className="text-purple-600" /> Vehicle Information
                                    </h4>
                                    {selected.vehicle ? (
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-extrabold text-gray-900 text-sm capitalize">{selected.vehicle.type} · {selected.vehicle.vehicleModel}</p>
                                                    <p className="font-mono text-purple-700 font-bold mt-0.5">{selected.vehicle.number}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-400 italic">No vehicle assigned</div>
                                    )}
                                </div>

                                {/* Pickup & Drop Route */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                        <MapPin size={14} className="text-purple-600" /> Trip Locations
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-3">
                                        <div className="flex items-start gap-2.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Pickup Address</p>
                                                <p className="font-semibold text-gray-800 mt-0.5">{selected.pickUpAddress}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Drop-off Address</p>
                                                <p className="font-semibold text-gray-800 mt-0.5">{selected.dropAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Breakdown */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                        <TrendingUp size={14} className="text-purple-600" /> Financial & Commission Breakdown
                                    </h4>
                                    <div className="bg-purple-50/70 border border-purple-100 p-4 rounded-2xl text-xs space-y-2.5">
                                        <div className="flex justify-between items-center pb-2 border-b border-purple-200/60">
                                            <span className="text-gray-600 font-medium">Total Fare</span>
                                            <span className="font-extrabold text-gray-900 text-base">৳{selected.fare}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Admin Commission (10%)</span>
                                            <span className="font-bold text-purple-700">৳{selected.adminCommission || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Partner Payout (90%)</span>
                                            <span className="font-bold text-emerald-700">৳{selected.partnerAmount || selected.fare - (selected.adminCommission || 0)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* OTP Verification Codes */}
                                {(selected.pickUpOtp || selected.dropOtp) && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                            <Tag size={14} className="text-purple-600" /> Security Verification Codes
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Pickup OTP</p>
                                                <p className="font-mono font-bold text-purple-700 text-sm mt-0.5">{selected.pickUpOtp || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Drop OTP</p>
                                                <p className="font-mono font-bold text-purple-700 text-sm mt-0.5">{selected.dropOtp || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    )
}
