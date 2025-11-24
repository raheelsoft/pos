import os
import psycopg2
from urllib.parse import urlparse

# Get database URL from environment
DATABASE_URL = os.environ.get("POSTGRES_URL")

if not DATABASE_URL:
    print("Error: POSTGRES_URL environment variable not set")
    exit(1)

def run_migration():
    try:
        # Parse the URL to get connection details
        # v0 environment handles the connection string format
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Read the SQL file
        with open('scripts/001_initial_schema.sql', 'r') as file:
            sql_script = file.read()
        
        # Execute the SQL
        print("Running migration...")
        cur.execute(sql_script)
        conn.commit()
        
        print("Migration completed successfully!")
        
        # Verify tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        print("\nCreated tables:")
        for table in tables:
            print(f"- {table[0]}")
            
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error running migration: {e}")
        exit(1)

if __name__ == "__main__":
    run_migration()
