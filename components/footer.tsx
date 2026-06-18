import { Car } from "lucide-react";

export function Footer() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <footer id="contact" className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Car className="size-4" />
              </span>
              Car Alex
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Επιλεγμένα μεταχειρισμένα αυτοκίνητα σε άριστη κατάσταση. Εμπιστευτείτε μας για την
              επόμενη αγορά σας.
            </p>
          </div>

          <div className="text-sm">
            <h3 className="mb-3 font-semibold">Επικοινωνία</h3>
            <ul className="space-y-2 text-muted-foreground">
              {phone && (
                <li>
                  Τηλέφωνο:{" "}
                  <a href={`tel:${phone}`} className="text-foreground hover:underline">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  Email:{" "}
                  <a href={`mailto:${email}`} className="text-foreground hover:underline">
                    {email}
                  </a>
                </li>
              )}
              {!phone && !email && (
                <li>Ρυθμίστε NEXT_PUBLIC_CONTACT_PHONE και NEXT_PUBLIC_CONTACT_EMAIL</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Car Alex. Με επιφύλαξη παντός δικαιώματος.
        </div>
      </div>
    </footer>
  );
}
