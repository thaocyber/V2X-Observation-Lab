# Arsenal submission draft — not submitted

## Proposed title

V2X Observation Lab: Exploring What a Receiver Can Know from Position Claims

## Abstract

A position claim can be wrong while its consecutive differences still look
unchanged. V2X Observation Lab is an open-source, browser-local playground for
exploring this observation limit with reproducible synthetic constant-position
offsets. It separates true motion, reported position and the last message that
actually reached a receiver. Guided scenarios show sampling gaps, offset onset
and termination, fixed reception delay and periodic message omissions.

Attendees can change scenario parameters, compare sender and receiver message
pairs and export a versioned reproduction report containing the applied
configuration, message schedule, snapshot and geometric checks. The demo makes
explicit when a comparison relies on ground truth unavailable to the receiver,
and why a received pair with omitted messages must not be compared blindly with
consecutive transmissions. The tool runs locally without accounts, external
APIs, learned models or live vehicle access.

This is an educational security testing aid for reasoning about evidence and
reproducibility at the application-message level. It is not a detector, a
standards-conformant V2X implementation, an RF simulator or a safety evaluation.

## Audience and practical takeaway

Vehicle-security researchers, students and practitioners designing message-based
checks. Attendees leave with a reproducible scenario and a clear distinction
between absolute-position correctness, geometric differences and receiver
visibility. The algebraic cancellation itself is not claimed as novel research.

## Demonstration

Three one-click scenarios and a five-minute walkthrough are in DEMO.md. The
hands-on exercise changes delay and omissions, predicts the held message, then
checks the trace and exports a reproduction report. A local bundle is the
fallback for venue connectivity.

## Links and license

- Tool: https://v2x.tcybertrust.id.vn/
- Source: https://github.com/thaocyber/V2X-Observation-Lab
- Project license: MIT; bundled Three.js retains its own MIT notice.
- Release target: v0.1.0, initial MVP with documented test limitations.

## Presenter fields still to complete

Presenter name, public biography, affiliation if desired, contact details,
co-presenters if any, travel availability and the event-specific form fields
must be supplied or confirmed by the maintainer. Do not fabricate experience,
affiliations, endorsement, acceptance or novelty claims.

This draft is not an application and has not been submitted. Check current
[event instructions](https://blackhat.com/html/arsenal-call-for-tools.html)
before copying it into the submission form. Tool demonstrations belong to
[Arsenal](https://blackhat.com/html/arsenal.html); selection is not guaranteed.
