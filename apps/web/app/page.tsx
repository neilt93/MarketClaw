import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Declutter
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Connect your Gmail. We find everything you could sell, price it, write
          the listing, and put it in front of buyers automatically.
        </p>
        <p className="mt-2 text-gray-500">You just tap approve.</p>
        <div className="mt-8">
          <Link
            href="/login"
            className="rounded-lg bg-black px-8 py-3 text-lg font-medium text-white hover:bg-gray-800"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
