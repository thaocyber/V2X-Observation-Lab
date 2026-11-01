# Current scope and limitations

## Implemented MVP

V2X Observation Lab provides three browser-local workspaces:

- **Observation Playground:** deterministic synthetic position claims, offsets,
  delay and omissions, with analyst comparison and receiver-only views.
- **Learning Lab:** one bounded two-world template, prediction/reveal, editable
  teaching text and lesson JSON exchange.
- **Evaluation Inspector:** user-supplied binary predictions and reference labels,
  declared metadata, error inspection and scoped evidence-report export.

Bundled scenarios and evaluation examples are synthetic. Imported evaluation
inputs are supplied by the user; the tool does not verify their origin or labels.
The Inspector is separate from the scene and does not map prediction rows into 3D.

## Observation boundaries

Ground truth is a teaching reference, not an assumed receiver capability.
Receiver-only views exclude hidden truth and unreceived claims. Sender and receiver
differences may use different message pairs; compare identifiers and send times.
Equal differences within a constant-offset segment do not establish position
correctness. Sampling gaps and delay alone do not demonstrate an attack.

## Distribution and privacy

Publish only `web/` as static content. The bundle includes frontend code, authored
fixtures, media, documentation and licensed dependencies. There is no backend,
learned model or proprietary research dataset in the distribution. Imported files
are processed locally in the browser. Exported inputs and notes may contain user
content and should be reviewed before sharing.

The public source is [on GitHub](https://github.com/thaocyber/V2X-Observation-Lab),
and the [website](https://v2x.tcybertrust.id.vn/) is hosted on Cloudflare Pages.
Security reports use [private vulnerability reporting](https://github.com/thaocyber/V2X-Observation-Lab/security/advisories/new).

## What is not established

The tool does not provide model inference, detector-performance validation,
RF or CAM/BSM wire encoding, collision dynamics, safety certification or deployment
approval. Imported metrics describe the supplied rows and declared scope only.
A content hash identifies bytes or normalized content; it does not authenticate origin.

Completed checks and untested environments are listed in the
[verification index](qa/README.md). A full browser/device matrix, external
accessibility review and physical network-disconnection validation remain pending.
Bundled vendor hashes identify local bytes; original download provenance has not
been independently revalidated.

Planned extensions are documented in the [evidence-review roadmap](ASSURANCE_PLAN.md)
and [learning roadmap](LEARNING_ROADMAP.md); they are not current capabilities.
