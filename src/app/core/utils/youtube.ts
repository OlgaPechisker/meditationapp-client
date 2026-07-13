const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:(?:[^#]*&)?v=)|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&][^#]*)?$/i;

export function getYouTubeId(url?: string | null): string | null {
  if (!url?.trim()) {
    return null;
  }

  const match = url.trim().match(YOUTUBE_URL_REGEX);
  const id = match?.[1] ?? null;

  return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
}

export function youTubeThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function youTubeEmbed(id: string): string {
  return `https://www.youtube.com/embed/${id}`;
}

export function isVideoPost(post: { videoUrl?: string | null | undefined }): boolean {
  return !!getYouTubeId(post.videoUrl);
}
