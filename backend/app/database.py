import sqlite3
import os

DB_FILE = "hess_protector.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, amount REAL, type TEXT, category TEXT, date TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS pantry (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, qty TEXT, category TEXT, expiry TEXT, added_date TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS recurring (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, amount REAL, day INTEGER, type TEXT)''')
    # MODIF : Ajout deadline, priority, icon pour les objectifs 
    # (Note: Duplicate creation line removed from original main.py reference during refactor)
    c.execute('''CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, target REAL, saved REAL, deadline TEXT, priority TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY AUTOINCREMENT, supermarket TEXT, diet TEXT, initial_balance REAL)''')
    c.execute('''CREATE TABLE IF NOT EXISTS plans (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, content_json TEXT, created_at TEXT)''')
    conn.commit()
    conn.close()
