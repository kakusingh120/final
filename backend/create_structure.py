import os

# Updated structure with full model list
structure = {
    "models": [
        "User.js",
        "UserAddress.js",
        "Lawyer.js",
        "LawyerAddress.js",
        "Case.js",
        "CaseNote.js",
        "Document.js",
        "ChatHistory.js",
        "ConnectedAid.js"
    ],
    "routes": [
        "userRoutes.js",
        "lawyerRoutes.js",
        "caseRoutes.js"
    ],
    "controllers": [
        "userController.js",
        "lawyerController.js",
        "caseController.js"
    ],
    "config": ["db.js"]
}

# Create folders and files
for folder, files in structure.items():
    os.makedirs(folder, exist_ok=True)
    for file in files:
        file_path = os.path.join(folder, file)
        with open(file_path, 'w') as f:
            f.write(f"// {file} - auto-generated\n")
        print(f"✅ Created: {file_path}")

print("\n🎉 Folder and file structure successfully generated!")
