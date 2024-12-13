# from fastapi import HTTPException, status
# from backend.models.user import User, UserRole
#
# def check_user_role(current_user: User, required_roles: list[UserRole]):
#     if current_user.role not in required_roles:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

from fastapi import HTTPException, status
from backend.models.user import User, UserRole

def check_user_role(current_user: User, required_roles: list[UserRole]):
    if current_user.role not in required_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. User role: {current_user.role.value}, Required: {[role.value for role in required_roles]}",
        )
