from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import requests
import json

# Correct folder setup
app = Flask(__name__, template_folder='../views')
CORS(app)
# Serve JS files
@app.route('/javascripts/<path:filename>')
def serve_js(filename):
    return send_from_directory('../public/javascripts', filename)

# Serve static CSS from public/stylesheets
@app.route('/stylesheets/<path:filename>')
def styles(filename):
    return send_from_directory('../public/stylesheets', filename)

# Render the chatbot.ejs file as raw HTML (Flask does not parse EJS)
@app.route('/')
def index():
    # Read the EJS file and return it as-is (Flask cannot parse EJS templates)
    with open('../views/chatbot.ejs', 'r', encoding='utf-8') as f:
        content = f.read()
    return render_template_string(content)

# Gemini API Configuration
GEMINI_API_KEY = "AIzaSyB4ybkFPFj2UDom2QZNfnP7DKHffEdXpwY"  # Replace with your key
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
headers = {
    "Content-Type": "application/json"
}

# Function to query Gemini
def query_gemini(prompt: str, language: str = "English") -> str:
    user_prompt = f"Answer in {language} in context of Indian law and IPC. Keep it short but detailed and simple:\n{prompt}"
    payload = {
        "contents": [{"parts": [{"text": user_prompt}]}]
    }

    try:
        response = requests.post(GEMINI_ENDPOINT, headers=headers, data=json.dumps(payload))
        data = response.json()

        print("Raw API response:", data)  # <--- ADD THIS

        if "candidates" in data:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        elif "error" in data:
            return f"API Error: {data['error'].get('message', 'Unknown error')}"
        else:
            return "⚠ Unexpected response format."
    except Exception as e:
        import traceback
        traceback.print_exc()  # <--- ADD THIS
        return f"Exception: {str(e)}"

# Chatbot route
@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    prompt = data.get("prompt")
    language = data.get("language", "English")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    response = query_gemini(prompt, language)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)