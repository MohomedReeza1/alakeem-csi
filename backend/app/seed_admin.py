from app.db import SessionLocal
from app.models import Admin
from app import auth

db = SessionLocal()

# Replace these with your desired credentials
username = "admin"
password = "admin123"

existing = db.query(Admin).filter(Admin.username == username).first()
if existing:
    print("Admin user already exists.")
else:
    admin = Admin(
        username=username,
        password_hash=auth.get_password_hash(password)
    )
    db.add(admin)
    db.commit()
    print(f"Admin user '{username}' created successfully.")

db.close()
