import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoResult, { type VideoData } from "@/components/VideoResult";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const MOCK_VIDEO: VideoData = {
  thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=450&fit=crop",
  title: "This viral dance trend is taking over 🔥 #fyp #trending #dance",
  author: "@creative_dancer",
  views: "2.4M",
  likes: "385K",
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState<VideoData | null>(null);

  const handleSubmit = (url: string) => {
    setIsLoading(true);
    setVideo(null);
    // Simulate API call
    setTimeout(() => {
      setVideo(MOCK_VIDEO);
      setIsLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection onSubmit={handleSubmit} isLoading={isLoading} />
        {video && <VideoResult video={video} />}
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
