import type { ToolId } from './projects';

/** Long-form page copy: /process, /about and legal. Edit here without touching layouts. */
export const STAGES = [
  { n: '01', slug: 'ingest', title: 'Ingest & Script', tc: 'IN', summary: 'I organise your footage, lock the brief and map the story before cutting.',
    youGive: ['Raw footage link (Drive, Dropbox, Frame.io)', 'Reference videos and style notes', 'Deadline and platform targets'],
    iDo: ['Organise and back up footage', 'Build a beat sheet and hook plan', 'Confirm scope, schedule and revision rounds'],
    youGet: ['A short written plan', 'Delivery date', 'A shared project folder'] },
  { n: '02', slug: 'rough-cut', title: 'Rough Cut', tc: 'V1', summary: 'The story is assembled with hooks, rhythm and pattern interrupts. You review structure first.',
    youGive: ['Feedback on structure and pacing', 'Timestamped notes where possible'],
    iDo: ['Assemble the full story', 'Place hooks and open loops', 'Tighten pacing against the curve'],
    youGet: ['A review link', 'A clear change list for the next pass'] },
  { n: '03', slug: 'vfx-audio', title: 'VFX & Audio', tc: 'FX', summary: 'Motion graphics, 3D, captions, colour and a full sound pass bring the cut to life.',
    youGive: ['Brand assets (logos, fonts, palette)', 'Music or sound preferences'],
    iDo: ['Kinetic type, motion and 3D', 'Colour grade', 'Foley, SFX layering, ducking and voice mastering'],
    youGet: ['A near-final cut', 'A final round of revisions'] },
  { n: '04', slug: 'master-delivery', title: 'Master Delivery', tc: 'OUT', summary: 'Revisions are folded in, then masters are exported in the formats each platform needs.',
    youGive: ['Final approval'],
    iDo: ['Apply final revisions', 'Export platform-specific masters', 'Archive project files per agreement'],
    youGet: ['Final video files', 'Thumbnails or key frames if scoped', 'Handover notes'] },
];

export const PRINCIPLES = [
  { title: 'Retention is the brief', body: 'Every decision answers one question: why does the viewer stay for the next few seconds?' },
  { title: 'Sound is half the picture', body: 'Foley, impacts and ducked music make an edit feel produced, so audio is designed, not added.' },
  { title: 'Systems over one-offs', body: 'Style guides, templates and clear communication keep every upload consistent.' },
  { title: 'Honest scoping', body: 'I say what is achievable, agree timelines up front and never promise results I cannot verify.' },
];

export const ARSENAL: { id: ToolId | 'capcut'; name: string; role: string }[] = [
  { id: 'premiere', name: 'Adobe Premiere Pro', role: 'Assembly, pacing and delivery' },
  { id: 'aftereffects', name: 'After Effects', role: 'Motion graphics and kinetic typography' },
  { id: 'resolve', name: 'DaVinci Resolve', role: 'Colour grading and finishing' },
  { id: 'blender', name: 'Blender 3D', role: '3D scenes, camera sweeps and renders' },
  { id: 'capcut', name: 'CapCut', role: 'Native short-form effects and quick turns' },
];
/** Hardware copy is intentionally generic: replace `detail` with your exact specs when ready. */
export const HARDWARE = [
  { name: 'Edit workstation', detail: 'A dedicated machine built for smooth multi-layer timelines and 3D renders.' },
  { name: 'Colour-managed display', detail: 'Grading and review on a display set up for accurate colour.' },
  { name: 'Audio monitoring chain', detail: 'Monitoring and headphones for mixing sound that translates to phones and speakers.' },
  { name: 'Fast storage & backup', detail: 'Organised project storage with backups, so your footage is safe.' },
];

export const LEGAL_UPDATED = '2026-10-20';
export const PRIVACY = [
  { h: 'What I collect', p: ['When you submit the inquiry form I collect the details you enter: name, email, channel or brand link, service, budget range, footage or reference links and your project description.', 'I also receive basic technical information needed to deliver and secure the site, such as your IP address, which is used for abuse prevention and rate limiting.'] },
  { h: 'How I use it', p: ['To reply to your inquiry, prepare a quote and manage a project if you and I work together. I store inquiries in my client database and send you a confirmation email. I do not sell your information.'] },
  { h: 'Where it goes', p: ['Form submissions are sent from my server to my automation workflow, which records them in a spreadsheet and sends email notifications. These tools process your data on my behalf.'] },
  { h: 'Retention', p: ['I keep inquiry details for as long as needed to respond and manage the relationship, then delete or anonymise them on request.'] },
  { h: 'Cookies & analytics', p: ['This site does not use advertising cookies. If analytics are added, I will update this policy.'] },
  { h: 'Your rights', p: ['You can ask me to access, correct or delete your information at any time by emailing me. I will respond within a reasonable period.'] },
  { h: 'Contact', p: ['Questions about this policy: email the address on my contact page.'] },
];
export const TERMS = [
  { h: 'Services & proposals', p: ['Each project is defined in a written proposal that sets scope, deliverables, price, schedule and revision rounds. Work begins once the proposal is accepted.'] },
  { h: 'Raw footage & handover', p: ['You provide raw footage through a shared link. You confirm you own or have permission to use all footage, music, imagery and other materials you supply.', 'Final deliverables are provided as rendered files in the agreed formats. Project files, source assets and working files are only included if stated in the proposal. I archive project files for a limited period after delivery and recommend you keep your own backups.'] },
  { h: 'Revisions', p: ['The number of revision rounds is stated in your proposal. A round is one consolidated set of feedback. Additional rounds or changes to scope may be quoted separately. Feedback by timestamped comments is the fastest route.'] },
  { h: 'Usage rights & ownership', p: ['On full payment, you receive the right to publish and use the final deliverables for the agreed purpose. You keep ownership of your footage and brand assets. I may retain rights to my underlying tools, templates and techniques.', 'Unless you request otherwise in writing, I may show finished work in my portfolio, with sensitive material removed on request.'] },
  { h: 'Copyright & clearance', p: ['You are responsible for clearing rights to footage, music, fonts and other third-party content you provide. Where I source music, sound effects or stock, licences are noted in the proposal and apply to the agreed use only.'] },
  { h: 'Payment', p: ['Payment terms are set in each proposal. Retainers are billed monthly. Work may be paused for overdue invoices.'] },
  { h: 'Deadlines', p: ['I agree delivery dates up front. Timelines depend on timely feedback and footage delivery; delays on either side may move the date.'] },
  { h: 'Results', p: ['I design edits to maximise viewer retention, but I do not guarantee specific views, retention figures or growth, which depend on many factors outside my control.'] },
  { h: 'Liability', p: ['To the extent permitted by law, my liability is limited to the fees paid for the affected project. Nothing here excludes liability that cannot legally be excluded.'] },
  { h: 'Changes', p: ['I may update these terms. The version that applies to a project is the one in effect when the proposal is accepted.'] },
];
