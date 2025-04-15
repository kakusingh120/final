    const fileInput = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const dropArea = document.getElementById('drop-area');
    const submitBtn = document.getElementById('submit-btn');
    const legalText = document.getElementById('legal-text');
    const languageSelect = document.getElementById('language-select');
    const output = document.getElementById('output');
    const outputText = document.getElementById('output-text');



    const maxLengthSlider = document.getElementById("maxLength");
    const minLengthSlider = document.getElementById("minLength");
    const maxLengthLabel = document.getElementById("maxLengthLabel");
    const minLengthLabel = document.getElementById("minLengthLabel");
    const file_Input = document.getElementById("fileInput");
    const fileName = document.getElementById("fileName");
    const generateBtn = document.getElementById("generateBtn");
    const loader = document.getElementById("loader");
    const out_put = document.getElementById("output");
    const summaryResult = document.getElementById("summaryResult");

    // File preview
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        fileNameDisplay.textContent = `📄 ${file.name}`;
        fileNameDisplay.classList.remove('hidden');
      }
    });

  

    // Drag and drop functionality
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        dropArea.classList.add('border-blue-400', 'bg-blue-50');
      });
    });
    ;['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        dropArea.classList.remove('border-blue-400', 'bg-blue-50');
      });
    });

    dropArea.addEventListener('drop', e => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        fileInput.files = files;
        fileInput.dispatchEvent(new Event('change'));
      }
    });

    submitBtn.addEventListener('click', async () => {
      const file = fileInput.files[0];
      const text = legalText.value.trim();
      const lang = languageSelect.value;
      const minLen = minLengthSlider.value;
      const maxLen = maxLengthSlider.value;
    
      if (!file && !text) {
        alert('Please upload a file or enter some text.');
        return;
      }
    
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("text", text);
      formData.append("language", lang);
      formData.append("minLength", minLen);
      formData.append("maxLength", maxLen);
    
      outputText.textContent = "⏳ Generating summary...";
      output.classList.remove('hidden');
    
      const response = await fetch("/summarize", {
        method: "POST",
        body: formData,
      });
    
      const result = await response.json();
      outputText.textContent = result.summary;
    });


    // 
    maxLengthSlider.oninput = () => maxLengthLabel.textContent = maxLengthSlider.value;
    minLengthSlider.oninput = () => minLengthLabel.textContent = minLengthSlider.value;

    file_Input.addEventListener("change", () => {
      const file = file_Input.files[0];
      if (file) {
        fileName.textContent = `📄 ${file.name}`;
        fileName.classList.remove("hidden");
      }
    });

    generateBtn.addEventListener("click", () => {
      const file = file_Input.files[0];
      const language = document.getElementById("language").value;
      const minLen = minLengthSlider.value;
      const maxLen = maxLengthSlider.value;

      if (!file) {
        alert("Please upload a file to summarize.");
        return;
      }

      loader.classList.remove("hidden");
      out_put.classList.add("hidden");
      summaryResult.textContent = "";

      setTimeout(() => {
        loader.classList.add("hidden");
        summaryResult.textContent =
          `✅ Summary Generated:\nLanguage: ${language.toUpperCase()}\nFile: ${file.name}\nMin Length: ${minLen}\nMax Length: ${maxLen}`;
        out_put.classList.remove("hidden");
      }, 2500);
    });