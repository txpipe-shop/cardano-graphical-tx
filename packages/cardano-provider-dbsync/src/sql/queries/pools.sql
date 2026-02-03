WITH current_epoch AS (
  SELECT MAX(no) as no FROM epoch
),
latest_update AS (
  SELECT DISTINCT ON (hash_id) *
  FROM pool_update
  ORDER BY hash_id, id DESC
)
SELECT 
  ph.view AS pool_id,
  encode(ph.hash_raw, 'hex') AS hex,
  ocpd.ticker_name AS ticker,
  ocpd.json ->> 'name' AS name,
  ocpd.json ->> 'description' AS description,
  ocpd.json ->> 'homepage' AS homepage,
  NULL as logo,
  lu.pledge,
  lu.margin,
  lu.fixed_cost,
  -- For list view, we might skip heavy calculations or use a cached/materialized view if available.
  -- For now using 0 to avoid timeouts on large lists.
  0::bigint AS stake, 
  0::bigint AS delegators
FROM pool_hash ph
JOIN latest_update lu ON lu.hash_id = ph.id
LEFT JOIN off_chain_pool_data ocpd ON ocpd.pmr_id = lu.meta_id
WHERE 
  ($3::text IS NULL OR 
   ocpd.ticker_name ILIKE '%' || $3 || '%' OR 
   ocpd.json ->> 'name' ILIKE '%' || $3 || '%')
ORDER BY lu.id DESC
OFFSET $1 LIMIT $2;
