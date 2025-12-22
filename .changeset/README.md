# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) for versioning and changelog generation.

## Adding a changeset

When you make a change that needs to be released, run:

```bash
pnpm changeset
```

This will prompt you to:
1. Select which packages have changed
2. Choose the type of change (major, minor, patch)
3. Write a summary of the changes

## Releasing

To create a new release:

1. Run `pnpm version-packages` to update versions and changelogs
2. Commit the changes
3. Run `pnpm release` to publish to npm

Or use the automated GitHub Actions workflow which handles this on merge to main.
