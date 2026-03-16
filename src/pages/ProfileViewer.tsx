import { useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  Loader2,
  Pin,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Download,
  Play,
  User,
  MapPin,
  Calendar,
  ArrowUpDown,
} from "lucide-react";

interface UserInfo {
  nickname: string;
  unique_id: string;
  avatar: string;
  follower_count: number;
  following_count: number;
  heart_count: number;
  video_count: number;
  bio: string;
  verified: boolean;
  region: string;
  create_time: number;
}

interface Video {
  video_id: string;
  title: string;
  cover: string;
  play_count: number;
  digg_count: number;
  comment_count: number;
  share_count: number;
  create_time: number;
  is_top: boolean;
  play: string;
  wmplay: string;
  music: string;
  _originalIndex?: number;
}

type SortMode = "latest" | "popular" | "oldest";

const formatCount = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
};

const formatDate = (ts: number): string => {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProfileViewer = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleSearch = async () => {
    const clean = username.replace(/^@/, "").trim();
    if (!clean) return;

    setIsLoading(true);
    setVideos([]);
    setUserInfo(null);
    setCursor("");
    setHasMore(false);

    try {
      const { data, error } = await supabase.functions.invoke("get-profile-videos", {
        body: { username: clean },
      });

      if (error) throw error;
      if (!data?.success) {
        toast.error(data?.error || "User not found");
        if (data?.userInfo) setUserInfo(data.userInfo);
        return;
      }

      setUserInfo(data.userInfo);
      setVideos(
        (data.videos || []).map((v: Video, i: number) => ({
          ...v,
          _originalIndex: i,
        }))
      );
      setHasMore(data.hasMore || false);
      setCursor(data.cursor || "");
      toast.success(`Found ${data.videos?.length || 0} videos`);
    } catch {
      toast.error("Something went wrong, try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!cursor || isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const clean = username.replace(/^@/, "").trim();
      const { data, error } = await supabase.functions.invoke("get-profile-videos", {
        body: { username: clean, cursor },
      });

      if (error) throw error;
      if (!data?.success) {
        toast.error(data?.error || "Failed to load more");
        return;
      }

      const currentLength = videos.length;
      const newVideos = (data.videos || []).map((v: Video, i: number) => ({
        ...v,
        _originalIndex: currentLength + i,
      }));

      setVideos((prev) => [...prev, ...newVideos]);
      setHasMore(data.hasMore || false);
      setCursor(data.cursor || "");
    } catch {
      toast.error("Failed to load more videos");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sortedVideos = useMemo(() => {
    const pinned = videos.filter((v) => v.is_top);
    const rest = videos.filter((v) => !v.is_top);

    const sortFn = (a: Video, b: Video): number => {
      switch (sortMode) {
        case "latest":
          if (a.create_time > 0 && b.create_time > 0) {
            return b.create_time - a.create_time;
          }
          return (a._originalIndex ?? 0) - (b._originalIndex ?? 0);
        case "oldest":
          if (a.create_time > 0 && b.create_time > 0) {
            return a.create_time - b.create_time;
          }
          return (b._originalIndex ?? 0) - (a._originalIndex ?? 0);
        case "popular":
          return b.play_count - a.play_count;
        default:
          return 0;
      }
    };

    const sortedRest = [...rest].sort(sortFn);
    return [...pinned, ...sortedRest];
  }, [videos, sortMode]);

  const handleDownload = useCallback(async (video: Video, type: "hd" | "sd" | "mp3") => {
    setDownloadingId(`${video.video_id}-${type}`);
    try {
      const url = type === "mp3" ? video.music : type === "hd" ? video.play : video.wmplay;
      if (!url) {
        toast.error("Download URL not available");
        return;
      }
      const resp = await fetch(url);
      const blob = await resp.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${video.video_id}_${type}.${type === "mp3" ? "mp3" : "mp4"}`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success("Download started!");
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloadingId(null);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Search Section */}
        <section className="py-12 gradient-hero-light">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              TikTok Profile Viewer
            </h1>
            <p className="text-muted-foreground mb-6">
              Browse and download all videos from any TikTok profile
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2 max-w-lg mx-auto"
            >
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter TikTok username (e.g. @charlidamelio)"
                className="flex-1 bg-background"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="gradient-hero text-primary-foreground">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </section>

        {/* User Info */}
        {userInfo && (
          <section className="py-8 border-b border-border">
            <div className="container max-w-5xl mx-auto px-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {userInfo.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.nickname}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h2 className="text-xl font-bold text-foreground">{userInfo.nickname}</h2>
                    {userInfo.verified && (
                      <Badge variant="secondary" className="text-xs">✓ Verified</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">@{userInfo.unique_id}</p>
                  {userInfo.bio && (
                    <p className="text-sm text-foreground mt-1 max-w-md">{userInfo.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 justify-center sm:justify-start text-sm">
                    <span className="text-foreground font-medium">{formatCount(userInfo.following_count)} <span className="text-muted-foreground">Following</span></span>
                    <span className="text-foreground font-medium">{formatCount(userInfo.follower_count)} <span className="text-muted-foreground">Followers</span></span>
                    <span className="text-foreground font-medium">{formatCount(userInfo.heart_count)} <span className="text-muted-foreground">Likes</span></span>
                    <span className="text-foreground font-medium">{formatCount(userInfo.video_count)} <span className="text-muted-foreground">Videos</span></span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start text-xs text-muted-foreground">
                    {userInfo.region && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {userInfo.region}
                      </span>
                    )}
                    {userInfo.create_time > 0 && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Joined {formatDate(userInfo.create_time)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section className="py-8">
            <div className="container max-w-5xl mx-auto px-4">
              {/* Sort controls */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {videos.length} Videos
                </h3>
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-1" />
                  {(["latest", "popular", "oldest"] as SortMode[]).map((mode) => (
                    <Button
                      key={mode}
                      size="sm"
                      variant={sortMode === mode ? "default" : "ghost"}
                      onClick={() => setSortMode(mode)}
                      className={sortMode === mode ? "gradient-hero text-primary-foreground" : "text-muted-foreground"}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {sortedVideos.map((video) => (
                  <Card
                    key={video.video_id}
                    className="group overflow-hidden border-border hover:shadow-elevated transition-shadow"
                  >
                    <div className="relative aspect-[9/16]">
                      <img
                        src={video.cover}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {video.is_top && (
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs gap-1">
                          <Pin className="h-3 w-3" /> Pinned
                        </Badge>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="flex items-center gap-2 text-xs text-white">
                          <span className="flex items-center gap-0.5">
                            <Play className="h-3 w-3" /> {formatCount(video.play_count)}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Heart className="h-3 w-3" /> {formatCount(video.digg_count)}
                          </span>
                        </div>
                      </div>
                      {/* Download overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="gradient-hero text-primary-foreground text-xs w-28"
                          disabled={downloadingId === `${video.video_id}-hd`}
                          onClick={() => handleDownload(video, "hd")}
                        >
                          {downloadingId === `${video.video_id}-hd` ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          HD MP4
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs w-28"
                          disabled={downloadingId === `${video.video_id}-sd`}
                          onClick={() => handleDownload(video, "sd")}
                        >
                          {downloadingId === `${video.video_id}-sd` ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          SD MP4
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs w-28 border-white/30 text-white hover:bg-white/20"
                          disabled={downloadingId === `${video.video_id}-mp3`}
                          onClick={() => handleDownload(video, "mp3")}
                        >
                          {downloadingId === `${video.video_id}-mp3` ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          MP3
                        </Button>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-foreground line-clamp-2">{video.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <MessageCircle className="h-3 w-3" /> {formatCount(video.comment_count)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Share2 className="h-3 w-3" /> {formatCount(video.share_count)}
                        </span>
                        {video.create_time > 0 && (
                          <span className="ml-auto">{formatDate(video.create_time)}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    className="min-w-[200px]"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
                      </>
                    ) : (
                      "Load More Videos"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Empty state during loading */}
        {isLoading && (
          <div className="py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading profile...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfileViewer;
