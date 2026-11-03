"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { authClient } from "@/lib/auth-client";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    tag: "FOR PHOTOGRAPHERS & CREATORS",
    title: "Your Vision. Your Space. Your Masterpiece.",
    description:
      "Discover inspiring photography studios and bring your creative ideas to life.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: 2,
    tag: "FOR FILMMAKERS & PRODUCERS",
    title: "Make Every Frame Extraordinary.",
    description:
      "Find professional production spaces designed to turn your ideas into reality.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: 3,
    tag: "FOR PODCASTERS & MUSICIANS",
    title: "Create Without Limits.",
    description:
      "Explore creative studios, podcast rooms and music spaces built for inspiration.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=2400&q=85",
  },
];

export default function Hero() {
  const { data: session } = authClient.useSession();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pt-8">
      <Swiper
        modules={[Autoplay, Pagination]}
        speed={900}
        loop
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="studio-hero h-[400px] overflow-hidden rounded-2xl sm:h-[440px] lg:h-[480px] sm:rounded-3xl"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="h-full">
            <div
              className="flex h-full items-center bg-cover bg-center px-6 py-6 sm:px-10 lg:px-16"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(18,60,50,0.92), rgba(18,60,50,0.35)), url('${slide.image}')`,
              }}
            >
              <div className="w-full max-w-7xl">
                <div className="max-w-3xl text-white">
                  <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] backdrop-blur-md sm:text-xs">
                    {slide.tag}
                  </span>

                  <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                    {slide.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
                    <Link
                      href="/studios"
                      className="rounded-lg bg-[#C5A66A] px-5 py-3 text-sm font-semibold text-[#123C32] transition hover:bg-[#d5ba83] sm:px-7 sm:py-3.5 sm:text-base"
                    >
                      Explore Studios →
                    </Link>

                    <Link
                      href={session ? "/add-studio" : "/login"}
                      className="rounded-lg border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 sm:px-7 sm:py-3.5 sm:text-base"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
