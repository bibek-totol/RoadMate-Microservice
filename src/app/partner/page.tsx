import { auth } from "@/auth";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export default async function PartnerPage() {
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

  return (
    <div className="w-full min-h-screen bg-[#0b0c10] text-white selection:bg-purple-500 selection:text-white">
      <GeoUpdater userId={plainUser?._id} />
      <Nav />
      <main className="relative z-10">
        <PartnerDashboard />
      </main>
      <Footer />
    </div>
  );
}
