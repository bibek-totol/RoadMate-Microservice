import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Nav from "@/components/Nav";
import PublicHome from "@/components/PublicHome";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  let user = null;
  if (session?.user?.email) {
    try {
      const conn = await connectDb();
      if (conn) {
        user = await User.findOne({ email: session.user.email });
      }
    } catch (error) {
      console.error("Database user fetch error:", error);
    }
  }
  const plainUser = user ? JSON.parse(JSON.stringify(user)) : null;

  if (plainUser?.role === "partner") {
    redirect("/partner");
  }

  return (
    <div className="w-full min-h-screen bg-[#0b0c10] text-white selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      <GeoUpdater userId={plainUser?._id} />
      <Nav />
      <main className="relative z-10 pt-20 flex-1">
        {plainUser?.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <PublicHome />
        )}
      </main>
      {plainUser?.role !== 'admin' && <Footer />}
    </div>
  );
}
