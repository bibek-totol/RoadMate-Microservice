import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextResponse } from "next/server";
import "@/models/user.model";
import "@/models/vehicle.model";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized admin access" }, { status: 401 });
        }

        await connectDb();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "all";
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: any = {};

        if (status !== "all") {
            filter.bookingStatus = status;
        }

        let bookings = await Booking.find(filter)
            .populate("user", "name email mobileNumber role")
            .populate("driver", "name email mobileNumber role")
            .populate("vehicle", "type vehicleModel number imageUrl baseFare pricePerKM")
            .sort({ createdAt: -1 });

        // In-memory filter if search query is provided
        if (search.trim()) {
            const q = search.toLowerCase();
            bookings = bookings.filter((b) => {
                const userName = b.user?.name?.toLowerCase() || "";
                const userEmail = b.user?.email?.toLowerCase() || "";
                const driverName = b.driver?.name?.toLowerCase() || "";
                const driverEmail = b.driver?.email?.toLowerCase() || "";
                const vehicleModel = b.vehicle?.vehicleModel?.toLowerCase() || "";
                const vehicleNumber = b.vehicle?.number?.toLowerCase() || "";
                const pickUp = b.pickUpAddress?.toLowerCase() || "";
                const drop = b.dropAddress?.toLowerCase() || "";
                const id = b._id?.toString() || "";

                return (
                    userName.includes(q) ||
                    userEmail.includes(q) ||
                    driverName.includes(q) ||
                    driverEmail.includes(q) ||
                    vehicleModel.includes(q) ||
                    vehicleNumber.includes(q) ||
                    pickUp.includes(q) ||
                    drop.includes(q) ||
                    id.includes(q)
                );
            });
        }

        const total = bookings.length;
        const pages = Math.ceil(total / limit) || 1;
        const startIndex = (page - 1) * limit;
        const paginatedBookings = bookings.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            success: true,
            bookings: paginatedBookings,
            total,
            page,
            pages
        });
    } catch (error) {
        console.error("Admin bookings fetch error:", error);
        return NextResponse.json({ message: "Internal server error fetching bookings" }, { status: 500 });
    }
}
