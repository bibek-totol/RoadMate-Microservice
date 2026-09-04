import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-extrabold text-purple-400">404 - Page Not Found</h2>
      <p className="text-gray-400 mt-2 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
      >
        Return Home
      </Link>
    </div>
  );
}
