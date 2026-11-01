"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

interface Booking {
  _id: string;
  studioTitle: string;
  bookingDate: string;
  startTime: string;
  endTime?: string;
  startAt?: string;
  endAt?: string;
  bookingType?: "hourly" | "daily" | "monthly" | "yearly";
  duration?: number;
  guests: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

function MyBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/my-bookings`,
        { credentials: "include" },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch bookings");
      }
      setError("");
      setBookings(result.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleCancelBooking = async (bookingId: string) => {
    try {
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

      toast.success("Booking cancelled successfully");

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel booking",
      );
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      await fetchBookings();
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl space-y-4 px-4 py-12">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>

      {error ? (
        <div className="space-y-3">
          <p>{error}</p>
          <Button onClick={fetchBookings}>Try Again</Button>
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">No bookings yet</h2>
            <p className="mt-2 text-muted-foreground">
              Your workspace bookings will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <Card key={booking._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{booking.studioTitle}</CardTitle>
                <Badge>{booking.status}</Badge>
              </CardHeader>

              <CardContent className="grid gap-3 sm:grid-cols-2">
                <p>
                  <strong>Guests:</strong> {booking.guests}
                </p>
                {booking.bookingType && (
                  <p>
                    <strong>Booking Type:</strong> {booking.bookingType}
                  </p>
                )}

                {booking.duration && (
                  <p>
                    <strong>Duration:</strong> {booking.duration}{" "}
                    {booking.bookingType}
                  </p>
                )}
                {booking.startAt && booking.endAt ? (
                  <>
                    <p>
                      <strong>Starts:</strong>{" "}
                      {new Date(booking.startAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Ends:</strong>{" "}
                      {new Date(booking.endAt).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Date:</strong> {booking.bookingDate}
                    </p>
                    <p>
                      <strong>Time:</strong> {booking.startTime} –{" "}
                      {booking.endTime}
                    </p>
                  </>
                )}
                <p>
                  <strong>Total:</strong> ৳{booking.totalPrice}
                </p>
                {booking.status === "Pending" && (
                  <div className="sm:col-span-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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
