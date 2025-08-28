// This file is used to create images for the extension description.
// Cursor HERE <---------
let interpolation = ""



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
