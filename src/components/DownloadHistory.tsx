import { type VideoData } from "@/components/VideoResult";
import { Eye, Heart, User, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadHistoryProps {
  history: VideoData[];
  onSelect: (video: VideoData) => void;
  onClear: () => void;
}

const DownloadHistory = ({ history, onSelect, onClear }: DownloadHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <section className="py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Downloads</h3>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
        <div className="space-y-3">
          {history.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className="w-full flex items-center gap-4 p-3 rounded-xl border border-border bg-card hover:shadow-card transition-all text-left group"
            >
              <img src={item.thumbnail} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{item.author}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{item.views}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{item.likes}</span>
                </div>
              </div>
              <RotateCcw className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DownloadHistory;
