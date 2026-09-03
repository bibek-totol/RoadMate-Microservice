import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const body = await req.json().catch(() => ({}));
        const { vehicleType } = body;
        const latitude = Number(body.latitude) || 23.8103;
        const longitude = Number(body.longitude) || 90.4125;

        let partners: any[] = [];
        try {
            // 1. Try finding partners near pickup coordinates (within 50 km)
            partners = await User.find({
                role: "partner",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 50000
                    }
                }
            });
        } catch (geoErr) {
            console.log("Geospatial search error or missing 2dsphere index:", geoErr);
        }

        // 2. Fallback: If no partners near coordinates or geo index missing, fetch all partners in DB
        if (!partners || partners.length === 0) {
            partners = await User.find({ role: "partner" });
        }

        const partnerIds = partners.map(p => p._id);

        let query: any = {};
        if (partnerIds.length > 0) {
            query.owner = { $in: partnerIds };
        }

        if (vehicleType) {
            query.type = vehicleType;
        }

        // 3. Find vehicles matching partner & vehicle type
        let vehicles = await Vehicle.find(query).lean();

        // 4. Fallback: If no vehicles found for selected vehicle type, search all vehicles for these partners
        if (vehicles.length === 0 && vehicleType) {
            delete query.type;
            vehicles = await Vehicle.find(query).lean();
        }

        // 5. Ultimate Fallback: If still no vehicles found with partner filter, fetch all vehicles in DB
        if (vehicles.length === 0) {
            vehicles = await Vehicle.find({}).lean();
        }

        return NextResponse.json(vehicles, { status: 200 });

    } catch (error) {
        console.error("near by vehicles error:", error);
        return NextResponse.json(
            { message: `near by vehicles error ${error}` },
            { status: 500 }
        );
    }
}
