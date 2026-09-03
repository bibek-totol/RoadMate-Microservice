'use client'
import axios from 'axios'
import React, { useEffect, useState, useCallback } from 'react'
import {
    Users, Briefcase, Search, ChevronLeft, ChevronRight,
    Mail, Phone, CheckCircle2, XCircle, Clock, Car,
    ShoppingBag, TrendingUp, BadgeCheck, AlertCircle, RefreshCw,
    FileText, CreditCard, ShieldCheck, DollarSign, ExternalLink, Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import DocPreview from './DocPreview'

/* ────────── Types ────────── */
type Role = 'user' | 'partner'

interface UserRow {
    _id: string
    name: string
    email: string
    mobileNumber?: string
    role: Role
    isEmailVerified: boolean
    partnerStatus?: 'pending' | 'approved' | 'rejected'
    rejectionReason?: string
    videoKycStatus?: string
    videoKycRejectionReason?: string
    partnerOnBoardingSteps?: number
    isOnline: boolean
    createdAt: string
    bookingCount: number
    totalSpent?: number       // users
    totalRevenue?: number     // partners
    vehicle?: {
        type: string
        vehicleModel: string
        number: string
        imageUrl?: string
        baseFare?: number
        pricePerKM?: number
        waitingCharge?: number
        status: string
        rejectionReason?: string
        isActive?: boolean
    } | null
    documents?: {
        aadharUrl?: string
        rcUrl?: string
        licenseUrl?: string
        status?: string
        rejectionReason?: string
    } | null
    bankAccount?: {
        accountHolder?: string
        accountNumber?: string
        ifsc?: string
        upi?: string
        status?: string
    } | null
}

/* ────────── Helpers ────────── */
const statusBadge = (status?: string) => {
    const map: Record<string, string> = {
        approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        added: 'bg-blue-100 text-blue-700 border-blue-200',
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
        not_added: 'bg-gray-100 text-gray-500 border-gray-200',
        not_required: 'bg-gray-100 text-gray-500 border-gray-200',
    }
    return map[status ?? ''] ?? 'bg-gray-100 text-gray-600 border-gray-200'
}

const StatusIcon = ({ s }: { s?: string }) =>
    s === 'approved' || s === 'verified' ? <CheckCircle2 size={12} className="text-emerald-600" /> :
        s === 'rejected' ? <XCircle size={12} className="text-red-500" /> :
            <Clock size={12} className="text-amber-500" />

/* ────────── Component ────────── */
export default function AdminUsers() {
    const [role, setRole] = useState<Role>('user')
    const [rows, setRows] = useState<UserRow[]>([])
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(1)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')       // debounced search
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<UserRow | null>(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await axios.get('/api/admin/users', {
                params: { role, page, search: query }
            })
            setRows(data.users || [])
            setTotal(data.total || 0)
            setPages(data.pages || 1)
        } catch (err) {
            console.error("Failed to fetch admin users:", err)
            setRows([])
            setTotal(0)
            setPages(1)
        } finally {
            setLoading(false)
        }
    }, [role, page, query])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setQuery(search); setPage(1) }, 400)
        return () => clearTimeout(t)
    }, [search])

    const switchRole = (r: Role) => { setRole(r); setPage(1); setSearch(''); setQuery('') }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">People Management</h2>
                    <p className="text-xs text-gray-400 mt-0.5">View and inspect user profiles and full partner credentials</p>
                </div>

                {/* Role Toggle */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
                    {(['user', 'partner'] as Role[]).map(r => (
                        <button
                            key={r}
                            onClick={() => switchRole(r)}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${role === r
                                ? 'bg-white shadow text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {r === 'user' ? <Users size={13} /> : <Briefcase size={13} />}
                            {r === 'user' ? 'Users' : 'Partners'}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${role === r ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>
                                {r === role ? total : ''}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search + Refresh */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={`Search ${role}s by name, email, or mobile…`}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400/40 placeholder:text-gray-400"
                    />
                </div>
                <button
                    onClick={fetchUsers}
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-500"
                    title="Refresh"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Table Header */}
                <div className={`grid text-[11px] font-bold uppercase tracking-wider text-gray-400 px-5 py-3 border-b border-gray-100 bg-gray-50 ${role === 'partner'
                    ? 'grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1fr]'
                    : 'grid-cols-[2fr_2fr_1fr_1fr_1fr]'
                    }`}>
                    <span>Name</span>
                    <span>Email & Contact</span>
                    {role === 'partner' && <span>Vehicle Details</span>}
                    <span>Status</span>
                    <span>{role === 'partner' ? 'Total Revenue' : 'Total Spent'}</span>
                    <span>Rides</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2 text-sm">
                        <RefreshCw size={16} className="animate-spin" /> Loading data from database…
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                        <AlertCircle size={32} className="text-gray-300" />
                        <p className="text-sm">No {role} records found in database</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${role}-${page}-${query}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            {rows.map((u, i) => (
                                <div
                                    key={u._id}
                                    onClick={() => setSelected(u)}
                                    className={`grid items-center px-5 py-3.5 text-xs cursor-pointer hover:bg-purple-50/60 transition border-b border-gray-50 last:border-0 ${role === 'partner'
                                        ? 'grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1fr]'
                                        : 'grid-cols-[2fr_2fr_1fr_1fr_1fr]'
                                        }`}
                                    style={{ animationDelay: `${i * 30}ms` }}
                                >
                                    {/* Name & Online Badge */}
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${role === 'partner' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">{u.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span className="text-[10px] text-gray-400">{u.isOnline ? 'Online' : 'Offline'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="min-w-0 pr-2">
                                        <p className="text-gray-700 font-medium truncate">{u.email}</p>
                                        <p className="text-[10px] text-gray-400">{u.mobileNumber ?? 'No Phone'}</p>
                                    </div>

                                    {/* Vehicle Details (Partners Only) */}
                                    {role === 'partner' && (
                                        <div>
                                            {u.vehicle ? (
                                                <div>
                                                    <p className="font-semibold text-gray-800 capitalize">{u.vehicle.type} · {u.vehicle.vehicleModel}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono">{u.vehicle.number}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No Vehicle</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div>
                                        {role === 'partner' ? (
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${statusBadge(u.partnerStatus)}`}>
                                                <StatusIcon s={u.partnerStatus} />
                                                {u.partnerStatus ?? 'pending'}
                                            </span>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${u.isEmailVerified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {u.isEmailVerified ? <BadgeCheck size={11} /> : <AlertCircle size={11} />}
                                                {u.isEmailVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Revenue / Spent */}
                                    <span className="font-semibold text-gray-800">
                                        ৳{((role === 'partner' ? u.totalRevenue : u.totalSpent) ?? 0).toLocaleString()}
                                    </span>

                                    {/* Rides */}
                                    <span className="text-gray-600 font-medium">{u.bookingCount}</span>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}</span>
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

            {/* Slide-In Full Detail Drawer */}
            <AnimatePresence>
                {selected && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            onClick={() => setSelected(null)}
                        />

                        {/* Slide-over Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            {/* Top Color Accent */}
                            <div className={`h-2 w-full ${selected.role === 'partner' ? 'bg-purple-600' : 'bg-blue-600'}`} />

                            <div className="p-6 space-y-7 text-gray-800">

                                {/* Header */}
                                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md ${selected.role === 'partner' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                            {selected.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{selected.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${selected.role === 'partner' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                                    {selected.role}
                                                </span>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${selected.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${selected.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                    {selected.isOnline ? 'Online' : 'Offline'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* ────────── 1. Personal Information ────────── */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                        <Users size={14} className="text-purple-600" />
                                        <span>Personal Information</span>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5 text-xs">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Email Address</p>
                                                <p className="font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                                                    <Mail size={12} className="text-gray-400 shrink-0" />
                                                    <span className="truncate">{selected.email}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Phone Number</p>
                                                <p className="font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                                                    <Phone size={12} className="text-gray-400 shrink-0" />
                                                    {selected.mobileNumber || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Email Verification</p>
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-0.5 ${selected.isEmailVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {selected.isEmailVerified ? <BadgeCheck size={13} /> : <AlertCircle size={13} />}
                                                    {selected.isEmailVerified ? 'Verified Email' : 'Unverified Email'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Joined Date</p>
                                                <p className="font-medium text-gray-700 mt-0.5">
                                                    {new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status & Rejection details for Partners */}
                                        {selected.role === 'partner' && (
                                            <div className="pt-2 border-t border-gray-200/60 space-y-2">
                                                <div className="flex flex-wrap gap-2 items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Partner Approval Status</p>
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold capitalize mt-0.5 ${statusBadge(selected.partnerStatus)}`}>
                                                            <StatusIcon s={selected.partnerStatus} />
                                                            {selected.partnerStatus ?? 'Pending'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Video KYC Status</p>
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold capitalize mt-0.5 ${statusBadge(selected.videoKycStatus)}`}>
                                                            <StatusIcon s={selected.videoKycStatus} />
                                                            {selected.videoKycStatus ?? 'Not Required'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {selected.rejectionReason && (
                                                    <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-700 text-[11px]">
                                                        <p className="font-bold flex items-center gap-1"><XCircle size={12} /> Partner Rejection Reason:</p>
                                                        <p className="mt-0.5">{selected.rejectionReason}</p>
                                                    </div>
                                                )}

                                                {selected.videoKycRejectionReason && (
                                                    <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-700 text-[11px]">
                                                        <p className="font-bold flex items-center gap-1"><XCircle size={12} /> KYC Rejection Reason:</p>
                                                        <p className="mt-0.5">{selected.videoKycRejectionReason}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ────────── 2. Performance & Revenue Summary ────────── */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4">
                                        <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <ShoppingBag size={12} /> Total Bookings
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{selected.bookingCount}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Completed rides</p>
                                    </div>
                                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <TrendingUp size={12} /> {selected.role === 'partner' ? 'Total Earnings' : 'Total Spent'}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            ৳{((selected.role === 'partner' ? selected.totalRevenue : selected.totalSpent) ?? 0).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{selected.role === 'partner' ? 'Net payout' : 'Gross bookings'}</p>
                                    </div>
                                </div>

                                {/* ────────── 3. Vehicle Information (Partners Only) ────────── */}
                                {selected.role === 'partner' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                                <Car size={14} className="text-purple-600" />
                                                <span>Vehicle Information</span>
                                            </div>
                                            {selected.vehicle?.status && (
                                                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${statusBadge(selected.vehicle.status)}`}>
                                                    {selected.vehicle.status}
                                                </span>
                                            )}
                                        </div>

                                        {selected.vehicle ? (
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 text-xs">
                                                {/* Vehicle details grid */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Type & Model</p>
                                                        <p className="font-bold text-gray-800 capitalize mt-0.5">
                                                            {selected.vehicle.type} · {selected.vehicle.vehicleModel}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Registration Number</p>
                                                        <p className="font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 w-fit mt-0.5">
                                                            {selected.vehicle.number}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Pricing breakdown */}
                                                {(selected.vehicle.baseFare !== undefined || selected.vehicle.pricePerKM !== undefined) && (
                                                    <div className="pt-2.5 border-t border-gray-200/60">
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1.5">Fare & Rates</p>
                                                        <div className="grid grid-cols-3 gap-2 text-center">
                                                            <div className="bg-white p-2 rounded-xl border border-gray-100">
                                                                <span className="text-[10px] text-gray-400 block">Base Fare</span>
                                                                <span className="font-bold text-gray-800">৳{selected.vehicle.baseFare ?? 0}</span>
                                                            </div>
                                                            <div className="bg-white p-2 rounded-xl border border-gray-100">
                                                                <span className="text-[10px] text-gray-400 block">Per KM Rate</span>
                                                                <span className="font-bold text-gray-800">৳{selected.vehicle.pricePerKM ?? 0}</span>
                                                            </div>
                                                            <div className="bg-white p-2 rounded-xl border border-gray-100">
                                                                <span className="text-[10px] text-gray-400 block">Waiting / min</span>
                                                                <span className="font-bold text-gray-800">৳{selected.vehicle.waitingCharge ?? 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Vehicle Rejection Reason */}
                                                {selected.vehicle.rejectionReason && (
                                                    <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-700 text-[11px]">
                                                        <p className="font-bold flex items-center gap-1"><XCircle size={12} /> Vehicle Rejection Reason:</p>
                                                        <p className="mt-0.5">{selected.vehicle.rejectionReason}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center text-xs text-gray-400 italic">
                                                No vehicle details registered for this partner.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ────────── 4. Account & Bank Details (Partners Only) ────────── */}
                                {selected.role === 'partner' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                                <CreditCard size={14} className="text-purple-600" />
                                                <span>Bank Account Details</span>
                                            </div>
                                            {selected.bankAccount?.status && (
                                                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${statusBadge(selected.bankAccount.status)}`}>
                                                    Bank: {selected.bankAccount.status}
                                                </span>
                                            )}
                                        </div>

                                        {selected.bankAccount ? (
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5 text-xs">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Account Holder</p>
                                                        <p className="font-semibold text-gray-800 mt-0.5">{selected.bankAccount.accountHolder}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Account Number</p>
                                                        <p className="font-mono font-semibold text-gray-800 mt-0.5">{selected.bankAccount.accountNumber}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200/60">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">IFSC Code</p>
                                                        <p className="font-mono font-semibold text-gray-800 mt-0.5">{selected.bankAccount.ifsc}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">UPI ID</p>
                                                        <p className="font-medium text-gray-800 mt-0.5">{selected.bankAccount.upi || 'Not set'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center text-xs text-gray-400 italic">
                                                No bank account registered for payouts.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ────────── 5. Partner Documents & Previews (Partners Only) ────────── */}
                                {selected.role === 'partner' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                                <FileText size={14} className="text-purple-600" />
                                                <span>Submitted Verification Documents</span>
                                            </div>
                                            {selected.documents?.status && (
                                                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${statusBadge(selected.documents.status)}`}>
                                                    Docs: {selected.documents.status}
                                                </span>
                                            )}
                                        </div>

                                        {selected.documents ? (
                                            <div className="space-y-3">
                                                <DocPreview label="ID Card" url={selected.documents.aadharUrl} />
                                                <DocPreview label="RC (Vehicle Registration)" url={selected.documents.rcUrl} />
                                                <DocPreview label="Driving License" url={selected.documents.licenseUrl} />

                                                {selected.documents.rejectionReason && (
                                                    <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-700 text-[11px]">
                                                        <p className="font-bold flex items-center gap-1"><XCircle size={12} /> Document Rejection Reason:</p>
                                                        <p className="mt-0.5">{selected.documents.rejectionReason}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center text-xs text-gray-400 italic">
                                                No verification documents uploaded yet.
                                            </div>
                                        )}
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
