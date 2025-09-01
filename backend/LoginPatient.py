import mysql.connector
from datetime import datetime

# ------------------------------
# DB Connection
# ------------------------------
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="admin123",
    database="nexora_medassist"
)
cursor = conn.cursor()

# ------------------------------
# Create tables if not exists
# ------------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    password VARCHAR(255),
    city VARCHAR(255)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Login_done_patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    city VARCHAR(255),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# ------------------------------
# Patient Signup
# ------------------------------

def patient_signup(username, email, password, city):
    try:
        cursor.execute(
            "INSERT INTO users (username, email, password, city) VALUES (%s, %s, %s, %s)",
            (username, email, password, city)
        )
        conn.commit()
        # Record login in login_done table
        cursor.execute(
            "INSERT INTO Login_done_patient (username, email, city) VALUES (%s, %s, %s)",
            (username, email, city)
        )
        conn.commit()
        return {"success": True, "message": f"Account created for {username}"}
    except mysql.connector.IntegrityError:
        return {"success": False, "message": "Username already exists."}

# ------------------------------
# Patient Login
# ------------------------------
def patient_login(username, password):
    cursor.execute(
        "SELECT * FROM users WHERE username=%s AND password=%s",
        (username, password)
    )
    result = cursor.fetchone()
    if result:
        # Record login in login_done table
        cursor.execute(
            "INSERT INTO Login_done_patient (username, email, city) VALUES (%s, %s, %s)",
            (result[1], result[2], result[4])
        )
        conn.commit()
        return {"success": True, "message": f"Login successful! Welcome, {username}", "patient": {"username": result[1], "email": result[2], "city": result[4]}}
    else:
        return {"success": False, "message": "Invalid username or password."}

