
"""
Format 
{"aadhaar" : [{"insurance_name":.., "insurance_type":..., "due":... },..]}
"""


from flask import Flask, request

app = Flask(__name__)
import json
import os

FILENAME = "insurance.json"

def load_json():
    """Loads data from insurance.json. Returns an empty dict if file doesn't exist or is invalid."""
    if not os.path.exists(FILENAME):
        return {}
    try:
        with open(FILENAME, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}

def save_json(data):
    """Saves the given dictionary to insurance.json with indentation."""
    with open(FILENAME, "w") as f:
        json.dump(data, f, indent=4)
@app.route('/check/<aadhaar>')
def index(aadhaar):
    return load_json()[aadhaar]

if __name__ == '__main__':
    app.run(host= "0.0.0.0", port=5051)

