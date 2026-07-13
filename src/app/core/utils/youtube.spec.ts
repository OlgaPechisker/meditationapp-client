import { getYouTubeId, isVideoPost, youTubeEmbed, youTubeThumb } from './youtube';

describe('youtube utils', () => {
  const videoId = 'dQw4w9WgXcQ';

  it('extracts an id from a watch url', () => {
    expect(getYouTubeId(`https://www.youtube.com/watch?v=${videoId}`)).toBe(videoId);
  });

  it('extracts an id from a short url', () => {
    expect(getYouTubeId(`https://youtu.be/${videoId}`)).toBe(videoId);
  });

  it('extracts an id from an embed url', () => {
    expect(getYouTubeId(`https://www.youtube.com/embed/${videoId}`)).toBe(videoId);
  });

  it('extracts an id from a shorts url', () => {
    expect(getYouTubeId(`https://www.youtube.com/shorts/${videoId}`)).toBe(videoId);
  });

  it('extracts an id when extra query params are present', () => {
    expect(
      getYouTubeId(`https://www.youtube.com/watch?v=${videoId}&t=30s&list=PL1234567890`)
    ).toBe(videoId);
  });

  it('returns null for an invalid url', () => {
    expect(getYouTubeId('not-a-youtube-url')).toBeNull();
  });

  it('returns null for undefined or empty input', () => {
    expect(getYouTubeId()).toBeNull();
    expect(getYouTubeId('')).toBeNull();
  });

  it('builds thumbnail and embed urls', () => {
    expect(youTubeThumb(videoId)).toBe(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    expect(youTubeEmbed(videoId)).toBe(`https://www.youtube.com/embed/${videoId}`);
  });

  it('detects video posts', () => {
    expect(isVideoPost({ videoUrl: `https://youtu.be/${videoId}` })).toBeTrue();
    expect(isVideoPost({ videoUrl: 'https://example.com/video.mp4' })).toBeFalse();
    expect(isVideoPost({ videoUrl: undefined })).toBeFalse();
  });
});
