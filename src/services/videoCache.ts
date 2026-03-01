// videoCache.ts

export class VideoCache {
    private cache: Map<string, HTMLVideoElement>;

    constructor() {
        this.cache = new Map();
    }

    public getVideo(url: string): HTMLVideoElement | null {
        return this.cache.get(url) || null;
    }

    public cacheVideo(url: string, videoElement: HTMLVideoElement): void {
        this.cache.set(url, videoElement);
    }

    public clearCache(): void {
        this.cache.clear();
    }
}