# v0.1.0 release checklist

## Scope

Only the standalone synthetic Lab is published. The research repository is not
part of this distribution. The public manifest identifies reviewed file bytes;
it is not an exhaustive security or privacy certification.

## Confirmed before release

- Review the complete tracked inventory and local links/imports.
- Scan all six inherited Lab commits for targeted research names, personal paths
  and credential markers. The only match was a scanner pattern in the verification
  script itself; no corresponding content finding was identified.
- GitHub repository changed to public and Private Vulnerability Reporting enabled
  and confirmed by API on 2026-10-11.
- Run deterministic scenario and report tests in an isolated source copy.
- Check the actual browser interactions and record limits in [BROWSER_QA.md](BROWSER_QA.md).

## CI limitation

GitHub Actions is allowed on the repository, but creating the workflow was denied
with HTTP 403 by both the publishing token and the GitHub integration. Until an
owner enables it, no green CI run is claimed. The workflow is prepared at
`docs/ci/github-actions.yml.example`. A maintainer can add it as
`.github/workflows/check.yml`, refresh PUBLIC_MANIFEST.json, run verification,
and push. The first workflow run must pass before claiming active CI.

## Release contents

Tag v0.1.0, prerelease notes, source archive, offline web bundle and SHA-256
checksums. The JSON report's tool version identifies the source release.
The Arsenal draft is not submitted; presenter information remains maintainer-owned.
