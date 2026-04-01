import Link from "next/link";

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm text-center space-y-4">
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="text-gray-600">
          We sent you a confirmation link. Click it to verify your account and
          get started.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm font-medium text-black hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
