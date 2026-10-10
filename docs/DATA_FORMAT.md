# Synthetic scenario format v1

```json
{"version":1,"kind":"synthetic-constant-offset","duration":20,"dx":8,"dy":0,"start":5,"end":15,"delay":0.25,"dropEvery":4}
```

All fields are required. Unknown fields, non-finite numbers, strings in numeric
fields and unsupported versions are rejected. Import is limited to 8 KiB.

| Field | Meaning / accepted range |
| --- | --- |
| version | Integer 1 |
| kind | `synthetic-constant-offset` |
| duration | Exactly 20 seconds |
| dx, dy | Offset components in metres, each −20 to 20 |
| start, end | Seconds; 0 ≤ start < end ≤ 20; active interval is end-exclusive |
| delay | Reception delay, 0 to 2 seconds |
| dropEvery | Integer 0 to 10; 0 omits none, N omits every Nth message |

Motion: A(t) = (−30 + 3t, 0); B(t) = (0, −20 + 2t). These are point
trajectories in a schematic local metric coordinate system, not a street map.
Reported A is translated by (dx, dy) during the active interval. Sample rate is
one message per second. Message IDs are `demo-1` through `demo-21`, and contain no
external identities. Reception occurs at send time + delay unless omitted.

The generator has no randomness. Identical scenario inputs produce identical
messages, including after seek/rewind. Full trace exports use kind `synthetic-trace`
and include configuration, units and generated messages. Future receive times in
an exported full trace are scheduled synthetic events; the live receiver view
exposes only messages already received by the selected time.

No score, learned decision, threshold, training label or real source path exists
in this format. Synthetic data can illustrate a limitation but cannot establish
detection accuracy, real packet loss, attack success rates or safety effectiveness.
