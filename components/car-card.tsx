import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatMileage, formatPrice } from "@/lib/cars";
import type { Car } from "@/lib/types";

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const cover = car.images[0]?.url;

  return (
    <Link href={`/cars/${car.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {cover ? (
            <Image
              src={cover}
              alt={car.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Χωρίς φωτογραφία
            </div>
          )}
          {car.featured && (
            <Badge className="absolute left-3 top-3">Προτεινόμενο</Badge>
          )}
        </div>

        <CardContent className="space-y-2 p-5">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug">{car.title}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {car.year && <span>{car.year}</span>}
            {car.mileage != null && <span>{formatMileage(car.mileage)}</span>}
            {car.fuel && <span>{car.fuel}</span>}
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/60 px-5 py-4">
          <span className="text-xl font-bold text-primary">{formatPrice(car.price)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
