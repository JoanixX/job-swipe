import os
from dotenv import load_dotenv

# Solo para usarlo local
load_dotenv()

BACKEND_API_URL = os.getenv("BACKEND_API_URL")
