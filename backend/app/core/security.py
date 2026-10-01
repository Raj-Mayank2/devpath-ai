from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from jose import jwt

from app.core.config import settings


password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Hash a plain-text password."""
    return password_hasher.hash(password)


def verify_password(
    password: str,
    hashed_password: str,
) -> bool:
    """Verify a password against its hash."""

    try:
        password_hasher.verify(
            hashed_password,
            password,
        )
        return True

    except Exception:
        return False


def create_access_token(user_id: str) -> str:
    """Create a JWT access token."""

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    )

    payload = {
        "sub": user_id,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )