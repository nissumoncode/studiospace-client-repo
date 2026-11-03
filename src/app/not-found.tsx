import Link from "next/link";

import { Camera, Clapperboard, Mic2, Palette } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 grid grid-cols-2 gap-3">
        <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Camera size={42} />
        </div>

        <div className="flex size-24 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Clapperboard size={42} />
        </div>

        <div className="flex size-24 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <Mic2 size={42} />
        </div>

        <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Palette size={42} />
        </div>
      </div>

      <h1 className="text-7xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">Studio Not Found</h2>

      <p className="mt-3 max-w-md text-muted-foreground">
        Looks like this creative space is out of frame. Let&apos;s get you back
        to exploring.
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
