import { Aperture } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="animate-spin text-primary">
        <Aperture size={48} strokeWidth={1.5} />
      </div>

      <p className="text-sm font-medium text-muted-foreground">
        Preparing your creative space...
      </p>
    </main>
  );
}
