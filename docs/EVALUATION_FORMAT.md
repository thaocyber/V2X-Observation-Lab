# Evaluation Inspector input and evidence format

The local `/evaluate/` route reads JSON in the browser. Use a localhost HTTP server
or HTTPS (Web Crypto is needed for SHA-256). No model execution or threshold selection.

Download [the teaching fixture](../web/evaluate/sample.json) for the exact schema.
Top-level keys must be exactly `schemaVersion: 1`, `kind: "v2x-binary-evaluation"`,
`metadata` and `records`. Unknown keys are rejected; lesson/report JSON is a different format.

Metadata has eight nonempty strings, each up to 500 characters: dataset, model,
split, intendedUse, positiveClass, labelSource, thresholdPolicy, dataOrigin.
Include dataset/model versions in their descriptions. dataOrigin is `synthetic` or
`external`; this is a declaration, not a validated provenance claim. State unknown
provenance explicitly rather than inventing it. Record preprocessing/threshold policy
in the supplied metadata; the tool cannot establish whether the policy was followed.

Each record has exactly `id` (unique nonempty string, at most 120 characters),
`expected` and `predicted` (numeric 0 or 1). At least one row, at most 10,000; file
size at most 2 MiB in the UI. Scores/probabilities, multiclass and unlabeled records
are not supported. A label is a supplied reference, not independently verified truth.

TP: expected=1, predicted=1; TN: 0,0; FP: 0,1; FN: 1,0.
Accuracy=(TP+TN)/N, precision=TP/(TP+FP), recall=TP/(TP+FN),
F1=2TP/(2TP+FP+FN). A zero denominator yields null / N/A, not zero.
Counts of both classes remain visible. No AUC, uncertainty interval, calibration,
leakage detection or generalization estimate is computed from this format.

The authored sample has eight rows: TP=2, TN=3, FP=1, FN=2. These values are software
fixtures, not detector results. The report's metrics derive from its embedded rows.

Evidence exports have kind `v2x-evaluation-evidence`, schemaVersion 1,
inspectorVersion, inputHash, input, summary, evidence, review and limitations.
The digest is SHA-256 of UTF-8 JSON.stringify(validateEvaluation(input)): fixed
object key order, original record order. It is content identity, not a signature.
The hash covers the validated input, not notes or the whole report. Reports contain
all input rows even when a filter is selected. Review notes are user-authored, at
most 3,000 characters, and never tool approval. Reopening reports is not yet supported.

Nothing is saved automatically or uploaded. Review the full export before sharing;
metadata, identifiers and notes may contain sensitive user-supplied content.
