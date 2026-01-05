-- Get a single transaction by hash
WITH
    target_txs AS (
        SELECT *
        FROM tx
        WHERE
            hash = decode($1, 'hex')
    ),
    -- Block Info
    block_info AS (
        SELECT DISTINCT
            b.id,
            b.hash,
            b.epoch_no,
            b.block_no,
            b.time
        FROM block b
            JOIN target_txs tx ON tx.block_id = b.id
    ),
    -- MINT ASSETS
    mint_assets AS (
        SELECT mtm.tx_id, json_object_agg(
                concat(
                    encode(ma.policy, 'hex'), encode(ma.name, 'hex')
                ), mtm.quantity::text
            ) as assets
        FROM
            ma_tx_mint mtm
            JOIN target_txs tx ON tx.id = mtm.tx_id
            JOIN multi_asset ma ON ma.id = mtm.ident
        GROUP BY
            mtm.tx_id
    ),
    -- INPUT ASSETS (USED BY INPUTS AND REF INPUTS)
    input_assets AS (
        SELECT mto.tx_out_id, json_object_agg(
                concat(
                    encode(ma.policy, 'hex'), encode(ma.name, 'hex')
                ), mto.quantity::text
            ) as assets
        FROM ma_tx_out mto
            JOIN multi_asset ma ON ma.id = mto.ident
        WHERE
            mto.tx_out_id IN (
                SELECT tx_out.id
                FROM tx_out
                    JOIN target_txs ON target_txs.id = tx_out.consumed_by_tx_id
                UNION
                SELECT tx_out_id
                FROM reference_tx_in
                    JOIN target_txs ON target_txs.id = reference_tx_in.tx_in_id
            )
        GROUP BY
            mto.tx_out_id
    ),
    -- INPUTS
    inputs AS (
        SELECT tx_in.tx_in_id as tx_id, jsonb_agg(
                jsonb_build_object(
                    'address', source_out.address, 'coin', source_out.value::text, 'outRef', json_build_object(
                        'hash', encode(source_tx.hash, 'hex'), 'index', tx_in.tx_out_index
                    ), 'value', COALESCE(
                        (
                            SELECT assets
                            FROM input_assets
                            WHERE
                                input_assets.tx_out_id = source_out.id
                        ), '{}'::json
                    ), 'consumedBy', encode(target_txs.hash, 'hex'), 'datum', (
                        CASE
                            WHEN source_out.inline_datum_id IS NOT NULL THEN (
                                SELECT json_build_object(
                                        'type', 'inline', 'datumHex', encode(d.bytes, 'hex')
                                    )
                                FROM datum d
                                WHERE
                                    d.id = source_out.inline_datum_id
                            )
                            WHEN source_out.data_hash IS NOT NULL THEN (
                                json_build_object(
                                    'type', 'hash', 'datumHash', encode(source_out.data_hash, 'hex')
                                )
                            )
                            ELSE null
                        END
                    )
                )
                ORDER BY tx_in.id
            ) as list
        FROM
            tx_in
            JOIN target_txs ON target_txs.id = tx_in.tx_in_id
            JOIN tx_out source_out ON source_out.tx_id = tx_in.tx_out_id
            AND source_out.index = tx_in.tx_out_index
            JOIN tx source_tx ON source_tx.id = source_out.tx_id
        GROUP BY
            tx_in.tx_in_id
    ),
    -- REFERENCE INPUTS
    reference_inputs AS (
        SELECT ref_in.tx_in_id as tx_id, jsonb_agg(
                jsonb_build_object(
                    'address', source_out.address, 'coin', source_out.value::text, 'outRef', json_build_object(
                        'hash', encode(source_tx.hash, 'hex'), 'index', ref_in.tx_out_index
                    ), 'value', COALESCE(
                        (
                            SELECT assets
                            FROM input_assets
                            WHERE
                                input_assets.tx_out_id = source_out.id
                        ), '{}'::json
                    ), 'datum', (
                        CASE
                            WHEN source_out.inline_datum_id IS NOT NULL THEN (
                                SELECT json_build_object(
                                        'type', 'inline', 'datumHex', encode(d.bytes, 'hex')
                                    )
                                FROM datum d
                                WHERE
                                    d.id = source_out.inline_datum_id
                            )
                            WHEN source_out.data_hash IS NOT NULL THEN (
                                json_build_object(
                                    'type', 'hash', 'datumHash', encode(source_out.data_hash, 'hex')
                                )
                            )
                            ELSE null
                        END
                    )
                )
                ORDER BY ref_in.id
            ) as list
        FROM
            reference_tx_in ref_in
            JOIN target_txs ON target_txs.id = ref_in.tx_in_id
            JOIN tx_out source_out ON source_out.tx_id = ref_in.tx_out_id
            AND source_out.index = ref_in.tx_out_index
            JOIN tx source_tx ON source_tx.id = source_out.tx_id
        GROUP BY
            ref_in.tx_in_id
    ),
    -- OUTPUT ASSETS
    output_assets AS (
        SELECT mto.tx_out_id, json_object_agg(
                concat(
                    encode(ma.policy, 'hex'), encode(ma.name, 'hex')
                ), mto.quantity::text
            ) as assets
        FROM
            ma_tx_out mto
            JOIN tx_out ON tx_out.id = mto.tx_out_id
            JOIN target_txs ON target_txs.id = tx_out.tx_id
            JOIN multi_asset ma ON ma.id = mto.ident
        GROUP BY
            mto.tx_out_id
    ),
    -- OUTPUTS
    outputs AS (
        SELECT tx.id as tx_id, jsonb_agg(
                jsonb_build_object(
                    'address', tx_out.address, 'coin', tx_out.value::text, 'outRef', json_build_object(
                        'hash', encode(tx.hash, 'hex'), 'index', tx_out.index
                    ), 'value', COALESCE(
                        (
                            SELECT assets
                            FROM output_assets
                            WHERE
                                output_assets.tx_out_id = tx_out.id
                        ), '{}'::json
                    ), 'consumedBy', (
                        SELECT encode(stx.hash, 'hex')
                        FROM tx_in si
                            JOIN tx stx ON stx.id = si.tx_in_id
                        WHERE
                            si.tx_out_id = tx_out.tx_id
                            AND si.tx_out_index = tx_out.index
                        LIMIT 1
                    ), 'datum', (
                        CASE
                            WHEN tx_out.inline_datum_id IS NOT NULL THEN (
                                SELECT json_build_object(
                                        'type', 'inline', 'datumHex', encode(d.bytes, 'hex')
                                    )
                                FROM datum d
                                WHERE
                                    d.id = tx_out.inline_datum_id
                            )
                            WHEN tx_out.data_hash IS NOT NULL THEN (
                                json_build_object(
                                    'type', 'hash', 'datumHash', encode(tx_out.data_hash, 'hex')
                                )
                            )
                            ELSE null
                        END
                    )
                )
                ORDER BY tx_out.index
            ) as list
        FROM tx_out
            JOIN target_txs tx ON tx.id = tx_out.tx_id
        GROUP BY
            tx.id
    ),
    -- WITNESS SCRIPTS
    witnesses_scripts AS (
        SELECT s.tx_id, json_agg(
                json_build_object(
                    'hash', encode(s.hash, 'hex'), 'type', s.type::text, 'bytes', encode(s.bytes, 'hex')
                )
            ) as list
        FROM script s
            JOIN target_txs tx ON tx.id = s.tx_id
        GROUP BY
            s.tx_id
    ),
    -- WITNESS REDEEMERS
    witnesses_redeemers AS (
        SELECT r.tx_id, json_agg(
                json_build_object(
                    'purpose', r.purpose::text, 'index', r.index, 'unitMem', r.unit_mem, 'unitSteps', r.unit_steps, 'fee', r.fee::text, 'scriptHash', encode(r.script_hash, 'hex'), 'redeemerDataHash', (
                        SELECT encode(rd.hash, 'hex')
                        FROM redeemer_data rd
                        WHERE
                            rd.id = r.redeemer_data_id
                    )
                )
            ) as list
        FROM redeemer r
            JOIN target_txs tx ON tx.id = r.tx_id
        GROUP BY
            r.tx_id
    ),
    -- METADATA
    metadata AS (
        SELECT tm.tx_id, json_object_agg(
                tm.key::text, encode(tm.bytes, 'hex')
            ) as map
        FROM tx_metadata tm
            JOIN target_txs tx ON tx.id = tm.tx_id
        GROUP BY
            tm.tx_id
    )
