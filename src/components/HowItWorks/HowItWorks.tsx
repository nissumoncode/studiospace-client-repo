import { Search, CalendarDays, CreditCard, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Find Your Studio",
    description:
      "Explore creative spaces and find the perfect studio for your project.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Date",
    description:
      "Check availability and select the date and time that work for you.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Book Your Space",
    description:
      "Confirm your booking and get ready for your creative session.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Create Something Amazing",
    description:
      "Arrive at your studio and bring your creative vision to life.",
    icon: Sparkles,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            Simple Process
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How StudioSpace Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Booking your perfect creative workspace is simple. Follow these four
            easy steps and start creating.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.number}
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex size-14 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                      <Icon size={27} strokeWidth={1.8} />
                    </div>

                    <span className="text-3xl font-bold text-muted-foreground/30">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold">{step.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {step.description}
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
