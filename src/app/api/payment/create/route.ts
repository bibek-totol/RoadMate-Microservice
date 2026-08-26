import connectDb from "@/lib/db";
import stripe from "@/lib/stripe";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { bookingId } = await req.json();
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json(
                { message: "booking is not found." },
                { status: 400 }
            );
        }

        const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Ride Booking #${booking._id}`,
                            description: `Ride from ${booking.pickUpAddress} to ${booking.dropAddress}`,
                        },
                        unit_amount: Math.round(booking.fare * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            metadata: {
                bookingId: booking._id.toString(),
            },
            success_url: `${origin}/api/payment/verify?session_id={CHECKOUT_SESSION_ID}&bookingId=${booking._id}`,
            cancel_url: `${origin}/user/checkout?bookingId=${booking._id}&cancelled=true`,
        });

        booking.bookingStatus = "awaiting_payment";
        await booking.save();

        return NextResponse.json(
            {
                sessionUrl: session.url,
                sessionId: session.id,
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                message: `payment create error ${error}`
            },
            { status: 500 }
        );
    }
}