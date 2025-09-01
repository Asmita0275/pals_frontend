import os, sys, json, textwrap
from PIL import Image
from rich import print as rprint
from rich.table import Table
import google.generativeai as genai

# === 1) CONFIG ===
API_KEY = "AIzaSyDym3m9_ThrdIMzT9kbmKSW5U-rA5DKpqw"  # Replace with your valid API key
MODEL_ID = "gemini-1.5-flash"


def analyze_image_and_conditions(image_path, api_key=None):
    """
    Analyze an image and return the main issue and 5 possible conditions.
    Returns: dict with result or error
    """
    API_KEY = "AIzaSyDym3m9_ThrdIMzT9kbmKSW5U-rA5DKpqw"
    MODEL_ID = "gemini-1.5-flash"
    key = api_key or os.environ.get("GEMINI_API_KEY") or API_KEY
    if not key or key == "PASTE_YOUR_VALID_GEMINI_KEY_HERE":
        return {"success": False, "error": "No valid Gemini API key provided."}
    genai.configure(api_key=key)
    model = genai.GenerativeModel(MODEL_ID)
    # Analyze image
    try:
        img = Image.open(image_path).convert("RGB")
    except Exception as e:
        return {"success": False, "error": f"Could not load image: {e}"}
    try:
        response = model.generate_content([
            "Look at this image. Identify the main problem or issue shown. "
            "Give somewhat detailed explanation like what happened and what it could cause in simple way. "
            "Reply in one line only as:\nIssue is: <your answer>",
            img
        ])
        image_issue = response.text.strip()
    except Exception as e:
        return {"success": False, "error": f"Image analysis failed: {e}"}
    # Ask for 5 possible issues
    prompt_5_issues = textwrap.dedent(f"""
    The image was analyzed and gave the following issue: "{image_issue}".
    Based on this, give the top 5 possible medical or problem-related issues it could represent.
    Provide probabilities as integers summing to 100, severity (low/moderate/high), and urgency (see doctor immediately / monitor 2-3 days).
    Output STRICT JSON only, no explanations, like this format:
    {{
      "conditions": [
        {{"name": "...", "prob": 0-100, "severity": "...", "urgency": "..."}},
        {{"name": "...", "prob": 0-100, "severity": "...", "urgency": "..."}},
        {{"name": "...", "prob": 0-100, "severity": "...", "urgency": "..."}},
        {{"name": "...", "prob": 0-100, "severity": "...", "urgency": "..."}},
        {{"name": "...", "prob": 0-100, "severity": "...", "urgency": "..."}}
      ]
    }}
    """).strip()
    try:
        resp = model.generate_content([prompt_5_issues])
        raw = resp.text.strip()
    except Exception as e:
        return {"success": False, "error": f"API error: {e}"}
    # Parse JSON
    def parse_json_strict(s: str):
        try:
            return json.loads(s)
        except:
            start = s.find("{")
            end = s.rfind("}")
            if start != -1 and end != -1 and end > start:
                try:
                    return json.loads(s[start:end+1])
                except:
                    pass
        return None
    parsed = parse_json_strict(raw)
    if not parsed:
        return {"success": False, "error": "Could not parse model output.", "raw": raw}
    return {"success": True, "image_issue": image_issue, "conditions": parsed.get("conditions", []), "raw": raw}