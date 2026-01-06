-- Get the total funds (ADA + native assets) held by an address
WITH unspent_outputs AS (
    SELECT
        tx_out.id as tx_out_id,
        tx_out.value as coin
    FROM tx_out
    WHERE
        tx_out.address = $1
        AND tx_out.consumed_by_tx_id IS NULL
),
-- Native assets from outputs
asset_balances AS (
    SELECT
        concat(encode(ma.policy, 'hex'), encode(ma.name, 'hex')) as unit,
        SUM(mto.quantity)::text as quantity
    FROM ma_tx_out mto
    JOIN unspent_utxos u ON u.tx_out_id = mto.tx_out_id
    JOIN multi_asset ma ON ma.id = mto.ident
    GROUP BY ma.policy, ma.name
)
SELECT
    COALESCE(SUM(u.coin), 0)::text as lovelace,
    COALESCE(
        (SELECT json_object_agg(unit, quantity) FROM asset_balances),
        '{}'::json
    ) as assets
FROM unspent_utxos u;
