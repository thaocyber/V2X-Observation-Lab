# QA record — display updates, 2026-10-12

Development build `0.2.0-dev`, following source commit `93b4ae1`. This section
covers new display behavior; the v0.1.0 archive record below remains historical.

## VERIFIED FACT — current display checks

- Automated tests cover arrived-only receiver histories, hidden-data isolation in
  camera framing, rewind/reset, display toggles and report invariance.
- In the Codex in-app browser, both camera modes and all three presets were
  exercised at 7 s after seeking from 16 s. Receiver X positions were -9 m
  (baseline), -1 m (offset), and -4 m (impaired).
- Top-down rendering showed labeled rings and history samples. The receiver
  showed ground truth only with its teaching overlay enabled.
- Two actual downloaded JSON reports for the impaired preset at 7 s, before and
  after changing camera mode, history visibility, ground-truth overlay and zoom,
  were identical and matched the report generator. Both identify `0.2.0-dev`.
- Receiver expansion/collapse and fit were exercised. At a 390 px emulated
  viewport, document width was 375 px with three canvases and no horizontal
  document overflow. This is not a physical mobile-device test.

## OPEN QUESTION — limits

Standalone Chrome/Firefox, physical mobile devices, frame-rate measurements and
accessibility certification remain untested. Browser automation timed out on the
semantic Fit button click; a direct visible-button click was used instead.
These checks establish neither detector effectiveness nor real-vehicle behavior.
The final three-page submission PDF is not included in this display increment. The published v0.1.0 archives are unchanged.

---

# QA record — v0.1.0 prerelease

Updated 2026-10-11 after post-release checks. These results cover the synthetic
Lab, not detector effectiveness or real vehicles. No complete browser/device
compatibility claim is made.

Evidence summaries: [browser and bundle checks](qa/browser-smoke-2026-10-11.json)
and [data audit](qa/data-audit-2026-10-11.json). These are recorded results, not
raw browser logs. They identify the reviewed source commit and archive hash.
The published v0.1.0 tag and release archives are unchanged.

## VERIFIED FACT — completed checks

| Check | Result and scope |
| --- | --- |
| Actual browser downloads | Scenario JSON, trace JSON, report JSON and Markdown were saved by the Codex in-app browser and read from disk. The scenario, trace and report matched expected generated values; Markdown matched the report renderer exactly. |
| Download/import round trip | The actual downloaded impaired scenario was imported on the public site. Seeking to 7 s restored held message demo-7, 5 received messages out of 8 sent, position (-4, 0) m, and data age 1 s. |
| Sender/receiver distinction | At 7 s, receiver pair demo-5 to demo-7 spans 2 s and 14 m; sender pair spans 6 to 7 s and 3 m. |
| Synthetic data audit | 435 configurations across 13 times (5,655 snapshots) matched an independently constructed formula/schedule oracle. JSON replay and the scenario embedded in Markdown matched. Eleven invalid inputs were rejected. This is a bounded deterministic matrix, not exhaustive testing or a detection benchmark. |
| Guided scenarios | All three presets, language switching and boundary navigation were exercised. The later walkthrough checked baseline at 6.5 s, offset at 5/10/15 s, and impaired at 7/15/16 s. |
| Input limits | Importing offsets (20, -20), interval [0, 20), delay 2 s and omission interval 1 updated the form and showed no received message. An object with unexpected fields produced a validation error. |
| Console | No application console error was captured during the recorded local-bundle and fallback checks. |

The earlier download-event timeout did not establish a download failure.
Subsequent checks verified all four saved files and their contents. Standalone
Chrome/Firefox download behavior remains untested.

## VERIFIED FACT — constrained and simulated checks

- **Standalone bundle:** the extracted release ZIP ran from a loopback HTTP
  server outside the checkout. A test server applied CSP `default-src 'self'`
  and `connect-src 'none'` (with local styling/image allowances), restricting
  external resources and data connections. The app loaded and the impaired
  scenario at 7 s matched. This was not an operating-system network disconnect.
- **WebGL fallback:** a temporary copy forced renderer construction to throw.
  The fallback message appeared; coordinate readouts, timeline and received
  message checks remained usable at 7 s. Production files were unchanged.
  This did not exercise an actual GPU failure or later WebGL context loss.
- **Narrow viewport:** at 390 px viewport width, document width was 375 px;
  three canvases were created and controls stacked without horizontal document
  overflow. This was desktop viewport emulation, not a physical phone test.
- **Demo:** the functional walkthrough matched the expected values. It was not
  a timed five-minute presenter rehearsal.

## INFERENCE

The observed results support a reproducible synthetic demonstration in the
available browser. They do not establish compatibility with every browser,
physical device or venue network configuration.

## OPEN QUESTION — remaining release checks

- [ ] Test standalone Chrome and Firefox, including all four downloads and import.
- [ ] Test a physical mobile device, touch controls and readability.
- [ ] Check keyboard/screen-reader accessibility.
- [ ] Run the extracted bundle with the operating system disconnected from Internet.
- [ ] Test a real WebGL-disabled environment or GPU/context failure.
- [ ] Rehearse the presenter script with a timer and the final display setup.

## DECISION

Retain prerelease status pending the relevant release gates. Use distinct labels
for observed passes, simulated checks and untested environments. New features
require corresponding regression checks; this record does not pre-approve v1.0.0.

## CI evidence

The workflow passed for commit `331f1d7` after the public manifest was refreshed:
[GitHub Actions run](https://github.com/thaocyber/V2X-Observation-Lab/actions/runs/38152456419).
That result applies to that commit, not automatically to later changes.
See [the release checklist](RELEASE_CHECKLIST.md) for packaging context.

## V2V communication panel increment — 2026-10-12

VERIFIED FACT: the automated suite now has 15 passing tests. Added checks cover
count partitioning, no future receive events, configured omissions, zero-delay
send/receive ordering, rewind and unchanged reproduction reports. At impaired
7 s: 8 sent = 1 pending + 2 omitted + 5 received; B holds demo-7 while A has
sent demo-8. The scenario model and export schema are unchanged.

OPEN QUESTION: browser automation timed out opening and selecting the local
preview for this increment. Visual layout and bilingual interaction for the new
panel have not been verified in-browser. Earlier browser checks above apply to
the previous display increment, not this panel. No frame-rate claim is made.
