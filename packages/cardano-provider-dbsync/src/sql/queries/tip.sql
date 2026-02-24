-- Get the current tip (latest block information)
SELECT
  encode(hash, 'hex') AS hash,
  slot_no AS slot
FROM block
ORDER BY id DESC LIMIT 1;
