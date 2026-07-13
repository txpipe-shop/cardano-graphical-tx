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
  background: "#fafafa",
  surface: "#f3f4f6",
  ink: "#1f2937",
  muted: "#4b5563",
  subtle: "#6b7280",
  border: "#d1d5db",
  softBorder: "#e5e7eb",
  accent: "#4299e1",
  explorer: "#f5f3ff",
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

export function OpenGraphImage({
  kind = "home",
  title = SITE_NAME,
  eyebrow = "Cardano transaction anatomy",
  description = DEFAULT_DESCRIPTION,
  chain,
  facts = [],
  logoSrc = "https://laceanatomy.com/txpipe.png",
}: OpenGraphImageProps) {
  const displayTitle =
    kind === "transaction" || kind === "address" || kind === "token"
      ? truncateMiddle(title, 22, 18)
      : title;
  const visibleFacts = facts.slice(0, 6);
  const factRows = [visibleFacts.slice(0, 3), visibleFacts.slice(3, 6)].filter(
    (row) => row.length > 0,
  );
  const titleSize = resolveTitleSize(displayTitle);
  const displayDescription = truncateDescription(description);
  const descriptionSize = resolveDescriptionSize(displayDescription);

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
          backgroundImage: `radial-gradient(${colors.border} 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          opacity: 0.32,
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
          border: `2px dashed ${colors.border}`,
          borderRadius: radii.lg,
          backgroundColor: "rgba(250, 250, 250, 0.94)",
          padding: spacing.panel,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: spacing.headerGap,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              width={50}
              height={50}
              alt="TxPipe"
              style={{
                width: 50,
                height: 50,
                display: "flex",
                marginRight: 14,
              }}
            />
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
                color: colors.muted,
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
          <div
            style={{
              display: "flex",
              fontFamily: fontStacks.mono,
              fontSize: 18,
              color: colors.accent,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: spacing.contentGap,
              maxWidth: 960,
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -1,
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
                    backgroundColor: colors.surface,
                    padding: "10px 14px",
                    marginRight: index === row.length - 1 ? 0 : spacing.factGap,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      color: colors.subtle,
                      fontFamily: fontStacks.mono,
                      fontSize: 13,
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
