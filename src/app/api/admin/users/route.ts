import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify admin role directly from database
        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser || dbUser.role !== "admin") {
            return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const roleParam = searchParams.get("role") ?? "user"; // "user" | "partner"
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
        const limit = 10;
        const skip = (page - 1) * limit;
        const search = searchParams.get("search")?.trim() ?? "";

        // Build role filter
        let roleFilter: Record<string, unknown>;
        if (roleParam === "partner") {
            // Strictly role: "partner" — excluding user and admin roles
            roleFilter = { role: "partner" };
        } else {
            // "user" — match users excluding partner and admin roles
            roleFilter = { role: { $nin: ["partner", "admin"] } };
        }

        // Combine with search if provided
        let queryFilter: Record<string, unknown> = roleFilter;
        if (search) {
            const regex = new RegExp(search, "i");
            queryFilter = {
                $and: [
                    roleFilter,
                    {
                        $or: [
                            { name: regex },
                            { email: regex },
                            { mobileNumber: regex },
                        ],
                    },
                ],
            };
        }

        const [users, total] = await Promise.all([
            User.find(queryFilter)
                .select("-password -otp -otpExpiresAt -socketId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(queryFilter),
        ]);

        const ids = users.map((u) => u._id);
        const mongoIds = ids.map((id) => new mongoose.Types.ObjectId(String(id)));

        let enriched: unknown[] = users;

        if (roleParam === "partner") {
            const [vehicles, docs, banks, bookingCounts] = await Promise.all([
                Vehicle.find({ owner: { $in: ids } }).lean().catch(() => []),
                PartnerDocs.find({ owner: { $in: ids } }).lean().catch(() => []),
                PartnerBank.find({ owner: { $in: ids } }).lean().catch(() => []),
                Booking.aggregate([
                    { $match: { driver: { $in: mongoIds } } },
                    { $group: { _id: "$driver", count: { $sum: 1 }, revenue: { $sum: "$partnerAmount" } } },
                ]).catch(() => []),
            ]);

            const vehicleMap = new Map(vehicles.map((v) => [String(v.owner), v]));
            const docsMap = new Map(docs.map((d) => [String(d.owner), d]));
            const bankMap = new Map(banks.map((b) => [String(b.owner), b]));
            const bookingMap = new Map(
                bookingCounts.map((b) => [String(b._id), { count: b.count, revenue: b.revenue }])
            );

            enriched = users.map((u) => ({
                ...u,
                vehicle: vehicleMap.get(String(u._id)) ?? null,
                documents: docsMap.get(String(u._id)) ?? null,
                bankAccount: bankMap.get(String(u._id)) ?? null,
                bookingCount: bookingMap.get(String(u._id))?.count ?? 0,
                totalRevenue: bookingMap.get(String(u._id))?.revenue ?? 0,
            }));
        } else {
            // For users, attach booking count & total spent
            const bookingCounts = await Booking.aggregate([
                { $match: { user: { $in: mongoIds } } },
                { $group: { _id: "$user", count: { $sum: 1 }, totalSpent: { $sum: "$fare" } } },
            ]).catch(() => []);

            const bookingMap = new Map(
                bookingCounts.map((b) => [String(b._id), { count: b.count, totalSpent: b.totalSpent }])
            );

            enriched = users.map((u) => ({
                ...u,
                bookingCount: bookingMap.get(String(u._id))?.count ?? 0,
                totalSpent: bookingMap.get(String(u._id))?.totalSpent ?? 0,
            }));
        }

        return NextResponse.json({
            users: enriched,
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
        });
    } catch (error) {
        console.error("Admin Users API Error:", error);
        return NextResponse.json({ message: `Server error: ${error}` }, { status: 500 });
    }
}
