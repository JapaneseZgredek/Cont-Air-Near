from fastapi import HTTPException, status
from backend.models.client import Client, UserRole

def check_user_role(current_client: Client, required_roles: list[UserRole]):
    if current_client.role not in required_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. User role: {current_client.role.value}, Required: {[role.value for role in required_roles]}",
        )
