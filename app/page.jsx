import { Toaster } from "react-hot-toast";

import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Dashboard />
      <Toaster position="top-right" reverseOrder={false} />
    </main>
  );
}
