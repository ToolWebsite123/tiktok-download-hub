import { Download, Music, Eye, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface VideoData {
  thumbnail: string;
  title: string;
  author: string;
  views: string;
  likes: string;
}

interface VideoResultProps {
  video: VideoData;
}

const VideoResult = ({ video }: VideoResultProps) => {
  const handleDownload = (format: string) => {
    toast.success(`Starting ${format} download...`, {
      description: "Your file will be ready in a moment.",
    });
  };

  return (
    <section className="py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="rounded-2xl overflow-hidden bg-card shadow-elevated border border-border animate-fade-up">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-primary-foreground font-semibold text-lg line-clamp-2">
                {video.title}
              </h3>
            </div>
          </div>

          {/* Info */}
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

            {/* Download Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => handleDownload("MP4 HD")}
                className="h-12 font-semibold gradient-success text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Download className="h-4 w-4 mr-2" />
                MP4 HD
              </Button>
              <Button
                onClick={() => handleDownload("MP4 SD")}
                className="h-12 font-semibold gradient-info text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Download className="h-4 w-4 mr-2" />
                MP4 SD
              </Button>
              <Button
                onClick={() => handleDownload("MP3 Audio")}
                className="h-12 font-semibold gradient-warning text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Music className="h-4 w-4 mr-2" />
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
