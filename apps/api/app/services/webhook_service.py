import httpx
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.webhook import Webhook

async def send_webhook_notification(db: Session, project_id: str, payload: Dict[str, Any]):
    """
    Sends an async notification to all active webhooks for a project.
    """
    webhooks = db.query(Webhook).filter(Webhook.project_id == project_id, Webhook.is_active == True).all()
    
    if not webhooks:
        return
        
    async with httpx.AsyncClient() as client:
        for wh in webhooks:
            # Transform payload based on provider if necessary
            formatted_payload = payload
            if wh.provider.lower() == 'slack':
                formatted_payload = {"text": payload.get("message", "New Alert")}
            elif wh.provider.lower() == 'discord':
                formatted_payload = {"content": payload.get("message", "New Alert")}
                
            try:
                await client.post(wh.url, json=formatted_payload)
            except Exception as e:
                print(f"Failed to send webhook to {wh.url}: {e}")
