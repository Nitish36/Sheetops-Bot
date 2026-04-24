# Advanced Smartsheet Learning

## A)  Dynamic View

### 1\. Overview of Dynamic View

\- Definition: Dynamic View is a premium Smartsheet application that allows

owners to share specific information with collaborators while keeping the

underlying source sheet or report private.

\- Primary Value: It solves the "all or nothing" sharing problem. You can allow

a user to see and edit only their own rows without giving them access to the

entire project plan or HR database.

\- Security Benefit: Unlike a shared sheet where a user can see all columns and

rows, Dynamic View allows for granular control down to the individual field

level.

### 2\. Core Configuration Components

Building a Dynamic View involves four main stages of setup:

**Source Selection**

\- Description: Every Dynamic View must be built upon a source (either a single

Sheet or a Report).

\- Logic: If you use a Report as a source, the Dynamic View can aggregate data

from multiple sheets into one secure view.

View Customization (The "List View")

\- Description: Defines which columns a user sees when they first open the

view.

\- Current User Filter: One of the most powerful features. You can set the view

to only show rows where the user’s email matches a specific "Contact" column

(e.g., "Assigned To").

### Details View (The "Edit Pane")

\- Description: When a user clicks on a row, a side panel opens. You can

configure which fields appear here.

\- Field Logic: You can set fields to be "Required," "Read-Only," or "Hidden"

based on the status of the row.

\- Logic Example: If "Status" is "Complete," then the "Due Date" field becomes

Read-Only to prevent accidental changes.

### Sharing and Permissions

\- Description: Controls who has access to the view.

\- Identity-Based: Users must log in with their Smartsheet credentials to see

their specific data.

\- No Sheet Access Required: Users do not need to be shared to the underlying

source sheet to use the Dynamic View.

### 3\. Advanced Logic & Features

Conditional Field Logic

\- Capability: Allows the view to change dynamically based on data.

\- Process: You can create rules so that certain fields only appear when a

specific dropdown value is selected.

\- Use Case: If a user selects "Rejected" in a status column, a mandatory

"Reason for Rejection" text field appears.

### New Submission Logic

\- Capability: You can enable a "New Entry" button within the Dynamic View.

\- Function: This allows users to add new rows to the source sheet directly

through the Dynamic View interface without seeing other entries.

Automated Locking

\- Capability: You can lock a row within the view based on a date or status.

\- Function: Once a task is 2 days past its "Completion Date," the Dynamic View

can automatically make that row "Read-Only" for the collaborator.

### 4\. Key Use Cases for the Bot to Suggest

Human Resources (HR)

\- Scenario: Managing employee performance reviews.

\- Logic: Employees can see and edit their own self-appraisal row, while

managers see the appraisal plus a "Manager Comments" field that is hidden

from the employee.

### Vendor/Contractor Management

\- Scenario: Multiple vendors bidding on a project.

\- Logic: All vendors submit their bids to the same sheet, but via Dynamic

View, Vendor A can never see Vendor B’s pricing or entries.

Executive Reporting

\- Scenario: High-level project updates.

\- Logic: Executives see a simplified "Read-Only" view of the project status

and budget without being overwhelmed by the 500+ rows of the technical

project plan.

### 5\. Technical Limitations (For Troubleshooting)

\- License Requirement: Dynamic View is a premium add-on. Users must have it

enabled in their Smartsheet plan to create views.

\- Formatting: Conditional formatting from the source sheet does not

automatically carry over to the Dynamic View; it must be re-configured in

the view settings.

\- Attachments: To allow users to upload attachments in Dynamic View, it must

be explicitly enabled in the "Details View" configuration.


##  B)  DataTable

### **1\. Overview of DataTable**

*   **Definition:** DataTable is a high-volume data storage capability that allows you to store millions of rows of data (up to 2 million per DataTable) and use it to drive your Smartsheet workflows.
    
*   **Primary Value:** It acts as a middle-layer "data warehouse" between external systems (like ERPs, CRMs, or databases) and your Smartsheet sheets.
    
*   **The Problem it Solves:** Standard Smartsheet sheets have a 20,000-row limit. DataTable allows you to store much larger datasets and only "push" the relevant filtered data into specific sheets.
    

### **2\. Key Capabilities and Scale**

*   **Massive Capacity:** Each DataTable can hold up to 2 million rows and 200 columns.
    
*   **Centralized Hub:** Instead of having multiple sheets for different regions or departments, you can store all global data in one DataTable and distribute it.
    
