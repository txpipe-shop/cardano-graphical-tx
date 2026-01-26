-- Get the total funds (ADA + native assets) held by an address
WITH
    unspent_outputs AS (
        SELECT tx_out.id as tx_out_id, tx_out.value as coin
        FROM tx_out
        WHERE
            tx_out.address = $1
            AND tx_out.consumed_by_tx_id IS NULL
    ),
    -- Native assets from outputs
    asset_balances AS (
        SELECT concat(
                encode(ma.policy, 'hex'), encode(ma.name, 'hex')
            ) as unit, SUM(mto.quantity)::text as quantity
        FROM
            ma_tx_out mto
            JOIN unspent_outputs u ON u.tx_out_id = mto.tx_out_id
            JOIN multi_asset ma ON ma.id = mto.ident
        GROUP BY
            ma.policy,
            ma.name
    ),
    -- Address usage stats (first/last seen)
    address_usage AS (
        SELECT
            COUNT(DISTINCT t.tx_id) as tx_count,
            MIN(t.tx_id) as first_tx_id,
            MAX(t.tx_id) as last_tx_id
        FROM (
                SELECT tx_id
                FROM tx_out
                WHERE
                    address = $1
                UNION
                SELECT tx_in.tx_in_id
                FROM tx_in
                    JOIN tx_out ON tx_in.tx_out_id = tx_out.id
                WHERE
                    tx_out.address = $1
            ) t
    ),
    block_info_first AS (
        SELECT b.block_no as height, b.slot_no as slot, encode(b.hash, 'hex') as hash
        FROM block b
            JOIN tx t ON t.block_id = b.id
        WHERE
            t.id = (
                SELECT first_tx_id
                FROM address_usage
            )
    ),
    block_info_last AS (
        SELECT b.block_no as height, b.slot_no as slot, encode(b.hash, 'hex') as hash
        FROM block b
            JOIN tx t ON t.block_id = b.id
        WHERE
            t.id = (
                SELECT last_tx_id
                FROM address_usage
            )
    )
SELECT
    COALESCE(SUM(u.coin), 0)::text as lovelace,
    COALESCE(
        (
            SELECT json_object_agg(unit, quantity)
            FROM asset_balances
        ),
        '{}'::json
    ) as assets,
    COALESCE(
        (
            SELECT tx_count
            FROM address_usage
        ),
        0
    )::text as "txCount",
    (
        SELECT row_to_json(b)
        FROM block_info_first b
    ) as "firstSeen",
    (
        SELECT row_to_json(b)
        FROM block_info_last b
    ) as "lastSeen"
FROM unspent_outputs u;