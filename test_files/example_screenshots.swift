// This file contains images for the extension description.
private let interpolation = ""
private let minSalary = 3800

// MARK: HTML - cursor HERE

// No changes to the normal strings.
let string = "<p>BODY</p>"

// Strings with # get HTML syntax highlighting.
let html = #"""
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE</title>
  </head>
  <body>
    BODY
    \#(interpolation)

    <!-- CSS and JavaScript are also highlighted. -->
    <style>
      body {
        color: white;
        background-color: lightblue;
      }
    </style>
    <script>
      document.getElementById("demo").innerHTML = "Hello JavaScript!";
    </script>
  </body>
  </html>
  """#

// MARK: SQL - cursor HERE

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
