"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteCarButtonProps = {
  carId: string;
  carTitle: string;
};

export function DeleteCarButton({ carId, carTitle }: DeleteCarButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Διαγραφή "${carTitle}"; Θα διαγραφούν και όλες οι φωτογραφίες.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/cars?id=${carId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Σφάλμα διαγραφής");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Σφάλμα διαγραφής");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
    </Button>
  );
}
