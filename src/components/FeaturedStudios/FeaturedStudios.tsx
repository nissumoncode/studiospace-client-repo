"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  image: string;
  rating: number;
  location: string;
}

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/studios/featured`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch studios");
        }

        const result = await response.json();
        setStudios(result.data);
      } catch {
        setError("Failed to load studios. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  return (
    <section className="w-full py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            Handpicked Spaces
          </p>

          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Featured Studios
          </h2>

          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Explore some of our top-rated creative spaces.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-56 w-full rounded-none" />
                <CardContent className="space-y-4 p-5">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <p className="py-10 text-center text-muted-foreground">{error}</p>
        )}

        {!loading && !error && studios.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">
            No studios available yet.
          </p>
        )}

        {!loading && !error && studios.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={studio.image}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-card-foreground">
                      {studio.title}
                    </h3>

                    <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-secondary">
                      <Star size={15} className="fill-accent text-accent" />
                      {studio.rating}
                    </span>
                  </div>

                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    {studio.location}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <p className="font-bold text-foreground">
                      ${studio.hourlyRate}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / hour
                      </span>
                    </p>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
