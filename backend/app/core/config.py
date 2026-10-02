from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "DevPath AI"
    app_env: str = "development"

    mongodb_url: str
    mongodb_database: str

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    groq_api_key: str
    groq_model: str = "openai/gpt-oss-20b"

    class Config:
        env_file = ".env"


settings = Settings()