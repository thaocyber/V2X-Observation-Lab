# Verification records

These records document implementation and browser checks, not detection accuracy,
safety certification or a complete browser/accessibility matrix. Read each record's
date, revision and limitations before reusing a result.

## Feature checks

| Record | Scope |
| --- | --- |
| [English interface](english-ui-2026-11-01.md) | Bundled language and principal workspace walkthroughs. |
| [Evaluation Inspector](evaluation-inspector-2026-11-01.md) | Binary input, error inspection and evidence exports. |
| [Learning demo](learning-demo-2026-10-31.md) | Two-world lesson and bounded authoring flow. |
| [Illustrated video](video-demo-2026-11-01.md) | Model-derived overview and media verification. |
| [Narration](narration-2026-11-01.md) | Synthetic voice, captions and playback. |

## Historical Playground and release checks

- [Browser QA log](../BROWSER_QA.md): dated Playground increments and v0.1.0 checks.
- [Browser/bundle summary](browser-smoke-2026-10-11.json).
- [Synthetic data audit](data-audit-2026-10-11.json).
- [Initial release record](../RELEASE_CHECKLIST.md).

## Current build checks

`VALIDATION.json` identifies the locally checked manifest.
[GitHub Actions](https://github.com/thaocyber/V2X-Observation-Lab/actions) records
CI results per commit. A passing earlier run does not validate later changes.
See the [maintainer guide](../MAINTAINING.md) to reproduce checks. Physical devices,
standalone browser coverage, accessibility and venue rehearsal remain separate
validation tasks; see the dated records for their status.
