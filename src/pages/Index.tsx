import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoResult, { type VideoData } from "@/components/VideoResult";
import DownloadHistory from "@/components/DownloadHistory";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const HISTORY_KEY = "tiksave_history";

const formatCount = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
};

const loadHistory = (): VideoData[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveHistory = (video: VideoData) => {
  const history = loadHistory().filter((v) => v.playUrl !== video.playUrl);
  history.unshift(video);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 5)));
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [history, setHistory] = useState<VideoData[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setVideo(null);

    try {
      const { data, error } = await supabase.functions.invoke("tiktok-proxy", {
        body: { url },
      });

      if (error) throw error;

      if (data?.code !== 0 || !data?.data) {
        const msg = data?.data === "private" ? "This video is private" : data?.msg || "Something went wrong, try again";
        toast.error(msg);
        return;
      }

      const d = data.data;
      const videoData: VideoData = {
        thumbnail: d.cover || d.origin_cover,
        title: d.title || "Untitled",
        author: d.author?.nickname || d.author?.unique_id || "Unknown",
        views: formatCount(d.play_count || 0),
        likes: formatCount(d.digg_count || 0),
        playUrl: d.play,
        wmPlayUrl: d.wmplay || d.play,
        musicUrl: d.music,
      };

      setVideo(videoData);
      saveHistory(videoData);
      setHistory(loadHistory());
      toast.success("Video found! Choose a download format.");
    } catch {
      toast.error("Something went wrong, try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (v: VideoData) => {
    setVideo(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection onSubmit={handleSubmit} isLoading={isLoading} />
        {video && <VideoResult video={video} />}
        <DownloadHistory history={history} onSelect={handleSelectFromHistory} onClear={handleClearHistory} />
        <div id="how-it-works"><HowItWorks /></div>
        <div id="features"><FeaturesSection /></div>
        <div id="faq"><FAQSection /></div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
