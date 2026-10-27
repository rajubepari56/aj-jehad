HOW TO MAKE VIDEOS AUTOPLAY
===========================
Google Drive videos cannot autoplay (Google blocks it). Videos hosted on your own site can.

1. Export each video as MP4 (H.264), 1280x720 (or 720x1280 for vertical), about 3-6 Mbit/s, so a 1-minute video is ~20-40 MB.
2. Also export a short muted loop for each portfolio card: 5-10 seconds, under 3 MB.
3. Upload the files into this "videos" folder.
4. Open videos.json (same folder) and write the file names, for example:

   "blox-fruits-video-edit": { "src": "/videos/blox.mp4", "preview": "/videos/blox-loop.mp4", "poster": "/videos/blox.jpg" }

   "showreel": { "src": "/videos/reel.mp4", "poster": "/videos/reel.jpg" }

Cards then autoplay their loop whenever they are on screen, and case pages / the showreel autoplay (muted) in their own player.
No rebuild is needed: save videos.json and refresh the site.
