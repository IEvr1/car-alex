import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/schema";

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  const demoCars = [
    {
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
          pathname: "demo/bmw-320d",
        },
      ],
      featured: true,
    },
    {
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
          pathname: "demo/mercedes-c200",
        },
      ],
      featured: true,
    },
    {
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
          pathname: "demo/toyota-yaris",
        },
      ],
      featured: false,
    },
  ];

  for (const car of demoCars) {
    await db.insert(schema.cars).values(car);
  }

  console.log(`Seeded ${demoCars.length} demo cars.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
