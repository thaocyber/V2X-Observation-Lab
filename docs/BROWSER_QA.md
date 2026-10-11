# Browser QA — v0.1.0 prerelease

Tested on 2026-10-11 using the available Codex in-app browser and a local static
server serving only `web/`. This is a smoke test, not a compatibility certification.

## Observed passes

- All three guided presets, language switching and boundary navigation were exercised.
- At 7 s in the impaired preset, the held message is demo-7, sent at 6 s and
  received at 7 s. The receiver pair is demo-5 to demo-7, with displacement
  (14, 0) m across 2 s; the sender pair spans 6 to 7 s with (3, 0) m.
- Importing a synthetic scenario with offsets (20, -20), interval [0, 20),
  delay 2 s and omission interval 1 updates the form and shows no received message.
- Importing an object with unexpected fields displays a validation error.
- Report JSON and Markdown buttons and the v0.1.0 footer are present.
- No application console error was captured during these checks.
- At a requested viewport width of 390 px, the document reported width 375 px:
  no horizontal document overflow was observed. This does not establish real-device usability.

## Not verified / remaining checks

- The browser automation download event timed out after clicking report JSON.
  No console error was captured, but a completed downloaded file was not confirmed.
  Report serialization and content are covered by the automated module tests;
  a maintainer should verify scenario, trace, JSON and Markdown downloads in a regular browser.
- Chrome and Firefox were not available as controllable browsers; no separate
  Chrome/Firefox compatibility result is claimed.
- Physical mobile devices, touch gestures, screen readers and WebGL-disabled
  fallback were not tested.
- Dependencies are bundled locally and the isolated source tests pass; a physical
  network-disconnected browser session has not been tested.

Before a live Arsenal demo, complete the download round trip, offline browser
run, Chrome/Firefox and mobile checks. CI activation is tracked separately in
[the release checklist](RELEASE_CHECKLIST.md).
