# v0.1.0 release checklist

## Scope

Only the standalone synthetic Lab is published. The research repository is not
part of this distribution. The public manifest identifies reviewed file bytes;
it is not an exhaustive security or privacy certification.

## Initial release checks and subsequent verification

- Review the complete tracked inventory and local links/imports.
- Scan all six inherited Lab commits for targeted research names, personal paths
  and credential markers. The only match was a scanner pattern in the verification
  script itself; no corresponding content finding was identified.
- GitHub repository changed to public and Private Vulnerability Reporting enabled
  and confirmed by API on 2026-10-11.
- Run deterministic scenario and report tests in an isolated source copy.
- Check the actual browser interactions and record limits in [BROWSER_QA.md](BROWSER_QA.md).

## CI after the initial prerelease

The initial v0.1.0 tag did not include an active workflow because both publishing
connections lacked workflow-write permission. The maintainer subsequently added
`.github/workflows/check.yml` to main. The obsolete `github/workflows/check.yml`
copy is removed and the public manifest is refreshed. Runs and their validation
artifacts are available under the repository Actions tab; verify the result for
the relevant commit. The v0.1.0 tag and its attached archives remain unchanged.

## Post-release QA update

Actual downloads and downloaded-scenario replay have now been verified in the
Codex in-app browser. Local bundle checks used CSP restrictions; WebGL fallback
used an injected renderer-construction failure in a temporary copy. These are
not full network-disconnect or actual GPU-failure tests. The remaining browser,
device and rehearsal gates are listed in [BROWSER_QA.md](BROWSER_QA.md).

## Release contents

Tag v0.1.0, prerelease notes, source archive, offline web bundle and SHA-256
checksums. The JSON report's tool version identifies the source release.
The Arsenal draft is not submitted; presenter information remains maintainer-owned.
