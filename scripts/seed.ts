import { saveCarMetadata, uploadCarImage } from "../lib/blob";
import type { Car } from "../lib/types";

const DEMO_IMAGE_SOURCES = [
  {
    url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    filename: "bmw-320d.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    filename: "mercedes-c200.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
    filename: "toyota-yaris.jpg",
  },
] as const;

async function fetchImageAsFile(url: string, filename: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}`);
  }

  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

async function seed() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }

  const now = new Date().toISOString();

  const demoCars: Omit<Car, "images">[] = [
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
      featured: false,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    },
  ];

  for (let index = 0; index < demoCars.length; index++) {
    const carData = demoCars[index];
    const source = DEMO_IMAGE_SOURCES[index];
    const file = await fetchImageAsFile(source.url, source.filename);
    const uploaded = await uploadCarImage(carData.id, file);

    const car: Car = {
      ...carData,
      images: [{ url: uploaded.url, pathname: uploaded.pathname }],
    };

    await saveCarMetadata(car);
    console.log(`Seeded: ${car.title} (${car.id})`);
  }

  console.log(`Seeded ${demoCars.length} demo cars with photos to Vercel Blob.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
