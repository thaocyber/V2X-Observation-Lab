# Learning demo checks — 2026-10-31

Scope: synthetic educational demo at `web/learn/`, not a vehicle or detector test.

## Confirmed checks

- Browser: advance one second, choose insufficient information, reveal truth.
  Default reported x=7 m in both worlds at 1 s; truths 7 m and -1 m.
- Author form: apply offset 12 m and speed 5 m/s. Resets time and prediction.
  At 1 s both claims are 9 m; truths 9 m and -3 m.
- Import a valid authored JSON: title and configuration restored; reset to 0 s
  with truth hidden. The file is read locally in the browser.
- Desktop and 390×844 viewport: examined revealed world cards and answer controls.
  No horizontal document overflow (client and scroll widths both 375 px).
- Browser error log: no captured errors in this session.
- Automated model tests cover constant-offset/equal-message invariants, JSON
  roundtrip, independent arrays, schema and bounds rejection, invalid timestamps.
- Public package verification: see `VALIDATION.json` for the current full run.

## Limits and follow-up

This is a smoke check in the in-app browser, not a full browser/accessibility matrix.
Invalid import UI and downloaded-file roundtrip were not exercised end-to-end;
model validation and serialization have automated coverage. No learner study,
real radio/device test, detector benchmark or security bypass evaluation was run.
The mobile diagram labels are compact; test readability with actual learners.
