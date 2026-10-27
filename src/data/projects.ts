/**
 * Portfolio collection. Everything on the home grid, archive and case-study
 * pages is driven from here. All entries are SAMPLE placeholders until real
 * projects are added: swap `video.src`, copy and metrics, then set `sample: false`.
 *
 * video.src      YouTube/Vimeo URL, .mp4/.webm, or .m3u8 (HLS, lazy-loaded)
 * video.preview  short muted loop (<=3MB .webm/.mp4) used for hover previews
 * metrics        never show a number unless status === 'verified'
 */
export type Category = 'gaming' | 'shorts' | 'motion' | 'long' | 'brand';
export type Platform = 'YouTube' | 'Twitch' | 'TikTok' | 'Instagram' | 'Direct brand' | 'Portfolio';
export type ToolId = 'premiere' | 'aftereffects' | 'resolve' | 'blender';

export interface Metric { label: string; value?: string; status: 'verified' | 'pending'; note: string }
export interface Project {
  slug: string; title: string; niche: string; category: Category; platform: Platform;
  ratio: '16:9' | '9:16'; hue: number; duration: number; year: number; sample: boolean;
  /** true = full case study (challenge, breakdown, metrics). false = portfolio piece: video + approach only, no claims about results. */
  detailed: boolean;
  client: { name: string; profile: string };
  summary: string;
  video: { src?: string; preview?: string; poster?: string };
  challenge: { summary: string; symptoms: string[] };
  solution: { step: string; title: string; body: string }[];
  tools: ToolId[];
  metrics: Metric[];
}

export const CATEGORY_LABEL: Record<Category, string> = { gaming: 'Gaming', shorts: 'Shorts & Reels', motion: '3D Motion', long: 'Long-form', brand: 'Brand' };
export const TOOLS: Record<ToolId, { name: string; abbr: string; role: string }> = {
  premiere: { name: 'Premiere Pro', abbr: 'Pr', role: 'Assembly & pacing' },
  aftereffects: { name: 'After Effects', abbr: 'Ae', role: 'Motion & kinetic type' },
  resolve: { name: 'DaVinci Resolve', abbr: 'Dr', role: 'Colour & finishing' },
  blender: { name: 'Blender 3D', abbr: 'Bl', role: '3D scenes & renders' },
};

const sol = (hook: string, pace: string, sound: string, punch: string, color: string) => [
  { step: '0–5s', title: 'Hook engineering', body: hook },
  { step: 'Curve', title: 'Narrative pacing curve', body: pace },
  { step: 'Audio', title: 'Custom sound staging', body: sound },
  { step: 'Motion', title: 'Dynamic punch-ins', body: punch },
  { step: 'Grade', title: 'Colour treatment', body: color },
];

const DRIVE = (id: string) => `https://drive.google.com/file/d/${id}/view`;
const piece = (o: { slug: string; title: string; niche: string; category: Category; ratio: '16:9' | '9:16'; hue: number; id: string; summary: string; tools: ToolId[]; duration?: number; approach?: ReturnType<typeof sol> }): Project => ({
  slug: o.slug, title: o.title, niche: o.niche, category: o.category, platform: 'Portfolio', ratio: o.ratio, hue: o.hue,
  duration: o.duration ?? 60, year: 2026, sample: false, detailed: false,
  client: { name: 'Portfolio project', profile: 'A finished piece from my portfolio.' },
  summary: o.summary, video: { src: DRIVE(o.id) },
  challenge: { summary: '', symptoms: [] },
  solution: o.approach ?? [],
  tools: o.tools,
  metrics: [],
});

/* Real portfolio pieces. Videos are Google Drive links: share each file as "Anyone with the link: Viewer".
   Ratios for 'video-edit-01' and 'bluey-orbeez-viral-edit' are best guesses: change `ratio` here if needed. */
