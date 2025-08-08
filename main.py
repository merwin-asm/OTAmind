from flask import Flask, request, jsonify
import os
import google.generativeai as genai
import requests as rs
import json
from flask_cors import CORS

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

genai.configure(api_key="AIzaSyCiCRk_VPGTwes25_isfa6ZsyIWfRYsDhc")
model = genai.GenerativeModel("gemini-2.0-flash")



app = Flask(__name__)
CORS(app)  # enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

rental = {}
installments = {}

def check_rental(bank, rental):
    rent_score = ai("give a calculated value/score out of 10 for rent payment being on time, the total amount to be paid per month is "+ str(rental["rent"])+ " , and the transations of the person recently is in json is "+ str(bank) + "..... just return the number , no other replies.").replace("\n", "").replace(" ", "")
    return int(rent_score)


def check_insurance(insurance):
    return int(ai("give a calculated value/score out of 10 for insurance payments, not keeping dues based on the persons payment due list and total insurances. the data for the person : "+ str(insurance) + " ... just return the number , no other replies.").replace("\n", "").replace(" ", ""))

def check_bill(bill):
    return int(ai("give a calculated value/score out of 10 for bill payments,not keeping dues based on the persons payment due list and total bills. the data for the person : "+str( bill) + " ... just return the number , no other replies.").replace("\n", "").replace(" ", ""))

def check_tax(tax):
    return int(ai("give a calculated value/score out of 10 for tax payments,not keeping dues based on the persons payment due list and total taxs. the data for the person : "+ str(tax) + " ... just return the number , no other replies.").replace("\n", "").replace(" ", ""))

def check_installment(installment):
    return int(ai("give a calculated value/score out of 10 for installment payments,not keeping dues based on the persons payment receipts and the dates of paying. the data for the person : " + str(installment) + " ... just return the number , no other replies.").replace("\n", "").replace(" ", ""))

def check_score(aadhaar, pan):
    insurance = json.loads(rs.get("http://0.0.0.0:5051/check/"+aadhaar).text)
    billpayments = json.loads(rs.get("http://0.0.0.0:5052/check/"+aadhaar).text)
    tax_due = json.loads(rs.get("http://0.0.0.0:5053/check/"+pan).text)
    bank = json.loads(rs.get("http://0.0.0.0:5054/check/"+aadhaar).text)
    
    print("Aadhaar : ", aadhaar)
    print("Pan : ", pan)
    print("Insurance : ", insurance)
    print("Billpayments : ", billpayments)
    print("Tax Due : ", tax_due)
    print("Bank Tran : ", bank)

    rent_score = 10
    try:
        rent_score = check_rental(bank, rental[aadhaar])
    except:
        pass

    insurance_score = check_insurance(insurance)
    bill_score = check_bill(billpayments)
    tax_score = check_tax(tax_due)
    try:
        installment_score = check_installment(installments[aadhaar])
    except:
        installment_score = 10

    total = insurance_score + installment_score + bill_score + tax_score + rent_score

    #clean up 
    installments[aadhaar] = []
    del rental[aadhaar]
    print("credit : ", total) 
    return total


def ai(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"

@app.route('/')
def index():
    return "V 0.1.0"

@app.route('/check/<aadhaar>/<pan>')
def check_score_(aadhaar, pan):
    data =  check_score(aadhaar, pan) 
    return str(data)


@app.route('/upload_rental/<aadhaar>', methods=['POST'])
def upload_pdf(aadhaar):
    file = request.files['file']
    if file and file.filename.endswith('.pdf'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Extract text from PDF
        pdf_text = extract_text_from_pdf(filepath)
        os.remove(filepath)
        rental.setdefault(aadhaar, json.loads(ai(f"this is an rental agreement, check the rent per month, '{pdf_text}'.. return as json dict 'rent': int .. only return the json output").replace("```json","").replace("```","").replace("₹", "").replace(",", "")))

        return ""

    return "Please upload a valid PDF file."


@app.route('/upload_installments/<aadhaar>', methods=['POST'])
def upload_pdf_(aadhaar):
    file = request.files['file']
    if file and file.filename.endswith('.pdf'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Extract text from PDF
        pdf_text = extract_text_from_pdf(filepath)
        os.remove(filepath)
        
        try:
            installments[aadhaar].append(json.loads(ai(f"this is an installment reciept, check the date and amount as json in format dict with date and amount, dont return anything else, '{pdf_text}'").replace("```json","").replace("```","").replace("₹", "")))
        except:
            installments.setdefault(aadhaar, [json.loads(ai(f"this is an installment reciept, check the date and amount as json in format dict with date and amount, dont return anything else, '{pdf_text}'").replace("```json","").replace("```","").replace("₹", ""))])

        return ""

    return "Please upload a valid PDF file."

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050)
