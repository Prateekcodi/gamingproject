from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str
    avatar: str | None = None

    class Config:
        from_attributes = True 