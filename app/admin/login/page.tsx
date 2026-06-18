import { Suspense } from "react";
import AdminLoginPage from "./page.client";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Φόρτωση...</div>}>
      <AdminLoginPage />
    </Suspense>
  );
}
