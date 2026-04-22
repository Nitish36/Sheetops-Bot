import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def get_db_connection():
    return psycopg2.connect(DATABASE_URL, sslmode='require')


def ensure_user_exists(email, name):
    """Checks if user exists, creates them if not, returns user_id."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        if user:
            # Update last login
            cur.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s", (user['id'],))
            user_id = user['id']
        else:
            cur.execute("INSERT INTO users (email, name) VALUES (%s, %s) RETURNING id", (email, name))
            user_id = cur.fetchone()['id']
        conn.commit()
        return user_id
    finally:
        cur.close()
        conn.close()


def log_activity(user_id, toolkit_name, action_type, metadata=None):
    """Logs a toolkit click or action for Looker."""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO activity_logs (user_id, toolkit_name, action_type, metadata) VALUES (%s, %s, %s, %s)",
            (user_id, toolkit_name, action_type, str(metadata) if metadata else None)
        )
        conn.commit()
    finally:
        cur.close()
        conn.close()


def create_session(user_id, title, module):
    """Creates a new chat session for the sidebar."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute(
            "INSERT INTO sessions (user_id, session_title, module_type) VALUES (%s, %s, %s) RETURNING id",
            (user_id, title, module)
        )
        session_id = cur.fetchone()['id']
        conn.commit()
        return session_id
    finally:
        cur.close()
        conn.close()


def save_message(session_id, role, content):
    """Saves a single message to the history."""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO messages (session_id, role, content) VALUES (%s, %s, %s)",
            (session_id, role, content)
        )
        conn.commit()
    finally:
        cur.close()
        conn.close()


def get_user_sessions(user_id):
    """Fetches the 10 most recent sessions for the sidebar."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("""
            SELECT id, session_title, module_type, created_at
            FROM sessions 
            WHERE user_id = %s 
            ORDER BY created_at DESC 
            LIMIT 10
        """, (user_id,))
        return cur.fetchall()
    finally:
        cur.close()
        conn.close()


def get_session_messages(session_id):
    """Fetches all messages for a specific session to rebuild the chat UI."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("""
            SELECT role, content
            FROM messages
            WHERE session_id = %s
            ORDER BY created_at ASC
        """, (session_id,))
        return cur.fetchall()
    finally:
        cur.close()
        conn.close()


def create_user(username, email, password):
    """Creates a new user with Huron domain verification."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # 1. Verification Logic
    plan_type = 'free'
    if email.lower().endswith('@hcg.com') or email.lower().endswith('@hcg'):
        plan_type = 'huron'

    # 2. Hash Password
    hashed_pw = generate_password_hash(password)

    try:
        cur.execute(
            "INSERT INTO users (username, email, password_hash, plan) VALUES (%s, %s, %s, %s) RETURNING id",
            (username, email, hashed_pw, plan_type)
        )
        user_id = cur.fetchone()['id']
        conn.commit()
        return {"success": True, "user_id": user_id, "plan": plan_type}
    except psycopg2.IntegrityError:
        return {"success": False, "error": "Email already registered."}
    finally:
        cur.close()
        conn.close()


def verify_user_login(email, password):
    """Checks credentials and returns user data if valid."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        if user and check_password_hash(user['password_hash'], password):
            return user
        return None
    finally:
        cur.close()
        conn.close()


# Update your existing user loader to include username and plan
def get_user_by_id(user_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def get_executive_stats(user_id):
    """Calculates total impact metrics for the scorecard."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # 1. Total Audits (Count CSV uploads)
        cur.execute("SELECT COUNT(*) FROM activity_logs WHERE user_id = %s AND action_type = 'upload_csv'", (user_id,))
        total_audits = cur.fetchone()['count']

        # 2. Formulas Fixed (Count clicks on Formula Builder)
        cur.execute("SELECT COUNT(*) FROM activity_logs WHERE user_id = %s AND toolkit_name = 'Formula Builder'", (user_id,))
        formulas_fixed = cur.fetchone()['count']

        # 3. Security Risks (Calculate based on Webhook + Published + User audits)
        cur.execute("""
            SELECT COUNT(*) FROM activity_logs 
            WHERE user_id = %s AND toolkit_name IN ('Webhook Audit', 'Published Items', 'User Audit')
        """, (user_id,))
        risks_found = cur.fetchone()['count'] * 2 # Mock multiplier: assume 2 risks per audit for demo

        return {
            "audits": total_audits,
            "formulas": formulas_fixed,
            "risks": risks_found,
            "savings": total_audits * 450 # Mock: Assume $450 saved per audit (Licenses/Time)
        }
    finally:
        cur.close()
        conn.close()
