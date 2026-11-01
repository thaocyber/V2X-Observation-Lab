# Project overview

## Purpose
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

This walkthrough uses Learning Lab and Evaluation Inspector. The separate
Playground provides configurable observation scenarios.

## Development status

The public MVP includes the Observation Playground, Learning Lab and Evaluation
Inspector. The workspaces support complementary teaching and review activities;
this is not an integrated model-in-the-loop system. Current usage instructions
are in the [user guide](USER_GUIDE.md), with [verification records](qa/README.md)
for the scope of completed checks.

## Limitations and roadmap
Current Inspector input is labelled binary JSON with precomputed classes. There
is no model training/inference, threshold tuning, SHAP, automatic leakage detection,
generalization test, calibrated confidence, RF, CAM/BSM wire encoding, real-vehicle
validation or certification. No imported case is automatically mapped into 3D.
Next steps: report reopening, compatible evaluation comparison, explicit case-to-
scenario adapters, structured human review and one separately planned public-data pilot.

## Links and setup
- Public demo: https://v2x.tcybertrust.id.vn/
- Source: https://github.com/thaocyber/V2X-Observation-Lab
- Local run: serve `web/` with Python 3 HTTP server; open `/`, `/learn/`, `/evaluate/`.
- Code license: MIT; retain the bundled Three.js notice.
- Browser-local processing; after obtaining the files, no external API or account is required.

