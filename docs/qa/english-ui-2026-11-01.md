# English interface audit — 2026-11-01

## Scope and decision
Bundled source text, UI labels, default lessons, validation messages and documentation use English. All three HTML entry points declare `lang="en"`. User-authored/imported lesson text and reviewer notes retain their original language.

## Verified checks
- Scanned first-party repository text for Vietnamese-specific characters: no matches. This is a language regression aid, not a proof of translation quality.
- Browser walkthrough: initial playground readout 6.50 s, offset story at 10.00 s, receiver-only mode and offset animation next-step control.
- Learning page: answer feedback, reveal, lesson editor and apply/reset use English.
- Evaluation Inspector: teaching sample loads eight rows; FN filter shows two cases with English status text.
- Inspected the Evaluation Inspector desktop viewport for text wrapping.
- Fixed an intermediate story-preset tuple regression found during browser testing; subsequent interactions completed without new console errors.

## Limits
No full browser/device or accessibility matrix was run. Imported user content is deliberately not translated. This report covers the local build; deployment is checked separately after publication.
