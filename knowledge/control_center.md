### **Control Center Knowledge Base (SCC)**

#### **1\. Core Concept: The Blueprint**

*   **Definition:** A Blueprint is the framework for a repeatable process. It defines how new projects are created and how data flows between them.
    
*   **Source Templates:** A folder containing the "Master" versions of your sheets, reports, and dashboards.
    
*   **Intake Sheet:** The "Master List" where new project requests are submitted.
    
*   **Blueprint Summary Sheet:** A "Master Tracker" that automatically aggregates high-level data (e.g., Status, Budget, % Complete) from every project provisioned by that blueprint.
    

#### **2\. Global Updates (Portfolio-Wide Changes)**

_Global Updates allow an Admin to make a change in one place and push it out to every active project in the portfolio._

*   **Add New Column:**
    
    *   Allows you to insert a new column into all existing project sheets.
        
    *   _Logic:_ You can define the column name, type, and even a **Column Formula** that will be applied to all current and future projects.
        
*   **Modify Existing Column:**
    
    *   Used to update dropdown list values (e.g., adding a new "Department" or "Status") or change column properties across the portfolio.
        
*   **Add Profile Data:**
    
    *   Profile Data is the "Metadata" of a project (e.g., Project Manager, Region, Project ID).
        
    *   _Logic:_ This update adds new summary-level data points to the "Project Profile" section of every sheet, which can then be pulled into the Summary Sheet.
        
*   **Find/Replace:**
    
    *   A powerful tool to search for specific text or formula strings across all project sheets and replace them with new values. Essential for fixing broken formulas or updating company-wide terminology.
        
*   **Update Reports:**
    
    *   Adds new columns to existing reports or changes the filter criteria for every project-level report in the portfolio.
        
*   **Update Dashboards:**
    
    *   Allows you to add, move, or modify widgets on all project dashboards. You can push a new "Chart" widget or update the "Instructional Text" on 500 dashboards at once.
        

#### **3\. Automation in Control Center**

_Control Center automates the lifecycle of a project to reduce manual overhead._

*   **Automated Provisioning:**
    
    *   When a row in the Intake Sheet is marked as "Approved," Control Center automatically creates the folder, copies the templates, sets permissions, and links the data—zero manual work required.
        
*   **Dynamic Lead/Lag & Scheduling:**
    
    *   SCC can automatically adjust project dates during provisioning based on the "Start Date" provided in the intake form.
        
*   **Approval Workflows:**
    
    *   Integrates with Smartsheet’s standard automation to trigger provisioning only after a multi-stage approval (e.g., Finance approves, then the PMO Lead).
        

#### **4\. Archiving Projects**

_Managing the end of the project lifecycle to keep the portfolio clean and performant._

*   **The Process:** When a project is marked "Complete," the Archiving tool moves the project assets to a dedicated "Archive Workspace."
    
*   **Data Preservation:**
    
    *   Archived projects are typically removed from the **Active Summary Sheet** to keep it lean but are added to an **Archive Summary Sheet** for historical year-over-year reporting.
        
*   **Resource Cleanup:** Archiving a project stops the data flow to Resource Management, freeing up the team's capacity for new assignments.
    
*   **Access Control:** Often, permissions are changed during archiving to "Read-Only" for everyone except the PMO Admins to prevent accidental changes to historical data.
    

#### **5\. Profile Data & Project Linking**

*   **Project Profile:** This is the "ID Card" of the project. It usually lives at the top of the sheet or in the Sheet Summary.
    
*   **Cell Linking:** SCC automates the complex cell-linking between the Intake Sheet, the Project Profile, and the Blueprint Summary Sheet.
    
*   **Multi-Tier Blueprints:** For advanced users, SCC supports "Sub-Blueprints" where one master project can trigger the creation of several sub-projects.
    

#### **6\. Troubleshooting Control Center**

*   **Symptom:** "Provisioning Failed."
    
    *   **Check:** Ensure the user who submitted the request is not a "Contact" that doesn't exist in the system, or check if the "Template Folder" has been moved/renamed.
        
*   **Symptom:** "Global Update timed out."
    
    *   **Check:** If you are updating more than 100 projects at once, try running the update in smaller batches. Ensure no sheets are "Locked" by another user.
        
*   **Symptom:** "Summary Sheet is not updating."
    
    *   **Check:** Verify that the "Profile Data" in the project sheet matches the column name in the Summary Sheet exactly.