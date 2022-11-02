import os
import psycopg2

POSTGRES_HOST = os.environ.get('POSTGRES_HOST', 'postgres')
POSTGRES_DB = os.environ['POSTGRES_DB']
POSTGRES_USER = os.environ['POSTGRES_USER']
POSTGRES_PASSWORD = os.environ['POSTGRES_PASSWORD']

# Connect to the database.
#
db = psycopg2.connect(
  host=POSTGRES_HOST,
  database=POSTGRES_DB,
  user=POSTGRES_USER,
  password=POSTGRES_PASSWORD
)

# Create a cursor.
#
cursor = db.cursor()

# Create a table.

SQL = """
CREATE TABLE vendors (
  vendor_id SERIAL PRIMARY KEY,
  vendor_name VARCHAR(255) NOT NULL
)
"""

cursor.execute(SQL)

# Insert data.

SQL = "INSERT INTO vendors (vendor_name) VALUES (%s);"

cursor.execute(SQL, ('Red Hat',))
cursor.execute(SQL, ('Canonical',))

# Query data.

SQL = "SELECT * from vendors ORDER BY vendor_name;"

cursor.execute(SQL)

print("Number of results: ", cursor.rowcount)

row = cursor.fetchone()
#
while row is not None:
  print(row)
  row = cursor.fetchone()

# Close the cursor and the connection.
#
cursor.close()
db.close()