from flask import Flask, request
import os
import google.generativeai as genai
import requests as rs
import json

import fitz  # PyMuPDF

def extract_text_from_pdf(filepath):
    doc = fitz.open(filepath)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

def ai(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"

genai.configure(api_key="AIzaSyCHs_5V6gjlydD8WGMeqIkXqE84JxBcEhc")
model = genai.GenerativeModel("gemini-2.0-flash")

pdf_text = extract_text_from_pdf("rental.pdf")
print(json.loads(ai(f"this is an installment reciept, check the date and amount as json in format dict with date and amount, dont return anything else, '{pdf_text}'").replace("```json","").replace("```","")))
