import { Zap, Gift, ShieldCheck, UserX } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Download videos in seconds with our optimized servers.",
  },
  {
    icon: Gift,
    title: "100% Free",
    description: "No hidden fees, subscriptions, or premium upsells. Ever.",
  },
  {
    icon: ShieldCheck,
    title: "No Watermark",
    description: "Get clean videos without the TikTok watermark overlay.",
  },
  {
    icon: UserX,
    title: "No Login Required",
    description: "Start downloading immediately. No account needed.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Why Choose Us?
        </h2>
        <p className="text-muted-foreground mb-14 max-w-md mx-auto">
          The simplest and most reliable TikTok video downloader
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl gradient-hero-light flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
