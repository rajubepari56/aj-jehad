/**
 * Showreel theater data. Set `SHOWREEL.src` to a high-bitrate MP4/WebM/HLS (.m3u8) or YouTube/Vimeo URL.
 * Chapters seek to `start` (seconds) inside the main reel. Leave `src` empty to show the placeholder slot.
 */
export interface Chapter { id: string; title: string; category: string; start: number; hue: number }
export const SHOWREEL = {
  title: 'Showreel',
  duration: 60,
  src: 'https://youtu.be/b1G2IJtvmDo' as string,
  poster: 'https://i.ytimg.com/vi/b1G2IJtvmDo/hqdefault.jpg',
  chapters: [
    { id: 'gaming', title: 'Gaming highlights', category: 'Gaming', start: 0, hue: 12 },
    { id: 'shorts', title: 'Viral short-form', category: 'Shorts & Reels', start: 14, hue: 300 },
    { id: 'motion', title: '3D & motion design', category: '3D Motion', start: 28, hue: 195 },
    { id: 'long', title: 'Long-form storytelling', category: 'Long-form', start: 42, hue: 265 },
    { id: 'brand', title: 'Brand commercials', category: 'Brand', start: 52, hue: 38 },
  ] as Chapter[],
};
