# SMARTSHEET CORPORATE GOVERNANCE & BEST PRACTICES (Huron-Tailored)
**Version:** v3.0 (SheetOps Chatbot Knowledge Base)  
**Audience:** Smartsheet Admins, Workspace Owners, Solution Architects  
**Applies to:** Sheets, Reports, Dashboards, WorkApps, Published Items, Webhooks, Attachments, User/Seat Governance  
**AI Policy:** SheetOps is **READ-ONLY**. It recommends actions; humans execute changes in Smartsheet UI or approved workflows.

---

## 0) Governance Goals (Why this exists)
**Purpose:** Keep Smartsheet assets secure, standardized, audit-ready, and scalable for enterprise use.  
**Outcomes we want:**
- Clean and consistent naming across departments
- Reliable reporting (Looker-ready data types + consistent status values)
- Least-privilege access (reduce Owners/Admins, control external users)
- Reduced sprawl (archive zombie/abandoned assets)
- Stable automation (documented, monitored, with fallback alerts)
- Cost optimization (seat + premium app utilization visibility)

---

## 1) Naming Conventions (Mandatory)
[TAG:NAMING][SEVERITY:HIGH]

### 1.1 Standard Naming Format
Use:
`[DEPT] - Program/Project Name - [Asset Type] - [Region/Client (optional)] - [Version (optional)]`

**Examples**
- `[IT] - Server Migration - Project Tracker`
- `[HC] - HCM Implementation - RAID Log`
- `[FIN] - Budget FY26 - Forecast Tracker`
- `[Digital] - PMO Intake - Request Tracker`
- `[Corporate] - Policy Updates - Governance Sheet`

### 1.2 Approved Department Prefixes (Aligned to your CC structure)
Use these when possible (keep consistent across assets):
- `Digital`
- `Education`
- `Healthcare` (or `HC`)
- `Human Resources` (or `HR`)
- `Business Advisory Consulting` (or `BAC`)
- `Corporate Finance Consulting` (or `CFC`)
- `Corporate`
- `Global Enablement`
- `Information Technology` (or `IT`)
- `Innosight`
- `Legal`
- `Marketing`
- `Operations`

> **Chatbot guidance:** If a sheet name doesn’t start with an approved prefix, recommend renaming.

### 1.3 Prohibited / Poor Naming Patterns
Avoid:
- `Untitled`, `Copy of…`, `New Sheet`, `Test`, `My Dashboard`, `Final_Final`
- Blank/unclear asset type (Tracker, Log, Dashboard, Report, Intake, Register)

### 1.4 Versioning + Archive Naming
- Controlled version updates: `… - v1`, `… - v2`, or `… - 2026-04`
- Archive format: `ARCHIVE - [DEPT] - … - [YYYY-MM]`

---

## 2) Mandatory Asset Ownership & Review Metadata
[TAG:GOVERNANCE][SEVERITY:HIGH]

### 2.1 Required Fields (for key operational assets)
Every “business-critical” sheet/report/dashboard must have:
- **Primary Owner** (Contact)
- **Backup Owner** (Contact)
- **Business Sponsor** (Text/Contact)
- **Last Reviewed Date** (Date)
- **Data Sensitivity** (Dropdown: Public/Internal/Confidential)

> **Chatbot remediation plan:** If missing, recommend adding these fields or adding them in a top section/summary fields.

### 2.2 Owner/Admin Sprawl Control
- Prefer **1–2 Owners** per critical asset
- Keep Admins minimal (structure managers only)
- Avoid making “everyone” an Admin to solve access issues (use WorkApps, Reports, Dynamic View instead)

---

## 3) Column Architecture (Looker-Ready + Automation-Ready)
[TAG:COLUMNS][SEVERITY:HIGH]

### 3.1 Must-Use Column Types (Strongly Recommended)
- **Owners / Assignees** → `Contact List`  
  *Reason:* Enables notifications, controlled identity, consistent assignments.
- **Status** → `Dropdown (Single Select)`  
  *Reason:* Standard values for reporting and automation.
- **Start/End/Due Dates** → `Date` type  
  *Reason:* Enables alerts, overdue logic, and date filters.
- **Priority / Risk Level** → `Dropdown`
- **Unique ID** (Task ID, Risk ID, Request ID) → `Text/Number` with format rules

### 3.2 Standard Status Values (Recommended Baseline)
Use a consistent set across org unless your official list differs:
- `Not Started`
- `In Progress`
- `Blocked`
- `On Hold`
- `Complete`

> **Note:** If your org has an official status taxonomy, align to that list.  
> **Chatbot behavior:** If it sees multiple spellings (“In progress”, “In-Progress”, “Done”), it should recommend normalization.

