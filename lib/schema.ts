import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { CarImage } from "./types";

export const cars = pgTable("cars", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  year: integer("year"),
  mileage: integer("mileage"),
  fuel: text("fuel"),
  transmission: text("transmission"),
  description: text("description"),
  images: jsonb("images").$type<CarImage[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
