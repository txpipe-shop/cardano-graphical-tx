-- Get epochs with offset-based pagination
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
WHERE e.no = $1;
