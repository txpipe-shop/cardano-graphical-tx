WITH latest_update AS (
  SELECT DISTINCT ON (hash_id) *
  FROM pool_update
  ORDER BY hash_id, id DESC
)
SELECT 
  COUNT(*) as total_pools,
  '0' as total_stake, -- placeholder
  '0' as total_delegators -- placeholder
FROM pool_hash ph
JOIN latest_update lu ON lu.hash_id = ph.id
LEFT JOIN off_chain_pool_data ocpd ON ocpd.pmr_id = lu.meta_id
WHERE 
  ($1::text IS NULL OR 
   ocpd.ticker_name ILIKE '%' || $1 || '%' OR 
   ocpd.json ->> 'name' ILIKE '%' || $1 || '%');
