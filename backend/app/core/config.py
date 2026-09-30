from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name:str="DevPath AI"
    app_env:str="development"

    mongodb_url:str
    mongodb_database:str

    class Config:
        env_file=".env"


settings=Settings()