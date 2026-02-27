import { useState } from "react";
import { Download, Music, Eye, Heart, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface VideoData {
  thumbnail: string;
  title: string;
  author: string;
  views: string;
  likes: string;
  playUrl: string;
  wmPlayUrl: string;
  musicUrl: string;
}

interface VideoResultProps {
  video: VideoData;
}

const VideoResult = ({ video }: VideoResultProps) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (url: string, format: string, filename: string) => {
    setDownloading(format);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success(`${format} download started!`);
    } catch {
      toast.error(`Failed to download ${format}. Try again.`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="rounded-2xl overflow-hidden bg-card shadow-elevated border border-border animate-fade-up">
          <div className="relative aspect-video bg-muted overflow-hidden">
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-primary-foreground font-semibold text-lg line-clamp-2">{video.title}</h3>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <User className="h-4 w-4 text-primary" />
                {video.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {video.views} views
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-primary" />
                {video.likes} likes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => handleDownload(video.playUrl, "MP4 HD", "tiktok-hd.mp4")}
                disabled={!!downloading}
                className="h-12 font-semibold gradient-success text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {downloading === "MP4 HD" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                MP4 HD
              </Button>
              <Button
                onClick={() => handleDownload(video.wmPlayUrl, "MP4 SD", "tiktok-sd.mp4")}
                disabled={!!downloading}
                className="h-12 font-semibold gradient-info text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {downloading === "MP4 SD" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                MP4 SD
              </Button>
              <Button
                onClick={() => handleDownload(video.musicUrl, "MP3", "tiktok-audio.mp3")}
                disabled={!!downloading}
                className="h-12 font-semibold gradient-warning text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {downloading === "MP3" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Music className="h-4 w-4 mr-2" />}
                MP3 Audio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoResult;
