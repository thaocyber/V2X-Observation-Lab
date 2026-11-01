# Narration verification — 2026-11-01

The demo now uses the synthetic female US English voice en-US-JennyNeural,
rate -5%, without background music. Exact wording and start times are in
[the narration script](../demo-narration.json). This supersedes the silent-audio
status in the earlier video report.

## Verified
- Four source clips fit their 12-second scenes; each begins 0.35 seconds after the scene boundary.
- Final MP4 decoded successfully: 48 seconds, H.264 video and mono AAC-LC audio at 48 kHz.
- Audio decoded to 2,304,000 samples; mean volume -19.6 dBFS and peak -1.5 dBFS. No clipping was observed in this signal check.
- Browser playback advanced, unmuted, duration 48 seconds, without console or media errors.
- English caption track is registered. On-screen text remains usable without audio.
- No autoplay; no music. Public speech text only was submitted to the synthesis service.

## Limits
Signal checks and service voice selection do not replace a human listening review
of pronunciation and delivery. Full cross-browser caption and audio testing was
not run. The spoken transcript includes the phonetic spelling “V two X” for TTS.
