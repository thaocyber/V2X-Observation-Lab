# Learning track: development plan

Status: learning demo 0.1, 2026-10-31. This is an incremental educational track;
it does not declare the whole tool ready for v1.0 or validate a vehicle vulnerability.

The broader evidence-review direction is in [ASSURANCE_PLAN.md](ASSURANCE_PLAN.md).
Learning remains an educational entry point, not a substitute for model evaluation.

## 1. Working lesson loop — implemented

Open [the learning demo](https://v2x.tcybertrust.id.vn/learn/), advance one second,
choose an answer, then reveal true positions. The worlds have identical displayed
messages but different true positions. Both use one shared coordinate scale.

Choose **Create your lesson** to edit title, objective, question, explanation,
offset (2–16 m) and speed (1–5 m/s). Apply to restart the lesson. Download lesson
JSON to keep it and use **Open lesson** to reopen it. Reloading restores the default;
there is no automatic saving. Pending form changes are not exported.

Lesson files use schemaVersion 1 and kind `v2x-two-worlds-lesson`. Unknown fields,
invalid bounds and files larger than 16 KiB are rejected. Evidence exports include
both worlds and are intentionally not importable as lesson configuration files.

The fixed template has six timestamps (0–5 seconds), immediate delivery, and no
packet loss. Receiver message position is x = 4 + speed × time, y = 0. World 1
truth equals the claim; world 2 truth is claim minus offset. A receiver given
only these message fields cannot distinguish the worlds. Authored explanations
are displayed separately from the tool's computed conclusion and are not verified.
Hidden answers support learning, not secure examinations. All files stay local
to the browser; no accounts, grading, learner tracking or backend are provided.

## 2. Test comprehension with real learners — next

Run short sessions with 3–5 first-time learners and one instructor. Ask learners
to describe what B receives before revealing truth, then explain why matching
movement does not prove a correct position. Record confusion anonymously and only
with consent. Acceptance: learners can explain the distinction in their own
words and the instructor can save/reopen a modified lesson without assistance.
These sessions have not yet been run; this is not an efficacy claim.

## 3. Add a small reviewed lesson library

Add three explicit templates: correct but stale information; constant offset;
and the existing indistinguishable-worlds lesson. Each needs a learning objective,
visible assumptions, reproducible expected output and a short debrief. Acceptance:
all three can be exported/reopened with matching results, and delay alone is never
labelled a confirmed attack. Version schemas and provide migrations before changes.

## 4. Guided teaching controls

Add named lesson stops, instructor notes, learner prompts and reveal order, starting
from templates rather than an unrestricted scene editor. Separate author preview
from the learner view. Acceptance: a teacher can prepare a five-minute lesson with
no code; each reveal makes its available evidence explicit. Validate import limits
and untrusted text. Avoid account/LMS infrastructure until users need it.

## 5. Introduce independent evidence as an explicit model

Only after the initial lessons are clear, explore a separately labelled synthetic
reference observation with specified uncertainty and timing. Explain what new
information changes the conclusion. Acceptance: the lesson states its assumptions
and never equates a rule result with detector performance or a real-system bypass.
No private model, real traces, RF injection or collision claims are required.

## 6. Prepare a release candidate

The learning track now uses English; test keyboard, small screens and chosen
browsers; provide a local/offline guide, example lesson files, regression checks,
known limitations and a short demonstration video. Freeze and tag a release only
once these checks and the learner feedback issues are resolved. Submission text
must list implemented capabilities separately from the roadmap. This plan does
not assert any conference acceptance or submission eligibility.

## Local use and hosting

Serve the repository's `web/` directory using the README instructions and open
`/learn/`. This route uses native SVG and needs no WebGL or package installation.
Cloudflare Pages serves the same static directory; no new hosting service is needed.
