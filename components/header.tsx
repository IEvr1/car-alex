import Link from "next/link";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Car className="size-5" />
          </span>
          <span className="text-lg">Car Alex</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Αρχική
          </Link>
          <Link href="/#contact" className="text-muted-foreground transition-colors hover:text-foreground">
            Επικοινωνία
          </Link>
        </nav>

        <Button asChild size="sm">
          <Link href="/#cars">Δείτε αυτοκίνητα</Link>
        </Button>
      </div>
    </header>
  );
}
