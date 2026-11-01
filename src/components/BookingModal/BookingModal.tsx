"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio: {
    _id: string;
    title: string;
    hourlyRate: number;
    dailyRate: number;
    monthlyRate: number;
    yearlyRate: number;
    securityDeposit: number;
    capacity: number;
  };
}

export default function BookingModal({
  open,
  onOpenChange,
  studio,
}: BookingModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [guests, setGuests] = useState("1");
  const [bookingType, setBookingType] = useState<
    "hourly" | "daily" | "monthly" | "yearly"
  >("hourly");

  const [duration, setDuration] = useState("1");

  const rate = {
    hourly: studio.hourlyRate,
    daily: studio.dailyRate,
    monthly: studio.monthlyRate,
    yearly: studio.yearlyRate,
  }[bookingType];

  const totalPrice = Number(duration) * rate;

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (!date || date < todayString || !startTime) {
      toast.error("সঠিক date ও start time নির্বাচন করো");
      return;
    }

    if (!Number.isInteger(Number(duration)) || Number(duration) < 1) {
      toast.error("Duration কমপক্ষে ১ হতে হবে");
      return;
    }

    if (Number(guests) < 1 || Number(guests) > studio.capacity) {
      toast.error("Guest count studio capacity-এর মধ্যে হতে হবে");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studioId: studio._id,
            bookingDate: date,
            startTime,
            bookingType,
            duration: Number(duration),
            guests: Number(guests),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      toast.success("Booking submitted successfully!");
      onOpenChange(false);
      router.push("/my-bookings");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {studio.title}</DialogTitle>
          <DialogDescription>
            Choose your booking date and time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="booking-date">Booking Date</label>
            <Input
              id="booking-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="start-time">Start Time</label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="booking-type">Booking Type</label>
              <select
                id="booking-type"
                value={bookingType}
                onChange={(e) =>
                  setBookingType(
                    e.target.value as "hourly" | "daily" | "monthly" | "yearly",
                  )
                }
                className="w-full rounded-md border bg-background p-2"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="duration">Duration ({bookingType})</label>
              <Input
                id="duration"
                type="number"
                min="1"
                step="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="guests">Number of Guests</label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={studio.capacity}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm">
            <p>
              Duration: {duration} {bookingType}
            </p>
            <p>
              Rate: ৳{rate} / {bookingType}
            </p>
            <p>Security deposit: ৳{studio.securityDeposit}</p>
            <p className="mt-2 font-bold">
              Total: ৳{totalPrice + studio.securityDeposit}
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