### 3.3 Formula Standards (Performance + Correctness)
[TAG:FORMULAS][SEVERITY:MEDIUM]
- Row formulas must use `@row` references:
  - Example: `=[Status]@row`
- Use `IFERROR()` where appropriate to reduce noisy errors:
  - Example: `=IFERROR([Actual]@row / [Target]@row, "")`
- Prefer helper columns instead of extremely nested formulas.
- Document cross-sheet dependencies if used heavily.

### 3.4 Cross-Sheet Reference Governance
[TAG:FORMULAS][SEVERITY:MEDIUM]
- Use named references `{Reference Name}` with meaningful names
- Document reference dependencies:
  - “This sheet depends on: {Resource Master}, {Budget Master}”
- Limit excessive cross-sheet references to avoid performance degradation.

---

## 4) Security & Sharing (Enterprise Controls)
[TAG:SECURITY][SEVERITY:CRITICAL]

### 4.1 Sharing Rules (Mandatory)
- Never use **“Anyone with a link”** for operational or internal governance sheets.
- Share with specific users or groups only.
- Use least privilege:
  - Viewer → default for most users
  - Editor (Cannot Share) → controlled contributors
  - Admin/Owner → only for structural managers

### 4.2 External Collaborators
- Default external access:
  - **Viewer** or **Editor – Cannot Share**
- Any elevated access must be approved and documented.
- External users must not be given Owner/Admin unless there is explicit governance approval.

### 4.3 WorkApps as Secure UI Layer
Use WorkApps to:
- Provide filtered access without giving full sheet control
- Reduce accidental sharing
- Deliver a governed experience for broad audiences

> **Chatbot remediation plan:** If it detects too many Editors/Admins, recommend WorkApps or Reports to reduce access.

---

## 5) Published Items Governance (High Risk Area)
[TAG:PUBLISH][SEVERITY:CRITICAL]

### 5.1 Publishing Rules
- “Public/Anyone” access is a **security exception** and must be reviewed.
- Publishing with **Edit** access is **extreme risk** and should be removed unless explicitly approved.

### 5.2 Review & Cleanup SLA (Recommended)
- Monthly review of published links:
  - Confirm still required
  - Restrict access
  - Unpublish stale items (e.g., not modified in 120+ days)

> **Chatbot output requirement:** Always classify publish links as `Critical / High / Medium / Low` based on access and recency.

---

## 6) Automation & Workflow Standards
[TAG:AUTOMATION][SEVERITY:HIGH]

### 6.1 Trigger Best Practices
- Prefer **change-based** triggers over time-based triggers to reduce processing load.
- Use time-based triggers only when business requires it (SLA reminders, due-date nudges).

### 6.2 Workflow Resilience (Mandatory for Critical Workflows)
Every critical workflow must have:
- Primary action (Update/Assign/Move Row/Request Update)
- Fallback **“Alert Someone”** step (so failures don’t go silent)
- Named workflow owner and last validation date

### 6.3 Automation Documentation (Recommended)
Maintain a simple “Workflow Registry” on key sheets:
- Workflow Name
- Purpose
- Owner
- Last Validated
- Dependencies (if any)

---

## 7) Workspace Governance & Asset Lifecycle (Sprawl Control)
[TAG:WORKSPACES][SEVERITY:HIGH]

### 7.1 Workspace Standards
- Prefer departmental workspaces over personal workspaces
- Avoid vague workspace names:
  - “My Workspace”, “Stuff”, “New Workspace”

### 7.2 Lifecycle Rules (Recommended)
- **Zombie assets:** createdAt ≈ modifiedAt and older than 90 days → review/cleanup
- **Abandoned assets:** not modified in 180 days → owner review, archive if unused
- Use standard archiving:
  - Move to Archive workspace
  - Rename with `ARCHIVE - ...`
  - Reduce sharing to Owners only

---

## 8) Reports & Dashboards Governance (Executive Ready)
[TAG:DASHBOARDS][SEVERITY:MEDIUM]

### 8.1 Reports
- Reports must have:
  - Clear naming with prefix + purpose
  - Owner and backup owner
  - Reviewed permissions (avoid unnecessary Owner/Admin access)

### 8.2 Dashboards
Dashboards should:
- Show a small set of KPIs (avoid clutter)
- Use consistent metric definitions
- Be reviewed if not modified in 180 days (dead dashboard risk)

> **Chatbot remediation plan:** For dead dashboards, recommend “review → update → decommission”.

---

## 9) Webhooks & Integrations (Security + Health)
[TAG:WEBHOOKS][SEVERITY:HIGH]

### 9.1 Security Standards
- Only allow **HTTPS** callback URLs
- Flag unknown domains or suspicious endpoints
- Disable/remove broken or unused webhooks

### 9.2 Health Monitoring Rules
Review:
- enabled vs disabled
- status + disabledDetails
- lastSuccessfulCallback vs lastAttempt
- any webhook failing for 30+ days

