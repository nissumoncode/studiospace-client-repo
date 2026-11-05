import Link from "next/link";
import { CalendarDays, Compass, ListChecks, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

const actions = [
  {
    title: "Add New Studio",
    description: "List a new creative space and start hosting creators.",
    icon: Plus,
    href: "/add-studio",
  },
  {
    title: "My Studio Listings",
    description: "Update, activate, or manage your listed studios.",
    icon: ListChecks,
    href: "/my-listings",
  },
  {
    title: "My Bookings",
    description: "Review, confirm, and manage your reservations.",
    icon: CalendarDays,
    href: "/my-bookings",
  },
  {
    title: "Explore Studios",
    description: "Discover creative spaces for your next project.",
    icon: Compass,
    href: "/studios",
  },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            Your Workspace
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Everything you need to manage your studios, bookings, and creative
            projects in one place.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex min-h-48 flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-105">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>

                  <h2 className="text-lg font-bold">{action.title}</h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {action.description}
                  </p>
                </div>

                <span className="mt-5 text-sm font-semibold text-secondary transition-colors group-hover:text-accent-foreground">
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </ProtectedRoute>
  );
}
