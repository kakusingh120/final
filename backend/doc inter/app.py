import os
import numpy as np
from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM, AutoConfig
from PIL import Image
import pdfplumber
import easyocr
import requests

# Initialize Flask app
app = Flask(__name__, template_folder="../views")
CORS(app)

# Serve JavaScript files
@app.route("/javascripts/<path:filename>")
def serve_js(filename):
    return send_from_directory("../public/javascripts", filename)

# Serve Document Interpreter page
@app.route("/")
def index():
    try:
        with open("../views/DocIncp.ejs", "r", encoding="utf-8") as f:
            content = f.read()
        return render_template_string(content)
    except FileNotFoundError:
        return jsonify({"error": "Template file not found."}), 500

# Create uploads folder
UPLOAD_FOLDER = "Uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load BART model for summarization
model_name = "mithra99/bart-indian-law"
tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
model_config = AutoConfig.from_pretrained(model_name)
model_config.early_stopping = False  # Patch early_stopping
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, config=model_config)
summarizer = pipeline("summarization", model=model, tokenizer=tokenizer, device=-1)

# Initialize EasyOCR for CPU
reader = easyocr.Reader(["en"], gpu=False)

# Gemini API configuration
GEMINI_API_KEY = "AIzaSyC3XRJ7qhGnBJq2xPpb1-K-xCs26kLD94Y"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def call_gemini_api(prompt):
    try:
        headers = {"Content-Type": "application/json"}
        params = {"key": GEMINI_API_KEY}
        data = {"contents": [{"parts": [{"text": prompt}]}]}
        response = requests.post(GEMINI_URL, headers=headers, params=params, json=data)
        response.raise_for_status()
        return response.json()["candidates"][0]["content"]["parts"][0]["text"]
    except requests.RequestException as e:
        raise Exception(f"Gemini API error: {str(e)}")

def extract_text(file_path, file_type):
    try:
        if file_type == "application/pdf":
            with pdfplumber.open(file_path) as pdf:
                return "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
        else:
            image = Image.open(file_path).convert("RGB")
            result = reader.readtext(np.array(image), detail=0, paragraph=True)
            return "\n".join(result)
    except Exception as e:
        raise Exception(f"Text extraction error: {str(e)}")

def chunk_text(text, max_chars=3500):
    return [text[i:i + max_chars] for i in range(0, len(text), max_chars)]

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        file = request.files.get("file")
        user_text = request.form.get("text", "").strip()
        language = request.form.get("language", "english").capitalize()
        min_len = int(request.form.get("minLength", 30))
        max_len = int(request.form.get("maxLength", 75))

        text_to_summarize = ""
        if file:
            if file.content_type not in ["application/pdf", "image/png", "image/jpeg", "image/jpg"]:
                return jsonify({"error": "Unsupported file type. Use PDF, PNG, JPG, or JPEG."}), 400
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            text_to_summarize = extract_text(file_path, file.content_type)
            os.remove(file_path)  # Clean up file after extraction
        elif user_text:
            text_to_summarize = user_text
        else:
            return jsonify({"error": "No valid input provided."}), 400

        # Summarize using BART
        chunks = chunk_text(text_to_summarize)
        summaries = [summarizer(chunk, max_length=max_len, min_length=min_len, do_sample=False)[0]["summary_text"] for chunk in chunks]
        bart_summary = "\n".join(summaries)

        # Refine with Gemini API
        lang_prompt = {
            "English": "",
            "Hindi": "Give the summary in Hindi.",
            "Marathi": "Give the summary in Marathi.",
            "Telugu": "Give the summary in Telugu.",
            "Tamil": "Give the summary in Tamil.",
            "Bengali": "Give the summary in Bengali.",
            "Kannada": "Give the summary in Kannada."
        }.get(language, "")

        gemini_prompt = (
            f"The following is a legal text:\n\n{text_to_summarize}\n\n"
            f"Here is a summary generated by a legal summarizer:\n\n{bart_summary}\n\n"
            f"Provide a refined version in the context Keep it short, in detail, make sure that the output is authentic and doesnt look AI generated and provide only the language preffered - {lang_prompt} in maximum of 250 words and minimum of 50 words"
        )
        gemini_response = call_gemini_api(gemini_prompt)

        return jsonify({"summary": gemini_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)