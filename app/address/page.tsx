"use client";

import { PropsWithChildren, Suspense } from "react";
import { Button, PropBlock, EmptyBlock } from "~/app/_components";
import Loading from "~/app/loading";
import { parseAddress } from "~/napi-pallas";
import { useUI } from "../_contexts";
import { isEmpty } from "../_utils";

// export const meta: MetaFunction = () => {
//   return [
//     { title: "Cardano Address - Lace Anatomy" },
//     { name: "description", content: "Lets dissect a Cardano address" },
//   ];
// };

// export async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   let raw = formData.get("raw");

//   if (!!raw) {
//     const res = parseAddress(raw.toString());
//     return json({ ...res, raw });
//   } else {
//     return json({ error: "an empty value? seriously?" });
//   }
// }

function Section(props: PropsWithChildren<{ title: string }>) {
  return (
    <blockquote className="mt-6 border-dashed py-4 md:border-l-4 md:px-10">
      <h4 className="text-3xl">{props.title}</h4>
      {props.children}
    </blockquote>
  );
}

function ByronSection(props: { data: any }) {
  const { data } = props;

  return (
    <Section title="Decoded Base58">
      <p className="text-xl text-gray-600">
        Your address is a valid base58 address value. By decoding the base58
        content we obtain a bytestring that can be interpreted according
        to&nbsp;
        <a
          className="text-blue-700 underline hover:text-blue-500"
          href="https://cips.cardano.org/cip/CIP-0019"
          target="_blank"
        >
          CIP-0019
        </a>
        . The CIP explains that there are 3 types of possible address, each one
        following a different encoding format: Shelley, Stake or Byron.
      </p>
      <PropBlock
        title="address bytes (hex)"
        value={data?.bytes}
        color="green"
      />
      <Section title="Parsed Address">
        <p className="text-xl text-gray-600">
          The address entered is of type&nbsp;
          <code>Byron</code>. Byron addresses are actually CBOR structures with
          several pieces of information. Since Byron addresses are deprecated
          and kept only for backward compatibility, we won't go into much more
          detail.
        </p>
        <PropBlock title="type" value={data?.address.kind} />
        <Section title="CBOR">
          <p className="text-xl text-gray-600">
            The following bytes are CBOR-encoded structures, you can continue
            your decoding journey using these (hex-encoded) bytes and a CBOR
            decoder.
          </p>
          <PropBlock
            title="CBOR (hex) "
            value={data?.address.byronCbor}
            color="green"
          />
        </Section>
      </Section>
    </Section>
  );
}

function StakeSection(props: { data: any }) {
  const { data } = props;

  return (
    <Section title="Decoded Bech32">
      <p className="text-xl text-gray-600">
        Your address is a valid bech32 address value. By decoding the bech32
        content we obtain a bytestring that can be interpreted according
        to&nbsp;
        <a
          className="text-blue-700 underline hover:text-blue-500"
          href="https://cips.cardano.org/cip/CIP-0019"
          target="_blank"
        >
          CIP-0019
        </a>
        . The CIP explains that there are 3 types of possible address, each one
        following a different encoding format: Shelley, Stake or Byron.
      </p>
      <PropBlock
        color="green"
        title="address bytes (hex)"
        value={data?.bytes}
      />
      <Section title="Parsed Address">
        <p className="text-xl text-gray-600">
          The address entered is of type&nbsp;
          <code>Stake</code>. Stake addresses contain two pieces of information:
          network tag and delegation info.
        </p>
        <PropBlock title="type" value={data?.address.kind} />
        <Section title="Network Tag">
          <p className="text-xl text-gray-600">
            The netword tag is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </p>
          <PropBlock title="network tag" value={data?.address.network} />
        </Section>
        {(!!data.address.delegationPart.hash ||
          !!data.address.delegationPart.pointer) && (
          <Section title="Delegation Info">
            <p className="text-xl text-gray-600">
              The delegation part describes who has control of the staking of
              the locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <PropBlock
              title="kind"
              value={
                data.address.delegationPart.isScript
                  ? "script"
                  : "verification key"
              }
            />
            {data.address.delegationPart.hash && (
              <PropBlock
                color="green"
                title="hash"
                value={data.address.delegationPart.hash}
              />
            )}
            {data.address.delegationPart.pointer && (
              <PropBlock
                color="green"
                title="pointer"
                value={data.address.delegationPart.pointer}
              />
            )}
          </Section>
        )}
      </Section>
    </Section>
  );
}

