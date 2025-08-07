
"""
Format 
{"aadhaar" : [{"tax_name":.., "due":... },..]}
"""


from flask import Flask, request

app = Flask(__name__)
import json
import os

FILENAME = "pan.json"

def load_json():
    """Loads data from json. Returns an empty dict if file doesn't exist or is invalid."""
    if not os.path.exists(FILENAME):
        return {}
    try:
        with open(FILENAME, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}

def save_json(data):
    """Saves the given dictionary to json with indentation."""
    with open(FILENAME, "w") as f:
        json.dump(data, f, indent=4)
@app.route('/check/<pan>')
def index(pan):
    return load_json()[pan]

if __name__ == '__main__':
    app.run(debug=True, host= "0.0.0.0", port=5053)
