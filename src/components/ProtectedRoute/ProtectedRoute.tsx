"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
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

  if (isPending || !session) {
    return <p className="py-20 text-center">Checking authentication...</p>;
  }

  return <>{children}</>;
}
