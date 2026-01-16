-- Get total number of transactions
SELECT count(*) as total
FROM tx
WHERE (
        $1::text IS NULL
        OR EXISTS (
            SELECT 1
            FROM tx_out
            WHERE
                tx_out.tx_id = tx.id
                AND tx_out.address = $1
        )
        OR EXISTS (
            SELECT 1
            FROM tx_in
                JOIN tx_out ON tx_in.tx_out_id = tx_out.id
                AND tx_in.tx_out_index = tx_out.index
            WHERE
                tx_in.tx_in_id = tx.id
                AND tx_out.address = $1
        )
    )
    AND (
        $2::text IS NULL
        OR EXISTS (
            SELECT 1
            FROM block
            WHERE
                block.id = tx.block_id
                AND block.hash = decode($2, 'hex')
        )
    )
    AND (
        $3::word31type IS NULL
        OR EXISTS (
            SELECT 1
            FROM block
            WHERE
                block.id = tx.block_id
                AND block.block_no = $3
        )
    )
    AND (
        $4::word31type IS NULL
        OR EXISTS (
            SELECT 1
            FROM block
            WHERE
                block.id = tx.block_id
                AND block.slot_no = $4
        )
    );
