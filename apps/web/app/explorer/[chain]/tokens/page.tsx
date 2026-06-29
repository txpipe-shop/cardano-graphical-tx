import Link from "next/link";
import { Header } from "~/app/_components/Header";
import { ROUTES } from "~/app/_utils/constants";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";

interface PolicyAsset {
  asset: string;
  quantity: string;
}

interface Props {
  params: Promise<{ chain: Network }>;
  searchParams?: Promise<{ policy?: string }>;
}

async function loadPolicyAssets(
  chain: Network,
  policy: string,
): Promise<{ assets: PolicyAsset[]; error: boolean }> {
  try {
    const provider = getDolosProvider(chain);
    const assets = await provider.getPolicyAssets(policy, 100, 1);
    return { assets, error: false };
  } catch (err) {
    console.error(err);
    return { assets: [], error: true };
  }
}

export default async function TokensListPage({ params, searchParams }: Props) {
  const { chain: chainParam } = await params;
  const searchParamsAwaited = searchParams ? await searchParams : undefined;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const policy = searchParamsAwaited?.policy;

  if (!policy) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary">
            Specify a <code className="font-mono">policy</code> query parameter
            to view all assets under a policy.
          </div>
        </main>
      </div>
    );
  }

  const { assets, error } = await loadPolicyAssets(chain, policy);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
            Could not load assets for this policy.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        <h1 className="mb-6 text-xl font-bold text-p-primary">
          Assets under policy{" "}
          <span className="font-mono text-sm">
            {policy.slice(0, 16)}...{policy.slice(-8)}
          </span>
        </h1>
        {assets.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary">
            No assets found for this policy.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {assets.map((a) => (
              <Link
                key={a.asset}
                href={ROUTES.EXPLORER_TOKEN(chain, a.asset)}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-mono text-accent-blue shadow-sm transition-colors hover:bg-explorer-row hover:underline"
              >
                {a.asset.slice(0, 20)}...{a.asset.slice(-8)}
                <span className="ml-2 text-p-secondary">({a.quantity})</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
