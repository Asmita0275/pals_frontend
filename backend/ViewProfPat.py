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
CREATE TABLE IF NOT EXISTS Login_done_patient (
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
        "INSERT INTO Login_done_patient (username, email, city) VALUES (%s, %s, %s)",
        (username, email, city)
    )
    conn.commit()

# ------------------------------
# Function to fetch last logged-in patient
# ------------------------------
def fetch_last_logged_in_patient():
    cursor.execute("""
    SELECT username, email, city 
    FROM Login_done_patient 
    ORDER BY id DESC 
    LIMIT 1
    """)
    return cursor.fetchone()

# ------------------------------
# Example: Insert login (simulate a login)
# Replace these values with actual login data
# ------------------------------
# insert_login_record("JD", "JD@gmail.com", "Chennai")  # Uncomment after real login

# ------------------------------
# Fetch and display last logged-in patient profile
# ------------------------------
last_patient = fetch_last_logged_in_patient()

if last_patient:
    print("\n--- Patient Profile ---")
    print(f"Username : {last_patient[0]}")
    print(f"Email    : {last_patient[1]}")
    print(f"City     : {last_patient[2]}")
else:
    print("⚠ No patient login data found!")

# ------------------------------
# Close connection
# ------------------------------
cursor.close()
conn.close()