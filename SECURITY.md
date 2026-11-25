# Security

The site is static: no server code, no database, no accounts and no forms.

- **No third-party requests.** Fonts are self-hosted, and there are no analytics, embeds or CDNs. The built pages set a Content Security Policy that allows only the site's own files.
- **Supply chain.** `package-lock.json` is committed. CI runs `npm audit` on every push and every Monday. Every GitHub Action is pinned to a full commit SHA, and CI fails on one that is not. Dependabot opens monthly update pull requests.
- **Secrets.** There are none. `.env` is git-ignored all the same.

## Reporting a problem

Use a private GitHub security advisory on the repository, never a public issue.
