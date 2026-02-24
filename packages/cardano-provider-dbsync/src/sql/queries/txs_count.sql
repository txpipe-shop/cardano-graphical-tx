-- Get total number of transactions
-- Optimized: Uses JOIN for block filters instead of correlated EXISTS subqueries
SELECT count(*) as total
FROM tx
JOIN block b ON b.id = tx.block_id
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
    AND ($2::text IS NULL OR b.hash = decode($2, 'hex'))
    AND ($3::word31type IS NULL OR b.block_no = $3)
    AND ($4::word31type IS NULL OR b.slot_no = $4);
