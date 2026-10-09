# CI and Deployment FAQ

## What is being built and when?

The docker image is built manually via `workflow_dispatch` — go to Actions → "Build and push dockers" → "Run workflow"

## How is this all being built?

It's built as a docker image through this [workflow](https://github.com/txpipe-shop/cardano-graphical-tx/blob/main/.github/workflows/docker.yml) and pushed to the GitHub Container Registry as `ghcr.io/txpipe-shop/cardano-graphical-tx`. The workflow authenticates with its own `GITHUB_TOKEN`, so no registry secrets are needed.

Each run publishes two tags:

- `ui-<sha7>` — the first 7 characters of the built commit, e.g. `ui-bc20bf7`.
- `ui-<ref>` — the branch the workflow ran on, e.g. `ui-main`.

The image namespace is set in `docker.yml`; change it there to publish elsewhere.

## Just merged a PR. What do I do to see this in production?

1. Go to Actions → "Build and push dockers" → "Run workflow" to trigger a build on `main`.
2. Check that the image was built and published successfully (green checkmark on the workflow run).
3. Copy the first **7** characters of the commit.
4. Roll the deployment to the new image tag, `ghcr.io/txpipe-shop/cardano-graphical-tx:ui-<sha7>`.

Done!

## My NEXT_PUBLIC variable is undefined

Given that this repo uses `Next.js` to serve the website and that environment variables that start with `NEXT_PUBLIC` are bundled at build time, those env variables need to be available when building the docker image (not only when serving the website!!!). To do this just follow the `NEXT_PUBLIC_CBOR_ENDPOINT` example inside this [Dockerfile](https://github.com/txpipe-shop/cardano-graphical-tx/blob/main/Dockerfile) and this [Github workflow](https://github.com/txpipe-shop/cardano-graphical-tx/blob/main/.github/workflows/docker.yml).

Notice that here, `NEXT_PUBLIC_CBOR_ENDPOINT` is defined as a repository variable in Github:

```yml
build-args: |
  NEXT_PUBLIC_CBOR_ENDPOINT=${{ vars.NEXT_PUBLIC_CBOR_ENDPOINT }}
```

## Where do I add my environment variables?

If the environment variable starts with `NEXT_PUBLIC`, read [NEXT_PUBLIC undefined](#my-next_public-variable-is-undefined).

Otherwise, add it to the deployment's runtime environment.
