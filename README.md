# Car Alex — Website Πώλησης Αυτοκινήτων

Σύγχρονο Next.js site για εμφάνιση και διαχείριση αυτοκινήτων προς πώληση. Όλα τα δεδομένα (φωτογραφίες + metadata) αποθηκεύονται στο **Vercel Blob** — χωρίς ξεχωριστή βάση.

## Τεχνολογίες

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Vercel Blob** — εικόνες + `metadata.json` ανά αυτοκίνητο
- **iron-session** — admin authentication

## Δομή αποθήκευσης (Blob)

```
cars/
  {car-id}/
    metadata.json     ← τίτλος, τιμή, περιγραφή, URLs εικόνων
    1710000000-photo1.jpg
    1710000001-photo2.jpg
```

## Γρήγορη εκκίνηση

### 1. Εγκατάσταση

```bash
npm install
```

### 2. Environment variables

Αντιγράψτε το `.env.example` σε `.env.local`:

```bash
cp .env.example .env.local
```

| Μεταβλητή | Περιγραφή |
|-----------|-----------|
| `BLOB_READ_WRITE_TOKEN` | Token από Vercel Blob store |
| `ADMIN_PASSWORD` | Κωδικός για `/admin/login` |
| `SESSION_SECRET` | Τυχαίο string ≥32 χαρακτήρες |
| `NEXT_PUBLIC_CONTACT_PHONE` | Τηλέφωνο επικοινωνίας |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email επικοινωνίας |

### 3. Demo δεδομένα (προαιρετικά)

```bash
npm run seed
```

### 4. Development

```bash
npm run dev
```

- **Δημόσιο site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin/login

## Deploy στο Vercel

1. Push το repo και συνδέστε με Vercel
2. Δημιουργήστε Blob store → `BLOB_READ_WRITE_TOKEN`
3. Ορίστε `ADMIN_PASSWORD` και `SESSION_SECRET`
4. (Προαιρετικά) `npm run seed` τοπικά για demo listings

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run seed       # Demo αυτοκίνητα στο Blob
```
