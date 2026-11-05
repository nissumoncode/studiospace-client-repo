"use client";

import Image from "next/image";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Booking,
  formatBookingDate,
  formatEndTime,
  formatTime,
  getStatusColor,
} from "./BookingCard";

interface BookingDetailsModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export default function BookingDetailsModal({
  booking,
  onClose,
}: BookingDetailsModalProps) {
  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {booking && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Booking Details</DialogTitle>
              <DialogDescription>
                Complete studio and reservation information.
              </DialogDescription>
            </DialogHeader>

            {booking.studio?.image && (
              <div className="h-52 overflow-hidden rounded-xl bg-muted sm:h-64">
                <Image
                  src={booking.studio.image}
                  alt={booking.studio.title || booking.studioTitle}
                  width={900}
                  height={500}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold">
                  {booking.studio?.title || booking.studioTitle}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {booking.studio?.category || "Studio"}
                  {booking.studio?.location
                    ? ` · ${booking.studio.location}`
                    : ""}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Badge
                    variant="outline"
                    className={getStatusColor(booking.status)}
                  >
                    {booking.status}
                  </Badge>

                  {booking.studio?.rating !== undefined && (
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {booking.studio.rating}
                      <span className="text-muted-foreground">
                        ({booking.studio.totalReviews ?? 0} reviews)
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <h4 className="mb-3 font-semibold">Host Information</h4>
                <p className="text-sm">
                  <strong>Name:</strong>{" "}
                  {booking.studio?.hostName || "Not available"}
                </p>
                <p className="mt-2 break-all text-sm">
                  <strong>Email:</strong>{" "}
                  {booking.studio?.hostEmail || "Not available"}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <h4 className="mb-3 font-semibold">Studio Information</h4>
                <p className="text-sm">
                  <strong>Location:</strong>{" "}
                  {booking.studio?.location || "Not available"}
                </p>
                <p className="mt-2 text-sm">
                  <strong>Address:</strong>{" "}
                  {booking.studio?.address || "Not available"}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                  {booking.studio?.overview || "No studio overview available."}
                </p>

                {booking.studio?.amenities?.length ? (
                  <div className="mt-4">
                    <h5 className="mb-2 text-sm font-semibold">Amenities</h5>
                    <div className="flex flex-wrap gap-2">
                      {booking.studio.amenities.map((amenity, index) => (
                        <Badge key={`${amenity}-${index}`} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border p-4">
                <h4 className="mb-3 font-semibold">Booking Information</h4>

                <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Booking Date</p>
                    <p className="mt-1 font-semibold">
                      {formatBookingDate(booking.bookingDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Start Time</p>
                    <p className="mt-1 font-semibold">
                      {formatTime(booking.startTime)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">End Time</p>
                    <p className="mt-1 font-semibold">
                      {formatEndTime(booking.endAt) !== "N/A"
                        ? formatTime(formatEndTime(booking.endAt))
                        : formatTime(booking.endTime)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Booking Type</p>
                    <p className="mt-1 font-semibold capitalize">
                      {booking.bookingType || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="mt-1 font-semibold">
                      {booking.duration
                        ? `${booking.duration} ${booking.bookingType || ""}`
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Guests</p>
                    <p className="mt-1 font-semibold">
                      {booking.guests} Persons
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Rate</p>
                    <p className="mt-1 font-semibold">
                      ${Number(booking.rate || 0).toLocaleString("en-BD")}
                      {booking.bookingType ? ` / ${booking.bookingType}` : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Security Deposit</p>
                    <p className="mt-1 font-semibold">
                      $
                      {Number(booking.securityDeposit || 0).toLocaleString(
                        "en-BD",
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-semibold">Total Price</span>
                  <span className="text-xl font-bold text-primary">
                    ${Number(booking.totalPrice || 0).toLocaleString("en-BD")}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
