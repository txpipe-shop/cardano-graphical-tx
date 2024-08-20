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
  WHITE: "#FFFFFF",
};
export type KONVA_COLORS = (typeof KONVA_COLORS)[keyof typeof KONVA_COLORS];

export const NETWORK = {
  MAINNET: "mainnet",
  PREPROD: "preprod",
  PREVIEW: "preview",
} as const;
export type NETWORK = (typeof NETWORK)[keyof typeof NETWORK];

export const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

export const TX_URL_PARAM = "tx";
