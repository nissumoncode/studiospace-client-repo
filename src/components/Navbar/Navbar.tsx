"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Aperture, Menu, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);

    updateHash();
    window.addEventListener("hashchange", updateHash);

    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  const isHowItWorks = pathname === "/" && hash === "#how-it-works";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Aperture size={23} strokeWidth={2.2} />
          </span>
          <span className="text-xl font-bold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.name === "How It Works"
                ? isHowItWorks
                : link.name === "Home"
                  ? pathname === "/" && !isHowItWorks
                  : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? null : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none">
                <Avatar>
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback>
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-2">
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>

                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/add-studio")}>
                  Add New Studio
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/my-listings")}>
                  My Studio Listings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/my-bookings")}>
                  My Bookings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-accent"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="rounded-lg border p-2 lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-border bg-background px-6 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-3 border-t border-border pt-4">
              {isPending ? null : session?.user ? (
                <>
                  <div className="mb-3 flex items-center gap-3 px-3">
                    <Avatar>
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-accent"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/add-studio"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-accent"
                  >
                    Add New Studio
                  </Link>

                  <Link
                    href="/my-listings"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-accent"
                  >
                    My Studio Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-accent"
                  >
                    My Bookings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-4 py-3 text-left text-sm hover:bg-accent"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg border px-4 py-3 text-center text-sm"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-primary px-4 py-3 text-center text-sm text-primary-foreground"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
