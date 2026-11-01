# Illustrated demo QA — 2026-11-01

- Video: 48 seconds, 1280 x 720, 24 fps, H.264/yuv420p, no audio, fast-start MP4.
- All 1,152 encoded frames decoded successfully with FFmpeg.
- Values come from the existing Learning Lab model, with smooth interpolation for display. Received-message values remain sampled. Video time is distinct from simulation time.
- Browser playback advanced with duration 48, readyState 4 and no media error.
- Desktop layout inspected. At a 390-pixel viewport, video width was 306.5 pixels and the document did not overflow horizontally. The in-app mobile screenshot was scaled incorrectly; no claim of full mobile visual QA.
- No autoplay or looping. Native playback controls, downloadable MP4 and a text transcript are available.
- Poster hides ground truth to preserve the reveal. The video is an illustrated model walkthrough, not a recording of browser interactions or evidence of an attack/detector result.
- Scope: one-way synthetic position messages, constant offset, immediate delivery. Does not demonstrate radio injection, collisions or a model bypass.
- Media allowlist is restricted to the two named demo files; content signatures, size ceiling and manifest hashes are checked. Other unexpected binary files still fail text inspection.

Full cross-browser, mobile-device and assistive-technology testing remains open.
