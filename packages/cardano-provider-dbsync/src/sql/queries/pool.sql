WITH current_epoch AS (
  SELECT MAX(no) as no FROM epoch
),
latest_update AS (
  SELECT DISTINCT ON (hash_id) *
  FROM pool_update
  ORDER BY hash_id, id DESC
),
pool_data AS (
  SELECT 
    ph.id AS pool_hash_id,
    ph.view AS pool_id,
    encode(ph.hash_raw, 'hex') AS hex,
    ocpd.ticker_name AS ticker,
    ocpd.json ->> 'name' AS name,
    ocpd.json ->> 'description' AS description,
    ocpd.json ->> 'homepage' AS homepage,
    NULL as logo, -- db-sync doesn't store logos
    lu.pledge,
    lu.margin,
    lu.fixed_cost,
    (SELECT COALESCE(SUM(amount), 0) FROM epoch_stake es WHERE es.pool_id = ph.id AND es.epoch_no = (SELECT no FROM current_epoch)) AS stake,
    0 AS delegators -- Placeholder, expensive to count live delegators
  FROM pool_hash ph
  JOIN latest_update lu ON lu.hash_id = ph.id
  LEFT JOIN off_chain_pool_data ocpd ON ocpd.pmr_id = lu.meta_id
  WHERE 
    ph.view = $1 OR encode(ph.hash_raw, 'hex') = $1
)
SELECT * FROM pool_data;
