import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { DeleteCarButton } from "@/components/delete-car-button";
import { LogoutButton } from "@/components/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMileage, formatPrice, getAllCars } from "@/lib/cars";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const allCars = await getAllCars();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Διαχείριση</h1>
          <p className="text-muted-foreground">
            {allCars.length} αυτοκίνητα στη βάση
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/cars/new">
              <Plus className="mr-2 size-4" />
              Νέο αυτοκίνητο
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      {allCars.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Δεν υπάρχουν αυτοκίνητα. Προσθέστε το πρώτο σας listing.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allCars.map((car) => (
            <Card key={car.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{car.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatPrice(car.price)}</span>
                    {car.year && <span>• {car.year}</span>}
                    {car.mileage != null && <span>• {formatMileage(car.mileage)}</span>}
                    {car.featured && <Badge variant="secondary">Προτεινόμενο</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/cars/${car.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteCarButton carId={car.id} carTitle={car.title} />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
