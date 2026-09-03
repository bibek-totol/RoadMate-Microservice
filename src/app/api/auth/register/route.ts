import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()
        await connectDb()
        let user = await User.findOne({ email })
        if (user && user.isEmailVerified) {
            return NextResponse.json(
                { message: "email already exist!" },
                { status: 400 }
            )
        }
        const otp=Math.floor(100000+Math.random()*900000).toString()
        const otpExpiresAt=new Date(Date.now()+10*60*1000)


          if (password.length<6) {
            return NextResponse.json(
                { message: "password must be at least 6 characters" },
                { status: 400 }
            )
        }



        const hashedPassword = await bcrypt.hash(password, 10)
        if(user && !user.isEmailVerified){
            user.name=name,
            user.password=hashedPassword,
            user.email=email
           user.otp=otp,
           user.otpExpiresAt=otpExpiresAt
           await user.save()
        }else{
             user = await User.create({
            name, email, password: hashedPassword,otp,otpExpiresAt
        })
        }


       

        try {
            await sendMail(
                email,
                "Your OTP for Email Verification",
                `<h2>Your Email Verification OTP is <strong>${otp}</strong></h2>`
            );
        } catch (emailError: any) {
            console.error("Failed to send verification email:", emailError?.message || emailError);
            if (emailError?.message?.includes("535") || emailError?.message?.includes("BadCredentials") || emailError?.message?.includes("Invalid login")) {
                return NextResponse.json(
                    { message: "Gmail authentication failed (Invalid App Password). Please update EMAIL and PASS in .env.local with a valid Google App Password." },
                    { status: 500 }
                );
            }
            return NextResponse.json(
                { message: "Failed to send OTP verification email. Please check server email credentials." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            user,
            { status: 201 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || `register error ${error}` },
            { status: 500 }
        )
    }
}