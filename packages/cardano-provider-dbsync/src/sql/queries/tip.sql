-- Get the current tip (latest block information)
SELECT
  encode(hash, 'hex') AS hash,
  slot_no AS slot,
FROM blocks
ORDER BY id DESC LIMIT 1;