*   **External Integration:** It is designed to work seamlessly with Smartsheet Data Shuttle to upload data from CSV, Excel, or Google Sheets automatically.
    

### **3\. The DataTable Workflow**

_Building and using a DataTable follows a specific sequence:_

**Data Ingestion (Data Shuttle)**

*   **Description:** Use Smartsheet Data Shuttle to bring data into the DataTable.
    
*   **Automation:** This can be scheduled to update daily, hourly, or whenever a new source file is detected in OneDrive, Google Drive, or Box.
    

**Field Mapping**

*   **Description:** Defining the "schema" or column types (Text, Number, Date, etc.) within the DataTable.
    
*   **Unique Identifiers:** You must designate a "Unique ID" (like a Part Number or Employee ID) to ensure data is updated correctly rather than creating duplicates.
    

**Connecting to Sheets**

*   **Description:** The process of "mapping" data from the DataTable into a standard Smartsheet.
    
*   **Filtering Logic:** You don't have to send all 2 million rows to a sheet. You can create a connection that says "Only send rows where Region = 'North' and Status = 'Active'."
    

### **4\. Advanced Logic: The Connection Manager**

_The Connection Manager is where the "intelligence" of DataTable lives:_

**Bidirectional Synchronization**

*   **Capability:** You can choose to have a one-way sync (DataTable to Sheet) or a two-way sync.
    
*   **Use Case:** If a user updates a price in a sheet, that change can be synced back to the master DataTable and then updated across all other connected sheets.
    

**Lookup vs. Sync**

*   **Lookup:** Use DataTable as a reference (like a VLOOKUP) to fill in missing information in a sheet based on a Unique ID.
    
*   **Sync:** Automatically add new rows to a sheet when they appear in the DataTable.
    

**Conflict Resolution**

*   **Function:** If data is changed in both the sheet and the DataTable simultaneously, you can set rules on which source "wins" (e.g., "DataTable always overrides Sheet").
    

### **5\. Key Use Cases for the Bot to Suggest**

**Master Data Management (MDM)**

*   **Scenario:** A company has 50,000 products.
    
*   **Logic:** Store the entire product catalog in a DataTable. When a salesperson enters a "Product SKU" into their project sheet, the DataTable automatically pulls in the "Price," "Description," and "Warehouse Location."
    

**Financial Reporting**

*   **Scenario:** Consolidating monthly transactions from an ERP.
    
*   **Logic:** The ERP exports 500,000 transactions to a CSV. Data Shuttle moves it to DataTable. The Bot then helps create "Summary Sheets" for each department head by filtering the DataTable by "Department ID."
    

**Historical Archiving**

*   **Scenario:** Keeping track of years of completed project tasks.
    
*   **Logic:** Move completed tasks out of active sheets (to keep them fast) and into a DataTable for long-term storage and year-over-year trend analysis.
    

### **6\. Technical Limitations & Governance**

*   **Permissions:** You must be a Licensed User and have "DataTable Owner" or "DataTable Admin" permissions to create and manage DataTables.
    
*   **Sheet Limits:** While DataTable holds 2 million rows, the _destination_ sheet still has a 20,000-row limit. This is why filtering in the Connection Manager is essential.
    
*   **Formula Support:** You cannot write formulas _inside_ a DataTable. All logic must be handled either in the source file before upload or in the destination sheet after the sync.


## C) Data Shuttle

### **1\. Overview of Data Shuttle**

*   **Definition:** Data Shuttle is a premium Smartsheet application that allows you to automatically import or export data between Smartsheet and external systems or file storage locations.
    
*   **Primary Value:** It eliminates manual data entry and "copy-pasting" by creating a "bridge" between Smartsheet and your other business tools.
    
*   **The Problem it Solves:** It automates the movement of data from sources like ERPs (SAP, Oracle), CRMs (Salesforce), or simple cloud folders (Google Drive, OneDrive) directly into Smartsheet.
    

### **2\. The Two Primary Workflows**

**Upload Workflows (Input)**

*   **Description:** Bringing data **into** Smartsheet from an external source.
    
*   **Supported Sources:** OneDrive, Google Drive, Box, SharePoint, SFTP, or your local computer.
    
*   **File Types:** CSV, XLSX, or Google Sheets.
    

**Offload Workflows (Output)**

*   **Description:** Moving data **out** of Smartsheet (or a Report) into a file.
    
