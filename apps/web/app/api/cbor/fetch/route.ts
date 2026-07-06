import { Hash } from "@laceanatomy/types";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { type NextRequest } from "next/server";
import { isValidChain } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hashRaw = searchParams.get("hash");
    const network = searchParams.get("net");
    const port = searchParams.get("port");

    if (!hashRaw || !network) {
      return new Response(null, {
        status: StatusCodes.BAD_REQUEST,
        statusText: "Missing hash or network parameter",
      });
    }

    const hash = Hash(hashRaw);
    let cbor: string;

    if (network === "devnet") {
      const portNumber = parseInt(port || "5164", 10);
      const provider = getU5CProviderNode(portNumber);
      cbor = await provider.getCBOR({ hash });
    } else if (isValidChain(network)) {
      const provider = getDolosProvider(network);
      cbor = await provider.getCBOR({ hash });
    } else {
      return new Response(null, {
        status: StatusCodes.BAD_REQUEST,
        statusText: `Unsupported network: ${network}`,
      });
    }

    return Response.json({ cbor });
  } catch (err) {
    console.error("Error fetching CBOR:", err);
    return new Response(null, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText:
        err instanceof Error
          ? err.message
          : ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
}
