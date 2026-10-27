
export const WHY = [
  { n: '01', title: 'Retention-first editing', body: 'Every cut starts with one question: why does the viewer stay for the next few seconds? Pacing is planned, not improvised.' },
  { n: '02', title: 'Fast, predictable turnaround', body: 'Delivery schedules are scoped and agreed before kickoff, so you can plan your upload calendar around them.' },
  { n: '03', title: 'Custom sound design', body: 'SFX, risers, impacts and music edits layered by hand and mixed to the picture, never just dropped on top.' },
  { n: '04', title: 'Narrative mastery', body: 'Hooks, stakes and payoffs. Story structure that carries a viewer through a 60-second short or a 20-minute video.' },
];

export const PIPELINE = [
  { n: '01', title: 'Ingest & Storyboarding', body: 'Footage is organised, the brief is locked and the beat structure is mapped before a single cut is made.', tc: 'IN' },
  { n: '02', title: 'Pacing & Rough Cut', body: 'The story is assembled with hooks, rhythm and pattern interrupts. You review the structure first.', tc: 'V1' },
  { n: '03', title: 'VFX / Motion & Sound Design', body: 'Motion graphics, 3D, captions, colour and a full sound pass bring the cut to life.', tc: 'FX' },
  { n: '04', title: 'Final Delivery', body: 'Revisions are folded in, then masters are exported in the formats each platform needs.', tc: 'OUT' },
];

export const STACK = [
  { abbr: 'Pr', name: 'Adobe Premiere Pro', role: 'Assembly, pacing & delivery' },
  { abbr: 'Ae', name: 'After Effects', role: 'Motion graphics & kinetic type' },
  { abbr: 'Dr', name: 'DaVinci Resolve', role: 'Colour grading & finishing' },
  { abbr: 'Bl', name: 'Blender 3D', role: '3D scenes & product renders' },
  { abbr: 'Cc', name: 'CapCut', role: 'Native short-form effects & fast turns' },
];

/** Placeholder slots. Replace with real, permissioned client quotes. */
export const TESTIMONIALS = [
  { quote: 'Your first client quote goes here. Keep it specific: what changed about the channel after working together?', name: 'Creator Name', role: 'YouTube · Gaming channel' },
  { quote: 'A second testimonial slot for a brand or e-commerce client, ideally mentioning turnaround and communication.', name: 'Brand Name', role: 'Founder · E-commerce' },
  { quote: 'A third slot for a Twitch or Kick streamer, speaking to stream assets, clips or short-form work.', name: 'Streamer Name', role: 'Twitch · Kick' },
];

export const FAQ = [
  { q: 'What is your typical turnaround time?', a: 'It depends on length and complexity. Short-form moves fastest, long-form and motion-heavy projects take longer. A delivery schedule is agreed in writing before kickoff, and rush slots are offered when the calendar allows.' },
  { q: 'How do I send you raw footage?', a: 'Any shared link works: Google Drive, Dropbox, Frame.io, WeTransfer or direct cloud storage. I set up a clean project folder and confirm everything arrived before work starts.' },
  { q: 'How do revisions work?', a: 'Each project includes revision rounds, defined in the proposal. Timestamped comments (Frame.io, Drive or a simple list) are the fastest route to exactly the change you want.' },
  { q: 'Which software do you use, and can you hand over project files?', a: 'Premiere Pro, After Effects, DaVinci Resolve, Blender and CapCut. Rendered masters come in any format you need, and project files or assets can be included when agreed up front.' },
  { q: 'Can you match my existing channel style?', a: 'Yes. Send a few reference videos and I build a style guide for pacing, captions, colour and sound, so every upload feels like the same channel.' },
];

export const PLATFORMS = ['YouTube', 'Twitch', 'TikTok', 'Kick', 'Instagram Reels', 'YouTube Shorts', 'Roblox', 'Minecraft'];