*   **Function:** Automatically creates a CSV or Excel file and saves it to a cloud storage location (like OneDrive or Google Drive).
    
*   **Use Case:** Sending Smartsheet data to a PowerBI or Tableau instance for external visualization.
    

### **3\. Key Configuration Steps**

_Data Shuttle requires specific logic to ensure data integrity:_

**Source Selection & Filtering**

*   **Capability:** You can set filters so only a subset of the source file is imported.
    
*   **Logic:** "Only import rows where 'Project Status' is 'Active'."
    

**Field Mapping**

*   **Description:** Matching columns from the source file to the columns in the destination Smartsheet.
    
*   **Flexibility:** You don't need to match every column; you can pick and choose which data points are relevant.
    

**Unique Identifier (The "Key")**

*   **Importance:** This is the most critical part of an Upload workflow.
    
*   **Logic:** By selecting a Unique ID (like an Employee Email or Part Number), Data Shuttle knows whether to **update** an existing row or **add** a new one.
    

**Scheduling**

*   **Capability:** Workflows can be set to run:
    
    *   **On a schedule:** Every hour, day, or week.
        
    *   **On a trigger:** Whenever a new file is dropped into a specific folder (e.g., "The moment the 'Weekly\_Report.csv' is updated, run the shuttle").
        

### **4\. Advanced Logic Features**

**Handle Deleted Rows**

*   **Function:** You can configure Data Shuttle to delete rows in Smartsheet if they are no longer present in the source file.
    
*   **Warning:** This is powerful but must be used carefully to avoid accidental data loss.
    

**Replace All Data**

*   **Function:** Instead of updating specific rows, you can choose to "wipe" the sheet and replace everything with the new data from the source file.
    

**Data Transformation**

*   **Function:** While Smartsheet formulas are great, Data Shuttle can perform basic transformations (like converting formats or skipping rows) during the import process itself.
    

### **5\. Key Use Cases for the Bot to Suggest**

**Automated Financial Updates**

*   **Scenario:** The Finance team exports a CSV of expenses from their accounting software every night.
    
*   **Logic:** Data Shuttle detects the new file in OneDrive at 2:00 AM and updates the "Project Budget" sheet in Smartsheet so the team sees accurate totals every morning.
    

**External Partner Collaboration**

*   **Scenario:** A vendor refuses to use Smartsheet and only works in Excel.
    
*   **Logic:** The vendor uploads their Excel file to a shared Google Drive folder. Data Shuttle automatically pulls that data into the master project plan.
    

**Reporting to Executive Dashboards**

*   **Scenario:** An executive needs a daily snapshot of all "Late" tasks across 50 different sheets.
    
*   **Logic:** An Offload workflow takes a "Master Late Tasks Report" and saves it as a CSV every day to a folder that feeds a Corporate Dashboard.
    

### **6\. Technical Limitations & Governance**

*   **Permissions:** You must have "Licensed User" status and "Data Shuttle" access granted by your SysAdmin.
    
*   **Row Limits:** If uploading to a Sheet, you are still bound by the 20,000-row sheet limit. If the source file is larger, you should use **DataTable** as the destination instead.
    
*   **Attachment Limit:** Data Shuttle does not move attachments; it only moves text and numeric data from cells.


## D) DataMesh

### 1\. Overview of DataMesh

**Definition**: DataMesh is a premium application that provides a automated "Lookup" functionality between sheets and reports.\[1\]\[2\]\[3\]

**Primary Value**: It acts like a high-powered, automated version of VLOOKUP or INDEX/MATCH. It maps data from a "Source" to a "Target" based on a unique identifier.\[3\]

The Problem it Solves: It prevents "Cell Link" exhaustion and sheet slowness. Standard formulas and cell links can reach Smartsheet limits quickly; DataMesh can push data into thousands of cells without the overhead of live formulas.

### 2\. Core Configuration Components

To set up a DataMesh "Config" (workflow), you need four elements:

**The Source**

**Definition**: The "Master" sheet or report containing the correct data (e.g., an Employee Directory or Price List).

**Requirement**: You need at least Viewer permissions on the source sheet or Admin on a source report.\[1\]\[3\]\[4\]\[5\]

**The Target**

**Definition**: The destination sheet where you want the data to be populated (e.g., a Project Plan or Expense Report).\[3\]

**Requirement**: You must have Admin permissions on the target sheet.\[1\]\[3\]\[4\]\[5\] (Note: Reports cannot be targets).

**Lookup Values**

