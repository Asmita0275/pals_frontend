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
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    password VARCHAR(255),
    city VARCHAR(255)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Login_done_doctor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    city VARCHAR(255),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# ------------------------------
# Doctor Signup
# ------------------------------
def doctor_signup(username, email, password, city):
    while True:
    # CLI removed: signup logic should be called with parameters from frontend

        try:
            cursor.execute(
                "INSERT INTO doctors (username, email, password, city) VALUES (%s, %s, %s, %s)",
                (username, email, password, city)
            )
            conn.commit()
            # Success message handled by frontend

            # Record login
            cursor.execute(
                "INSERT INTO Login_done_doctor (username, email, city) VALUES (%s, %s, %s)",
                (username, email, city)
            )
            conn.commit()
            return {"success": True, "message": f"Account created for Dr. {username}"}
        except mysql.connector.IntegrityError:
            return {"success": False, "message": "Username already exists."}

# ------------------------------
# Doctor Login
# ------------------------------
def doctor_login(username, password):
    while True:
    # CLI removed: login logic should be called with parameters from frontend

        cursor.execute("SELECT * FROM doctors WHERE username=%s AND password=%s", (username, password))
        result = cursor.fetchone()

        if result:
            # Success message handled by frontend
            
            # INSERT INTO Login_done_doctor
            cursor.execute(
                "INSERT INTO Login_done_doctor (username, email, city) VALUES (%s, %s, %s)",
                (result[1], result[2], result[4])  # username, email, city from doctors table
            )
            conn.commit()
            return {"success": True, "message": f"Login successful! Welcome, Dr. {username}", "doctor": {"username": result[1], "email": result[2], "city": result[4]}}
            break
        else:
            return {"success": False, "message": "Invalid username or password."}
            # Error message handled by frontend

# ------------------------------
# Main Menu
# ------------------------------
while True:
    # CLI menu removed; frontend should call backend functions directly

    if choice == "1":
        doctor_login()
        break
    elif choice == "2":
        doctor_signup()
        break
    else:
    # Error message handled by frontend

        # Close connection
        cursor.close()
        conn.close()