"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  capacity: number;
  location: string;
  image: string;
};

function MyListingsContent() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudios() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/my-studios`,
          { credentials: "include" },
        );

        const result = await response.json();

        if (response.ok) {
          setStudios(result.data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStudios();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12">Loading studios...</main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-12">
      <h1 className="text-3xl font-bold text-primary">My Studio Listings</h1>

      {studios.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          You haven&apos;t added any studios yet.
        </p>
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

                <Link href={`/edit-studio/${studio._id}`}>
                  <Button variant="outline" className="mt-4 w-full">
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
