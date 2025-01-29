import toast from "react-hot-toast";

const hexaToText = (hexa: string) => {
  let text = "";
  for (let i = 0; i < hexa.length; i += 2) {
    text += String.fromCharCode(parseInt(hexa.substring(i, i + 2), 16));
  }
  return text;
};

export const trimString = (string: string, length = 8) => {
  if (string.length === 0) return "";
  if (string.length <= length * 2) return string;
  return string.slice(0, length) + "..." + string.slice(-length);
};

export const firstNChars = (string: string, n: number) => {
  if (string.length <= n) return string;
  return string.slice(0, n) + "...";
};

const validHexaChars = "0123456789abcdefABCDEF";

export const isHexa = (cbor: string): boolean => {
  for (let i = 0; i < cbor.length; i++) {
    if (!!cbor[i] && !validHexaChars.includes(cbor[i] ?? "")) {
      return false;
    }
  }
  return true;
};

export const isEmpty = (str: string) => {
  return str.trim() === "";
};

export const getQuery = (query: string) => {
  return query
    .split("?")[1]
    ?.split("&")
    .reduce((acc, curr) => {
      const [key, value] = curr.split("=");
      return { ...acc, [key ?? "failed"]: value };
    }, {});
};

export const getAssetName = (hexa: string) => {
  if (hexa === "lovelace") return hexa;
  return isEmpty(hexaToText(hexa)) ? "n/a" : hexaToText(hexa);
};

export const handleCopy = (text: string) => () => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
};

export const checkIfHash = (hash: string): boolean => {
  if (hash.length === 64) {
    return isHexa(hash);
  } else {
    const [hashString, hashNumber] = hash.split("#");
    if (!hashNumber || isEmpty(hashNumber) || Number.isNaN(Number(hashNumber)))
      return false;
    return !!hashString && checkIfHash(hashString);
  }
};