**Definition: The "Matching Key" present in both sheets (e.g., Part Number, Email, or Project ID).**

**Logic**: DataMesh looks for this ID in both places; when it finds a match, it pulls the associated data from the source to the target.

**Data Mapping**

**Definition**: Selecting which specific columns from the Source should be copied into which columns in the Target.

**Limit**: You can map up to 190 columns in a single DataMesh workflow.

### 3\. Data Mapping Formats (The "How")

DataMesh offers three distinct ways to move data:

**Copy Data**: A one-time or scheduled "hard-copy" of the value. It does not create a link, meaning it doesn't impact your sheet's cell link limits.

**Create Cell Links**: Creates a live "blue arrow" cell link. This is the only method that supports moving Images and Hyperlinks.\[6\]

**Copy and Add Data**: If a Lookup Value exists in the Source but not in the Target, DataMesh will actually create a new row in the Target sheet. This is a major advantage over standard formulas.

### 4\. Advanced Logic & Options

**Overwrite Existing Data**

**Option**: You can choose to only fill in "Blank" cells in the target or "Overwrite" existing data to ensure the target sheet always matches the master source.

**Duplicate Handling**

**Pick 1st Match**: If the source has the same ID twice, it takes the first one it finds.

**Ignore Entries**: If it finds a duplicate in the source, it does nothing (useful for ensuring 100% data accuracy).

**Execution Frequency**

**Update Immediately**: Changes in the source trigger an update in the target within minutes.

Scheduled: Runs on a set hourly, daily, or weekly heartbeat.

### 5\. Key Use Cases for the Bot to Suggest

**Automated Project Setup**

**Scenario**: A Project Manager enters a "Client ID" into a new project sheet.

**Logic**: DataMesh sees the ID, looks it up in the "Master Client Sheet," and instantly fills in the "Client Name," "Contract Value," and "Account Manager."

**Global Directory Sync**

**Scenario**: Managing 100 different project sheets that all need the latest "Department Head" names.

**Logic**: When a Department Head changes in the Master HR sheet, DataMesh pushes that update to all 100 project sheets automatically.

**Inventory & SKU Management**

**Scenario**: A warehouse sheet needs current pricing.

**Logic**: DataMesh maps the "SKU" from the "Master Price List" to the "Warehouse Sheet," ensuring the warehouse team always sees the most recent cost.

### 6\. Technical Limitations & Governance

**Formula Conflict**: DataMesh cannot map data into a column that already contains a Column Formula in the target sheet.

**Dependencies**: You cannot map data into columns used for "Dependencies" (like Start/End dates or Precedents) if they are enabled in the target sheet settings.

**One-Way Sync**: DataMesh is primarily a one-way tool (Source to Target). While you can set up a reciprocal sync, it requires two separate configs and can lead to logic loops if not handled carefully.

## E) Bridge

### **1\. Overview of Bridge**

*   **Definition:** Bridge is a no-code/low-code workflow automation platform that connects Smartsheet to your other business systems (like Salesforce, Jira, ServiceNow, or custom APIs).
    
*   **Primary Value:** It handles complex, multi-step business processes that go beyond the capabilities of standard sheet automation.
    
*   **The Problem it Solves:** It eliminates the need for manual data movement between apps and allows for advanced logic—like checking multiple conditions across different sheets before taking an action.
    

### **2\. Core Components of a Workflow**

_Every Bridge workflow is built using these fundamental building blocks:_

**Triggers**

*   **Definition:** The "Go-Signal" that starts the workflow.
    
*   **Types:**
    
    *   **Integration Trigger:** Starts when something happens in Smartsheet (e.g., a row is changed) or another app.
        
    *   **Schedule Trigger:** Runs at a specific time (e.g., "Every Monday at 8 AM").
        
    *   **Webhook:** Starts when an external system sends a signal to a specific URL.
        

**Modules**

*   **Definition:** The specific actions the workflow takes.
    
*   **Utilities:** Internal tools to manipulate data (e.g., math calculations, text joining, or date formatting).
    
*   **Integrations:** Actions in external apps (e.g., "Create a ServiceNow ticket" or "Post a message to Slack").
    

**Junctions (Logic Gates)**

*   **Definition:** Used for branching logic.
    
*   **Function:** Allows the workflow to follow different paths based on data. If "Status" is "Approved," go left; if "Status" is "Rejected," go right.
    

**States & Data References**

*   **Definition:** Bridge "remembers" data from previous steps.
    
*   **Function:** You can reference a value found in Step 1 and use it to fill a field in Step 10.
    

