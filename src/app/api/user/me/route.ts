import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function GET(req:Request) {
    try {
        await connectDb()
        const session=await auth()
        if(!session || !session.user){
            return Response.json(
                {message:"user is not authenticated"},
                {status:400}
            )
        }
        let user=await User.findOne({email:session.user.email})
        if(!user){
             user = await User.create({
                 name: session.user.name || "User",
                 email: session.user.email,
                 isEmailVerified: true,
                 role: "user"
             })
        }

         return Response.json(
                user,
                {status:200}
            )
    } catch (error) {
         return Response.json(
                {message:`get me error ${error}`},
                {status:500}
            )
    }
}