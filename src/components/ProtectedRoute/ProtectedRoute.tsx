"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Aperture } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      const currentUrl = pathname + window.location.search;

      router.replace(`/login?callbackURL=${encodeURIComponent(currentUrl)}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Aperture
          className="animate-spin text-primary"
          size={48}
          strokeWidth={1.5}
        />
        <p className="text-sm font-medium text-muted-foreground">
          Preparing your creative space...
        </p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
