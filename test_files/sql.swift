let sql = ##"select first_name from employees"##

let sql1 = ##"""
  SELECT first_name
  ,      last_name
  ,      salary
  FROM employees
  WHERE salary > \##(minSalary)
    AND salary > \#(notInterpolation)
  ORDER BY salary DESC, last_name ASC;
  """##

let sql2 = ##"""
  SELECT object_id
  ,      COUNT(*) OVER (ORDER BY object_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS [preceding]
  ,      COUNT(*) OVER (ORDER BY object_id ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING) AS [central]
  ,      COUNT(*) OVER (ORDER BY object_id ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS [following]
  FROM sys.objects
  ORDER BY object_id ASC;
  """##

// Slightly modified query from:
// github.com/pointfreeco/sharing-grdb/Examples/Reminders/RemindersListDetail.swift#L139
func fetch(_ db: Database) throws {
  try Record
    .fetchAll(
      db,
      sql: ##"""
        SELECT [reminder].*
        ,      group_concat([tag].[name], ',') as commaSeparatedTags
        ,      NOT isCompleted AND coalesce([reminder].[date], date('now')) < date('now') as isPastDue
        FROM      [reminder]
        LEFT JOIN [reminderTag] ON [reminderTag].[reminderId] = [reminder].[id]
        LEFT JOIN [tag]         ON [tag].[id] = [reminderTag].[tagId]
        WHERE [reminder].[listId] = ?
          AND \(showCompleted ? "1=1" : "NOT isCompleted")
        GROUP BY [reminder].[id]
        ORDER BY [reminder].[isCompleted] ASC,
                \(ordering.queryString)
        """##,
      arguments: [listID]
    )
}

// Slightly modified query from:
// github.com/pointfreeco/sharing-grdb/Examples/Reminders/SearchReminders.swift#L116
func fetch2(_ db: Database) throws {
  let reminders = try LocalRequest.fetchAll(
    db,
    SQLRequest(
      literal: ##"""
        SELECT [reminder].*
        ,      [reminderList].[id] AS reminderListID
        ,      group_concat([tag].[name], ',') AS commaSeparatedTags
        ,      NOT isCompleted AND coalesce([reminder].[date], date('now')) < date('now') AS isPastDue
        FROM      [reminder]
        LEFT JOIN [reminderList] ON [reminderList].[id] = [reminder].[listId]
        LEFT JOIN [reminderTag]  ON [reminderTag].[reminderId] = [reminder].[id]
        LEFT JOIN [tag]          ON [tag].[id] = [reminderTag].[tagId]
        WHERE (
            [reminder].[title] COLLATE NOCASE LIKE \("%\(searchText)%")
            OR
            [reminder].[notes] COLLATE NOCASE LIKE \("%\(searchText)%")
          )
          AND \(sql: showCompletedInSearchResults ? "1=1" : "NOT reminders.isCompleted")
        GROUP BY [reminder].[id]
        ORDER BY [reminder].[isCompleted]
        ,        [reminder].[date]
        """##)
  )
}

// MARK: Data

private let listID = 1
private let minSalary = 3800

struct Database {}
struct SQLRequest { init(literal: String) {} }
struct Record { static func fetchAll(_ db: Database, sql: String, arguments: [Int]) throws {} }
struct LocalRequest { static func fetchAll(_ db: Database, _ request: SQLRequest) throws {} }