function ShelleySection(props: { data: any }) {
  const { data } = props;

  return (
    <Section title="Decoded Bech32">
      <p className="text-xl text-gray-600">
        Your address is a valid bech32 address value. By decoding the bech32
        content we obtain a bytestring that can be interpreted according
        to&nbsp;
        <a
          className="text-blue-700 underline hover:text-blue-500"
          href="https://cips.cardano.org/cip/CIP-0019"
          target="_blank"
        >
          CIP-0019
        </a>
        . The CIP explains that there are 3 types of possible address, each one
        following a different encoding format: Shelley, Stake or Byron.
      </p>
      <PropBlock
        color="green"
        title="address bytes (hex)"
        value={data?.bytes}
      />
      <Section title="Parsed Address">
        <p className="text-xl text-gray-600">
          The address entered is of type&nbsp;
          <code>Shelley</code>. Shelley addresses contain three pieces of
          information: network id, payment part and a delegation part.
        </p>
        <PropBlock title="type" value={data?.address.kind} />
        <Section title="Network Id">
          <p className="text-xl text-gray-600">
            The netword id is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </p>
          <PropBlock title="network id" value={data?.address.network} />
        </Section>
        {!!data.address.paymentPart && (
          <Section title="Payment Part">
            <p className="text-xl text-gray-600">
              The payment part describes who has control of the ownership of the
              locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <PropBlock
              title="kind"
              value={
                data.address.paymentPart.isScript
                  ? "script"
                  : "verification key"
              }
            />
            <PropBlock
              color="green"
              title="hash"
              value={data.address.paymentPart.hash}
            />
          </Section>
        )}
        {(!!data.address.delegationPart.hash ||
          !!data.address.delegationPart.pointer) && (
          <Section title="Delegation Part">
            <p className="text-xl text-gray-600">
              The delegation part describes who has control of the staking of
              the locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <PropBlock
              title="kind"
              value={
                data.address.delegationPart.isScript
                  ? "script"
                  : "verification key"
              }
            />
            {data.address.delegationPart.hash && (
              <PropBlock
                color="green"
                title="hash"
                value={data.address.delegationPart.hash}
              />
            )}
            {data.address.delegationPart.pointer && (
              <PropBlock
                color="green"
                title="pointer"
                value={data.address.delegationPart.pointer}
              />
            )}
          </Section>
        )}
        {!data.address.delegationPart.hash &&
          !data.address.delegationPart.pointer && (
            <Section title="Delegation Part">
              <p className="text-xl text-gray-600">
                The delegation part describes who has control of the staking of
                the locked values. This address doesn't specify a delegation
                part, this means there's no way to delegate the locked values of
                this address.
              </p>
              <EmptyBlock />
            </Section>
          )}
      </Section>
    </Section>
  );
}

function ExampleCard(props: { title: string; address: string }) {
  return (
    <form method="POST">
      <button
        type="submit"
        className="flex h-full w-full cursor-pointer flex-col rounded-lg border-2 bg-gray-100 p-4 text-left shadow"
      >
        <h3 className="text-xl">{props.title}</h3>
        <input type="hidden" value={props.address} name="raw" />
        <code className="mt-4 block w-full break-words text-gray-400">
          {props.address}
        </code>
      </button>
    </form>
  );
}

export default function Index() {
  const { error } = useUI();
  const data: any = useActionData();

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {!isEmpty(error) && (
          <div className="mb-4 text-lg text-red-500">{error}</div>
        )}

        <main className="mt-10 px-4">
          <h1 className="text-5xl text-black lg:text-7xl">Cardano Address</h1>
          <p className="text-xl text-gray-600">
            Lets dissect a Cardano address. Enter any valid address to inspect
            its contents.
          </p>
          <div className="mt-8 block">
            <form method="POST">
              <input
                type="text"
                autoComplete="off"
                defaultValue={data?.raw}
                name="raw"
                className="mt-4 block h-16 w-full appearance-none rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-white px-4 py-2 text-2xl text-black placeholder-gray-400 shadow shadow-black outline-none"
                placeholder="Enter any Cardano address in Bech32, Base58 or Hex encoding"
              />
              <div className="mt-4 flex flex-row justify-end">
                <Button type="submit">Dissect</Button>
              </div>
            </form>
          </div>
          {!!data?.error && (
            <div className="mt-8 block rounded-lg border-2 border-red-700 bg-red-200 p-4 text-2xl shadow shadow-black">
              {data.error}
            </div>
          )}

          {!data && (
            <>
              <h2 className="mt-16 text-3xl text-gray-500">
                Or try one of these examples...
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <ExampleCard
                  title="Mainnet address in Bech32"
                  address="addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x"
                />
                <ExampleCard
                  title="A script address"
                  address="addr1w8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcyjy7wx"
                />
                <ExampleCard
                  title="An address without delegation part"
                  address="addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8"
                />
                <ExampleCard
                  title="A Byron address"
                  address="37btjrVyb4KDXBNC4haBVPCrro8AQPHwvCMp3RFhhSVWwfFmZ6wwzSK6JK1hY6wHNmtrpTf1kdbva8TCneM2YsiXT7mrzT21EacHnPpz5YyUdj64na"
                />
                <ExampleCard
                  title="A stake addresss"
                  address="stake178phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcccycj5"
                />
                <ExampleCard
                  title="A rare address using a pointer to the delegation cert"
                  address="addr1gx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer5pnz75xxcrzqf96k"
                />
              </div>
            </>
          )}

          {data?.address?.kind == "Shelley" && <ShelleySection data={data} />}
          {data?.address?.kind == "Stake" && <StakeSection data={data} />}
          {data?.address?.kind == "Byron" && <ByronSection data={data} />}
        </main>
      </Suspense>
    </div>
  );
}
