"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  capacity: number;
  location: string;
  image: string;
  status: "active" | "inactive";
};

function MyListingsContent() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudios() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/my-studios`,
          { credentials: "include" },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch studios");
        }

        setStudios(result.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load studios",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStudios();
  }, []);

  const handleStatusChange = async (
    studioId: string,
    currentStatus: "active" | "inactive",
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      setUpdatingId(studioId);

      // Step 1: Create a fresh JWT cookie
      const cookieResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/set-jwt-cookie`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!cookieResponse.ok) {
        throw new Error("Authentication failed. Please login again.");
      }

      // Step 2: Update studio status
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${studioId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update studio status");
      }

      setStudios((previousStudios) =>
        previousStudios.map((studio) =>
          studio._id === studioId ? { ...studio, status: newStatus } : studio,
        ),
      );

      toast.success(`Studio is now ${newStatus}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update studio status",
      );
    } finally {
      setUpdatingId(null);
    }
  };
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-64" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-destructive">{error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-12">
      <h1 className="text-3xl font-bold text-primary">My Studio Listings</h1>

      {studios.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t added any studios yet.
          </p>

          <Button
            nativeButton={false}
            className="mt-5"
            render={<Link href="/add-studio" />}
          >
            Add Your First Studio
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <Card key={studio._id} className="overflow-hidden">
              <Image
                src={studio.image}
                alt={studio.title}
                width={600}
                height={400}
                className="h-48 w-full object-cover"
              />

              <CardHeader>
                <CardTitle>{studio.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {studio.category} · {studio.location}
                </p>

                <p className="mt-2">
                  Maximum Capacity: {studio.capacity} guests
                </p>

                <p className="mt-2 font-semibold">
                  ${studio.hourlyRate} / hour
                </p>

                <p className="mt-3 text-sm font-semibold">
                  Status:{" "}
                  <span
                    className={
                      studio.status === "active"
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {studio.status}
                  </span>
                </p>

                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  disabled={updatingId === studio._id}
                  onClick={() => handleStatusChange(studio._id, studio.status)}
                >
                  {updatingId === studio._id
                    ? "Updating..."
                    : studio.status === "active"
                      ? "Inactive"
                      : "Active"}
                </Button>

                <Link href={`/studios/edit/${studio._id}`}>
                  <Button variant="outline" className="mt-4 w-full">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Studio
                  </Button>
                </Link>

                <Link href={`/delete-studio/${studio._id}`}>
                  <Button variant="destructive" className="mt-4 w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Studio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      <MyListingsContent />
    </ProtectedRoute>
  );
}
