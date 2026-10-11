# Public preparation scope

## VERIFIED FACT

This package contains a newly authored deterministic scenario generator and UI,
project licensing, a bundled Three.js library, tests and community documentation.
Generated positions and message schedules come only from the formulas documented
in DATA_FORMAT.md. Vendor source is unchanged and retains its license.

## DECISION

The web distribution is browser-local and synthetic-only. No Git metadata, backend,
learned models, checkpoints, measured replay, archived evaluation reports or
external input data are included. Publish only the web directory as static content.
The selected security reporting route is GitHub Private Vulnerability Reporting;
activation was confirmed through the GitHub API on 2026-10-11.

## INFERENCE

A deterministic synthetic playground is useful for explaining coordinate offsets,
reception delay and onset effects. It is not evidence of a detector's performance.

## OPEN QUESTION / limits

The public repository is https://github.com/thaocyber/V2X-Observation-Lab.
The website is hosted at https://v2x.tcybertrust.id.vn on Cloudflare Pages.
Actual downloads, scenario replay and constrained local-bundle checks are recorded
in [BROWSER_QA.md](BROWSER_QA.md). Full mobile/browser compatibility, physical
network-disconnection testing and external accessibility review remain pending. The vendor bundle's original download provenance has not
been independently revalidated; bundled hashes establish local byte identity.
No model inference or safety assessment is provided.

The MVP focuses on receiver observation limits. Guided presets illustrate
sampling gaps, constant-offset cancellation within a segment and delayed or
omitted boundary messages. Ground truth is an optional teaching overlay in the
receiver pane, never an assumed receiver capability. Sender and receiver
differences identify their separate message pairs; they are not detector scores.
