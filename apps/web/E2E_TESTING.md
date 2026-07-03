# E2E Testing Plan

## Stack

[Playwright](https://playwright.dev) for browser e2e tests. No other test frameworks in `apps/web`.

## Scope (Phase 1)

| Spec              | What it tests                                                                     | Priority |
| ----------------- | --------------------------------------------------------------------------------- | -------- |
| `dissect.spec.ts` | CBOR → Dissect structured view. Tx hash → Dissect CBOR + metadata. Error handling | High     |
| `address.spec.ts` | Shelley/Byron/stake/script address dissect. Invalid input error                   | High     |

Homepage, tx-input, and explorer tests deferred to later phases.

## File structure

```
apps/web/
  e2e/
    playwright.config.ts
    fixtures/
      CREDITS.md
      addresses.fixtures.ts
      txs.fixtures.ts
    specs/
      dissect.spec.ts
      address.spec.ts
    support/
      test-utils.ts
```

## Fixtures from blockfrost-tests

Test input data adapted from [blockfrost/blockfrost-tests](https://github.com/blockfrost/blockfrost-tests) (Apache-2.0 license). Full attribution in `e2e/fixtures/CREDITS.md`.

### Tx hashes (from `src/fixtures/mainnet/txs/tx.ts`)

- `28172ea876c3d1e691284e5179fae2feb3e69d7d41e43f8023dc380115741026` — generic Shelley tx
- `4e686b3c16670497f10f8dfd74ff4f1426221deda7b34816f426d4964589e1de` — tx with assets

### Addresses (from `src/fixtures/mainnet/addresses/address.ts`)

- `addr1q9s5ws6xufe74h5vqyhxsd0n2hr4fdg895k9ztut2fjqz93z3znzpvegug3chp4dx556lp38h8ptu3smtj20q83rmdtqcjup2u` — Shelley with stake address
- `DdzFFzCqrhstmqBkaU98vdHu6PdqjqotmgudToWYEeRmQKDrn4cAgGv9EZKtu1DevLrMA1pdVazufUCK4zhFkUcQZ5Gm88mVHnrwmXvT` — Byron
- `addr1w9vgcswrfxcujpqxt39wefrnd75ww35u3k3gauq4pf60mdc2rlkz7` — Script address
- `addr_vkh1h7wl3l3w6heru0us8mdc3v3jlahq79w49cpypsuvgjhdwp5apep` — Payment credential (no stake)

## Test cases

### dissect.spec.ts

1. **CBOR → Dissect** — enter known CBOR string (from `constants.ts`), click Dissect, verify structured view renders inputs/outputs/fee
2. **Tx hash → Dissect** — select Hash option, enter known tx hash, click Dissect, verify CBOR hex + metadata loaded from Blockfrost
3. **Network selector** — switch between mainnet/preprod/preview, verify it persists in localStorage and query params
4. **Invalid input** — enter garbage text, verify error banner

### address.spec.ts

1. **Shelley address** — enter Shelley address, verify type=`shelley`, stake address shown
2. **Byron address** — enter Byron address, verify type=`byron`
3. **Stake address** — enter stake address, verify stake key rendered
4. **Script address** — enter script address, verify `script` flag shown
5. **Invalid address** — enter garbage text, verify error state

## Dependencies

```bash
pnpm --filter cardano-graphical-tx add -D @playwright/test
pnpm --filter cardano-graphical-tx exec playwright install chromium
```

## Scripts (to add in `apps/web/package.json`)

```json
"test:e2e": "playwright test -c e2e/playwright.config.ts",
"test:e2e:ui": "playwright test --ui -c e2e/playwright.config.ts"
```

## `playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "pnpm --filter cardano-graphical-tx dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: {
      SKIP_VALIDATION: "1",
    },
  },
});
```

## Running

```bash
# First time
pnpm --filter cardano-graphical-tx exec playwright install chromium

# Run tests
PREPROD_BLOCKFROST_KEY=... pnpm --filter cardano-graphical-tx test:e2e

# UI mode
PREPROD_BLOCKFROST_KEY=... pnpm --filter cardano-graphical-tx test:e2e:ui
```

Requires `PREPROD_BLOCKFROST_KEY` in environment (or `.env` file) for hash/CBOR resolution via Blockfrost API.

## CI notes

- napi-pallas must be built first (handled by turbo `^build` dependency)
- `PREPROD_BLOCKFROST_KEY` must be set in CI secrets
- `SKIP_VALIDATION=1` to skip env validation during build
- `playwright install chromium` runs in CI setup step
