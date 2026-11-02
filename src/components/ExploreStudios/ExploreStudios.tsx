"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  image: string;
  rating: number;
  totalReviews: number;
}

const categories = [
  "All",
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

function ExploreStudiosContent() {
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All",
  );

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        setError("");

        const query =
          selectedCategory === "All"
            ? ""
            : `?category=${encodeURIComponent(selectedCategory)}`;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/studios${query}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch studios");
        }

        const result = await response.json();
        setStudios(result.data || []);
      } catch {
        setError("Could not load studios. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, [selectedCategory, retryCount]);

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge variant="secondary" className="mb-4">
            Explore Creative Spaces
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find Your Perfect Studio
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Discover professional creative spaces for your next project.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-56 w-full rounded-none" />
                <CardContent className="space-y-4 p-5">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="mb-4 text-destructive">{error}</p>
            <Button onClick={() => setRetryCount((prev) => prev + 1)}>
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && studios.length === 0 && (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">No studios found</h2>
            <p className="mt-2 text-muted-foreground">
              Try selecting another category.
            </p>
            <Button className="mt-5" onClick={() => setSelectedCategory("All")}>
              View All Studios
            </Button>
          </div>
        )}

        {!loading && !error && studios.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <Card
                key={studio._id}
                className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={studio.image}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <CardContent className="space-y-3 p-5">
                  <Badge variant="secondary">{studio.category}</Badge>

                  <h2 className="text-xl font-bold">{studio.title}</h2>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    <span>{studio.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-accent text-accent" />
                      <span className="text-sm font-medium">
                        {studio.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({studio.totalReviews} reviews)
                      </span>
                    </div>

                    <p className="font-bold text-primary">
                      ${studio.hourlyRate}
                      <span className="text-xs font-normal text-muted-foreground">
                        /hr
                      </span>
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="px-5 pb-5">
                  <Button
                    nativeButton={false}
                    className="w-full"
                    render={<Link href={`/studios/${studio._id}`} />}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ExploreStudios() {
  return (
    <Suspense
      fallback={<div className="py-20 text-center">Loading studios...</div>}
    >
      <ExploreStudiosContent />
    </Suspense>
  );
}
