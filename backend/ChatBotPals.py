import os, sys, json, textwrap
from typing import List
from PIL import Image
import google.generativeai as genai

API_KEY = "AIzaSyDym3m9_ThrdIMzT9kbmKSW5U-rA5DKpqw"
MODEL_ID = "gemini-1.5-flash"

def run_diagnosure(patient_name, patient_age, patient_sex, symptoms, taking_pills, duration, conditions, image_paths=None, api_key=None):
    """
    Main backend function for Diagnosure. All arguments must be provided by frontend.
    image_paths: list of image file paths (optional)
    Returns: dict with result or error
    """
    key = api_key or os.environ.get("GEMINI_API_KEY") or API_KEY
    if not key or key == "PASTE_HERE":
        return {"success": False, "error": "No valid Gemini API key provided."}
    genai.configure(api_key=key)
    model = genai.GenerativeModel(MODEL_ID)

    # Load images if provided
    images = []
    if image_paths:
        for p in image_paths:
            try:
                images.append(Image.open(p).convert("RGB"))
            except Exception as e:
                sys.exit(0)

                # All top-level code removed. Only run_diagnosure and imports remain. Safe for import.


# All top-level code removed. Only run_diagnosure and imports remain. Safe for import.