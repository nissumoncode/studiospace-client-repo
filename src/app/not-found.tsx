import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Aperture } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <Aperture className="mb-6 h-20 w-20 text-primary" />

      <h1 className="text-7xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">Studio Not Found</h2>

      <p className="mt-3 max-w-md text-muted-foreground">
        Looks like this creative space is out of frame. Let's get you back to
        exploring.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Return to Home
      </Link>
    </main>
  );
}
