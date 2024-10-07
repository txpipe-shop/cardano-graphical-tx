# CI and Deployment FAQ

## What is being built and when?

This entire repo is being built on each push to `main`

## How is this all being built?

It's built as a docker image through this [workflow](https://github.com/txpipe-shop/cardano-graphical-tx/blob/4fc36fbd5260b3773eaa40ca450d01feac51b8d7/.github/workflows/build.yml#L1-L37). It's pushed to Docker Hub. You can change the account it's being pushed to by changing the repository secrets.

## Just merged a PR. What do I do to see this in production?

If you've just added a PR and you want this deployed. Do the following:

1. Check if docker image was built and published successfully (green checkmark on latest `main` commit).

2. Copy the first **7** characters of the commit.

3. Go to Demeter and change the version of the deployed docker image `dockerusername/cardano-graphical-tx:bc20bf7` to have the hash of your commit.

4. Save changes.

Done!

## My NEXT_PUBLIC variable is undefined

Given that this repo uses `Next.js` to serve the website and that environment variables that start with `NEXT_PUBLIC` are bundled at build time, those env variables need to be available when building the docker image (not only when serving the website!!!). To do this just follow the `NEXT_PUBLIC_CBOR_ENDPOINT` example inside this [Dockerfile](https://github.com/txpipe-shop/cardano-graphical-tx/blob/4fc36fbd5260b3773eaa40ca450d01feac51b8d7/Dockerfile#L15-L19) and this [Github workflow](https://github.com/txpipe-shop/cardano-graphical-tx/blob/4fc36fbd5260b3773eaa40ca450d01feac51b8d7/.github/workflows/build.yml#L36-L37).

Notice that here, `CBOR_ENDPOINT` is defined a repository variable in Github:

```yml
build-args: |
  NEXT_PUBLIC_CBOR_ENDPOINT=${{ vars.CBOR_ENDPOINT }}
```

## Where do I add my environment variables?

If the environment variable starts with `NEXT_PUBLIC`, read [NEXT_PUBLIC undefined](#my-next_public-variable-is-undefined).

Otherwise, just add it in Demeter.
