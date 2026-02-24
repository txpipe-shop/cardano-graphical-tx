-- Performance Indices for DbSync Provider
-- Run with: psql $DATABASE_URL -f create_indices.sql
--
-- Uses CREATE INDEX CONCURRENTLY to avoid locking tables during creation.
-- These indices are safe to run on a live database.
-- Expected total time: 45-75 minutes on mainnet.

\timing on

-- ─────────────────────────────────────────────────────────────
-- Redeemer & Reference Inputs
-- Eliminates sequential scans when assembling transaction witnesses.
-- ─────────────────────────────────────────────────────────────

\echo '[1/9] idx_redeemer_tx_id (redeemer ~9.4M rows)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_redeemer_tx_id
ON redeemer(tx_id)
INCLUDE (purpose, index, unit_mem, unit_steps, fee, script_hash, redeemer_data_id);
ANALYZE redeemer;

\echo '[2/9] idx_reference_tx_in_tx_in_id (reference_tx_in ~7M rows)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reference_tx_in_tx_in_id
ON reference_tx_in(tx_in_id)
INCLUDE (tx_out_id, tx_out_index);
ANALYZE reference_tx_in;

-- ─────────────────────────────────────────────────────────────
-- Address Filtering
-- Accelerates getTxs/getAddressFunds/getAddressUTxOs queries.
-- ─────────────────────────────────────────────────────────────

\echo '[3/9] idx_tx_out_address_tx_id (tx_out, address filtering)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tx_out_address_tx_id
ON tx_out(address, tx_id)
INCLUDE (consumed_by_tx_id);
ANALYZE tx_out;

-- ─────────────────────────────────────────────────────────────
-- Block Filtering
-- Accelerates getTxs/getBlocks queries filtered by hash, height, or slot.
-- ─────────────────────────────────────────────────────────────

\echo '[4/9] idx_block_hash_id (block, hash lookup)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_block_hash_id
ON block(hash, id);

\echo '[5/9] idx_block_block_no_id (block, height filtering)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_block_block_no_id
ON block(block_no, id);

\echo '[6/9] idx_block_slot_no_id (block, slot filtering)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_block_slot_no_id
ON block(slot_no, id);
ANALYZE block;

-- ─────────────────────────────────────────────────────────────
-- Transaction Inputs
-- Accelerates input resolution when building full transaction objects.
-- ─────────────────────────────────────────────────────────────

\echo '[7/9] idx_tx_block_id_desc (tx, pagination within blocks)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tx_block_id_id_desc
ON tx(block_id, id DESC);
ANALYZE tx;

\echo '[8/9] idx_tx_in_tx_in_id (tx_in, input assembly)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tx_in_tx_in_id
ON tx_in(tx_in_id)
INCLUDE (tx_out_id, tx_out_index, redeemer_id);

\echo '[9/9] idx_tx_in_consumed_lookup (tx_in, consumed-by lookup)...'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tx_in_consumed_lookup
ON tx_in(tx_out_id, tx_out_index)
INCLUDE (tx_in_id);
ANALYZE tx_in;

-- ─────────────────────────────────────────────────────────────
-- Verification
-- ─────────────────────────────────────────────────────────────

\echo ''
\echo 'Index summary:'

SELECT
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) AS size
FROM pg_indexes
WHERE indexname IN (
    'idx_redeemer_tx_id',
    'idx_reference_tx_in_tx_in_id',
    'idx_tx_out_address_tx_id',
    'idx_block_hash_id',
    'idx_block_block_no_id',
    'idx_block_slot_no_id',
    'idx_tx_block_id_id_desc',
    'idx_tx_in_tx_in_id',
    'idx_tx_in_consumed_lookup'
)
ORDER BY tablename, indexname;
