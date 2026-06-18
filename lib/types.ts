export type CarImage = {
  url: string;
  pathname: string;
};

export type Car = {
  id: string;
  title: string;
  price: number;
  year: number | null;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  description: string | null;
  images: CarImage[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CarFormData = {
  id?: string;
  title: string;
  price: number;
  year?: number | null;
  mileage?: number | null;
  fuel?: string | null;
  transmission?: string | null;
  description?: string | null;
  images: CarImage[];
  featured?: boolean;
};
