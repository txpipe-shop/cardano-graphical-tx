import JSONbig from "json-bigint";

export const ROUTES = {
  HOME: "/",
};

export const API_ROUTES = {
  CBOR: "api/cbor",
};

export const TX_WIDTH = 125;
export const TX_HEIGHT = 250;
export const POINT_SIZE = 10;
export const UTXO_TEXT_WIDTH = 400;
export const STROKE_WIDTH = 3;
export const LINE_WIDTH = 2;
export const UTXO_LINE_GAP = 10;
export const POLICY_LENGTH = 56;

export const KONVA_COLORS = {
  PINK: "#FF8096",
  RED: "#FF0000",
  BLUE: "#0000FF",
  LIGHT_BLUE: "#ADD8E6",
  BLACK: "#000000",
  GREY: "#808080",
  TRANSAPARENT: "transparent",
  LIGHTER_GREY: "#F7F7F7",
  GREEN_MINT_FILL: "#8AC926",
  GREEN_MINT_STROKE: "#77AD21",
  RED_BURN_FILL: "#FF3E45",
  RED_BURN_STROKE: "#FF262D",
  WHITE: "#FFFFFF",
};
export type KONVA_COLORS = (typeof KONVA_COLORS)[keyof typeof KONVA_COLORS];

export const NETWORK = {
  MAINNET: "mainnet",
  PREPROD: "preprod",
  PREVIEW: "preview",
} as const;
export type NETWORK = (typeof NETWORK)[keyof typeof NETWORK];

export const JSONBIG = JSONbig({
  useNativeBigInt: true,
  constructorAction: "preserve",
  protoAction: "preserve",
});

export const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

export const TX_URL_PARAM = "tx";
export const UTXO_URL_PARAM = "utxo";

export const burnIconURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik0yNDAtNDAwcTAgNTIgMjEgOTguNXQ2MCA4MS41cS0xLTUtMS05di05cTAtMzIgMTItNjB0MzUtNTFsMTEzLTExMSAxMTMgMTExcTIzIDIzIDM1IDUxdDEyIDYwdjlxMCA0LTEgOSAzOS0zNSA2MC04MS41dDIxLTk4LjVxMC01MC0xOC41LTk0LjVUNjQ4LTU3NHEtMjAgMTMtNDIgMTkuNXQtNDUgNi41cS02MiAwLTEwNy41LTQxVDQwMS02OTBxLTM5IDMzLTY5IDY4LjV0LTUwLjUgNzJRMjYxLTUxMyAyNTAuNS00NzVUMjQwLTQwMFptMjQwIDUyLTU3IDU2cS0xMSAxMS0xNyAyNXQtNiAyOXEwIDMyIDIzLjUgNTV0NTYuNSAyM3EzMyAwIDU2LjUtMjN0MjMuNS01NXEwLTE2LTYtMjkuNVQ1MzctMjkybC01Ny01NlptMC00OTJ2MTMycTAgMzQgMjMuNSA1N3Q1Ny41IDIzcTE4IDAgMzMuNS03LjVUNjIyLTY1OGwxOC0yMnE3NCA0MiAxMTcgMTE3dDQzIDE2M3EwIDEzNC05MyAyMjdUNDgwLTgwcS0xMzQgMC0yMjctOTN0LTkzLTIyN3EwLTEyOSA4Ni41LTI0NVQ0ODAtODQwWiIvPjwvc3ZnPg==";
export const mintIconURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik00NDAtMTIwdi0zMTlxLTY0IDAtMTIzLTI0LjVUMjEzLTUzM3EtNDUtNDUtNjktMTA0dC0yNC0xMjN2LTgwaDgwcTYzIDAgMTIyIDI0LjVUNDI2LTc0NnEzMSAzMSA1MS41IDY4dDMxLjUgNzlxNS03IDExLTEzLjV0MTMtMTMuNXE0NS00NSAxMDQtNjkuNVQ3NjAtNzIwaDgwdjgwcTAgNjQtMjQuNSAxMjNUNzQ2LTQxM3EtNDUgNDUtMTAzLjUgNjlUNTIwLTMyMHYyMDBoLTgwWm0wLTQwMHEwLTQ4LTE4LjUtOTEuNVQzNjktNjg5cS0zNC0zNC03Ny41LTUyLjVUMjAwLTc2MHEwIDQ4IDE4IDkydDUyIDc4cTM0IDM0IDc4IDUydDkyIDE4Wm04MCAxMjBxNDggMCA5MS41LTE4dDc3LjUtNTJxMzQtMzQgNTIuNS03OHQxOC41LTkycS00OCAwLTkyIDE4LjVUNTkwLTU2OXEtMzQgMzQtNTIgNzcuNVQ1MjAtNDAwWm0wIDBabS04MC0xMjBaIi8+PC9zdmc+";

export const OPTIONS = {
  HASH: "hash",
  CBOR: "cbor",
} as const;

export type OPTIONS = (typeof OPTIONS)[keyof typeof OPTIONS];
