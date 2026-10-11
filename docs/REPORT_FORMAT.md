# Reproduction reports (schema 1)

Use **Download JSON report** to save the applied scenario and current playback
instant. Pending form edits are excluded. The Markdown button saves a readable
summary; the JSON report is the complete artifact.

- `tool.version`: release version; `generator`: authored formula implementation.
- `scenario`: the validated scenario object, suitable for the scenario importer.
- `snapshot.time`: playback time to seek to after import.
- `snapshot.heldMessage`: latest message that actually arrived, or null.
- `ageSinceTransmission`: current time minus send time (data age).
- `ageSinceReception`: current time minus arrival time (time held locally).
- `receiverDifference`: last two arrived messages, their send-time interval and
  claimed-position difference. Null until two messages arrive.
- `trace`: **complete synthetic scenario schedule**, including messages that
  have not yet been sent at snapshot time. It is not receiver knowledge.
- `senderDifferences`: consecutive sent-message comparisons over the complete
  synthetic schedule, with ground truth and offset-change labels.
- `limitations` and `reproduce`: interpretation and replay instructions.

Position units are metres and time units are seconds. The report contains no
account identity, browser fingerprint, network location, wall-clock timestamp,
camera configuration, measured traces or detector scores. Identical applied
scenario and snapshot time produce identical JSON values in the same version.

To replay, save the `scenario` object as its own JSON file, import that file,
and seek to `snapshot.time`. The importer deliberately rejects entire reports
and traces, whose schemas differ. Use the source corresponding to `tool.version`.
Floating-point formatting can vary by display; JSON numeric values are the basis
for reproduction. Reports are not signed or tamper-proof evidence.
