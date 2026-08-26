import connectDb from "@/lib/db";
import stripe from "@/lib/stripe";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");
        const bookingIdFromQuery = searchParams.get("bookingId");

        if (!sessionId) {
            return NextResponse.json({ success: false, message: "session_id is required" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const bookingId = bookingIdFromQuery || session.metadata?.bookingId;

        if (session.payment_status !== "paid") {
            const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";
            return NextResponse.redirect(`${origin}/user/checkout?bookingId=${bookingId}&failed=true`);
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: "booking is not found." }, { status: 404 });
        }

        const adminCommission = booking.fare * 0.10;
        const partnerAmount = booking.fare - adminCommission;
        booking.adminCommission = adminCommission;
        booking.partnerAmount = partnerAmount;
        booking.paymentStatus = "paid";
        booking.bookingStatus = "confirmed";
        await booking.save();

        const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";
        return NextResponse.redirect(`${origin}/user/ride/${booking._id}`);
    } catch (error) {
        return NextResponse.json(
            { success: false, message: `verify payment error ${error}` },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { bookingId, session_id } = await req.json();

        if (!session_id) {
            return NextResponse.json({ success: false, message: "session_id is required" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status !== "paid") {
            return NextResponse.json({ success: false, message: "Payment not completed" }, { status: 400 });
        }

        const booking = await Booking.findById(bookingId || session.metadata?.bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: "booking is not found." }, { status: 404 });
        }

        const adminCommission = booking.fare * 0.10;
        const partnerAmount = booking.fare - adminCommission;
        booking.adminCommission = adminCommission;
        booking.partnerAmount = partnerAmount;
        booking.paymentStatus = "paid";
        booking.bookingStatus = "confirmed";
        await booking.save();

        return NextResponse.json(
            { success: true, adminCommission, partnerAmount },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: `verify payment error ${error}` },
            { status: 500 }
        );
    }
}