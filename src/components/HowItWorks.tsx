import { Link2, ClipboardPaste, Download } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Copy TikTok Link",
    description: "Open TikTok and copy the share link of any video you want to download.",
  },
  {
    icon: ClipboardPaste,
    title: "Paste It Here",
    description: "Paste the copied link into the input field above and hit the download button.",
  },
  {
    icon: Download,
    title: "Click Download",
    description: "Choose your preferred format and quality, then download instantly.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          How It Works
        </h2>
        <p className="text-muted-foreground mb-14 max-w-md mx-auto">
          Download any TikTok video in just three easy steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-border" />
              )}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl gradient-hero-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-hero text-primary-foreground text-sm font-bold flex items-center justify-center shadow-soft">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
