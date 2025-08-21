from pydantic import BaseModel, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseSettings(BaseModel):
    engine: str
    name: str
    user: str
    password: SecretStr
    host: str
    port: str


class AppConfiguration(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False,
        env_nested_delimiter="__",
        arbitrary_types_allowed=True,
        env_prefix="REGRU__",
    )

    environment: str
    secret_key: SecretStr
    database: DatabaseSettings
