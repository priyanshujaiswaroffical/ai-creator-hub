
import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# Load Master Class .env
env_path = Path("c:/Users/ASUS/OneDrive/Desktop/Master Class/.env")
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")

print(f"🔍 Testing API Key: {api_key[:10]}...")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, respond with 'KEY_WORKS'")
    
    if "KEY_WORKS" in response.text:
        print("✅ SUCCESS: Your Gemini API Key is ACTIVE and working!")
    else:
        print(f"⚠️ UNKNOWN RESPONSE: {response.text}")

except Exception as e:
    print(f"❌ API KEY ERROR: {e}")
