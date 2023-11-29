# -*- coding: utf-8 -*-
"""
Created on Mon Jul 17 17:33:09 2023

@author: DELL
"""

import psycopg2
from psycopg2 import pool
import config as cfg

conn_string = cfg.getSubDbConn()
import base64
def decode_string(s):
    # Convert the encoded string to bytes
    encoded_bytes = s.encode('utf-8')
    # Decode the bytes from Base64
    decoded_bytes = base64.b64decode(encoded_bytes)

    # Convert the decoded bytes back to a string
    decoded_string = decoded_bytes.decode('utf-8')
    return decoded_string

decoded_connection_string = decode_string(conn_string)
# Create a connection pool
connection_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=15,
    dsn = decoded_connection_string
)

def getConnection():
    return connection_pool.getconn()
    # return connection

def execute_read_query(query, params=None):
    connection = connection_pool.getconn()  # Get a connection from the pool
    cursor = connection.cursor()

    try:
        cursor.execute(query, params)
        result = cursor.fetchall()  # Or use fetchone(), fetchmany() as per your needs
        connection.commit()
        return result
    except (Exception, psycopg2.DatabaseError) as error:
        connection.rollback()
        print("Error executing query:", error)
        raise
    finally:
        cursor.close()
        connection_pool.putconn(connection)  # Return the connection to the pool

# Example usage
# query = "SELECT * FROM your_table"
# results = execute_query(query)
# for row in results:
#     print(row)

# Don't forget to close the connection pool when you're done
# connection_pool.closeall()
