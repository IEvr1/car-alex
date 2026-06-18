import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminCarForm } from "@/components/admin-car-form";
import { Button } from "@/components/ui/button";

export default function NewCarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 size-4" />
            Πίσω
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Νέο αυτοκίνητο</h1>
      </div>
      <AdminCarForm />
    </div>
  );
}
