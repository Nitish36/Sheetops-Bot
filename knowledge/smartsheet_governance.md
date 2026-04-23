# SMARTSHEET CORPORATE GOVERNANCE & BEST PRACTICES

## 1. Naming Conventions
- All professional sheets must follow the prefix format: `[DEPT] - Project Name - [Asset Type]` (e.g., [IT] - Server Migration - Tracker).
- Avoid names like "Untitled" or "Copy of...".

## 2. Column Architecture
- Use "Contact List" columns for Owners and Assignees to enable automated notifications.
- Use "Dropdown (Single Select)" for Status columns to ensure data consistency for Looker reporting.
- Row-level formulas should always use `@row` references (e.g., `=[Status]@row`) to improve sheet performance.

## 3. Security & Sharing
- Never share sheets with "Anyone with a link." Use specific email sharing.
- External collaborators should be restricted to "Viewer" or "Editor - Cannot Share" unless approved.
- Use "WorkApps" to provide a filtered UI for users who do not need full sheet access.

## 4. Automation Rules
- Change-based triggers are preferred over time-based triggers to save processing power.
- All critical workflows must have an "Alert Someone" fallback if the primary action fails.

## 5. SheetOps Platform Capabilities
- SheetOps can perform deep audits on Sheet IDs, User Lists, Seats, Webhooks, and Workspaces.
- SheetOps can summarize PDF, Word, PowerPoint, and Excel documents.
- SheetOps provides visual charts for health metrics but operates in READ-ONLY mode for safety.