### **Connectors Knowledge Base**

### **A) Smartsheet Jira Connector**

#### **1\. Overview of the Jira Connector**

*   **Definition:** A premium integration that provides a secure, bidirectional synchronization between Smartsheet and Jira (Cloud or Data Center).
    
*   **Primary Value:** It allows development teams to work in Jira while automatically pushing status, priority, and timeline updates to Smartsheet for executive visibility and portfolio reporting.
    
*   **The Problem it Solves:** Eliminates the manual work of updating two systems. It ensures that "Project Plans" in Smartsheet reflect the "Real-time Progress" of issues and bugs in Jira.
    

#### **2\. Core Capabilities**

*   **Bidirectional Sync:** Changes made in a Jira issue (e.g., Status updated to "Done") reflect in Smartsheet, and changes in Smartsheet (e.g., a "Due Date" shift) can sync back to Jira.
    
*   **Issue Creation:** Users can create new Jira issues (Stories, Tasks, Bugs) directly from a row in Smartsheet.
    
*   **Field Mapping:** High flexibility to map standard Jira fields (Summary, Description, Status, Assignee) and Custom Fields to Smartsheet columns.
    
*   **Automated Workflows:** Workflows can be set to run automatically, ensuring data is always current without manual triggers.
    

#### **3\. Workflow Configuration**

_Setting up a Jira Connector workflow follows a structured path:_

**Connection Setup (Admin Level)**

*   **Requirement:** A Smartsheet System Admin and a Jira Admin must establish the initial connection.
    
*   **Best Practice:** Use a "Service Account" email (e.g., smartsheet-jira@company.com) to prevent the connection from breaking if an individual admin leaves the company.
    

**Defining Workflow Direction**

*   **Jira to Smartsheet:** Pulls data for reporting and dashboards.
    
*   **Smartsheet to Jira:** Pushes project schedules or new requirements into the dev backlog.
    
*   **Bidirectional:** Keeps both systems perfectly in sync (most common).
    

**Filtering & Mapping**

*   **Filtering:** You can set rules so only specific Jira projects or issue types (e.g., "Only High Priority Bugs") sync to the sheet.
    
*   **Mandatory Columns:** Every sync requires an **Issue Key** column and an **Error** column in Smartsheet to track the connection health.
    

#### **4\. Advanced Logic & Features**

**Shared Webhook Model**

*   **Capability:** Modern versions of the connector use a "Shared Webhook," allowing multiple workflows to run efficiently without hitting Jira’s webhook limits.
    

**Hierarchy Mapping**

*   **Capability:** While Jira uses Epics > Issues > Sub-tasks, Smartsheet uses indentation. The connector can be configured to maintain this parent-child relationship during the sync.
    

**Assignee Syncing**

*   **Logic:** The connector can map Jira "Assignees" to Smartsheet "Contact List" columns, enabling Smartsheet notifications and resource management based on dev activity.
    

#### **5\. Key Use Cases for the Bot to Suggest**

**Software Development Tracking**

*   **Scenario:** A PMO needs to see the status of 10 different dev teams.
    
*   **Logic:** Each team stays in Jira. The Jira Connector pulls all "Sprints" into one master "Product Roadmap" sheet in Smartsheet.
    

**Ticket Escalation**

*   **Scenario:** A client-facing team uses Smartsheet to track feedback.
    
*   **Logic:** When a client request is flagged as "Technical," a row in Smartsheet is checked. The Connector automatically creates a corresponding "Bug" ticket in the developers' Jira backlog.
    

**Executive Dashboards**

*   **Scenario:** Leadership wants a "Health Score" for all software products.
    
*   **Logic:** The Connector feeds Jira data into Smartsheet. Smartsheet then uses the **Pivot App** to summarize the data into a high-level Dashboard.
    

#### **6\. Technical Limitations & Governance**

*   **Permissions:** A user must be a "Jira Connector User" to create workflows. They also need "Editor" permissions on the Smartsheet and "Browse Projects" access in Jira.
    
*   **Column Formatting:** You cannot sync data into Smartsheet columns that have **Column Formulas** enabled.
    