export const PROJECTS: Project[] = [
  piece({ slug: 'blox-fruits-video-edit', title: 'Blox Fruits Video Edit', niche: 'Gaming · Roblox', category: 'gaming', ratio: '16:9', hue: 12, id: '1oJcDLbBVNibuQB_Wa4jQAZDrgsFylFIr', tools: ['premiere', 'aftereffects'],
    summary: 'A Blox Fruits gameplay edit cut for pace, impact and sound, built to keep the next beat earning attention.',
    approach: sol('Open on the strongest moment, then build context around it.', 'Beats mapped against a pacing curve, with dead air removed and pattern interrupts placed on purpose.', 'Layered impacts, risers and a ducked music bed tuned to the cuts.', 'Punch-ins and zooms on reactions, hits and reveals.', 'Contrast and colour lifted so gameplay reads clearly on a phone.') }),
  piece({ slug: 'roblox-gameplay-edit', title: 'Roblox Gameplay Edit', niche: 'Gaming · Roblox client work', category: 'gaming', ratio: '16:9', hue: 195, id: '1iLVRyYysqgh9szlYfFjW2HqNBYg6BSM2', tools: ['premiere', 'aftereffects'],
    summary: 'A Roblox edit made for a client: fast-paced, sound-driven and cut around the funniest and most intense moments.',
    approach: sol('A hook inside the first few seconds that makes the stakes clear.', 'Rhythm-first cutting that compresses slow stretches and lets reactions breathe.', 'SFX and music edited to the picture so every cut lands.', 'Dynamic zooms that emphasise key moments without clutter.', 'Consistent colour so the whole video feels like one piece.') }),
  piece({ slug: 'video-edit-01', title: 'Video Edit 01', niche: 'Gaming · Edit', category: 'gaming', ratio: '16:9', hue: 150, id: '1MTqQmV5j6ReMqmt_j2SJFsLXJhHl_z8T', tools: ['premiere', 'aftereffects'],
    summary: 'A fast-cut edit from my portfolio, focused on pacing, sound and clean visual flow.',
    approach: sol('Strong opening that sets expectation straight away.', 'Tight pacing with no wasted beats.', 'Sound effects and music cut to the rhythm of the edit.', 'Punch-ins for emphasis.', 'Clean, consistent colour.') }),
  piece({ slug: 'channel-intro-01', title: 'Channel Intro 01', niche: 'Motion · Intro', category: 'motion', ratio: '16:9', hue: 265, id: '1BPHyPHfhhBpa75ZTZs1IacByqAgi5q5C', tools: ['aftereffects', 'blender'],
    summary: 'An animated channel intro with motion graphics and sound design, made to brand a channel in seconds.',
    approach: sol('A recognisable opening frame that lands immediately.', 'Timing built around the beat of the sound.', 'A designed sting with layered hits and a clean finish.', 'Camera and type moves that add energy without noise.', 'A tight palette that stays on brand.') }),
  piece({ slug: 'channel-intro-02', title: 'Channel Intro 02', niche: 'Motion · Intro', category: 'motion', ratio: '16:9', hue: 175, id: '1DcaYyh7KuRBheB5DrFZdqQTBkbCIQcII', tools: ['aftereffects', 'blender'],
    summary: 'A second intro in a different style: motion graphics, kinetic type and sound working together.',
    approach: sol('An opening beat that grabs attention at once.', 'Animation timed to the music and impacts.', 'Sound design that makes every move feel physical.', 'Smooth, eased motion with no wasted frames.', 'Colour chosen to match the channel identity.') }),
  piece({ slug: 'rate-this-edit-reel', title: 'Rate This Edit: Viral Reel', niche: 'Short-form · Reels', category: 'shorts', ratio: '9:16', hue: 300, id: '10KMyi5Bsj6FpTb9w-Be5s1zKBSntxIYK', tools: ['premiere', 'aftereffects'], duration: 30,
    summary: 'A vertical short-form edit made for Reels and TikTok: instant hook, fast cuts and punchy sound.',
    approach: sol('The hook lands in the first second.', 'Constant micro-changes in framing and rhythm to keep attention.', 'SFX hits on every key beat.', 'Rapid punch-ins on emphasis moments.', 'Saturated but controlled colour for small screens.') }),
  piece({ slug: 'bluey-orbeez-viral-edit', title: 'Bluey × Orbeez Viral Edit', niche: 'Short-form · Viral edit', category: 'shorts', ratio: '9:16', hue: 205, id: '1M4BFy5iSS6KJ2s6g6ZPSQEl9QEJkFoN1', tools: ['premiere', 'aftereffects'], duration: 45,
    summary: 'A playful viral-style edit combining character footage and satisfying visuals, paced for short-form.',
    approach: sol('A curiosity hook up front.', 'Fast, rhythmic cuts with a satisfying flow.', 'Sound design that sells the visuals.', 'Scale and zoom moves for emphasis.', 'Bright, clean colour that pops in the feed.') }),
];

export const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
/** Google Drive file id from a share link, if the source is Drive. */
export const driveId = (src?: string) => src?.match(/drive\.google\.com\/file\/d\/([\w-]+)/)?.[1];
/** YouTube video id from any youtu.be / youtube.com link. */
export const ytId = (src?: string) => src?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)?.[1];
/** Poster frame: explicit `video.poster`, else YouTube's or Drive's own thumbnail (loaded lazily by the browser, hidden if unavailable). */
export const posterUrl = (p: Project) => p.video.poster
  ?? (ytId(p.video.src) ? `https://i.ytimg.com/vi/${ytId(p.video.src)}/hqdefault.jpg` : undefined)
  ?? (driveId(p.video.src) ? `https://drive.google.com/thumbnail?id=${driveId(p.video.src)}&sz=w1000` : undefined);
export const caseUrl = (p: Project) => `/case-studies/${p.slug}`;
