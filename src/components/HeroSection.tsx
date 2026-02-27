import { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const HeroSection = ({ onSubmit, isLoading }: HeroSectionProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (input: string) => {
    const tiktokRegex = /^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/.+/i;
    return tiktokRegex.test(input.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) {
      setError("Please paste a TikTok video link");
      return;
    }
    if (!validateUrl(url)) {
      setError("Please enter a valid TikTok URL");
      return;
    }
    onSubmit(url.trim());
  };

  return (
    <section className="relative overflow-hidden gradient-hero-light py-20 md:py-32">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative z-10 max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-accent-foreground mb-6 animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          100% Free — No Registration
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Download TikTok Videos{" "}
          <span className="text-primary">Free & Fast</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Save TikTok videos without watermark in HD quality. No login, no limits, completely free.
        </p>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Paste TikTok link here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                className="pl-12 h-14 text-base rounded-xl border-2 border-border bg-background shadow-card focus:border-primary focus:ring-primary/20 transition-all"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-14 px-8 text-base font-semibold rounded-xl gradient-hero text-primary-foreground shadow-soft hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin-slow mr-2" />
              ) : null}
              {isLoading ? "Fetching..." : "Download"}
            </Button>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 mt-3 text-destructive text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
