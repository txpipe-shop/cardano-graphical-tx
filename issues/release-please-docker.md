# Issue: Set up release-please and Docker build-on-release

> **good first issue** — This issue is beginner-friendly and a great way to learn about CI/CD automation with GitHub Actions.

## Goal
Set up an automated release pipeline using `release-please` that:
1. Generates changelogs and version bumps based on conventional commits
2. Creates GitHub releases automatically
3. Triggers Docker image builds **only** after a release is successfully published

## Background
Currently the repository lacks an automated release mechanism. Manual version bumps and changelog maintenance are error-prone. Docker images (if any) may be built on every push to `main`, which is wasteful and produces untagged intermediate images.

`release-please` is a Google-maintained tool that:
- Parses conventional commits (`feat:`, `fix:`, ` BREAKING CHANGE:`)
- Opens a release PR with updated `CHANGELOG.md` and version bumps
- Creates a GitHub release when the PR is merged
- Supports monorepos via manifest mode

## Changes

### 1. Add `release-please` configuration

Create `.release-please-manifest.json` at the repo root:

```json
{
  "packages/provider-core": "0.0.1",
  "packages/types": "0.0.1",
  "packages/utxorpc-sdk": "0.0.1",
  "packages/blockfrost-sdk": "0.0.1",
  "packages/cardano-provider-dbsync": "0.0.1",
  "packages/cardano-provider-dolos": "0.0.1",
  "packages/cardano-provider-u5c": "0.0.1",
  "packages/cardano-token-registry-sdk": "0.0.1",
  "packages/provider-tests": "0.0.1",
  "packages/napi-pallas": "0.0.1",
  "apps/web": "0.0.1",
  "apps/api": "0.0.1",
  "apps/svelte-app": "0.0.1"
}
```

Create `release-please-config.json`:

```json
{
  "packages": {
    "packages/provider-core": {},
    "packages/types": {},
    "packages/utxorpc-sdk": {},
    "packages/blockfrost-sdk": {},
    "packages/cardano-provider-dbsync": {},
    "packages/cardano-provider-dolos": {},
    "packages/cardano-provider-u5c": {},
    "packages/cardano-token-registry-sdk": {},
    "packages/provider-tests": {},
    "packages/napi-pallas": {},
    "apps/web": {},
    "apps/api": {},
    "apps/svelte-app": {}
  },
  "plugins": ["node-workspace"]
}
```

### 2. Create release GitHub Action

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    outputs:
      releases_created: ${{ steps.release.outputs.releases_created }}
    steps:
      - uses: google-github-actions/release-please-action@v4
        id: release
        with:
          command: manifest
          token: ${{ secrets.GITHUB_TOKEN }}

  docker:
    needs: release-please
    if: ${{ needs.release-please.outputs.releases_created == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ github.ref }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker images
        run: |
          # Build apps/web
          docker build -f apps/web/Dockerfile -t ghcr.io/${{ github.repository }}/web:${{ github.ref_name }} .
          docker push ghcr.io/${{ github.repository }}/web:${{ github.ref_name }}
          
          # Build apps/api
          docker build -f apps/api/Dockerfile -t ghcr.io/${{ github.repository }}/api:${{ github.ref_name }} .
          docker push ghcr.io/${{ github.repository }}/api:${{ github.ref_name }}
```

### 3. Add Dockerfiles (if missing)

If `apps/web/Dockerfile` or `apps/api/Dockerfile` do not exist, create minimal production Dockerfiles:

**`apps/web/Dockerfile`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter cardano-graphical-tx build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**`apps/api/Dockerfile`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### 4. Ensure conventional commits

Add a note to `CONTRIBUTING.md` (or create one) stating that commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `style:` — formatting, missing semi colons, etc.
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `perf:` — performance improvement
- `test:` — adding or correcting tests
- `chore:` — build process or auxiliary tool changes

## Acceptance Criteria
- [ ] `.release-please-manifest.json` created with all workspace packages
- [ ] `release-please-config.json` created with `node-workspace` plugin
- [ ] `.github/workflows/release.yml` created with `release-please` + conditional Docker jobs
- [ ] Docker images are built and pushed **only** when a release is created
- [ ] Docker images are tagged with the release version
- [ ] `CONTRIBUTING.md` mentions conventional commits
- [ ] A test release PR is successfully generated by release-please

## Notes
- The `node-workspace` plugin ensures that when a package is released, dependent packages in the monorepo are also bumped.
- If Dockerfiles already exist, update them instead of creating new ones.
- Consider using `docker/build-push-action` for caching and multi-platform builds in the future.
- `secrets.GITHUB_TOKEN` is automatically provided by GitHub Actions; no extra secrets needed.

## Related
- [release-please documentation](https://github.com/googleapis/release-please)
- [Conventional Commits specification](https://www.conventionalcommits.org/)