*   **Assignee Mapping:** For Jira assignees to sync correctly, their email address in Jira must match their Smartsheet account email.
    
*   **Attachment Sync:** The Jira Connector moves data (text/dates/numbers), but it does **not** natively sync file attachments between systems.
    
*   **Hierarchy Limit:** Smartsheet mostly supports Jira hierarchy up to the "Epic" level; deeper nested sub-task logic may require custom mapping.


### **B) Smartsheet Salesforce Connector**

#### **1\. Overview of the Salesforce Connector**

*   **Definition:** A premium integration that enables a seamless, bidirectional data flow between Salesforce objects (like Opportunities, Accounts, or Cases) and Smartsheet.
    
*   **Primary Value:** It allows Sales teams to remain in their CRM (Salesforce) while Project and Operations teams manage the post-sale process in Smartsheet.
    
*   **The Problem it Solves:** Prevents the "silo" effect between Sales and Operations. It automates the handoff process and provides leadership with a real-time view of the sales-to-delivery lifecycle.
    

#### **2\. Core Capabilities**

*   **Object Mapping:** Connect Smartsheet rows to almost any Salesforce object, including Standard Objects (Opportunities, Leads, Tasks, Accounts) and Custom Objects.
    
*   **Bidirectional Sync:** Updates to a Salesforce Opportunity (e.g., "Stage" changed to "Closed Won") can trigger updates in Smartsheet. Conversely, project updates in Smartsheet (e.g., "Project Launch Date") can be pushed back into Salesforce.
    
*   **Automatic Row Creation:** New rows can be automatically added to Smartsheet as soon as a new record is created in Salesforce that meets specific criteria.
    
*   **Attachment & Comment Sync:** Unlike many other connectors, the Salesforce connector can be configured to sync Salesforce "Notes and Attachments" or "Chatter" feeds into Smartsheet.
    

#### **3\. Configuration & Workflow Logic**

_Setting up a Salesforce Connector workflow involves these key steps:_

**Authentication**

*   **Requirement:** Requires a Salesforce user with "API Enabled" permissions and a Smartsheet System Admin.
    
*   **Best Practice:** Use a "Dedicated Integration User" (Service Account) in Salesforce to avoid workflow failures if an employee's Salesforce password changes or they leave the organization.
    

**Workflow Filtering**

*   **Logic:** You can define specific triggers for the sync.
    
*   **Example:** "Only sync Salesforce Opportunities where the Stage is 'Closed Won' AND the Region is 'North America'."
    

**Field Mapping & Data Types**

*   **Data Integrity:** Ensure that Salesforce field types (e.g., Picklist, Date, Currency) match the Smartsheet column types (Dropdown, Date, Symbol) to prevent sync errors.
    
*   **Lookup Fields:** Salesforce "Lookup" fields (like Account Name on an Opportunity) can be pulled into Smartsheet to provide full context.
    

#### **4\. Advanced Features**

**Polling vs. Real-time**

*   **Function:** The connector "polls" Salesforce for changes. You can set the frequency of these checks or trigger an immediate sync manually.
    

**Primary Key (Salesforce ID)**

*   **Requirement:** Every Salesforce sync workflow requires the **Salesforce Record ID** to be mapped to a Smartsheet column. This acts as the "anchor" to ensure the correct rows are being updated.
    

**Error Reporting**

*   **Capability:** Like the Jira connector, it includes a mandatory "Error" column. If a sync fails (e.g., due to a validation rule in Salesforce), the specific reason will be written into that cell for the Admin to fix.
    

#### **5\. Key Use Cases for the Bot to Suggest**

**Sales-to-Operations Handoff**

*   **Scenario:** A Sales Rep closes a deal.
    
*   **Logic:** The moment the Opportunity hits "Closed Won," the Connector creates a new row in the "Project Launch" sheet, pulling in the Client Name, Deal Value, and Scope of Work.
    

**Executive Pipeline Dashboards**

*   **Scenario:** The VP of Ops needs to resource-plan for next month.
    
*   **Logic:** The Connector pulls all "Probability > 70%" Opportunities into a Smartsheet. The bot then uses this data to generate a "Forecasted Resource Demand" chart.
    

