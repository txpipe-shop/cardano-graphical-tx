import { StatusCodes } from "http-status-codes";
import { EXPLORER_PAGE_SIZE, JSONBIG } from "~/app/_utils";
import { isValidChain, NETWORK } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";

export async function GET(
  req: Request,
  { params }: { params: { chain: string } },
) {
  const { searchParams } = new URL(req.url);
  const offset = BigInt(searchParams.get("offset") ?? "0");
  const chain = isValidChain(params.chain) ? params.chain : NETWORK.MAINNET;

  try {
    const provider = getDolosProvider(chain);
    const result = await provider.getTxs({
      limit: EXPLORER_PAGE_SIZE,
      offset,
      query: undefined,
    });

    return new Response(
      JSONBIG.stringify({
        data: result.data,
        hasMore: result.data.length === Number(EXPLORER_PAGE_SIZE),
      }),
      {
        status: StatusCodes.OK,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(null, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
