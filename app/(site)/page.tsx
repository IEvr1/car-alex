import Link from "next/link";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { getAllCars } from "@/lib/cars";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allCars = await getAllCars();
  const featuredCars = allCars.filter((car) => car.featured);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-background via-background to-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
              Car Alex
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Επιλεγμένα αυτοκίνητα, έτοιμα για εσάς
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Ανακαλύψτε μεταχειρισμένα αυτοκίνητα σε άριστη κατάσταση. Διαφανείς τιμές,
              πλήρεις φωτογραφίες και άμεση επικοινωνία.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="#cars">Δείτε διαθέσιμα αυτοκίνητα</Link>
            </Button>
          </div>
        </div>
      </section>

      {featuredCars.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Προτεινόμενα</h2>
            <p className="text-muted-foreground">Τα καλύτερα listings μας αυτή τη στιγμή</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      )}

      <section id="cars" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Όλα τα αυτοκίνητα</h2>
          <p className="text-muted-foreground">
            {allCars.length} {allCars.length === 1 ? "διαθέσιμο" : "διαθέσιμα"} αυτοκίνητα
          </p>
        </div>

        {allCars.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
            <p className="text-muted-foreground">
              Δεν υπάρχουν αυτοκίνητα ακόμα. Συνδεθείτε στο admin panel για να προσθέσετε το πρώτο.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/admin/login">Admin</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
