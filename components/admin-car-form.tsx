"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Car, CarFormData, CarImage } from "@/lib/types";

type AdminCarFormProps = {
  car?: Car;
};

const emptyForm: CarFormData = {
  title: "",
  price: 0,
  year: null,
  mileage: null,
  fuel: "",
  transmission: "",
  description: "",
  images: [],
  featured: false,
};

export function AdminCarForm({ car }: AdminCarFormProps) {
  const router = useRouter();
  const [carId] = useState(() => car?.id ?? crypto.randomUUID());
  const [form, setForm] = useState<CarFormData>(() =>
    car
      ? {
          title: car.title,
          price: car.price,
          year: car.year,
          mileage: car.mileage,
          fuel: car.fuel ?? "",
          transmission: car.transmission ?? "",
          description: car.description ?? "",
          images: car.images,
          featured: car.featured,
        }
      : emptyForm
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(car);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;

    if (form.images.length + files.length > 10) {
      setError("Μέγιστο 10 φωτογραφίες ανά αυτοκίνητο.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploaded: CarImage[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("carId", carId);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Σφάλμα upload");
        }

        uploaded.push({ url: data.url, pathname: data.pathname });
      }

      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploaded],
      }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Σφάλμα upload"
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage(pathname: string) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((img) => img.pathname !== pathname),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: CarFormData & { id?: string } = {
        ...form,
        fuel: form.fuel || null,
        transmission: form.transmission || null,
        description: form.description || null,
      };

      const response = await fetch("/api/admin/cars", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing ? { ...payload, id: car!.id } : { ...payload, id: carId }
        ),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Σφάλμα αποθήκευσης");
      }

      router.push("/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Σφάλμα αποθήκευσης"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Τίτλος *</Label>
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="π.χ. BMW 320d 2019"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Τιμή (€) *</Label>
          <Input
            id="price"
            type="number"
            required
            min={0}
            value={form.price || ""}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Έτος</Label>
          <Input
            id="year"
            type="number"
            min={1980}
            max={new Date().getFullYear() + 1}
            value={form.year ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                year: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Χιλιόμετρα</Label>
          <Input
            id="mileage"
            type="number"
            min={0}
            value={form.mileage ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                mileage: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel">Καύσιμο</Label>
          <Input
            id="fuel"
            value={form.fuel ?? ""}
            onChange={(e) => setForm({ ...form, fuel: e.target.value })}
            placeholder="π.χ. Πετρέλαιο"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Κιβώτιο</Label>
          <Input
            id="transmission"
            value={form.transmission ?? ""}
            onChange={(e) => setForm({ ...form, transmission: e.target.value })}
            placeholder="π.χ. Αυτόματο"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Περιγραφή</Label>
        <Textarea
          id="description"
          rows={5}
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Περιγραφή αυτοκινήτου, εξοπλισμός, ιστορικό service..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="size-4 rounded border-border"
        />
        <Label htmlFor="featured">Προτεινόμενο στην αρχική</Label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Φωτογραφίες ({form.images.length}/10)</Label>
          <Button type="button" variant="outline" disabled={uploading} asChild>
            <label className="cursor-pointer">
              {uploading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Upload className="mr-2 size-4" />
              )}
              Ανέβασμα
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </Button>
        </div>

        {form.images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {form.images.map((image) => (
              <div key={image.pathname} className="group relative aspect-[4/3] overflow-hidden rounded-lg border">
                <Image
                  src={image.url}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeImage(image.pathname)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || uploading}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEditing ? "Αποθήκευση αλλαγών" : "Δημιουργία αυτοκινήτου"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
          Ακύρωση
        </Button>
      </div>
    </form>
  );
}