**Customer Support Escalation**

*   **Scenario:** A technician in Smartsheet identifies a bug that affects a specific customer account.
    
*   **Logic:** The technician checks a box in Smartsheet; the Connector creates a "Case" or "Task" in Salesforce for the Account Manager to see immediately.
    

#### **6\. Technical Limitations & Governance**

*   **API Limits:** Salesforce has daily API call limits. High-frequency syncs across thousands of rows can consume these limits; Admins should monitor "API Usage" in Salesforce.
    
*   **Validation Rules:** If Salesforce has a "Validation Rule" (e.g., "Reason for Loss is required if Stage is Closed Lost"), Smartsheet cannot push an update that violates that rule. The sync will fail and log an error.
    
*   **Formula Columns:** Data cannot be synced into Smartsheet columns that contain **Column Formulas**.
    
*   **Sandbox vs. Production:** It is highly recommended to test complex workflows in a Salesforce Sandbox before connecting to your live Production instance.

### **C. Smartsheet for Microsoft Teams**

*   **Overview:** A deep integration that allows teams to collaborate on Smartsheet items directly within the Teams interface.
    
*   **Core Capabilities:**
    
    *   **Tabs:** Pin a Smartsheet Sheet, Report, or Dashboard as a tab in a Teams channel for easy access.
        
    *   **Personal Bot:** Receive Smartsheet notifications (Reminders, @mentions, Update Requests) in a private Teams chat.
        
    *   **Messaging Extensions:** Search for and send a Smartsheet item as a "card" within a Teams conversation.
        
*   **Key Use Case:** A project team uses a Teams Channel for daily chat. They pin their **Project Dashboard** as a tab so everyone sees real-time status without leaving the app.
    
*   **Technical Governance:** Admins must enable the Smartsheet app within the Microsoft 365 Admin Center. Users must "Authenticate" their Smartsheet account within Teams.
    

### **D. Smartsheet for Slack**

*   **Overview:** An integration focused on real-time alerts and taking quick actions on Smartsheet rows from within Slack.
    
*   **Core Capabilities:**
    
    *   **Direct Notifications:** Get notified in a Slack channel when specific changes are made to a sheet.
        
    *   **Actionable Alerts:** Users can "Approve" or "Deny" requests directly from the Slack notification.
        
    *   **Slash Commands:** Use /smartsheet to search for sheets or find specific information.
        
*   **Key Use Case:** An IT team uses Slack for incident management. When a "High Priority" row is added to their Smartsheet Ticket Tracker, the Slack channel gets an immediate alert with a button to "Assign to Me."
    
*   **Technical Governance:** Requires the Smartsheet for Slack app to be installed in the Slack Workspace. Security admins can restrict which channels are allowed to receive Smartsheet data.
    

### **E. Smartsheet ServiceNow Connector**

*   **Overview:** A premium, bidirectional connector that syncs ServiceNow records (Incidents, Requests, Problems) with Smartsheet.
    
*   **Core Capabilities:**
    
    *   **Automatic Sync:** Pushes data from ServiceNow to Smartsheet for high-level project management and resource planning.
        
    *   **Bidirectional Flow:** Updates made in Smartsheet (e.g., changing a "Work Note" or "Status") can be pushed back to the live ServiceNow record.
        
    *   **Field Mapping:** Map complex ServiceNow fields, including Reference fields and State transitions.
        
*   **Key Use Case:** An IT PMO (Project Management Office) uses the connector to pull all "Digital Transformation" incidents into a master Smartsheet. This allows the PMO to track progress against project milestones without needing a ServiceNow license.
    
*   **Technical Governance:**
    
    *   Requires a ServiceNow Service Account with the rest\_service role.
        
    *   Must be an **Enterprise** or **Premier** Smartsheet plan.
        
    *   Admins should monitor ServiceNow "Business Rules" to ensure they don't block the connector's updates.

#### **F. Microsoft Dynamics 365 Connector**

*   **Overview:** A premium connector that enables bidirectional synchronization between Smartsheet and Microsoft Dynamics 365 (CRM/ERP).
    
