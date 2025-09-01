import mysql.connector

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
# Create table if not exists
# ------------------------------
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
# Function to insert login record
# ------------------------------
def insert_login_record(username, email, city):
    cursor.execute(
        "INSERT INTO Login_done_doctor (username, email, city) VALUES (%s, %s, %s)",
        (username, email, city)
    )
    conn.commit()

# ------------------------------
# Function to fetch last logged-in doctor
# ------------------------------
def fetch_last_logged_in_doctor():
    cursor.execute("""
    SELECT username, email, city 
    FROM Login_done_doctor 
    ORDER BY id DESC 
    LIMIT 1
    """)
    return cursor.fetchone()

# ------------------------------
# Example: Insert login (simulate a login)
# Replace these values with actual login data
# ------------------------------
# insert_login_record("Dr. Meenakshi", "meenakshi@gmail.com", "Chennai")  # Uncomment after real login


# ------------------------------
# API function to get last logged-in doctor profile
# ------------------------------
def get_last_logged_in_doctor():
    last_doctor = fetch_last_logged_in_doctor()
    if last_doctor:
        return {"success": True, "doctor": {"username": last_doctor[0], "email": last_doctor[1], "city": last_doctor[2]}}
    else:
        return {"success": False, "message": "No doctor login data found!"}

# ------------------------------
# Close connection
# ------------------------------
cursor.close()
conn.close()