SELECT json_build_object(
        'hash', encode(tx.hash, 'hex'), 'fee', tx.fee::text, 'block', (
            SELECT json_build_object(
                    'hash', encode(b.hash, 'hex'), 'epochNo', b.epoch_no, 'height', b.block_no
                )
            FROM block_info b
            WHERE
                b.id = tx.block_id
        ), 'createdAt', (
            SELECT extract(
                    epoch
                    from time
                )::integer
            FROM block_info b
            WHERE
                b.id = tx.block_id
        ), 'inputs', COALESCE(
            (
                SELECT list
                FROM inputs
                WHERE
                    inputs.tx_id = tx.id
            ), '[]'::jsonb
        ), 'outputs', COALESCE(
            (
                SELECT list
                FROM outputs
                WHERE
                    outputs.tx_id = tx.id
            ), '[]'::jsonb
        ), 'referenceInputs', COALESCE(
            (
                SELECT list
                FROM reference_inputs
                WHERE
                    reference_inputs.tx_id = tx.id
            ), '[]'::jsonb
        ), 'mint', COALESCE(
            (
                SELECT assets
                FROM mint_assets
                WHERE
                    mint_assets.tx_id = tx.id
            ), '{}'::json
        ), 'metadata', COALESCE(
            (
                SELECT map
                FROM metadata
                WHERE
                    metadata.tx_id = tx.id
            ), '{}'::json
        ), 'treasuryDonation', tx.treasury_donation::text, 'validityInterval', json_build_object(
            'invalidBefore', tx.invalid_before::text, 'invalidHereafter', tx.invalid_hereafter::text
        ), 'witnesses', json_build_object(
            'scripts', COALESCE(
                (
                    SELECT list
                    FROM witnesses_scripts
                    WHERE
                        witnesses_scripts.tx_id = tx.id
                ), '[]'::json
            ), 'redeemers', COALESCE(
                (
                    SELECT list
                    FROM witnesses_redeemers
                    WHERE
                        witnesses_redeemers.tx_id = tx.id
                ), '[]'::json
            )
        )
    ) as result
FROM target_txs tx;
