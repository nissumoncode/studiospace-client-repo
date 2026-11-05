"use client";

import { useParams, useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import EditStudioform from "@/components/EditStudioform/EditStudioform";

export default function EditStudioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <main className="min-h-screen w-full">
        <EditStudioform
          studioId={id}
          onClose={() => router.push("/my-listings")}
          onUpdated={() => {}}
        />
      </main>
    </ProtectedRoute>
  );
}