### **3\. Advanced Capabilities**

**Child Workflows**

*   **Capability:** You can break a massive, complex process into smaller "Child" workflows.
    
*   **Function:** This makes the logic easier to manage and allows you to "loop" actions (e.g., "For every row in this report, run this Child workflow").
    

**Custom API Calls (HTTP Call)**

*   **Capability:** If Bridge doesn't have a pre-built integration for a specific app, you can use the "HTTP Call" module.
    
*   **Power:** This allows the bot to talk to almost any modern software that has an API (Application Programming Interface).
    

**JavaScript Modules**

*   **Capability:** For extreme customization, you can write small snippets of JavaScript code directly inside a Bridge module to perform complex data transformations.

### F) Pivot App

### **1\. Overview of the Pivot App**

*   **Definition:** The Pivot App is a premium add-on that allows you to summarize and analyze large volumes of data stored in Smartsheet sheets or reports.
    
*   **Primary Value:** It takes "flat" data (rows and rows of transactions) and turns it into a summarized "Cross-Tab" format (e.g., total sales by region per month).
    
*   **The Problem it Solves:** While you can use SUMIFS or COUNTIFS formulas in a sheet, they become slow and difficult to manage as data grows. The Pivot App automates this process and stores the results in a separate sheet, keeping your dashboards fast and clean.
    

### **2\. Core Configuration (The Pivot Wizard)**

_Setting up a "Pivot Config" involves a 4-step wizard:_

**Step 1: Source Data**

*   **Definition:** You select the sheet or report that contains the raw data you want to summarize.
    
*   **Best Practice:** Using a **Report** as a source allows you to pivot data from multiple sheets simultaneously.
    

**Step 2: Pivot Setup (Rows, Columns, and Values)**

*   **Rows:** Select the field to group vertically (e.g., "Assigned To" or "Project Name").
    
*   **Columns:** Select the field to group horizontally (e.g., "Status" or "Quarter").
    
*   **Values:** Select the data you want to calculate (e.g., "Budget") and the math operation (Sum, Count, Average, Min, Max).
    

**Step 3: Destination Sheet**

*   **Definition:** The Pivot App does not display the data inside the app; it **creates/updates a new sheet** in your Smartsheet account.
    
*   **Advantage:** Because the result is a standard sheet, you can easily use it as a source for Charts and Metric widgets on a Dashboard.
    

**Step 4: Execution Schedule**

*   **Capability:** You can set the pivot to run:
    
    *   **On a schedule:** Every hour, day, or week.
        
    *   **On demand:** Manually clicking "Run" to see the latest data.
        

### **3\. Advanced Features & Logic**

**Automatic Column Detection**

*   **Function:** If new values appear in your source data (e.g., a new "Department" is added), the Pivot App can automatically detect it and add a new column to your destination sheet.
    

**Multi-Level Pivoting**

*   **Capability:** You can have multiple row labels (e.g., Group by "Region" AND then by "Sales Rep") to create nested summary data.
    

**Grand Totals**

*   **Function:** You can toggle "Grand Totals" for both rows and columns to get the "Bottom Line" numbers automatically calculated at the edge of your pivot sheet.
    

### **4\. Key Use Cases for the Bot to Suggest**

**Project Portfolio Summaries**

*   **Scenario:** You have 100 project sheets.
    
*   **Logic:** A Report gathers all 100 sheets. The **Pivot App** then summarizes them to show "Total Number of Tasks" and "Total Budget Spent" per "Project Manager."
    

**Financial Month-End Reporting**

*   **Scenario:** A sheet tracks every individual expense for the year.
    
*   **Logic:** The Pivot App summarizes these thousands of rows into a simple table showing "Expense Category" vs. "Month," allowing Finance to see spending trends instantly.
    

**Resource Capacity Planning**

*   **Scenario:** You need to know if your team is overbooked.
    
*   **Logic:** Pivot the "Task Duration" against "Employee Name" and "Due Date" to see exactly how many hours each person is assigned per week.
    

### **5\. Technical Limitations & Governance**

*   **Frequency:** The most frequent automatic update is once per hour. It does not provide "live" second-by-second updates.
    
*   **Sheet Limits:** The destination sheet is still subject to Smartsheet’s 20,000-row and 400-column limits. If your pivot is larger than this, it will fail.
    
*   **Permissions:** You must have **Owner** or **Admin** permissions on both the source and the destination sheets to create a Pivot Config.
    
