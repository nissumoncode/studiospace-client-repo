"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import BookingModal from "@/components/BookingModal/BookingModal";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  yearlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  address: string;
  image: string;
  imageGallery: string[];
  overview: string;
  amenities: string[];
  hostName: string;
  rating: number;
  totalReviews: number;
}

export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Studio load করা যায়নি");
        }

        setStudio(result.data);
      } catch {
        setError("Studio load করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [id]);

  if (loading) {
    return <p className="py-20 text-center">Loading studio...</p>;
  }

  if (error || !studio) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        {error || "Studio পাওয়া যায়নি।"}
      </p>
    );
  }

  const gallery = (
    studio.imageGallery?.length ? studio.imageGallery : [studio.image]
  ).filter((url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      <p className="mb-2 text-sm font-semibold text-secondary">
        {studio.category}
      </p>

      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        {studio.title}
      </h1>

      <p className="mt-3 flex items-center gap-2 text-muted-foreground">
        <MapPin size={17} />
        {studio.location} · {studio.address}
      </p>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="mt-6"
      >
        {gallery.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className="relative h-64 overflow-hidden rounded-2xl">
              <Image
                src={image}
                alt={`${studio.title} photo ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="text-xl font-bold text-foreground">
            About this studio
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            {studio.overview}
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">Amenities</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {studio.amenities.map((amenity) => (
              <li
                key={amenity}
                className="rounded-full border border-border px-3 py-2 text-sm"
              >
                {amenity}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-bold text-foreground">Hosted by</h2>
          <p className="mt-2 text-muted-foreground">{studio.hostName}</p>
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <p>Hourly: ৳{studio.hourlyRate}</p>
            <p>Daily: ৳{studio.dailyRate}</p>
            <p>Monthly: ৳{studio.monthlyRate}</p>
            <p>Yearly: ৳{studio.yearlyRate}</p>
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Star size={16} className="fill-accent text-accent" />
            {studio.rating} ({studio.totalReviews ?? 0} reviews)
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Security deposit: ৳{studio.securityDeposit}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Maximum capacity: {studio.capacity} people
          </p>

          <button
            onClick={() => setIsBookingOpen(true)}
            type="button"
            className="mt-6 w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Book Workspace Now
          </button>
        </aside>
      </div>
      <BookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        studio={studio}
      />
    </main>
  );
}
