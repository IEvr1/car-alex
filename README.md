# Car Alex — Website Πώλησης Αυτοκινήτων

Σύγχρονο Next.js site για εμφάνιση και διαχείριση αυτοκινήτων προς πώληση, με αποθήκευση φωτογραφιών στο Vercel Blob.

## Τεχνολογίες

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Neon Postgres** + Drizzle ORM
- **Vercel Blob** για εικόνες
- **iron-session** για admin authentication

## Γρήγορη εκκίνηση

### 1. Εγκατάσταση

```bash
npm install
```

### 2. Environment variables

Αντιγράψτε το `.env.example` σε `.env.local` και συμπληρώστε τις τιμές:

```bash
cp .env.example .env.local
```

| Μεταβλητή | Περιγραφή |
|-----------|-----------|
| `DATABASE_URL` | Connection string από Neon Postgres |
| `BLOB_READ_WRITE_TOKEN` | Token από Vercel Blob store |
| `ADMIN_PASSWORD` | Κωδικός για `/admin/login` |
| `SESSION_SECRET` | Τυχαίο string ≥32 χαρακτήρες |
| `NEXT_PUBLIC_CONTACT_PHONE` | Τηλέφωνο επικοινωνίας |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email επικοινωνίας |

### 3. Βάση δεδομένων

```bash
npm run db:push
npm run db:seed   # προαιρετικά — 3 demo αυτοκίνητα
```

### 4. Development

```bash
npm run dev
```

- **Δημόσιο site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin/login

## Δομή routes

| Route | Περιγραφή |
|-------|-----------|
| `/` | Αρχική — grid αυτοκινήτων |
| `/cars/[id]` | Λεπτομέρειες + photo gallery |
| `/admin/login` | Σύνδεση admin |
| `/admin` | Dashboard διαχείρισης |
| `/admin/cars/new` | Νέο listing |
| `/admin/cars/[id]/edit` | Επεξεργασία listing |

## Λογική εικόνων

### Upload
1. Admin επιλέγει εικόνες στη φόρμα (JPEG/PNG/WebP, max 5MB)
2. Κάθε αρχείο στέλνεται στο `POST /api/upload`
3. Το API αποθηκεύει στο Vercel Blob (`cars/{carId}/{timestamp}-{filename}`)
4. Τα URLs αποθηκεύονται στη βάση

### Εμφάνιση
Οι public URLs του Blob σερβίρονται μέσω CDN και `next/image`.

### Διαγραφή
- Διαγραφή αυτοκινήτου → διαγραφή όλων των εικόνων από Blob
- Αφαίρεση εικόνας στην επεξεργασία → `del()` στο Blob

## Deploy στο Vercel

1. Push το repo και συνδέστε με Vercel
2. `vercel integration add neon` — provisioning `DATABASE_URL`
3. Δημιουργήστε Blob store → `BLOB_READ_WRITE_TOKEN`
4. Ορίστε `ADMIN_PASSWORD` και `SESSION_SECRET`
5. Τρέξτε `npm run db:push` (τοπικά ή μέσω CI)

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run db:push    # Sync schema στη βάση
npm run db:seed    # Demo δεδομένα
```
