-- Get network statistics
SELECT (
        SELECT MAX(block_no)
        FROM block
    ) as block_height,
    (
        SELECT reltuples::bigint
        FROM pg_class
        WHERE
            relname = 'tx'
    ) as tx_count,
     (SELECT COUNT(DISTINCT address) FROM tx_out) as addresses,
    (
        SELECT
            CASE
                WHEN COUNT(*) > 1 THEN EXTRACT(
                    EPOCH
                    FROM (MAX(time) - MIN(time))
                ) / (COUNT(*) - 1)
                ELSE 20
            END
        FROM block
        WHERE
            time > (
                SELECT MAX(time) - INTERVAL '24 hours'
                FROM block
            )
    ) as avg_block_time;
