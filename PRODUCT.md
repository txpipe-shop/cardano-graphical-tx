# Product

## Register

product

## Users

Cardano dApp developers building and debugging smart contracts on the eUTxO model. They inspect raw CBOR, trace UTxO flows through multi-transaction chains, and verify minting policies, redeemers, and Plutus scripts across networks (Mainnet, Preprod, Preview). Secondary users include blockchain analysts exploring on-chain patterns and educators using the visualizations to teach the eUTxO model.

## Product Purpose

Lace Anatomy renders Cardano transactions from CBOR and transaction hashes as interactive graphical diagrams and structured dissections. It exists to make low-level Cardano transaction data legible, debuggable, and visually navigable, replacing manual hex-picking and CLI grepping with a browser-based tool purpose-built for the developer workflow.

## Brand Personality

Technical, precise, clean. The interface speaks the developer's language: monospace where it matters, no decorative excess, every element earns its place. Not flashy, not playful, not corporate. Confident in its utility.

## Anti-references

Old-school enterprise tools: dense table grids, nested sidebar menus, Oracle/IBM-style chrome, 90s-era button bevels. Also avoid the generic Web3 aesthetic (neon-on-black, excessive blur, gradient everything, animated grid backgrounds). The tool should feel modern but not trendy, timeless but not dated.

## Design Principles

1. **Show, don't tell.** Visualize transaction structure graphically. The grapher is the primary insight surface; text dissections supplement, not replace.
2. **Precision over decoration.** Monospace data, exact values, no rounding without reason. Every visual element directly supports understanding. No ornament.
3. **Depth on demand.** Present the transaction at a glance, then let the developer drill into any UTxO, input, output, mint, or datum progressively.
4. **Feel solid, not delicate.** Interaction should inspire confidence: responsive drag, smooth zoom, clear feedback. The tool should feel like it was built by developers for developers.

## Accessibility & Inclusion

Current state is adequate: dark/light mode toggle via next-themes, basic aria labels on interactive controls. No additional formal requirements.
