from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import openai
import pandas as pd
import os

openai.api_key = os.getenv("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

class Patient(BaseModel):
    sno: str
    name: str
    issue: str

records = pd.DataFrame(columns=["Sno", "Name", "Issue", "Time", "PriorityScore"])

@app.post("/add_patient")
def add_patient(patient: Patient):
    global records
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    prompt = f"On a scale of 1-10, how serious is this medical issue: {patient.issue}? Respond with only the number."
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=5,
        temperature=0
    )
    try:
        score = int(response.choices[0].text.strip())
    except:
        score = 0
    records = records.append({
        "Sno": patient.sno,
        "Name": patient.name,
        "Issue": patient.issue,
        "Time": current_time,
        "PriorityScore": score
    }, ignore_index=True)
    sorted_records = records.sort_values(by="PriorityScore", ascending=False).drop(columns=["PriorityScore"])
    return {"records": sorted_records.to_dict(orient="records")}

@app.get("/patients")
def get_patients():
    global records
    sorted_records = records.sort_values(by="PriorityScore", ascending=False).drop(columns=["PriorityScore"])
    return {"records": sorted_records.to_dict(orient="records")}
