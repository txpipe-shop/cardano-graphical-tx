-- Get unspent outpus for an address with pagination
-- $1 = address (bech32 or base58)
-- $2 = offset
-- $3 = limit
WITH unspent_outputs AS (
    SELECT
        tx_out.id as tx_out_id,
        tx_out.tx_id,
        tx_out.index,
        tx_out.address,
        tx_out.value as coin,
        tx_out.data_hash,
        tx_out.inline_datum_id,
        tx_out.reference_script_id,
        tx.hash as tx_hash
    FROM tx_out
    JOIN tx ON tx.id = tx_out.tx_id
    WHERE
        tx_out.address = $1
        AND tx_out.consumed_by_tx_id IS NULL
    ORDER BY tx_out.id DESC
),
total_count AS (
    SELECT COUNT(*) as total FROM unspent_outputs
),
paginated_utxos AS (
    SELECT * FROM unspent_outputs
    ORDER BY unspent_outputs.tx_out_id DESC
    OFFSET $2
    LIMIT $3
),
utxo_assets AS (
    SELECT
        mto.tx_out_id,
        json_object_agg(
            concat(encode(ma.policy, 'hex'), encode(ma.name, 'hex')),
            mto.quantity::text
        ) as assets
    FROM ma_tx_out mto
    JOIN paginated_utxos u ON u.tx_out_id = mto.tx_out_id
    JOIN multi_asset ma ON ma.id = mto.ident
    GROUP BY mto.tx_out_id
)
SELECT
    (SELECT total FROM total_count) as total,
    jsonb_agg(
        jsonb_build_object(
            'address', u.address,
            'coin', u.coin::text,
            'outRef', json_build_object(
                'hash', encode(u.tx_hash, 'hex'),
                'index', u.index
            ),
            'value', COALESCE(
                (SELECT assets FROM utxo_assets WHERE utxo_assets.tx_out_id = u.tx_out_id),
                '{}'::json
            ),
            'datum', (
                CASE
                    WHEN u.inline_datum_id IS NOT NULL THEN (
                        SELECT json_build_object(
                            'type', 'inline',
                            'datumHex', encode(d.bytes, 'hex')
                        )
                        FROM datum d
                        WHERE d.id = u.inline_datum_id
                    )
                    WHEN u.data_hash IS NOT NULL THEN (
                        json_build_object(
                            'type', 'hash',
                            'datumHash', encode(u.data_hash, 'hex')
                        )
                    )
                    ELSE null
                END
            ),
            'referenceScript', (
                CASE
                    WHEN u.reference_script_id IS NOT NULL THEN (
                        SELECT json_build_object(
                            'hash', encode(s.hash, 'hex'),
                            'type', s.type::text,
                            'bytes', encode(s.bytes, 'hex')
                        )
                        FROM script s
                        WHERE s.id = u.reference_script_id
                    )
                    ELSE null
                END
            )
        )
        ORDER BY u.tx_out_id DESC
    ) as utxos
FROM paginated_utxos u;
