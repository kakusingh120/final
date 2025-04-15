const fileInput = document.getElementById("file-upload");
const fileNameDisplay = document.getElementById("file-name");
const dropArea = document.getElementById("drop-area");
const submitBtn = document.getElementById("submit-btn");
const legalText = document.getElementById("legal-text");
const languageSelect = document.getElementById("language-select");
const output = document.getElementById("output");
const outputText = document.getElementById("output-text");
const maxLengthSlider = document.getElementById("maxLength");
const minLengthSlider = document.getElementById("minLength");
const maxLengthLabel = document.getElementById("maxLengthLabel");
const minLengthLabel = document.getElementById("minLengthLabel");
const loader = document.createElement("div"); // Create loader dynamically
loader.className = "text-center text-blue-600 mt-4 hidden";
loader.innerHTML = "⏳ Generating summary...";
output.parentElement.insertBefore(loader, output);

// Update slider labels
maxLengthSlider.oninput = () => maxLengthLabel.textContent = maxLengthSlider.value;
minLengthSlider.oninput = () => minLengthLabel.textContent = minLengthSlider.value;

// File preview
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        fileNameDisplay.textContent = `📄 ${file.name}`;
        fileNameDisplay.classList.remove("hidden");
    } else {
        fileNameDisplay.classList.add("hidden");
    }
});

// Drag and drop functionality
["dragenter", "dragover"].forEach(eventName => {
    dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        dropArea.classList.add("border-blue-400", "bg-blue-50");
    });
});
["dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        dropArea.classList.remove("border-blue-400", "bg-blue-50");
    });
});
dropArea.addEventListener("drop", e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        fileInput.files = files;
        fileInput.dispatchEvent(new Event("change"));
    }
});

// Submit summary request
submitBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    const text = legalText.value.trim();
    const language = languageSelect.value;
    const minLen = minLengthSlider.value;
    const maxLen = maxLengthSlider.value;

    if (!file && !text) {
        alert("Please upload a file or enter some text.");
        return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text) formData.append("text", text);
    formData.append("language", language);
    formData.append("minLength", minLen);
    formData.append("maxLength", maxLen);

    loader.classList.remove("hidden");
    output.classList.add("hidden");
    outputText.textContent = "";

    try {
        const response = await fetch("http://localhost:5001/summarize", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        loader.classList.add("hidden");

        if (response.ok) {
            outputText.textContent = data.summary;
            output.classList.remove("hidden");
        } else {
            outputText.textContent = `Error: ${data.error}`;
            output.classList.remove("hidden");
        }
    } catch (error) {
        loader.classList.add("hidden");
        outputText.textContent = `Error: Failed to connect to the server.`;
        output.classList.remove("hidden");
    }
});