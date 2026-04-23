# Smartsheet Formula & Function Knowledge Base

## Category 1: Hierarchy Functions

These functions are unique to Smartsheet and allow you to perform calculations

based on the row indentation levels (Parent/Child relationships).

### 1) **ANCESTORS Function**

\- Syntax: ANCESTORS(\[Column Name\]Row)

\- Description: Returns a reference to all parent rows of the specified cell.

\- Use Case: Often used with COUNT(ANCESTORS()) to determine how deep a row is

in a hierarchy (e.g., Row Level 1, 2, or 3).

### 2) **CHILDREN Function**

\- Syntax: CHILDREN(\[Column Name\]Row)

\- Description: References all direct child rows underneath a parent row.

\- Use Case: Ideal for summing up all sub-tasks into a parent task:

\=SUM(CHILDREN()).

### 3) **PARENT Function**

\- Syntax: PARENT(\[Column Name\]Row)

\- Description: Returns the value or reference of the immediate parent of the

specified row.

\- Use Case: Useful for pulling a project phase name down into all individual

task rows for reporting.

## Category 2: Logical Functions

Used to automate decision-making and handle data validation.

### 1) **IF Function**

\- Syntax: IF(logical\_test, value\_if\_true, \[value\_if\_false\])

\- Description: Evaluates a condition. If the condition is met, it returns the

first value; otherwise, it returns the second.

\- Use Case: =IF(Status@row = "Complete", 1, 0) to check a box when a status is

marked finished.

### 2) **IFERROR Function**

\- Syntax: IFERROR(formula, value\_if\_error)

\- Description: Catches errors (like #DIV/0) and replaces them with a custom

value or a blank space.

\- Use Case: =IFERROR(Actual/Budget, 0) to prevent errors if the budget is

zero.

### 3) **AND / OR Functions**

\- Syntax: AND(condition1, condition2, ...) or OR(condition1, condition2, ...)

\- Description: Used to check multiple conditions at once. AND requires all to

be true; OR requires only one to be true.

\- Use Case: =IF(AND(Status@row = "In Progress", Due@row < TODAY()), "Overdue",

"On Track").

### 4) **ISBLANK Function**

\- Syntax: ISBLANK(\[Column Name\]@row)

\- Description: Returns true if a cell is empty.

\- Use Case: Used to prevent formulas from running on empty rows.

## Category 3: Date and Time Functions

Essential for project scheduling and tracking timelines.

### 1) **TODAY Function**

\- Syntax: TODAY()

\- Description: Returns the current date. Note: The date updates whenever the

sheet is opened and saved.

\- Use Case: =TODAY() - \[Date Column\]@row to find the number of days since an

event.

### 2) **NETWORKDAYS Function**

\- Syntax: NETWORKDAYS(start\_date, end\_date, \[holidays\])

\- Description: Calculates the number of working days between two dates,

excluding weekends and optional holidays.

\- Use Case: Calculating the actual working duration of a project task.

### 3) **WORKDAY Function**

\- Syntax: WORKDAY(start\_date, days, \[holidays\])

\- Description: Returns a date that is a specific number of working days in the

future or past.

\- Use Case: Calculating a deadline based on a 5-day turnaround time.

### 4) **DATE Function**

\- Syntax: DATE(year, month, day)

\- Description: Creates a valid date value from three separate numbers.

## Category 4: Numeric and Statistical Functions

Used for calculations across ranges or specific columns.

### 1) **SUMIF / SUMIFS Functions**

\- Syntax: SUMIFS(sum\_range, criterion\_range1, criterion1, ...)

\- Description: Adds up values in a range that meet one or more specific

criteria.

\- Use Case: =SUMIFS(Amount:Amount, Department:Department, "Sales").

### 2) **COUNTIFS Function**

\- Syntax: COUNTIFS(range1, criterion1, range2, criterion2, ...)

\- Description: Counts the number of rows that meet multiple criteria.

\- Use Case: Counting how many tasks are "High Priority" AND "Not Started."

### 3) **COUNTM Function**

\- Syntax: COUNTM(\[Column Name\]@row)

\- Description: (Smartsheet Specific) Counts the number of items selected in a

multi-select dropdown or multi-contact cell.

\- Use Case: If a cell contains 3 people, COUNTM returns 3.

### 4) **AVG Function**

\- Syntax: AVG(number1, number2, ...)

\- Description: Returns the average of the selected range.

## Category 5: Text and String Functions

Used to clean, combine, or extract information from text.

### 1) **JOIN Function**

\- Syntax: JOIN(range, \[delimiter\])

\- Description: Combines multiple cells into one string, separated by a

character like a comma or dash.

\- Use Case: =JOIN(CHILDREN(TaskName@row), ", ") to list all sub-tasks in one

cell.

### 2) **CONTAINS Function**

\- Syntax: CONTAINS(search\_text, range)

\- Description: Checks if a piece of text exists within a cell or range.

\- Use Case: Often used inside an IF statement: =IF(CONTAINS("Urgent",

Subject@row), "Red", "Green").

### 3) **LEFT / RIGHT / MID Functions**

\- Syntax: LEFT(text, number\_of\_chars)

\- Description: Extracts a specific number of characters from the start, end,

or middle of a text string.

### 4) **HAS Function**

\- Syntax: HAS(range, search\_value)

\- Description: (Smartsheet Specific) Searches for an exact match in a

multi-select dropdown or contact cell. Unlike CONTAINS, HAS looks for the

specific item, not just part of the text.

## Category 6: Lookup and Reference Functions

Used to pull data from other parts of the sheet or external sheets.

### 1) **VLOOKUP Function**

\- Syntax: VLOOKUP(search\_value, lookup\_table, column\_num, \[match\_type\])

\- Description: Searches for a value in the first column of a range and returns

a value in the same row from a specified column.

### 2) **INDEX / MATCH Functions**

\- Syntax: INDEX(range, MATCH(search\_value, search\_range, 0))

\- Description: A more flexible alternative to VLOOKUP. MATCH finds the row

number, and INDEX pulls the value from that row.

\- Use Case: This is the preferred method for Cross-Sheet references in

Smartsheet.

### 3) **COLLECT Function**

\- Syntax: COLLECT(range, criteria\_range1, criteria1, ...)

\- Description: Returns a list of values that meet specific criteria. It is

almost always used inside another function like JOIN, AVG, or MAX.

\- Use Case: =JOIN(COLLECT(Email:Email, Status:Status, "Late"), "; ") to get a

list of emails for everyone with a late status.

## Important Smartsheet Concepts for the Bot:

1\. The @row Reference: Instead of using \[Status\]5 (which refers to row 5),

always encourage using \[Status\]@row. This makes the formula more efficient

and allows it to be converted into a "Column Formula."

2\. The @cell Reference: Used inside functions like COUNTIFS or COLLECT to apply

logic to every individual cell in a range. Example: COUNTIF(Range:Range,

@cell > 10).

3\. Cross-Sheet References: These are indicated by curly braces { }. Your bot

should recognize that {Project Tracker Range 1} refers to data in a

different Smartsheet.