> **Chatbot priority:** Broken + non-HTTPS = critical. Broken + old = high.

---

## 10) Attachments Governance (Storage + Risk)
[TAG:ATTACHMENTS][SEVERITY:MEDIUM]

### 10.1 Storage Standards
- Flag attachments >10MB (10240KB) for external storage (OneDrive/SharePoint).
- Identify stale attachments older than 1 year on inactive sheets.

### 10.2 Security Standards
- Flag risky file types (examples):
  - `.exe`, `.msi`, suspicious `.zip`
- Ensure sensitive assets are not shared widely.

---

## 11) Seat & User Governance (Cost + Control)
[TAG:SEATS][SEVERITY:HIGH]

### 11.1 License Optimization Rules
- **Ghost licenses:** member seats with 0 edits and 0 created assets (90 days) → downgrade review
- **Viewer-only behavior:** high views, no edits → consider Free Viewer or role adjustment
- **True-up risks:** qualified for true-up but no meaningful activity (180 days) → investigate

### 11.2 Connector Admin Rights
- Connector Admin access (Jira/Salesforce/etc.) must be limited to required admins
- Connector Admin + no recent login = security risk

---

## 12) Document Intelligence (PDF/DOCX/PPTX/Excel)
[TAG:DOCS][SEVERITY:LOW]

### 12.1 Output Expectations for Summaries
When summarizing documents, the assistant should provide:
- Executive Summary (3 sentences)
- Key Takeaways (top 5)
- Admin Actions (clear steps)
- Glossary / jargon cleanup (simple wording)

---

## 13) SheetOps AI Assistant Operating Rules (Mandatory)
[TAG:AI_POLICY][SEVERITY:CRITICAL]

1. **READ-ONLY only**: The assistant never writes to Smartsheet.
2. **Human-in-the-loop**: Any remediation is manual or via approved workflows.
3. **Ticketing requires explicit user initiation**:
   - Only begin ticket flow when user clearly requests it (or triggers approved UI action).
4. **Actionable remediation required**:
   - Every issue found must include a “Manual Remediation Plan” with steps inside Smartsheet UI.
5. **Consistency for reporting**:
   - Encourage Contact columns, dropdown status, and standardized naming.
6. **Charts**:
   - If numerical counts appear, include chart data in the required format (as implemented in your system prompt).

---

## 14) Audit Output Standard (What your chatbot should produce)
[TAG:AUDIT_OUTPUT][SEVERITY:HIGH]

Every audit response should include:

### A) Executive Summary (3–5 bullets)
- What was reviewed
- Biggest risks found
- Biggest cleanup opportunities
- Estimated impact (security/cost/operational)

### B) Findings by Category
- Naming
- Access/Security
- Data quality (columns/status)
- Automations
- Staleness (zombie/abandoned)
- Integrations (webhooks/publish)

### C) Severity Labels
- **Critical:** immediate security or public exposure risk
- **High:** major compliance, access sprawl, high cost wastage
- **Medium:** data quality/performance risks
- **Low:** cleanup + best practice enhancements

### D) Manual Remediation Plan (Copy/Paste Checklist)
Each item formatted like:
- **Issue:** …
- **Why it matters:** …
- **Recommended Action (Smartsheet UI):** Step 1 → Step 2 → Step 3
- **Owner suggestion:** Admin / Workspace Owner / Asset Owner
- **Priority:** Critical/High/Medium/Low

---

## 15) Quick “Admin Checklist” (Standard)
[TAG:CHECKLIST][SEVERITY:HIGH]

Use this checklist during governance review:
- [ ] Asset naming follows `[DEPT] - Project - Asset Type`
- [ ] Primary/Backup Owner defined
- [ ] Owners/Assignees use Contact columns
- [ ] Status uses dropdown with consistent values
- [ ] No public/anyone publish links (or documented exceptions)
- [ ] External users restricted to least privilege
- [ ] Zombie/abandoned assets archived or reviewed
- [ ] Automations documented and have fallback alerts
- [ ] Webhooks are HTTPS and not failing repeatedly
- [ ] Large/risky attachments reviewed
- [ ] Seat usage reviewed for ghost licenses and true-up risks

---

# Appendix: Chatbot Retrieval Tags (Recommended)
Use these tags to help the assistant retrieve the right policy quickly:
- `NAMING`, `GOVERNANCE`, `COLUMNS`, `FORMULAS`, `SECURITY`, `PUBLISH`, `AUTOMATION`,
  `WORKSPACES`, `DASHBOARDS`, `WEBHOOKS`, `ATTACHMENTS`, `SEATS`, `DOCS`, `AI_POLICY`,
  `AUDIT_OUTPUT`, `CHECKLIST`