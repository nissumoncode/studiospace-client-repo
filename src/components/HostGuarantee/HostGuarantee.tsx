import { ShieldCheck, BadgeCheck, Wrench, Headset } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "Added protection and peace of mind for hosts and creators during every booking.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    description:
      "Connect with trusted hosts and creators through verified community profiles.",
  },
  {
    icon: Wrench,
    title: "Equipment Safety",
    description:
      "Keep your creative sessions safe with clear equipment guidelines and support.",
  },
  {
    icon: Headset,
    title: "24/7 Creator Support",
    description:
      "Get help whenever you need it from our dedicated creator support team.",
  },
];

export default function HostGuarantee() {
  return (
    <section className="w-full py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3">
            Your Trust Matters
          </Badge>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Create With Confidence
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Your creative journey deserves a safe, trusted, and supportive
            environment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="h-full">
                <CardContent className="p-6">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon size={25} />
                  </div>

                  <h3 className="text-lg font-semibold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
