"use client";

import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/gates";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-lg">
      <div className="glass rounded-3xl p-6 shadow-2xl">
        <AuthPanel onDone={() => router.push("/")} />
      </div>
    </div>
  );
}
