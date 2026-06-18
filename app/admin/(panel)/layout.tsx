import Link from "next/link";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b border-border/60 bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="font-semibold">
            Car Alex Admin
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Δημόσιο site
          </Link>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
