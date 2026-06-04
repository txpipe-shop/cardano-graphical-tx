# CI and Deployment FAQ

## What is being built and when?

The docker image is built manually via `workflow_dispatch` — go to Actions → "Build and push dockers" → "Run workflow"

## How is this all being built?

It's built as a docker image through this [workflow](https://github.com/txpipe-shop/cardano-graphical-tx/blob/main/.github/workflows/docker.yml). It's pushed to Docker Hub. You can change the account it's being pushed to by changing the repository secrets.

## Just merged a PR. What do I do to see this in production?

If you've just added a PR and you want this deployed. Do the following:

1. Go to Actions → "Build and push dockers" → "Run workflow" to trigger a build on `main`.
2. Check if docker image was built and published successfully (green checkmark on the workflow run).

3. Copy the first **7** characters of the commit.

4. Go to Demeter and change the version of the deployed docker image `dockerusername/cardano-graphical-tx:bc20bf7` to have the hash of your commit.

5. Save changes.

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

Otherwise, just add it in Demeter.
