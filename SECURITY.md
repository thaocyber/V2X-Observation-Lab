# Security policy

This is a pre-release browser-local tool. There is no stable-version support
commitment or promised response SLA. The selected reporting channel is GitHub
Private Vulnerability Reporting for
[thaocyber/V2X-Observation-Lab](https://github.com/thaocyber/V2X-Observation-Lab).
Activation has not been verified. The maintainer must enable and test this channel;
until then, it must not be treated as an available private reporting route. No security email is offered.

Once configured, use Security > Advisories > Report a vulnerability in that
repository. Until then, ask the maintainer for a private route without sharing
vulnerability details publicly. Do not disclose payloads or secrets in public
issues or pull requests. Include revision, browser, minimal synthetic reproduction,
impact and sanitized evidence in a private report.

Only test instances you control or have permission to test. This policy does not
authorize attacks on vehicles, infrastructure or other users. No bounty or legal
safe-harbor promise is made. Coordinate a fix and disclosure privately.

The app has no backend or remote upload. Imported JSON is validated and read in
browser memory; text is rendered as text, not HTML. Only serve the reviewed `web/`
directory. Report script injection, unexpected network transfer or file exposure;
ordinary visual defects use the bug template. Local file validation is not a
substitute for separate review if server storage or uploads are added later.
