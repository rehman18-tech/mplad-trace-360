from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from ....auth.jwt import create_access_token
from ....auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    role: str
    username: str = "demo_user"

@router.post("/token")
def generate_token(req: LoginRequest) -> Dict[str, Any]:
    valid_roles = ["citizen", "field_officer", "district_authority", "admin"]
    role = req.role if req.role in valid_roles else "citizen"
    payload = {
        "sub": req.username,
        "name": f"Government User ({role.replace('_', ' ').title()})",
        "role": role,
        "is_super_admin": role == "admin"
    }
    token = create_access_token(payload)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role,
        "user": payload
    }

@router.get("/me")
def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    return user
