SELECT count(*) as total
FROM block
WHERE (
   $1::word63type IS NULL
   OR block.slot_no = $1
);
