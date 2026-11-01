# Evidence centered AI assurance development plan

Decision date: 2026-11-01. Keep the name V2X Observation Lab. Develop support for
reviewing evidence about AI outputs, with V2X as the first application context.
This is not a model trust certification or an automatic deployment decision.

## Phase 1 — Local Evaluation Inspector implemented

Route `/evaluate/`: import precomputed binary predictions and reference labels;
inspect TP/TN/FP/FN, accuracy, precision, recall and F1; filter individual rows;
export the validated input, derived results, declared metadata, content hash,
limitations and reviewer notes. The supplied sample is entirely fictional.

Acceptance: known fixtures produce expected counts; undefined ratios are null;
invalid schemas and duplicate IDs fail; failed imports preserve current data;
filters do not change aggregate metrics or full-data exports; imported strings
render as text. Input limits: 2 MiB, 10,000 rows. No backend or new dependency.
See [format](EVALUATION_FORMAT.md) and [QA](qa/evaluation-inspector-2026-11-01.md).
The English Inspector is available at `/evaluate/`; see the [user guide](USER_GUIDE.md).

## Phase 2 — Reproduction and review workflow

Add evidence-report reopening with schema/version checks, saved case annotations,
explicit evaluation IDs and comparison of compatible evaluations. Compare only
when dataset membership, labels, positive class and evaluation policy agree.
Acceptance: reopening a report preserves notes and reproduces calculations;
incompatible comparisons are rejected with a reason. A hash does not authenticate
an origin. Record code/version and input identity without claiming an audit-grade
immutable history. Expand cross-browser and accessibility checks before a stable release.

## Phase 3 — Link cases to observations

Define an optional adapter with message IDs, timestamps, coordinate frame, units,
label provenance and prediction provenance. Require an explicit mapping before
showing an imported case in a V2X scene. Never invent a trajectory from a class label.
Acceptance: reviewers can trace each displayed state back to a record and distinguish
synthetic truth, received messages and imported predictions. Missing mappings remain
unmapped; they are not silently replaced with the teaching scene.

## Phase 4 — Focused assurance cases

Add intended-use requirements, supporting evidence references, counterevidence,
assumptions and human review records. Use supported / contradicted / not assessed
statuses with criteria, rather than a universal numerical Assurance Score.
Acceptance: every conclusion points to evidence and scope; missing evaluation is
not shown as a pass. Notes do not automatically become engineering approval.

## Phase 5 — One defensible model evaluation pilot

Choose one openly licensed dataset, one baseline and one intended use in a separate
approved evaluation plan. Fix label logic, splits, threshold policy, seeds, metrics,
stopping rules and artifacts first. Keep validation for selection and test for final
assessment. Only add robustness, calibration or generalization conclusions after
running the corresponding evaluations. Do not use private thesis artifacts.
Acceptance: independently reproducible outputs, provenance, limitations and no
unresolved label or split ambiguity. This phase has not been executed.

## Release gate and exclusions

Before publishing: review the diff and public inventory, run verification, complete
browser checks, align the proposal and demo with the exact release, then obtain the
maintainer's instruction to commit/publish. Record the revision and deployment result.
Do not promise conference acceptance or use an unverified deadline as a release gate.

Deferred: SHAP scores, trust heatmaps, live inference, model uploads, arbitrary attack
libraries, RF injection, autonomous recommendations, evaluation-report PDF export and LMS/accounts.
The downloadable user-guide PDF is documentation, not an Inspector export.
The existing learning roadmap remains the educational track; it is not replaced by
an unimplemented general AI governance platform.
