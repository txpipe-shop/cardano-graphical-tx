import { EpochContent } from '@laceanatomy/blockfrost-sdk';
import { EpochsRes } from '@laceanatomy/provider-core';

type EpochItem = EpochsRes['data'][number];

export function toEqualBfEpoch(
    received: EpochItem,
    expected: EpochContent
): { pass: boolean; message: () => string } {
    const failures: string[] = [];

    if (received.index !== BigInt(expected.epoch)) {
        failures.push(`index (epoch): expected ${expected.epoch}, received ${received.index}`);
    }

    if (received.txCount !== BigInt(expected.tx_count)) {
        failures.push(`txCount: expected ${expected.tx_count}, received ${received.txCount}`);
    }

    if (received.blocksProduced !== BigInt(expected.block_count)) {
        failures.push(
            `blocksProduced: expected ${expected.block_count}, received ${received.blocksProduced}`
        );
    }

    if (received.fees !== BigInt(expected.fees)) {
        failures.push(`fees: expected ${expected.fees}, received ${received.fees}`);
    }

    const pass = failures.length === 0;

    return {
        pass,
        message: () =>
            pass
                ? 'Expected epoch values not to be equal'
                : `Epoch mismatch for ${expected.epoch}:\n${failures.join('\n')}`
    };
}
