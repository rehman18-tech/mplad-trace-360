import hmac
import hashlib
import base64
import json
import time
from typing import Dict, Any, Optional
from ..config import settings

def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def _b64_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4)) if len(data) % 4 != 0 else ''
    return base64.urlsafe_b64decode(data + padding)

def create_access_token(payload: Dict[str, Any], expires_in_seconds: int = 86400) -> str:
    header = {"alg": settings.JWT_ALGORITHM, "typ": "JWT"}
    body = dict(payload)
    body["exp"] = int(time.time()) + expires_in_seconds
    body["iat"] = int(time.time())

    encoded_header = _b64_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    encoded_body = _b64_encode(json.dumps(body, separators=(',', ':')).encode('utf-8'))
    
    signing_input = f"{encoded_header}.{encoded_body}".encode('utf-8')
    signature = hmac.new(settings.JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
    encoded_sig = _b64_encode(signature)

    return f"{encoded_header}.{encoded_body}.{encoded_sig}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_b64, body_b64, sig_b64 = parts
        
        signing_input = f"{header_b64}.{body_b64}".encode('utf-8')
        expected_sig = hmac.new(settings.JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
        
        if not hmac.compare_digest(expected_sig, _b64_decode(sig_b64)):
            return None
            
        body = json.loads(_b64_decode(body_b64).decode('utf-8'))
        if body.get("exp") and body["exp"] < time.time():
            return None # Expired
            
        return body
    except Exception:
        return None
