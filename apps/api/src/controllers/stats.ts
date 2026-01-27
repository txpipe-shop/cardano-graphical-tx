import { Stats } from '../types';
import { createProvider, NetworkConfig } from '../utils';

const formatOptions: Intl.NumberFormatOptions = {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1
};

const numberFormatter = new Intl.NumberFormat('en-US', formatOptions);
const integerFormatter = new Intl.NumberFormat('en-US');

export async function resolveStats(config: NetworkConfig): Promise<Stats> {
  const provider = createProvider(config);
  const stats = await provider.getNetworkStats();

  return {
    blockHeight: integerFormatter.format(stats.blockHeight),
    transactions: numberFormatter.format(stats.txCount),
    addresses: numberFormatter.format(stats.addresses),
    avgBlockTime: `${stats.avgBlockTime.toFixed(1)}s`
  };
}
