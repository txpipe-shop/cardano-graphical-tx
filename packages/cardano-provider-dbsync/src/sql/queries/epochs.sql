-- Get epochs with cursor-based pagination
SELECT
    e.no as epoch,
    extract(
        epoch
        from e.start_time
    )::integer as "startTime",
    extract(
        epoch
        from e.end_time
    )::integer as "endTime",
    e.tx_count as "txCount",
    e.blk_count as "blkCount",
    e.out_sum::text as output,
    e.fees::text as fees
FROM epoch e
WHERE (
        $1::word31type IS NULL
        OR e.no < $1
    )
ORDER BY e.no DESC
LIMIT $2;