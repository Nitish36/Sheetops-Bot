### **Resource Management Knowledge Base**

#### **1\. Core Overview & Philosophy**

*   **Definition:** Resource Management by Smartsheet is a high-level planning tool used to visualize the team's capacity, track time, and forecast project budgets across an entire organization.
    
*   **Primary Value:** It answers the question: "Who is working on what, and do we have the capacity to take on new projects?"
    
*   **The Difference:** While a Smartsheet Project Plan manages **tasks**, Resource Management manages **people and time**.
    

#### **2\. Setting Up the Foundation (Getting Started)**

*   **People Management:**
    
    *   **Users:** Licensed team members who can be assigned work.
        
    *   **Placeholders:** Non-human roles (e.g., "Senior Designer" or "Contractor") used for high-level planning before a specific person is assigned.
        
    *   **Attributes:** Tag people by Role, Discipline, Location, and Skills to make finding the right resource easier.
        
*   **The Schedule:**
    
    *   **Team View:** A heatmap showing everyone's availability. Red indicates over-allocation; white indicates availability.
        
    *   **Project View:** A gantt-style view showing all projects and their timelines.
        
*   **Permissions:**
    
    *   **Portfolio Viewers:** Can see everything but edit nothing.
        
    *   **Project Editors:** Can manage specific projects they own.
        
    *   **Resourcing Admins:** Can manage people, schedules, and account settings.
        

#### **3\. Smartsheet + Resource Management Integration**

_Connecting your project sheets to the Resource Management panel is the most critical workflow._

*   **The RM Panel:** An interface inside a standard Smartsheet that allows you to sync task data directly to the RM platform.
    
*   **Mapping Columns:**
    
    *   **Assigned To:** Must be a Contact List column.
        
    *   **Dates:** Start and End Date columns.
        
    *   **Allocation %:** Determines how much of a person's day is dedicated to a task (e.g., 50% for 4 hours of an 8-hour day).
        
*   **Project Linking:**
    
    *   You must "link" a Smartsheet to a specific Project in Resource Management.
        
    *   Once linked, moving a task in Smartsheet automatically updates that person's heat map in Resource Management.
        

#### **4\. Time Tracking & Actuals**

_Tracking the difference between what was planned and what actually happened._

*   **Timesheets:**
    
    *   Team members log hours against specific projects and phases.
        
    *   **Suggested Hours:** RM can pre-fill timesheets based on the planned schedule to save time for the user.
        
*   **Approval Workflows:**
    
    *   Managers can review, approve, or reject timesheets at the end of the week.
        
    *   **Status Tracking:** Track who has submitted their time and who is late.
        
*   **Time Categories:** Categorize time as "Billable," "Non-Billable," or "Internal" to calculate project profitability.
    

#### **5\. Analytics & Reporting**

_Using data to make strategic business decisions._

*   **Utilization Reports:**
    
    *   Calculates the percentage of time a person spends on billable work vs. total capacity.
        
    *   **Target Utilization:** Set goals (e.g., 80%) to identify if the team is underperforming or burning out.
        
*   **Budget Tracking:**
    
    *   **Fees:** Track project revenue against labor costs.
        
    *   **Expenses:** Track non-labor costs (travel, materials) within the project.
        
    *   **Burn Rates:** Visualize how quickly a project's budget is being consumed over time.
        
*   **Forecasting:**
    
    *   Predict future resource needs based on the "Pipeline" of upcoming projects.
        
    *   Identify "hiring gaps" where placeholders are consistently over-allocated.
        

#### **6\. Advanced Governance & Best Practices**

*   **The "Work Policy":** Define standard work weeks (e.g., 40 hours) and holidays at the account level so capacity is calculated accurately.
    
*   **Part-Time Resources:** Adjust individual availability for part-time employees or contractors.
    
*   **Phases and Categories:** Break large projects into phases (e.g., Discovery, Design, Build) to track budgets at a granular level.
    
*   **Data Integrity:** Ensure that the "Email Address" in Smartsheet matches the "Email Address" in Resource Management exactly, or the integration will fail to recognize the person.
    

#### **7\. Troubleshooting Resource Management**

*   **Symptom:** "People aren't showing up in the RM Panel inside my sheet."
    
    *   **Check:** Ensure the "Assigned To" column is a **Contact List** type and the users are added to the RM People database.
        
*   **Symptom:** "Changes in my sheet aren't updating the RM Schedule."
    
    *   **Check:** Verify that the RM Panel is "enabled" for that specific sheet and that the "Allocation %" column is mapped correctly.
        
*   **Symptom:** "Project Budget looks wrong."
    
    *   **Check:** Ensure "Billable Rates" are correctly set in the People profile or the specific Project settings.