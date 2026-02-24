-- Get total number of blocks with optional epoch filter
-- Uses epoch filter (not slot) to match blocks.sql
SELECT count(*) as total
FROM block
WHERE (
   $1::word31type IS NULL
   OR block.epoch_no = $1
);
