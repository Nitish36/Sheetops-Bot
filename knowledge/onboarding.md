# **Sheetops-Bot Feature & Capability Knowledge Base**

### **1\. Core AI Interaction Tools**

_General AI-driven features for data analysis and document processing._

**Chat AI (Sheet Insights)**

*   **Capability:** Performs regular audits of specific sheets.
    
*   **Process:** The user provides a Sheet ID; the AI scans the entire content and generates actionable insights.
    
*   **Output:** Insights can be exported by the user as a PDF document.
    

**Formula Builder & Troubleshooter**

*   **Capability:** Identifies and fixes formula errors.
    
*   **Process:** Users share a non-working formula or a logic goal. The AI analyzes the syntax and explains the specific reasoning behind the error or the logic used to fix it.
    

**PDF Summarizer**

*   **Capability:** Condenses large documents.
    
*   **Process:** The bot processes high-volume PDF files and extracts the most relevant information into a concise summary for the user.
    

### **2\. Administrative & Cost-Optimization Audits**

_Features designed for Smartsheet Admins to reduce organizational spending and manage licenses._

**User Audit (License Management)**

*   **Capability:** Analyzes user activity via the Smartsheet Admin Center.
    
*   **Logic:** Tracks the "Last Login" time and "Premium App" usage.
    
*   **Action:** Suggests degrading licenses for inactive users or removing access to premium apps that are no longer needed to reduce organizational costs.
    

**Seat Audit (Inactivity Tracking)**

*   **Capability:** Manages license seat allocation.
    
*   **Logic:** Identifies users who have been inactive for more than 60 days.
    
*   **Action:** Recommends downgrading "Licensed" or "Provisional" seats to "Guest" or "Viewer" status to optimize seat count and spending.
    

### **3\. Workspace & Asset Hygiene**

_Automated cleanup and naming convention standards for Smartsheet assets._

**Sheet / Report / Dashboard Hygiene**

*   **Capability:** Monitors the health and relevance of workspace assets.
    
*   **Logic:** Tracks the "Last Edit Time" for every sheet, report, and dashboard.
    
*   **Action 1 (Cleanup):** If an asset has not been used for a long period, the bot suggests deletion.
    
*   **Action 2 (Naming):** If an asset name is ambiguous or doesn't follow standards, the AI suggests a simpler, clearer naming convention.
    

### **4\. Security and Technical Governance**

_Monitoring technical configurations and security risks._

**Webhook Audit**

*   **Capability:** Provides transparency into automated data flows.
    
*   **Details:** Tracks the scope of the webhook (what it points to), the creation date, and the last modification date to ensure integrations are current.
    

**Published Items Audit**

*   **Capability:** Monitors publicly accessible content.
    
*   **Security Check:** Analyzes the "Last Modified" date and checks if the URL is secure.
    
*   **Action:** Suggests whether a published item should remain active or be retracted based on access levels and necessity.
    

**Attachment Audit**

*   **Capability:** Monitors storage limits.
    
*   **Logic:** Analyzes the size of all attachments added to sheets.
    
*   **Action:** Flags instances where attachment sizes are exceeding the user’s specific plan limits to prevent overages.
    

#### **5\. WorkApps Insights**

_Analysis of custom Smartsheet WorkApps._

**WorkApps Audit**

*   **Capability:** Evaluates the reach and ownership of WorkApps.
    
*   **Collaboration Analysis:** Identifies if the app is used primarily by internal team members or external collaborators.
    
*   **Usage Analysis:** Tracks "Last Accessed" dates to determine the popularity/adoption of the app.
    
*   **Governance:** Identifies the owner and monitors login activity to ensure the app is still providing value.