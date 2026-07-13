import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  formatChain,
  truncateMiddle,
} from "~/app/_utils/metadata";

export type OpenGraphKind =
  | "home"
  | "tx"
  | "address"
  | "explorer"
  | "transaction"
  | "block"
  | "token";

export type OpenGraphFact = [string, string];

export type OpenGraphImageProps = {
  kind?: OpenGraphKind | string;
  title?: string;
  eyebrow?: string;
  description?: string;
  chain?: string | null;
  facts?: OpenGraphFact[];
  logoSrc?: string;
};

export const OPEN_GRAPH_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

const colors = {
  background: "#eef6fc",
  accentSurface: "#e6f3fb",
  ink: "#1f2937",
  muted: "#374151",
  subtle: "#536579",
  border: "#b9d9ee",
  softBorder: "#d8e8f3",
  accent: "#2b6cb0",
  accentStrong: "#1e4e8c",
  accentMid: "#90cdf4",
  explorer: "#ede9fe",
  explorerInk: "#5b21b6",
} as const;

const fontStacks = {
  sans: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
} as const;

const spacing = {
  page: 34,
  panel: 34,
  headerGap: 26,
  contentGap: 10,
  factGap: 12,
} as const;

const radii = {
  sm: 8,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

function resolveTitleSize(title: string): number {
  if (title.length > 66) return 36;
  if (title.length > 48) return 42;
  return 54;
}

function resolveDescriptionSize(description: string): number {
  return description.length > 110 ? 20 : 22;
}

function truncateDescription(description: string): string {
  if (description.length <= 132) return description;
  return `${description.slice(0, 129).trimEnd()}...`;
}

function normalizeOpenGraphText(value: string): string {
  return value.replaceAll("₳", "ADA");
}

export function OpenGraphImage({
  kind = "home",
  title = SITE_NAME,
  eyebrow = "Cardano transaction anatomy",
  description = DEFAULT_DESCRIPTION,
  chain,
  facts = [],
  logoSrc = "https://laceanatomy.com/txpipe.png",
}: OpenGraphImageProps) {
  const normalizedTitle = normalizeOpenGraphText(title);
  const displayTitle =
    kind === "transaction" || kind === "address" || kind === "token"
      ? truncateMiddle(normalizedTitle, 22, 18)
      : normalizedTitle;
  const visibleFacts = facts
    .slice(0, 6)
    .map(
      ([label, value]) =>
        [label, normalizeOpenGraphText(value)] as OpenGraphFact,
    );
  const factRows = [visibleFacts.slice(0, 3), visibleFacts.slice(3, 6)].filter(
    (row) => row.length > 0,
  );
  const titleSize = resolveTitleSize(displayTitle);
  const displayDescription = truncateDescription(
    normalizeOpenGraphText(description),
  );
  const descriptionSize = resolveDescriptionSize(displayDescription);
  const normalizedEyebrow = normalizeOpenGraphText(eyebrow);
  const displayEyebrow =
    normalizedEyebrow.trim().toLowerCase() === kind.trim().toLowerCase()
      ? null
      : normalizedEyebrow;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        boxSizing: "border-box",
        backgroundColor: colors.background,
        color: colors.ink,
        fontFamily: fontStacks.sans,
        padding: spacing.page,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${colors.accentMid} 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
          border: `2px dashed ${colors.accentMid}`,
          borderRadius: radii.lg,
          backgroundColor: "#fcfeff",
          padding: spacing.panel,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 8,
            backgroundColor: colors.accent,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: spacing.headerGap - 2,
            paddingBottom: 20,
            borderBottom: `2px dashed ${colors.softBorder}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 58,
                height: 58,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
                border: `2px solid ${colors.border}`,
                borderRadius: radii.md,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                width={44}
                height={44}
                alt="TxPipe"
                style={{
                  width: 44,
                  height: 44,
                  display: "flex",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700 }}>{SITE_NAME}</div>
              <div
                style={{
                  marginTop: 2,
                  fontSize: 15,
                  color: colors.subtle,
                  letterSpacing: 0.4,
                  fontFamily: fontStacks.mono,
                }}
              >
                txpipe.io
              </div>
            </div>
          </div>
          {chain ? (
            <div
              style={{
                display: "flex",
                border: `2px solid ${colors.softBorder}`,
                borderRadius: radii.pill,
                backgroundColor: colors.explorer,
                padding: "10px 18px",
                fontFamily: fontStacks.mono,
                fontSize: 18,
                color: colors.explorerInk,
                fontWeight: 600,
              }}
            >
              {formatChain(chain)}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {displayEyebrow ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontFamily: fontStacks.mono,
                fontSize: 16,
                color: colors.accent,
                fontWeight: 600,
                borderRadius: radii.pill,
                backgroundColor: colors.accentSurface,
                padding: "7px 12px",
              }}
            >
              {displayEyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              marginTop: displayEyebrow ? spacing.contentGap : 0,
              maxWidth: 960,
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -1,
              color: colors.accentStrong,
            }}
          >
            {displayTitle}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: spacing.contentGap,
              maxWidth: 820,
              color: colors.muted,
              fontSize: descriptionSize,
              lineHeight: 1.24,
            }}
          >
            {displayDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            width: "100%",
            height: 142,
          }}
        >
          {factRows.map((row, rowIndex) => (
            <div
              key={`fact-row-${rowIndex}`}
              style={{
                display: "flex",
                width: "100%",
                height: 65,
                marginTop: rowIndex === 0 ? 0 : spacing.factGap,
              }}
            >
              {row.map(([label, value], index) => (
                <div
                  key={`${label}:${value}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    flex: 1,
                    height: "100%",
                    boxSizing: "border-box",
                    border: `2px solid ${colors.softBorder}`,
                    borderRadius: radii.md,
                    backgroundColor: colors.accentSurface,
                    padding: "10px 14px",
                    marginRight: index === row.length - 1 ? 0 : spacing.factGap,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      color: colors.accent,
                      fontFamily: fontStacks.mono,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 6,
                      color: colors.ink,
                      fontFamily: fontStacks.mono,
                      fontSize: 18,
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}
                  >
                    {truncateMiddle(value, 13, 8)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
