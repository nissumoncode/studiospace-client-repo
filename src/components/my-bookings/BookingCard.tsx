"use client";

import Image from "next/image";
import { CalendarDays, Eye, Star, Trash2, Users, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Studio {
  _id: string;
  title?: string;
  image?: string;
  category?: string;
  location?: string;
  address?: string;
  hostName?: string;
  hostEmail?: string;
  rating?: number;
  totalReviews?: number;
  amenities?: string[];
  overview?: string;
  capacity?: number;
}

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  bookingDate: string;
  startTime: string;
  endTime?: string;
  startAt?: string;
  endAt?: string;
  bookingType?: "hourly" | "daily" | "monthly" | "yearly";
  duration?: number;
  guests: number;
  rate?: number;
  securityDeposit?: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  studio?: Studio | null;
}

export function formatBookingDate(date: string) {
  if (!date) return "N/A";

  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatEndTime(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
    date.getUTCMinutes(),
  ).padStart(2, "0")}`;
}

export function formatTime(value?: string) {
  if (!value) return "N/A";

  const [hourString, minute] = value.split(":");
  const hour = Number(hourString);

  if (!Number.isInteger(hour) || !minute) return value;

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}

export function getStatusColor(status: Booking["status"]) {
  switch (status) {
    case "Pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Confirmed":
      return "border-green-200 bg-green-50 text-green-700";
    case "Completed":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "Cancelled":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "";
  }
}

interface BookingCardProps {
  booking: Booking;
  processingId: string | null;
  onDetails: (booking: Booking) => void;
  onCancel: (bookingId: string) => void;
  onDelete: (booking: Booking) => void;
}

export default function BookingCard({
  booking,
  processingId,
  onDetails,
  onCancel,
  onDelete,
}: BookingCardProps) {
  const studio = booking.studio;

  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-36">
            {studio?.image ? (
              <Image
                src={studio.image}
                alt={studio.title || booking.studioTitle}
                width={400}
                height={300}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-1 text-lg font-bold md:text-xl">
              {studio?.title || booking.studioTitle}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {studio?.category || "Studio"}
              {studio?.location ? ` · ${studio.location}` : ""}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`rounded-full ${getStatusColor(booking.status)}`}
              >
                {booking.status}
              </Badge>

              {studio?.rating !== undefined && (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {studio.rating}
                  <span>({studio.totalReviews ?? 0} reviews)</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t pt-4 lg:w-[43%] lg:shrink-0 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Booking Date
              </div>
              <p className="text-sm font-semibold">
                {formatBookingDate(booking.bookingDate)}
              </p>
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Guests
              </div>
              <p className="text-sm font-semibold">{booking.guests} Persons</p>
            </div>

            <div className="min-w-0">
              <div className="mb-2 text-xs text-muted-foreground">
                Total Price
              </div>
              <p className="text-lg font-bold text-primary">
                ${Number(booking.totalPrice || 0).toLocaleString("en-BD")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => onDetails(booking)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Details
          </Button>

          {booking.status === "Pending" && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
              disabled={processingId === booking._id}
              onClick={() => onCancel(booking._id)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            className="rounded-lg"
            disabled={processingId === booking._id}
            onClick={() => onDelete(booking)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
