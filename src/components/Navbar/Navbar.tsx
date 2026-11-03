"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Aperture, Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { toast } from "sonner";

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
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    setMounted(true);
  }, []);

  // Theme toggle
  function handleThemeToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
  }

  // Track URL hash changes
  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash);
    };

    updateHash();

    window.addEventListener("hashchange", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, [pathname]);

  const isHowItWorks = pathname === "/" && hash === "#how-it-works";

  // Active navigation link
  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/" && !isHowItWorks;
    }

    if (href === "/#how-it-works") {
      return isHowItWorks;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Logout with error handling
  async function handleLogout() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "Logout failed. Please try again.");
        return;
      }

      toast.success("Logged out successfully");

      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong during logout.",
      );
    }
  }

  function closeMobileMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Aperture size={23} strokeWidth={2.2} />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
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

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? null : session?.user ? (
            <DropdownMenu>
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback>
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <span className="max-w-24 truncate text-sm font-medium">
                  {session.user.name || "User"}
                </span>

                <DropdownMenuTrigger
                  className="rounded-md p-1 outline-none hover:bg-accent"
                  aria-label="Open profile menu"
                >
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
              </div>

              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-2">
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>

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

          {/* Desktop Theme Toggle */}
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
            className="rounded-lg border p-2 transition-colors hover:bg-accent"
          >
            {mounted && theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-6 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {/* Mobile Navigation */}
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg border-l-2 px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile Account */}
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

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  {[
                    { name: "Dashboard", href: "/dashboard" },
                    { name: "Add New Studio", href: "/add-studio" },
                    { name: "My Studio Listings", href: "/my-listings" },
                    { name: "My Bookings", href: "/my-bookings" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`block rounded-lg px-4 py-3 text-sm transition-colors ${
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                          ? "bg-primary/10 font-medium text-primary"
                          : "hover:bg-accent"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-4 py-3 text-left text-sm text-destructive hover:bg-accent"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="rounded-lg border px-4 py-3 text-center text-sm"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="rounded-lg bg-primary px-4 py-3 text-center text-sm text-primary-foreground"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Theme Toggle */}
            <div className="mt-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={handleThemeToggle}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent"
              >
                <span>
                  {theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"}
                </span>

                {mounted && theme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
