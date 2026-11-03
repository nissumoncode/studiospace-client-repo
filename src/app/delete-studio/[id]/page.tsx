"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  address: string;
  image: string;
  amenities: string[];
  overview: string;
  hostEmail: string;
};

export default function DeleteStudioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/login");
      return;
    }

    async function fetchStudio() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/my-studios/${id}`,
          {
            credentials: "include",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || "Studio not found");
          return;
        }

        if (result.data.hostEmail !== session?.user.email) {
          toast.error("You cannot delete this studio");
          router.push("/my-listings");
          return;
        }

        setStudio(result.data);
      } catch {
        toast.error("Failed to load studio");
      } finally {
        setLoading(false);
      }
    }

    fetchStudio();
  }, [id, session, isPending, router]);

  async function handleDelete() {
    if (!studio) return;

    setDeleting(true);

    try {
      const cookieResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/set-jwt-cookie`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!cookieResponse.ok) {
        toast.error("Authentication failed. Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to delete studio");
        return;
      }

      toast.success("Studio deleted successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  if (loading || isPending) {
    return <main className="container mx-auto px-4 py-12">Loading...</main>;
  }

  if (!studio) {
    return (
      <main className="container mx-auto px-4 py-12">Studio not found.</main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-12">
      <Card className="mx-auto max-w-2xl overflow-hidden">
        <Image
          src={studio.image}
          alt={studio.title}
          width={800}
          height={400}
          className="h-64 w-full object-cover"
        />

        <CardHeader>
          <CardTitle>{studio.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {studio.category} · {studio.location}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          <p>Hourly Rate: ${studio.hourlyRate}</p>
          <p>Security Deposit: ${studio.securityDeposit}</p>
          <p>Maximum Capacity: {studio.capacity}</p>
          <p>Address: {studio.address}</p>
          <p>{studio.overview}</p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/my-listings")}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setConfirmOpen(true)}
            >
              Delete Studio
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this studio?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{studio.title}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
