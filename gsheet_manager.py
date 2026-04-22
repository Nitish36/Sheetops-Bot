import gspread
import os
import json
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

GOOGLE_SERVICE_ACCOUNT = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")


def get_gsheet():
    if not GOOGLE_SERVICE_ACCOUNT:
        return None
    creds_dict = json.loads(GOOGLE_SERVICE_ACCOUNT)
    gc = gspread.service_account_from_dict(creds_dict)
    return gc.open("SheetOps_Logs")


def gsheet_sync_user(user_id, email, name,plan):
    """Updates or adds user to the Users tab."""
    try:
        sh = get_gsheet()
        if not sh: return
        wks = sh.worksheet("Users")

        # Check if user already exists in sheet to avoid duplicates
        try:
            cell = wks.find(email)
        except:
            cell = None
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if cell:
            # Update Last Login (Column 5)
            wks.update_cell(cell.row, 3, name)
            wks.update_cell(cell.row, 4, plan)
            #wks.update_cell(cell.row, 5, now)
            wks.update_cell(cell.row, 6, now)
        else:
            # Add new row
            wks.append_row([user_id, email, name,plan, now, now])
    except Exception as e:
        print(f"GSheet User Sync Error: {e}")


def gsheet_log_session(session_id, user_name, title, module):
    """Adds a new session to the Sessions tab."""
    try:
        sh = get_gsheet()
        wks = sh.worksheet("Sessions")
        wks.append_row([
            str(session_id),
            user_name,
            title,
            module,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ])
    except Exception as e:
        print(f"GSheet Session Log Error: {e}")


def gsheet_log_activity(user_name, toolkit, action, details=""):
    """Adds activity logs to the Activity tab."""
    try:
        sh = get_gsheet()
        wks = sh.worksheet("Activity")
        wks.append_row([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_name,
            toolkit,
            action,
            details
        ])
    except Exception as e:
        print(f"GSheet Activity Log Error: {e}")


def gsheet_log_feedback(user_name, feedback_type, response_id):
    """Logs user feedback specifically to the Feedback tab."""
    try:
        sh = get_gsheet()
        if not sh: return
        wks = sh.worksheet("Feedback")  # Targets the Feedback tab

        wks.append_row([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_name,
            feedback_type,  # 'helpful' or 'not-helpful'
            response_id
        ])
        print(f"✅ Feedback synced to GSheet for {user_name}")
    except Exception as e:
        print(f"❌ GSheet Feedback Log Error: {e}")