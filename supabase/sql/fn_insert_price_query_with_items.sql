-- SQL: create RPC to insert a price query and its items atomically
-- Run this on your Supabase / Postgres database (SQL editor)

create or replace function public.insert_price_query_with_items(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_company text,
  p_message text,
  p_items json
) returns uuid as $$
declare
  v_new_id uuid;
  item json;
begin
  -- Insert header and capture id
  -- If your price_queries table has a non-null `product_id` column (legacy single-product),
  -- populate it from the first item in the provided JSON array. Adjust cast if your product_id is not UUID.
  insert into public.price_queries (customer_name, customer_email, customer_phone, customer_company, message, status, created_at, product_id)
  values (
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_customer_company,
    p_message,
    'pending',
    now(),
    -- extract product_id from first element of p_items array; if not present this will be NULL
    nullif((p_items->0->>'product_id')::text, '')::uuid
  )
  returning id into v_new_id;

  -- Insert each item (expecting p_items to be a JSON array of objects with product_id, name, quantity)
  for item in select * from json_array_elements(p_items)
  loop
    insert into public.quote_items (query_id, product_id, quantity, name)
    values (
      v_new_id,
      (item->>'product_id')::uuid,
      (item->>'quantity')::int,
      item->>'name'
    );
  end loop;

  return v_new_id;
end;
$$ language plpgsql security definer;

-- NOTES:
-- 1) Ensure the table/column names match your DB schema.
-- 2) If `product_id` is not UUID, remove the ::uuid cast.
-- 3) You may need to set function owner's rights or policies to allow calls from the client.
