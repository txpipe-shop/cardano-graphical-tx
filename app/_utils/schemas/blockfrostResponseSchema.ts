import { z } from "zod";

const BlockfrostResponseSchema = z.object({
  cbor: z.string(),
});

export default BlockfrostResponseSchema;
