"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Aperture, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

const categories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Aperture size={23} />
              </span>
              <span className="text-xl font-bold">
                Studio<span className="text-secondary">Space</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
              A creative home for creators. Discover inspiring spaces, connect
              with hosts, and bring your ideas to life.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <FaInstagram size={18} />
              </Link>

              <Link
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <FaFacebookF size={18} />
              </Link>

              <Link
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <FaXTwitter size={18} />
              </Link>

              <Link
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <FaLinkedinIn size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base font-semibold">Popular Categories</h3>
            <ul className="mt-5 space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-base font-semibold">Stay Inspired</h3>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Get creative inspiration and the latest studio updates in your
              inbox.
            </p>

            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Your email address"
                aria-label="Your email address"
                required
                className="min-w-0"
              />

              <Button type="submit" size="icon" aria-label="Subscribe">
                <ArrowRight size={18} />
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>

            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
