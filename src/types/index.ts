// Type definitions for the TikTok Download Hub

type DownloadStatus = 'downloading' | 'completed' | 'error';

type DownloadResult = {
    videoUrl: string;
    status: DownloadStatus;
    error?: string;
};

interface TikTokDownloadHub {
    downloadVideo(videoId: string): Promise<DownloadResult>;
    cancelDownload(videoId: string): void;
}

export { DownloadStatus, DownloadResult, TikTokDownloadHub };