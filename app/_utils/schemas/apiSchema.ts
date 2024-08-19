import { z } from "zod";

const networkSchema = z.enum(["mainnet", "preprod", "preview"], {
  required_error: "Network is required",
});

export const getTxFromCBORSchema = z.object({
  network: networkSchema,
  cbor: z.string({ required_error: "CBOR is required" }),
});
