import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminCarForm } from "@/components/admin-car-form";
import { Button } from "@/components/ui/button";
import { getCarById } from "@/lib/cars";

export const dynamic = "force-dynamic";

type EditCarPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCarPage({ params }: EditCarPageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 size-4" />
            Πίσω
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Επεξεργασία</h1>
      </div>
      <AdminCarForm car={car} />
    </div>
  );
}