*   **Core Capabilities:**
    
    *   **Entity Mapping:** Sync Smartsheet rows with Dynamics 365 Entities (e.g., Accounts, Opportunities, Leads, or Custom Entities).
        
    *   **Automated Data Flow:** Automatically trigger Smartsheet workflows based on changes in Dynamics (and vice versa).
        
    *   **Field Integrity:** Maps complex Dynamics data types to Smartsheet columns to maintain data consistency across Sales and Ops.
        
*   **Key Use Case:** A finance team uses Smartsheet to track project budgets. When a project is marked "Active" in Dynamics 365, the connector creates a tracking row in Smartsheet and pushes "Actual Spend" back to Dynamics for executive reporting.
    
*   **Technical Governance:** Requires a Dynamics 365 user with API access and a Smartsheet System Admin.
    

#### **G. Adobe Creative Cloud Extension**

*   **Overview:** An extension for Adobe Photoshop, Illustrator, and InDesign that allows creative teams to manage tasks without leaving their design environment.
    
*   **Core Capabilities:**
    
    *   **Contextual Tasks:** Designers can see their assigned tasks, descriptions, and due dates directly inside a panel in Adobe.
        
    *   **Proofing & Versioning:** Upload design files directly to a Smartsheet row as a "Proof." It supports version control, allowing users to see the evolution of a design.
        
    *   **Comment Syncing:** Comments made by stakeholders in Smartsheet appear in the Adobe panel for the designer.
        
*   **Key Use Case:** A marketing designer receives a task in Photoshop via the Smartsheet panel. They complete the graphic and upload it as a "Proof" directly from Photoshop. The Creative Director reviews it in Smartsheet, and their feedback appears back in Photoshop for the designer.
    

#### **H. Microsoft Outlook Add-in**

*   **Overview:** A sidebar integration for Outlook (Web and Desktop) that turns emails into actionable Smartsheet data.
    
*   **Core Capabilities:**
    
    *   **Create/Edit Rows:** Convert an email into a new row in a sheet or search for an existing row to update it.
        
    *   **Attachment Upload:** Save email attachments directly to a specific Smartsheet row.
        
    *   **Comment Integration:** Add the body of an email as a comment/discussion on a row to keep a paper trail.
        
*   **Key Use Case:** A Project Manager receives a "Change Request" via email. Using the Outlook Add-in, they search for the "Project Tasks" sheet, find the relevant task, and attach the email as a comment so the history is preserved in the sheet.
    

#### **I. Google Workspace Integrations**

*   **Overview:** A suite of integrations connecting Smartsheet with Google Drive, Gmail, and Google Calendar.
    
*   **Core Capabilities:**
    
    *   **Google Drive:** Attach files directly from Drive to Smartsheet rows. Smartsheet also supports "Sync to Google Sheets" for one-way data exports.
        
    *   **Gmail Add-on:** Similar to the Outlook Add-in; allows users to add emails as rows or comments to sheets from the Gmail sidebar.
        
    *   **Google Calendar:** Sync Smartsheet dates to a Google Calendar. Note: This is a "Publish" function (one-way visibility).
        
    *   **Google Forms (via Data Shuttle):** While not a direct connector, Data Shuttle is often used to pull Google Form responses (stored in Google Sheets) into a master Smartsheet.
        
*   **Key Use Case:** An HR team uses a Google Form for employee feedback. They use **Data Shuttle** to pull that data into Smartsheet for analysis, and then use the **Gmail Add-on** to reply to employees directly from the sheet's comment section.
    

#### **J. Messaging App Integrations (Google Chat / Hangouts)**

*   **Overview:** Provides automated alerts and notifications within the Google Chat ecosystem.
    
*   **Core Capabilities:**
    
    *   **Hangouts Chat Bot:** Receive Smartsheet notifications (Reminders, @mentions, Requests) in Google Chat.
        
    *   **Actionable Notifications:** Much like the Slack/Teams integration, users can receive alerts in a room or direct message when sheet data changes.
        
*   **Technical Governance:** Admins must allow the Smartsheet app in the Google Workspace Admin Console.