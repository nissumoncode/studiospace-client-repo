import {
  Aperture,
  Target,
  Eye,
  ShieldCheck,
  Users,
  Sparkles,
  Camera,
  Music,
  Mic,
  Palette,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Spaces",
    description:
      "Discover creative spaces with transparent information, verified profiles, and reliable hosts.",
  },
  {
    icon: Users,
    title: "Creator Community",
    description:
      "Connect with photographers, filmmakers, musicians, podcasters, and other creative minds.",
  },
  {
    icon: Sparkles,
    title: "Creative Freedom",
    description:
      "Find the right environment and equipment to bring your ideas and projects to life.",
  },
];

const creativeFields = [
  { icon: Camera, title: "Photography" },
  { icon: Music, title: "Music Production" },
  { icon: Mic, title: "Podcasting" },
  { icon: Palette, title: "Art & Design" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full">
      {/* Hero */}
      <section className="px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-24">
            <Badge
              variant="outline"
              className="mb-5 border-primary-foreground/40 text-primary-foreground"
            >
              About StudioSpace
            </Badge>

            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Where Creativity Finds Its Space
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
              We connect creators with inspiring workspaces where ideas become
              experiences, projects become reality, and creativity has no
              limits.
            </p>

            <Link
              href="/studios"
              className="mt-8 inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors hover:bg-secondary/80"
            >
              Explore Studios
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4">
              Our Story
            </Badge>

            <h2 className="text-3xl font-bold sm:text-4xl">
              A Space for Every Creative Vision
            </h2>

            <p className="mt-6 text-sm leading-8 text-muted-foreground sm:text-base">
              StudioSpace is a peer-to-peer creative workspace marketplace
              designed to make finding and sharing creative spaces easier.
            </p>

            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
              Whether you are a photographer looking for the perfect studio, a
              podcaster searching for a recording room, or a musician needing a
              professional music suite, StudioSpace helps you discover spaces
              that match your creative needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {creativeFields.map((field) => {
              const Icon = field.icon;

              return (
                <Card key={field.title}>
                  <CardContent className="flex min-h-36 flex-col items-center justify-center gap-4 p-5 text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Icon size={25} />
                    </div>

                    <h3 className="text-sm font-semibold sm:text-base">
                      {field.title}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <Badge variant="outline" className="mb-4">
              Our Purpose
            </Badge>

            <h2 className="text-3xl font-bold sm:text-4xl">Mission & Vision</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-7 sm:p-9">
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Target size={25} />
                </div>

                <h3 className="text-xl font-bold">Our Mission</h3>

                <p className="mt-4 text-sm leading-8 text-muted-foreground">
                  To make creative workspaces accessible to everyone by
                  connecting talented creators with suitable spaces and helping
                  hosts share their studios with the world.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-7 sm:p-9">
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Eye size={25} />
                </div>

                <h3 className="text-xl font-bold">Our Vision</h3>

                <p className="mt-4 text-sm leading-8 text-muted-foreground">
                  To build a connected creative community where every creator
                  can access inspiring environments, collaborate, and turn
                  ambitious ideas into meaningful work.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <Badge variant="outline" className="mb-4">
              Why StudioSpace
            </Badge>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Built Around Your Creativity
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Everything you need to discover spaces, connect with hosts, and
              focus on creating.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <Card key={benefit.title} className="h-full">
                  <CardContent className="p-7">
                    <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Icon size={25} />
                    </div>

                    <h3 className="text-lg font-semibold">{benefit.title}</h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <Aperture className="mx-auto mb-5" size={38} />

          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Create Something Amazing?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-primary-foreground/80">
            Find your perfect creative space and bring your next big idea to
            life.
          </p>

          <Link
            href="/studios"
            className="mt-7 inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors hover:bg-secondary/80"
          >
            Find Your Space
          </Link>
        </div>
      </section>
    </main>
  );
}
