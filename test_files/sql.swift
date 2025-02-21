let sql = ###"select first_name from employees"###

let sql1 = ###"""
  SELECT first_name
  ,      last_name
  ,      salary
  FROM employees
  WHERE salary > 3800
  ORDER BY salary DESC, last_name ASC;
  """###

let sql2 = ###"""
  SELECT object_id
  ,      COUNT(*) OVER (ORDER BY object_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS [preceding]
  ,      COUNT(*) OVER (ORDER BY object_id ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING) AS [central]
  ,      COUNT(*) OVER (ORDER BY object_id ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS [following]
  FROM sys.objects
  ORDER BY object_id ASC;
  """###
