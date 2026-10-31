import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Mic2,
  Music,
  Palette,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    title: "Photo Studios",
    description: "Professional spaces for stunning photography.",
    icon: Camera,
    slug: "Photo Studios",
  },
  {
    title: "Sound Stages",
    description: "Production-ready spaces for filming.",
    icon: Clapperboard,
    slug: "Sound Stages",
  },
  {
    title: "Podcast Rooms",
    description: "Create podcasts with professional setups.",
    icon: Mic2,
    slug: "Podcast Rooms",
  },
  {
    title: "Music Suites",
    description: "Spaces for music production and recording.",
    icon: Music,
    slug: "Music Suites",
  },
  {
    title: "Art Workshops",
    description: "Inspiring spaces for artistic creativity.",
    icon: Palette,
    slug: "Art Workshops",
  },
];

export default function StudioCategories() {
  return (
    <section className="w-full py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            Explore by Category
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Find Your Perfect Creative Space
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Discover inspiring spaces designed for every kind of creative
            project.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/studios?category=${encodeURIComponent(category.slug)}`}
                className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-background text-primary transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon size={27} strokeWidth={1.7} />
                  </div>

                  <h3 className="text-lg font-bold text-card-foreground">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-secondary">
                    Explore Spaces
                  </span>

                  <ArrowUpRight
                    size={19}
                    className="text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
