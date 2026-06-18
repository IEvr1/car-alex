import { saveCarMetadata } from "../lib/blob";
import type { Car } from "../lib/types";

async function seed() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }

  const now = new Date().toISOString();

  const demoCars: Car[] = [
    {
      id: crypto.randomUUID(),
      title: "BMW 320d xDrive M Sport",
      price: 28900,
      year: 2019,
      mileage: 78500,
      fuel: "Πετρέλαιο",
      transmission: "Αυτόματο",
      description:
        "Εξαιρετική κατάσταση, πλήρες service history, M Sport πακέτο, leather interior, navigation, parking sensors.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
          pathname: "external/bmw-320d",
        },
      ],
      featured: true,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    },
    {
      id: crypto.randomUUID(),
      title: "Mercedes-Benz C 200 AMG Line",
      price: 32500,
      year: 2020,
      mileage: 62000,
      fuel: "Βενζίνη",
      transmission: "Αυτόματο",
      description:
        "AMG Line, LED headlights, dual zone A/C, keyless entry, cruise control. Άριστη συντήρηση.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
          pathname: "external/mercedes-c200",
        },
      ],
      featured: true,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    },
    {
      id: crypto.randomUUID(),
      title: "Toyota Yaris Hybrid",
      price: 15900,
      year: 2021,
      mileage: 41000,
      fuel: "Υβριδικό",
      transmission: "Αυτόματο",
      description:
        "Οικονομικό hybrid, ιδανικό για πόλη. Εγγύηση Toyota, ένας ιδιοκτήτης, ατρακάριστο.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1623869675781-52e3a7a1f4c5?w=1200&q=80",
          pathname: "external/toyota-yaris",
        },
      ],
      featured: false,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    },
  ];

  for (const car of demoCars) {
    await saveCarMetadata(car);
    console.log(`Seeded: ${car.title} (${car.id})`);
  }

  console.log(`Seeded ${demoCars.length} demo cars to Vercel Blob.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
