import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { CarGallery } from "@/components/car-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatMileage, formatPrice, getCarById } from "@/lib/cars";

export const dynamic = "force-dynamic";

type CarDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  const specs = [
    { label: "Έτος", value: car.year?.toString() },
    { label: "Χιλιόμετρα", value: formatMileage(car.mileage) },
    { label: "Καύσιμο", value: car.fuel },
    { label: "Κιβώτιο", value: car.transmission },
  ].filter((spec) => spec.value);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/#cars">
          <ArrowLeft className="mr-2 size-4" />
          Πίσω στα αυτοκίνητα
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <CarGallery images={car.images} title={car.title} />

        <div className="space-y-6">
          <div>
            {car.featured && <Badge className="mb-3">Προτεινόμενο</Badge>}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{car.title}</h1>
            <p className="mt-3 text-3xl font-bold text-primary">{formatPrice(car.price)}</p>
          </div>

          {specs.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h2 className="mb-4 font-semibold">Χαρακτηριστικά</h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                    <dd className="font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {car.description && (
            <div>
              <h2 className="mb-3 font-semibold">Περιγραφή</h2>
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {car.description}
              </p>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h2 className="font-semibold">Ενδιαφέρεστε;</h2>
            <p className="text-sm text-muted-foreground">
              Επικοινωνήστε μαζί μας για περισσότερες πληροφορίες ή δοκιμαστική οδήγηση.
            </p>
            <div className="flex flex-wrap gap-3">
              {phone && (
                <Button asChild>
                  <a href={`tel:${phone}`}>
                    <Phone className="mr-2 size-4" />
                    {phone}
                  </a>
                </Button>
              )}
              {email && (
                <Button asChild variant="outline">
                  <a href={`mailto:${email}?subject=${encodeURIComponent(`Ενδιαφέρον για ${car.title}`)}`}>
                    <Mail className="mr-2 size-4" />
                    Email
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
