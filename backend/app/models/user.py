from beanie import Document
from pydantic import EmailStr


class User(Document):
    name: str
    email: EmailStr
    password_hash: str

    class Settings:
        name = "users"