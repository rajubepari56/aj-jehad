import type { Category, ToolId } from './projects';

/** Service catalogue: drives /services, /services/[slug], the bento and the footer. Edit copy here only. */
export interface Service {
  slug: string; title: string; kicker: string; category: Category; hue: number;
  /** Matches an option id in shared/contact.ts so the form can be prefilled. */
  formId: 'gaming' | 'shorts' | 'motion' | 'longform' | 'retainer';
  summary: string; headline: string; intro: string; focus: string;
  deliverables: string[]; approach: { title: string; body: string }[]; idealFor: string[];
  tools: ToolId[]; faqs: { q: string; a: string }[];
}

export const SERVICES: Service[] = [
  {
    slug: 'gaming-edits', title: 'High-Retention Gaming Edits', kicker: 'Roblox · Minecraft · Story-driven', category: 'gaming', hue: 12, formId: 'gaming',
    summary: 'Story-driven gaming edits with fast pacing, sound-led narrative and dynamic punch-ins.',
    headline: 'Gaming edits engineered to hold the next beat.',
    intro: 'Hours of gameplay become a tense, funny, momentum-driven story. I cut for rhythm, stakes and payoff, with meme-fluent timing and sound that makes every moment land.',
    focus: 'Hook-first openings and first-30-second retention',
    deliverables: ['Hook-first cold opens and rewind structure', 'Pacing curve with planned pattern interrupts', 'Dynamic zooms and punch-ins on reactions and reveals', 'Meme and sound-effect sync, used with restraint', 'Kinetic subtitles and on-screen callouts', 'Thumbnail-ready key frames on request'],
    approach: [
      { title: 'Find the story', body: 'I scan raw footage for stakes, jokes and turning points, then build the beat structure before cutting.' },
      { title: 'Cut for rhythm', body: 'Every cut is placed against a pacing curve. Dead air goes; reactions and reveals get room.' },
      { title: 'Layer the sound', body: 'Impacts, risers, foley and a ducked music bed make the picture feel produced.' },
    ],
    idealFor: ['Roblox and Minecraft storyline channels', 'Gaming creators scaling to a weekly cadence', 'Streamers repurposing highlights'],
    tools: ['premiere', 'aftereffects', 'resolve'],
    faqs: [
      { q: 'Can you match my existing editing style?', a: 'Yes. Send a few reference videos and I build a short style guide for pacing, captions, colour and sound, then keep every upload consistent.' },
      { q: 'Do you handle meme and sound-effect sourcing?', a: 'Yes, using licensed or cleared libraries. Usage terms are covered in my Terms.' },
    ],
  },
  {
    slug: 'viral-shorts', title: 'Viral Short-Form Content', kicker: 'TikTok · Shorts · Reels', category: 'shorts', hue: 300, formId: 'shorts',
    summary: 'Vertical-first TikTok, Shorts and Reels with kinetic subtitles and retention hooks.',
    headline: 'Short-form built for the first second.',
    intro: 'A repeatable system that turns long recordings and raw clips into hook-first vertical content: tight pacing, kinetic captions and loop-ready endings.',
    focus: 'Swipe-away rate and replays',
    deliverables: ['Hook line on screen and spoken inside the first second', 'Kinetic subtitles timed to speech', 'Safe-area-aware framing for 9:16', 'Loop-friendly endings', 'Batch delivery with consistent branding', 'Platform-specific exports'],
    approach: [
      { title: 'Mine the moments', body: 'I pull the strongest 15–60 second moments from long-form or raw footage.' },
      { title: 'Hook and tighten', body: 'Re-order for the payoff first, then trim every beat that does not earn its place.' },
      { title: 'Type and sound', body: 'Dynamic typography and SFX hits reinforce each beat on a muted or unmuted feed.' },
    ],
    idealFor: ['Creators repurposing long-form into Shorts', 'Brands building a Reels format', 'Managers and brands needing consistent volume'],
    tools: ['premiere', 'aftereffects'],
    faqs: [
      { q: 'How many short-form clips can you deliver per week?', a: 'Volume is scoped per retainer. Tell me your target cadence on the inquiry form and I will propose a realistic plan.' },
      { q: 'Do you write the hooks?', a: 'I engineer them from what is already in your footage, and can suggest hook lines for you to approve.' },
    ],
  },
  {
    slug: '3d-motion-graphics', title: '2D / 3D Motion Graphics', kicker: 'Blender · After Effects · Kinetic type', category: 'motion', hue: 195, formId: 'motion',
    summary: 'Blender camera sweeps, kinetic typography, logo animation and 3D product staging.',
    headline: 'Motion that gives a brand a recognisable face.',
    intro: 'From logo stings and channel intros to 3D product scenes, I design motion systems that feel premium and stay on brand across every upload.',
    focus: 'Brand recall and perceived production value',
    deliverables: ['Logo animation and stingers', 'Kinetic typography and lower-thirds', 'Blender 3D scenes and camera sweeps', 'Product and brand asset staging', 'Looping social assets', 'Source files by arrangement'],
    approach: [
      { title: 'Define the language', body: 'Shape, timing and easing rules that become the brand motion style.' },
      { title: 'Build and render', body: 'Blender and After Effects production with sound-aware timing.' },
      { title: 'Deliver systems, not one-offs', body: 'Reusable templates and formats so future edits stay consistent.' },
    ],
    idealFor: ['Channels needing an intro and stinger package', 'Product brands launching a hero film', 'Creators wanting recurring motion assets'],
    tools: ['blender', 'aftereffects', 'resolve'],
    faqs: [
      { q: 'Can I get the project files?', a: 'Often yes, by arrangement. Tell me during scoping and I will confirm what is included.' },
      { q: 'Do you animate existing logos?', a: 'Yes. Send vector files (SVG, AI or PDF) where possible.' },
    ],
  },
  {
    slug: 'youtube-pacing', title: 'Long-Form YouTube Production', kicker: 'Pacing architecture · Multi-cam · Narrative', category: 'long', hue: 265, formId: 'longform',
    summary: 'Pacing architecture, narrative hooks and multi-cam sync with a retention-first flow.',
    headline: 'Long-form that holds through the middle.',
    intro: 'Documentary, commentary and vlog edits where structure, sound and rhythm are planned, so the middle of the video earns attention as carefully as the opening.',
    focus: 'Average view duration',
    deliverables: ['Act structure with escalating open loops', 'Multi-cam sync and coverage selection', 'Sound design and voice clean-up', 'Colour grade with consistent skin tones', 'Chapters, B-roll and graphic support', 'Final mastering for YouTube'],
    approach: [
      { title: 'Structure first', body: 'I map acts, loops and reveals before the first cut.' },
      { title: 'Refresh the frame', body: 'Reframes, B-roll and graphics keep long sequences alive.' },
      { title: 'Master the mix', body: 'Dialogue, music and effects balanced for headphones and phone speakers.' },
    ],
    idealFor: ['Documentary and storytelling channels', 'Commentary and essay creators', 'Vloggers with multi-cam footage'],
    tools: ['premiere', 'aftereffects', 'resolve'],
    faqs: [
      { q: 'How long does a long-form edit take?', a: 'It depends on length and complexity. A delivery schedule is agreed before kickoff.' },
      { q: 'Can you work from my script?', a: 'Yes. Scripts and outlines help me build structure faster.' },
    ],
  },
  {
    slug: 'sound-design', title: 'Sound Design & Audio Engineering', kicker: 'Foley · SFX layering · Ducking · Voice', category: 'gaming', hue: 40, formId: 'longform',
    summary: 'Custom foley, punchy SFX layering, rhythmic music ducking and voice mastering.',
    headline: 'Audio that makes the picture feel produced.',
    intro: 'Great edits are heard as much as seen. I design layered soundscapes that sell every cut, protect dialogue clarity and give the whole video a polished finish.',
    focus: 'Perceived production value',
    deliverables: ['Foley and ambient beds', 'Impact, riser and transition SFX layering', 'Rhythmic music ducking under voice', 'Voice clean-up, EQ and loudness mastering', 'Consistent sonic palette for intros and alerts', 'Stems on request'],
    approach: [
      { title: 'Clean the dialogue', body: 'Noise reduction and EQ so speech is clear on every device.' },
      { title: 'Design the hits', body: 'Layered effects timed to cuts, punch-ins and typography.' },
      { title: 'Mix and master', body: 'Balanced levels and loudness targets for each platform.' },
    ],
    idealFor: ['Edits that look good but sound flat', 'Channels building a signature sound', 'Creators with noisy source audio'],
    tools: ['premiere', 'resolve'],
    faqs: [
      { q: 'Do you provide music?', a: 'I can source cleared tracks or edit music you supply, with licensing noted in the Terms.' },
      { q: 'Can you fix poor microphone audio?', a: 'Often significantly, depending on the source. I will tell you honestly what is achievable.' },
    ],
  },
  {
    slug: 'channel-packaging', title: 'Channel Packaging & Brand Assets', kicker: 'Overlays · Stingers · Lower-thirds · Thumbnails', category: 'motion', hue: 175, formId: 'motion',
    summary: 'Stream overlays, intros and stingers, lower-thirds and click-worthy thumbnails.',
    headline: 'A channel identity that looks like a broadcast.',
    intro: 'A unified visual and sound package for streamers and creators: consistent overlays, alerts, stingers and thumbnails that make a channel instantly recognisable.',
    focus: 'Consistent channel identity',
    deliverables: ['Animated stream overlays and alerts', 'Intro and scene-transition stingers', 'Lower-thirds and end screens', 'Thumbnail templates', 'Sound-driven stingers', 'Brand usage notes'],
    approach: [
      { title: 'Audit the identity', body: 'Review current assets and define the visual direction.' },
      { title: 'Design the system', body: 'A cohesive palette, type and motion language.' },
      { title: 'Package and hand over', body: 'Organised files with install and usage guidance.' },
    ],
    idealFor: ['Twitch and Kick streamers', 'Channels rebranding', 'Creators launching a new series'],
    tools: ['aftereffects', 'blender', 'premiere'],
    faqs: [
      { q: 'Which streaming software do assets work with?', a: 'I deliver standard formats compatible with OBS and Streamlabs.' },
      { q: 'Can you design thumbnails too?', a: 'Yes, as templates or per-video, depending on the plan.' },
    ],
  },
  {
    slug: 'creator-retainers', title: 'Dedicated Monthly Retainers', kicker: 'End-to-end post-production', category: 'long', hue: 220, formId: 'retainer',
    summary: 'A dedicated freelance editor for consistent, scalable weekly output.',
    headline: 'A dedicated editor on call, without the overhead.',
    intro: 'For creators and brands publishing consistently, a retainer gives you a stable pipeline across long-form, short-form, motion and sound, with predictable communication and delivery.',
    focus: 'Consistent output at a sustainable cost',
    deliverables: ['Defined monthly volume across formats', 'Shared style guide and asset library', 'Priority scheduling', 'Weekly review rhythm', 'Short-form repurposing of long-form', 'Thumbnail and motion support as scoped'],
    approach: [
      { title: 'Scope the engine', body: 'I agree volume, formats, turnaround and review cadence.' },
      { title: 'Build the system', body: 'Templates, style guide and folder structure so output stays consistent.' },
      { title: 'Iterate monthly', body: 'I review what is working and adjust the plan.' },
    ],
    idealFor: ['Creators with a weekly publishing rhythm', 'Brands running ongoing social content', 'Busy creators who need a reliable editor on call'],
    tools: ['premiere', 'aftereffects', 'resolve', 'blender'],
    faqs: [
      { q: 'Is there a minimum commitment?', a: 'Retainer terms are agreed in your proposal. I can start with a trial edit before committing.' },
      { q: 'Can the plan change month to month?', a: 'Yes. I review volume and scope each month.' },
    ],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const serviceUrl = (s: Service) => `/services/${s.slug}`;
