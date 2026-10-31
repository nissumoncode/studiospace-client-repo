import FeaturedStudios from "@/components/FeaturedStudios/FeaturedStudios";
import Hero from "@/components/Hero/Hero";
import HostGuarantee from "@/components/HostGuarantee/HostGuarantee";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import StudioCategories from "@/components/StudioCategories/StudioCategories";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Hero />
      <StudioCategories />
      <FeaturedStudios />
      <HowItWorks />
      <HostGuarantee />
    </main>
  );
}
