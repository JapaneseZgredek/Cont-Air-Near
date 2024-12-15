import httpx
from sqlalchemy.orm import Session
from backend.database import engine
from backend.models.debl.email_block_list import email_block_list

# URL for the disposable email blocklist
BLOCKLIST_URL = "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf"

def fetch_blocklist():
    try:
        response = httpx.get(BLOCKLIST_URL, timeout=10.0)
        response.raise_for_status()
        return response.text.splitlines()
    except httpx.RequestError as e:
        print(f"Error fetching blocklist: {e}")
        return []

def update_blocklist():
    blocklist = fetch_blocklist()
    if not blocklist:
        print("No blocklist data available")
        return

    with Session(engine) as session:
        session.query(email_block_list).delete()

        for domain in blocklist:
            if domain.strip():  # Check if it's not empty
                session.add(email_block_list(domain=domain.strip()))

        session.commit()
        print(f"Blocklist updated with {len(blocklist)} domains.")

if __name__ == "__main__":
    update_blocklist()
