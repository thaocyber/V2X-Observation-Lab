# Maintainer guide

## Repository layout

- `web/`: static website, including bundled dependencies and downloadable documentation.
- `tests/`: deterministic implementation regression checks.
- `scripts/`: verification and optional documentation/media builders.
- `docs/`: user guides, data contracts, scope, roadmaps and dated QA records.
- `.github/`: CI and community templates.
- `PUBLIC_MANIFEST.json`: reviewed file inventory and hashes.
- `VALIDATION.json`: local implementation-check result for the recorded inventory.

Publish only `web/` to the static host. GitHub Actions checks do not automatically
block Cloudflare deployment. Check both CI and the deployed routes after publishing.

## Rebuild documentation

Edit `scripts/build_user_guide.py`, the shared source for `docs/USER_GUIDE.md`,
`web/docs/index.html` and the four-page PDF. Install ReportLab and DejaVu Sans/Mono
fonts, then run `python3 scripts/build_user_guide.py`. Inspect all rendered PDF
pages and the web page before updating the inventory. Do not independently edit
generated copies. The documentation stylesheet is `web/docs/guide.css`.

## Rebuild the illustrated overview

To rebuild the optional media assets, install Pillow and imageio-ffmpeg in a
separate development environment, provide DejaVu Sans fonts and Node.js, then run
`python scripts/build_demo.py`. These dependencies are not needed to use the site
or run its standard verification. The video is H.264, 1280×720, 24 fps, 48 seconds,
with narration; model time and video time differ as described in the transcript.
The renderer creates the silent base. To add narration, run
`python scripts/add_narration.py --audio-dir /tmp/v2x-voice --synthesize`
with edge-tts installed. This explicitly sends only the public text in
`docs/demo-narration.json` to Microsoft’s speech service. Omit `--synthesize`
to use four existing MP3 clips instead. Generated voice timing can vary; the
script rejects clips that exceed their scene rather than cutting off speech.

## Verify

Python 3.10+ and Node.js 20+ are sufficient; no Python packages are required:

```sh
python3 scripts/verify_public.py
```

The check verifies the reviewed file inventory, local links/module dependencies,
and deterministic model behavior in a temporary copy. Optional JSON output:

```sh
python3 scripts/verify_public.py --report /tmp/v2x-public-check.json
```

After intentional edits, inspect the changed files, update the manifest using
`python3 scripts/verify_public.py --refresh`, and rerun checks. A manifest records
bytes, not a guarantee that content is appropriate for publication.


## Documentation policy

Keep README focused on what works today and how to start. Use the documentation
index for detailed guides, development plans and verification records. Label
roadmap items as planned and keep dated QA results tied to their tested scope.
Conference applications, presenter details and submission checklists belong in
maintainer-owned working files, not the public user guide. Public overview text
should describe the tool independently of any conference decision.
