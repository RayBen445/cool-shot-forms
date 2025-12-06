import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold mb-8">Cool Shot Forms</h1>
        <div className="space-x-4">
          <Link
            href="/builder"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Form
          </Link>
        </div>
      </div>
    </div>
  );
}
