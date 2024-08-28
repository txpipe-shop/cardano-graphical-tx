import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import {
  getApiKey,
  getBlockfrostUTxO,
  getBlockfrostTx,
  getBlockfrostMetadata,
  getBlockfrostRedeemers,
  type NETWORK,
} from "../_utils";
import BlockfrostResponseSchema from "../_utils/schemas/blockfrostResponseSchema";

interface IHashHandler {
  network: NETWORK;
  hash: string;
}

export const hashHandler = async ({ network, hash }: IHashHandler) => {
  try {
    const apiKey = getApiKey(network);

    // Fetch UTXO response
    const utxosRes = await fetch(getBlockfrostUTxO(network, hash), {
      headers: {
        project_id: apiKey,
      },
      method: "GET",
    }).then(async (res) => {
      if (res.status !== StatusCodes.OK) throw res;
      return await res.json();
    });

    // Fetch Transaction response
    const txRes = await fetch(getBlockfrostTx(network, hash), {
      headers: {
        project_id: apiKey,
      },
      method: "GET",
    }).then(async (res) => {
      if (res.status !== StatusCodes.OK) throw res;
      return await res.json();
    });

    // Fetch metadata response
    const metadataRes = await fetch(getBlockfrostMetadata(network, hash), {
      headers: {
        project_id: apiKey,
      },
      method: "GET",
    }).then(async (res) => {
      if (res.status !== StatusCodes.OK) throw res;
      return await res.json();
    });
    const metadataParsed = metadataRes.map(
      (metadata: { label: string; json_metadata: any }) => {
        return {
          label: metadata.label,
          json_metadata: JSON.stringify(metadata.json_metadata, null, 2),
        };
      },
    );
    // Fetch redeemers response
    const redeemersRes = await fetch(getBlockfrostRedeemers(network, hash), {
      headers: {
        project_id: apiKey,
      },
      method: "GET",
    }).then(async (res) => {
      if (res.status !== StatusCodes.OK) throw res;
      return await res.json();
    });

    const parsedData = BlockfrostResponseSchema.parse({
      ...utxosRes,
      ...txRes,
      metadata: metadataParsed,
      redeemers: redeemersRes,
    });
    return Response.json(parsedData);
  } catch (err: any) {
    console.error(err);
    if (err instanceof ZodError) {
      return Response.json(
        {
          error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: Server respond with invalid data`,
        },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: Server respond with invalid data`,
        },
      );
    }

    if (err.status === StatusCodes.NOT_FOUND) {
      return Response.json(
        {
          error:
            "Transaction not found. Check your hash or try using another network",
        },
        {
          status: err.status,
          statusText:
            "Transaction not found. Check your hash or try using another network",
        },
      );
    } else if (err.status !== StatusCodes.OK) {
      return Response.json(
        {
          error: err.statusText,
        },
        {
          status: err.status,
          statusText: err.statusText,
        },
      );
    } else {
      return Response.json(
        { error: ReasonPhrases.INTERNAL_SERVER_ERROR },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      );
    }
  }
};