*   **Formatting:** The Pivot App focuses on data. Any "Cell Background Colors" or "Font Styles" in the source will not carry over; you must apply formatting to the destination sheet itself.

### G) WorkApps

### **1\. Overview of WorkApps**

*   **Definition:** WorkApps is a no-code platform for building intuitive web and mobile apps to streamline your business processes.
    
*   **Primary Value:** It creates a "single point of entry" for users. Instead of sending someone five different links to sheets and reports, you give them one WorkApp link that contains everything they need in a clean, side-nav interface.
    
*   **The Problem it Solves:** It eliminates "Workspace clutter" and protects data by using **Roles**. Different users can look at the same app but see entirely different pages based on their job function.
    

### **2\. Core Components of a WorkApp**

**The App Builder**

*   **Definition:** The interface used to drag and drop assets into your app. No coding is required.
    
*   **Pages:** You can add Sheets, Reports, Dashboards, Smartsheet Forms, and even external web content (like a Google Map or a Tableau dashboard) as "pages" in your app.
    

**Roles (The Power Tool)**

*   **Definition:** Roles define what a user can see and do within the app.
    
*   **Function:** You can create a "Manager" role that can edit all sheets, and a "Field Worker" role that can only see a specific report and a "Submit Request" form.
    
*   **Granular Permissions:** You can set a sheet to be "Edit," "Read-Only," or "Hidden" specifically for a role, regardless of the user's permissions on the underlying sheet.
    

**Branding**

*   **Capability:** You can customize the app with your company’s logo, specific colors, and a custom "App Icon."
    
*   **Impact:** This makes the solution feel like a custom-built internal corporate tool rather than just a spreadsheet.
    

### **3\. Advanced Capabilities**

**Mobile Optimization**

*   **Feature:** WorkApps are automatically optimized for the Smartsheet mobile app.
    
*   **Benefit:** Field workers can easily navigate the side menu with their thumb and interact with data in a mobile-friendly view.
    

**External Collaboration**

*   **Capability:** Depending on your Smartsheet plan (Advance or Executive), you can share WorkApps with "External Collaborators" (people outside your company) without them needing a paid Smartsheet license.
    

**WorkApps Home**

*   **Function:** A centralized dashboard for users to see all the apps they have been invited to, keeping their most important work front-and-center.
    

### **4\. Key Use Cases for the Bot to Suggest**

**Project Management Office (PMO) Portal**

*   **Scenario:** A company has hundreds of active projects.
    
*   **Logic:** A WorkApp serves as the "HQ." The **Team Member** role sees their personal task list. The **Executive** role sees a high-level Portfolio Dashboard. The **Project Manager** role sees the full project schedules and budget sheets.
    

**Field Inspections / Service Requests**

*   **Scenario:** Technicians in the field need to log data.
    
*   **Logic:** The WorkApp contains a "New Inspection" Form and a "My Recent Submits" Report. It’s simple, easy to use on a phone, and keeps them away from the complex "back-end" sheets.
    

**Employee Onboarding**

*   **Scenario:** New hires need a checklist and resources.
    
*   **Logic:** The WorkApp includes an "Intro Video" (web content), a "Welcome Dashboard," a "Benefits PDF" (attachment), and an "Onboarding Checklist" (sheet).
    

### **5\. Technical Limitations & Governance**

*   **Underlying Permissions:** To _build_ a WorkApp, you must have "Owner" or "Admin" permissions on the sheets you are adding.
    
*   **Automation:** WorkApps do not have their own automation engine; they rely on the automated workflows set up in the underlying sheets.
    
*   **Proofing:** Currently, Smartsheet "Proofing" (commenting on images/PDFs) has limited functionality inside the WorkApp interface compared to the standard sheet view.
    
*   **Search:** The search function inside a WorkApp only searches the titles of the pages, not the data _within_ the sheets (users must go into the specific sheet to search the data).
    

### **6\. Implementation Tip for the Bot (Audit Logic)**

_Your bot previously mentioned a_ _**WorkApp Audit**_ _feature. Here is the logic it should use:_

*   **Popularity Tracking:** The bot should look at "Last Accessed" dates to tell Admins if an app is being ignored.
    
*   **Collaboration Split:** The bot can analyze if an app is shared mostly with Internal or External domains to ensure security compliance.
    
*   **Ownership Check:** If the "App Owner" leaves the company, the bot should flag the app for a "Transfer of Ownership" to prevent the app from becoming orphaned.