# Five-minute Arsenal demo

## Setup

Open the live site or start the offline bundle with `python3 -m http.server 8095
--bind 127.0.0.1 --directory web` (one line). Use a WebGL-capable browser for 3D;
coordinate and message tables remain the primary numerical evidence. Select
English for an international audience. Keep a local source bundle available.

## 0:00–0:40 — The question

“What can a receiver know from received position claims alone?” Explain that
this is an authored synthetic, application-level observation lab. It does not
transmit V2X radio packets or test a real vehicle. Ground truth is a teaching
reference, not an assumed receiver capability. No model or detector is running.

## 0:40–1:30 — Sampling alone leaves gaps

Use **1 · Observation gap** (6.5 s), or expand advanced settings and select **1. No offset**, then seek to **6.5 s**. True A is at x = −10.5 m; the
receiver holds x = −12 m from 6 s. Even zero network delay does not mean a
continuously current position. Switch on ground truth briefly to compare,
then switch it off again.

## 1:30–2:40 — Constant offset and boundaries

Use **2 · Offset, equal differences** for 10 s. Expand **Offset boundaries** to use Start boundary (5 s), Inspect middle (10 s),
and End boundary (15 s). In this authored example, the X differences are
11 m, 3 m and −5 m respectively; true consecutive displacement is 3 m.
Inside the constant-offset segment, equal differences do not establish correct
absolute position. A boundary jump is a geometric observation, not an attack
verdict. Inspect the Y coordinate too: it is zero in these presets.

## 2:40–3:50 — What arrives changes the evidence

Use **3 · Late information** (7 s), or select the corresponding preset in advanced settings. At 5 s the boundary message is omitted.
At **7 s**, the held message was sent at 6 s: reception age is 0 s, data age
is 1 s. The received pair spans send times 4→6 s and Δx′ = 14 m, while the
last consecutive sent pair spans 6→7 s and Δx′ = 3 m. These are different
pairs. Seek to 15 then 16 s to show the delayed observation of offset removal.

## 3:50–4:35 — Reproduce

Download a JSON report and its Markdown summary. Point out the scenario,
version, snapshot time, message identifiers, time intervals and limitations.
Export a scenario, reset, import it and seek to the same time. A report contains
full synthetic ground truth for auditing; that is not extra receiver knowledge.

## 4:35–5:00 — Invite a hands-on question

Ask an attendee to change delay or omission interval, predict which message is
visible, then test it. Show GitHub, contribution guidance, ordinary bug reports
and the private vulnerability reporting link.

## Claims to avoid

Do not call this a detector, benchmark, complete V2X stack, RF simulator, safety
assessment or demonstrated real-world exploit. Do not infer a collision from
intersecting teaching trajectories. Offset cancellation is a simple algebraic
property, not a newly discovered vulnerability.
