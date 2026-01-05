-- Get blocks with cursor-based pagination
WITH
    latest_block AS (
        SELECT block_no
        FROM block
        WHERE block_no IS NOT NULL
        ORDER BY block_no DESC
        LIMIT 1
    )
SELECT
    encode(b.hash, 'hex') as hash,
    b.block_no as height,
    b.slot_no as slot,
    extract(
        epoch
        from b.time
    )::integer as time,
    b.tx_count as "txCount",
    (
        SELECT COALESCE(SUM(fee), 0)
        FROM tx
        WHERE
            tx.block_id = b.id
    )::text as fees,
    (lb.block_no - b.block_no) as confirmations,
    b.size
FROM
    block b
    CROSS JOIN latest_block lb
WHERE (
        (
          $1::text IS NULL
          OR b.id < (
             SELECT id
             FROM block
             WHERE hash = decode($1, 'hex')
          )
        ) AND
        (
          $2::word31type IS NULL
          OR b.epoch_no = $2
        )
    )
ORDER BY b.id DESC
LIMIT $2;
