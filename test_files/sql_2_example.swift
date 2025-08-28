// This file is used to create images for the extension description.
// Cursor HERE <---------
let minSalary = 3800



// No changes to the normal strings.
let sql0 = "select first_name from employees"
let sql1 = """
  SELECT first_name
  FROM employees
  WHERE salary > 3800;
  """

// Strings with ## get SQL syntax highlighting.
let sql2 = ##"select first_name from employees"##

let sql3 = ##"""
  -- You no longer have to paste SQL into a separate editor just for reading.
  SELECT first_name
  ,      last_name
  ,      salary
  FROM employees
  WHERE last_name = "Kowalski"
    AND salary > \##(minSalary)
  ORDER BY salary DESC, last_name ASC;
  """##
