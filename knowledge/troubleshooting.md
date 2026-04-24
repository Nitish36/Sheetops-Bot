### **Troubleshooting & Health Check**

#### **1\. General Troubleshooting (Apply First)**

_If a sync or integration is failing, the AI should advise the Admin to check these three pillars:_

*   **The Error Column:** Every Premium Connector (Jira, Salesforce, Dynamics, ServiceNow) requires a dedicated "Error" column in Smartsheet.
    
    *   _Action:_ Check the specific cell in the row that failed. It will contain the exact API error message from the external system.
        
*   **Authentication & Service Accounts:** Integrations often break when the person who set them up leaves the company or changes their password.
    
    *   _Action:_ Verify if the "Integration User" or "Service Account" is still active and has a valid token.
        
*   **Permissions:**
    
    *   _Action:_ Ensure the user has "Admin" permissions on the Smartsheet and at least "Read/Write" or "API Enabled" permissions in the external system.
        

#### **2\. Specific Connector Troubleshooting**

**Jira Connector Issues**

*   **Symptom:** "Data is not syncing back to Jira."
    
    *   _Cause:_ You are likely trying to sync into a "Read-Only" Jira field (like _Created Date_) or a field that is not on the Jira "Edit Screen."
        
*   **Symptom:** "New rows aren't being created."
    
    *   _Cause:_ Check if there are "Required Fields" in Jira that aren't mapped in Smartsheet. Jira will block row creation if mandatory data is missing.
        
*   **Symptom:** "Hierarchy (Epics/Tasks) is messed up."
    
    *   _Cause:_ Ensure the "Indent" logic is enabled in the Connector settings.
        

**Salesforce Connector Issues**

*   **Symptom:** "Sync is successful but data looks wrong."
    
    *   _Cause:_ **Validation Rules.** Salesforce might have a rule that prevents a stage from being changed unless a certain field is filled. Smartsheet cannot bypass these rules.
        
*   **Symptom:** "Connector says 'API Limit Reached'."
    
    *   _Cause:_ Your Salesforce instance has reached its daily limit of API calls.
        
    *   _Fix:_ Reduce the "Polling Frequency" in the Connector settings.
        

**ServiceNow Connector Issues**

*   **Symptom:** "Updates are delayed."
    
    *   _Cause:_ ServiceNow often uses a "Polling" method rather than "Real-time."
        
    *   _Fix:_ Check the "Sync Interval" in the Smartsheet ServiceNow Governance panel.
        

#### **3\. Productivity Add-in Troubleshooting (Outlook/Teams/Gmail)**

**Microsoft Outlook / Gmail Sidebar Not Loading**

*   **Fix 1:** Clear the browser cache or the Outlook Desktop App cache.
    
*   **Fix 2:** Ensure the "Third-Party Cookies" are allowed in the browser settings, as the sidebar is technically an "iframe."
    
*   **Fix 3:** Re-authenticate. Sign out of the Smartsheet add-in and sign back in.
    

**Microsoft Teams Tab Not Updating**

*   **Fix:** Ensure the user viewing the tab has at least "Viewer" permissions on the underlying Smartsheet. If they don't have Smartsheet access, they will see a "Request Access" screen even if they are in the Teams Channel.
    

#### **4\. The "Column Formula" Conflict (Most Common)**

*   **Critical Rule:** **Connectors cannot write data into a column that has a 'Column Formula' enabled.**
    
*   **Symptom:** The sync fails or the cell remains empty despite a successful connection.
    
*   **Remediation:** Change the column back to a regular cell or use a separate "Landing Column" for the sync and then use a formula in a _different_ column to process that data.
    

#### **5\. Technical "Health Check" Checklist for the Bot**

_If a user asks "Is my integration healthy?", the bot should ask:_

1.  Are you using a **Service Account** instead of a personal email? (Best Practice)
    
2.  Do you have an **Error Column** visible on your sheet?
    
3.  Is your **Unique ID** (Salesforce ID, Jira Key) locked to prevent accidental deletion?
    
4.  If using Data Shuttle, is the **Source File** named exactly the same every time?