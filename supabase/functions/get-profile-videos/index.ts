const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface TikWMVideo {
  play: string;
  wmplay?: string;
  music?: string;
  cover: string;
  origin_cover?: string;
  title: string;
  play_count: number;
  digg_count: number;
  comment_count: number;
  share_count: number;
  create_time: number;
  video_id: string;
  is_top?: number;
}

interface MappedVideo {
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
}

function mapVideo(v: TikWMVideo, index: number): MappedVideo & { _apiIndex: number } {
  return {
    video_id: v.video_id || `vid_${index}`,
    title: v.title || 'Untitled',
    cover: v.cover || v.origin_cover || '',
    play_count: v.play_count || 0,
    digg_count: v.digg_count || 0,
    comment_count: v.comment_count || 0,
    share_count: v.share_count || 0,
    create_time: v.create_time || 0,
    is_top: v.is_top === 1,
    play: v.play || '',
    wmplay: v.wmplay || v.play || '',
    music: v.music || '',
    _apiIndex: index,
  };
}

function sortVideos(videos: (MappedVideo & { _apiIndex: number })[]): MappedVideo[] {
  const pinned = videos.filter(v => v.is_top);
  const rest = videos.filter(v => !v.is_top);

  pinned.sort((a, b) => a._apiIndex - b._apiIndex);

  rest.sort((a, b) => {
    if (a.create_time > 0 && b.create_time > 0) {
      return b.create_time - a.create_time;
    }
    return a._apiIndex - b._apiIndex;
  });

  const sorted = [...pinned, ...rest];
  // Strip _apiIndex before returning
  return sorted.map(({ _apiIndex, ...video }) => video);
}

async function fetchFromTikWM(username: string, cursor: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.tikwm.com/',
    'Origin': 'https://www.tikwm.com',
  };

  const body = cursor
    ? `unique_id=${encodeURIComponent(username)}&count=30&cursor=${cursor}`
    : `unique_id=${encodeURIComponent(username)}&count=30`;

  const response = await fetch('https://www.tikwm.com/api/user/posts', {
    method: 'POST',
    headers,
    body,
  });

  const text = await response.text();

  if (text.includes('Enable JavaScript') || text.includes('cloudflare')) {
    throw new Error('CLOUDFLARE_BLOCKED');
  }

  return JSON.parse(text);
}

async function fetchUserInfo(username: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://www.tikwm.com/',
    'Origin': 'https://www.tikwm.com',
  };

  const response = await fetch('https://www.tikwm.com/api/user/info', {
    method: 'POST',
    headers,
    body: `unique_id=${encodeURIComponent(username)}`,
  });

  const text = await response.text();
  if (text.includes('Enable JavaScript') || text.includes('cloudflare')) {
    throw new Error('CLOUDFLARE_BLOCKED');
  }
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, cursor } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanUsername = username.replace(/^@/, '').trim();
    console.log(`Fetching profile for: ${cleanUsername}, cursor: ${cursor || 'initial'}`);

    // Fetch user info and videos in parallel
    const [userInfoResult, videosResult] = await Promise.allSettled([
      !cursor ? fetchUserInfo(cleanUsername) : Promise.resolve(null),
      fetchFromTikWM(cleanUsername, cursor || ''),
    ]);

    // Process user info
    let userInfo = null;
    if (userInfoResult.status === 'fulfilled' && userInfoResult.value) {
      const uData = userInfoResult.value;
      if (uData?.code === 0 && uData?.data) {
        const u = uData.data;
        userInfo = {
          nickname: u.nickname || cleanUsername,
          unique_id: u.unique_id || cleanUsername,
          avatar: u.avatar || '',
          follower_count: u.follower_count || 0,
          following_count: u.following_count || 0,
          heart_count: u.heart_count || u.total_favorited || 0,
          video_count: u.video_count || 0,
          bio: u.signature || '',
          verified: u.verified || false,
          region: u.region || '',
          create_time: u.create_time || 0,
        };
      }
    }

    // Process videos
    if (videosResult.status === 'rejected') {
      const err = videosResult.reason;
      if (err.message === 'CLOUDFLARE_BLOCKED') {
        return new Response(
          JSON.stringify({ success: false, error: 'Service temporarily unavailable. TikWM is blocking requests. Please try again later.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw err;
    }

    const vData = videosResult.value;
    if (vData?.code !== 0 || !vData?.data?.videos) {
      return new Response(
        JSON.stringify({
          success: false,
          error: vData?.msg || 'User not found or no videos available',
          userInfo,
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawVideos = vData.data.videos || [];
    const mapped = rawVideos.map((v: TikWMVideo, i: number) => mapVideo(v, i));
    const sorted = sortVideos(mapped);

    console.log(`Found ${sorted.length} videos for ${cleanUsername}`);

    return new Response(
      JSON.stringify({
        success: true,
        userInfo,
        videos: sorted,
        hasMore: vData.data.hasMore || false,
        cursor: vData.data.cursor || '',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-profile-videos:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
