import { format } from './sqlFormatter.js';

// const sql = `
// SELECT users.id, users.name, ro.last_order, ss
// FROM users
// JOIN high_spenders hs ON users.id = hs.user_id
// WHERE users.status = 'active' AND users.role = 'premium'
//       `;

// const sql = `
// WITH recent_orders AS (
//   SELECT   user_id,
//   MAX(order_date) AS last_order
//   FROM   orders
//   WHERE   status = 'completed'
//   GROUP BY   user_id
// ),
// high_spenders AS (
//   SELECT   user_id
//   FROM   orders
//   WHERE   total > 1000
// )
// SELECT users.id, users.name, ro.last_order
// FROM users
// JOIN recent_orders ro ON users.id = ro.user_id
// JOIN high_spenders hs ON users.id = hs.user_id
// WHERE users.status = 'active' AND users.role = 'premium'
//       `;

const sql = `
with
  cte (id, name) AS (
    select
      *
    from
      users
  )
select
  supplier_name,
  city
from
  (
    select
      *
    from
      suppliers
      join addresses on suppliers.address_id = addresses.id
  ) as suppliers
where
  supplier_id > 500
order by
  supplier_name asc,
  city desc
`;

const d = format(sql, {
  language: 'postgresql',
  keywordCase: 'upper',
});

console.log(d);
