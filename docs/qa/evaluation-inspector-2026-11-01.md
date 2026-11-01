# Evaluation Inspector local QA — 2026-11-01

Scope: software behavior on authored fixtures. No model training, inference,
real dataset experiment or assurance certification was performed.

## Verified

- Automated tests: known fixture confusion counts and metrics; missing-class and
  zero-denominator handling; schema, type, duplicate ID and row-bound rejection;
  independent validated data, deterministic report generation and notes limits.
- Browser sample loaded with TP=2, TN=3, FP=1, FN=2 (fixture: `web/evaluate/sample.json`).
- FN filter displayed only fixture-3 and fixture-4; aggregate metrics were retained.
- Import with a string label was rejected; the existing filtered data remained.
- Valid single-class fixture imported: precision, recall and F1 showed N/A.
- HTML-like model metadata and ID were displayed as text, not executed markup.
- Export while FN-filtered produced a file with all eight input rows and the typed
  reviewer note. The downloaded file was parsed locally; recomputed summary and
  SHA-256 of canonical input matched. The browser download-event waiter timed out,
  but the actual file was saved and independently inspected.
- 390×844 viewport document width and scroll width were both 375 px; no horizontal
  document overflow. Captured browser error log was empty. Full-page screenshot
  stitching had duplicate sections; it is not evidence of a full visual-device audit.
- Revised three-page proposal rendered and all pages visually inspected.

## Limits

In-app browser smoke checks only. Full browser/accessibility matrix, 10,000-row
UI performance, pagination interaction and unsaved-note confirmation branches have
not been exercised in browser. UI size limit has not been boundary-tested in browser.
No public deployment was made; no inference accuracy or deployment recommendation
can be inferred from fixture success. English Inspector UI remains planned.

Run `python3 scripts/verify_public.py --report VALIDATION.json` after reviewing and
refreshing the manifest. That report records the full automated suite.
