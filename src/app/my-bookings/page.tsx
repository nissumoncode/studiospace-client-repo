"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

import BookingCard, {
  type Booking,
} from "@/components/my-bookings/BookingCard";
import BookingDetailsModal from "@/components/my-bookings/BookingDetailsModal";

function MyBookingsContent() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteBooking, setDeleteBooking] = useState<Booking | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/my-bookings`,
        { credentials: "include" },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch bookings");
      }

      setBookings(result.data || []);
      setError("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/my-bookings`,
          { credentials: "include" },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch bookings");
        }

        if (isMounted) {
          setBookings(result.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setProcessingId(bookingId);

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking,
        ),
      );

      setSelectedBooking((previous) =>
        previous?._id === bookingId
          ? { ...previous, status: "Cancelled" }
          : previous,
      );

      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel booking",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteBooking = async () => {
    if (!deleteBooking) return;

    const bookingId = deleteBooking._id;

    try {
      setProcessingId(bookingId);

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete booking");
      }

      setBookings((previous) =>
        previous.filter((booking) => booking._id !== bookingId),
      );

      setDeleteBooking(null);

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking(null);
      }

      toast.success("Booking deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete booking",
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-12">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Your reservations
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage and view all your studio bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="flex h-9 items-center rounded-full px-4"
          >
            {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
          </Badge>

          <Button className="h-9" onClick={() => router.push("/studios")}>
            + Add New Booking
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchBookings}>Try Again</Button>
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-5">
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">No bookings yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Your workspace bookings will appear here.
            </p>

            <Button className="mt-5" onClick={() => router.push("/studios")}>
              Explore Studios
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              processingId={processingId}
              onDetails={setSelectedBooking}
              onCancel={handleCancelBooking}
              onDelete={setDeleteBooking}
            />
          ))}
        </div>
      )}

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      {/* Delete confirmation modal */}
      <Dialog
        open={!!deleteBooking}
        onOpenChange={(open) => !open && setDeleteBooking(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Booking?</DialogTitle>
            <DialogDescription>
              This booking will be permanently removed from your booking list.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteBooking(null)}
              disabled={!!processingId}
            >
              Keep Booking
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteBooking}
              disabled={!!processingId}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {processingId === deleteBooking?._id
                ? "Deleting..."
                : "Delete Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}
