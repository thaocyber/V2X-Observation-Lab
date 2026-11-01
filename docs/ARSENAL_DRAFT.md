# Arsenal proposal draft — not submitted

## Session title
V2X Observation Lab: From AI Accuracy to Evidence-Based Assurance

## Abstract
V2X security evaluations need more than an aggregate accuracy figure. Reviewers
also need to know what information was available, which predictions failed, and
what evidence is missing before drawing engineering conclusions.

V2X Observation Lab is an open-source, browser-local tool combining synthetic
observation exercises with a lightweight inspector for precomputed binary
classification results. The observation exercises distinguish true position,
reported position and the latest claim received by a vehicle. A two-worlds lesson
shows how different true positions can produce identical receiver message inputs.
This demonstrates an observation limit, not a detector bypass.

The Evaluation Inspector accepts reference labels, predictions and declared
evaluation metadata. It computes confusion counts and basic classification
metrics, exposes individual false positives and false negatives, and exports a
JSON evidence report containing the validated input, a content hash, derived
results, assumptions, unanswered questions and reviewer notes. Its included
fixture is hand-authored; no AI model is executed for that demonstration.

The tool supports evidence review toward AI assurance. It does not assign a
universal trust score, certify safety or recommend autonomous deployment. Mapping
imported prediction rows to 3D replay is planned and is not a current capability.

## Audience and practical value
Security researchers, automotive cybersecurity engineers and instructors reviewing
message-based detection results. Attendees can reproduce an observation example,
inspect a supplied evaluation, identify errors and take away a machine-readable
evidence package. The contribution is the scoped workflow and explicit evidence
boundaries; neither binary metrics nor translation invariance is claimed as novel.

## Implemented capabilities
- Synthetic position-claim scenarios, receiver-only and analyst comparison views.
- A constrained lesson authoring flow with prediction/reveal and JSON exchange.
- Binary evaluation JSON import, metadata display, confusion counts and metrics.
- Filtered case inspection and full-input evidence export with reviewer notes.

## Five-minute demonstration
1. Explore two synthetic worlds with identical receiver messages; reveal truth.
2. Open the Inspector's clearly labelled fictional prediction fixture.
3. Filter false negatives; inspect the supplied reference and predicted labels.
4. Separate supplied facts, computed results, assumptions and unknowns.
5. Export the evidence report and explain what further validation would be needed.

These are two related workspaces, not a linked model-in-the-loop demonstration.

## Current development and access status
The source includes all three English-language workspaces. The 2026-11-01
publication update includes the Evaluation Inspector at `/evaluate/`. Before
submission, verify the deployed revision and routes against this draft. This
draft has not been submitted.

## Limitations and roadmap
Current Inspector input is labelled binary JSON with precomputed classes. There
is no model training/inference, threshold tuning, SHAP, automatic leakage detection,
generalization test, calibrated confidence, RF, CAM/BSM wire encoding, real-vehicle
validation or certification. No imported case is automatically mapped into 3D.
Next steps: report reopening, compatible evaluation comparison, explicit case-to-
scenario adapters, structured human review and one separately planned public-data pilot.

## Links and setup
- Existing public demo: https://v2x.tcybertrust.id.vn/
- Source: https://github.com/thaocyber/V2X-Observation-Lab
- Local run: serve `web/` with Python 3 HTTP server; open `/`, `/learn/`, `/evaluate/`.
- Code license: MIT; retain the bundled Three.js notice.
- Browser-local processing; after obtaining the files, no external API or account is required.

## Maintainer items before submission
Confirm the release revision, published Inspector access, browser QA,
demo video, presenter information and the current event-specific form requirements.
Do not claim acceptance, measured trustworthiness or deployment readiness.
