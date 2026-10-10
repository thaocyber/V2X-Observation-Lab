# Contributing

Vietnamese and English contributions are welcome. Useful changes include clearer
explanations, accessibility, synthetic scenarios and reproducible UI bug fixes.
Read README and docs/DATA_FORMAT.md before changing scenario behavior.

Use a focused change. Describe expected/actual behavior, affected revision, browser
and exact reproduction steps. Use the issue/PR templates after a GitHub repository
is created. Security reports follow SECURITY.md and must not be filed publicly.

Use only authored synthetic fixtures or inputs with documented redistribution
rights. Never attach secrets, real location traces or proprietary materials.
Preserve copyright and bundled vendor notices. Contribute only material you have
rights to share under the project MIT license; identify separate third-party terms.

Run `python3 scripts/verify_public.py --refresh` after reviewing intentional edits,
then `python3 scripts/verify_public.py`. Inspect the manifest inventory before
refreshing. Add focused tests for meaningful behavior changes. Check both languages,
reset/rewind, missing WebGL behavior and scenario import errors for affected UI work.
Keep exports deterministic and do not present authored examples as measured results.

Be respectful, explain technical disagreements and protect other people's privacy.
