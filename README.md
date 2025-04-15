# LawGic

**LawGic** is a comprehensive platform designed to provide various services like legal consultation, case tracking, document interpretation, and more. The application integrates advanced AI-powered tools and a user-friendly interface to streamline the process of finding legal assistance and resources.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)

---

## Overview

LawGic aims to revolutionize the way individuals and organizations interact with legal services by integrating artificial intelligence (AI), a comprehensive legal database, and an interactive user interface. From connecting clients with lawyers to tracking case statuses and providing document interpretation, **LawGic** is your go-to platform for legal tech solutions.

---

## Features

- **Responsiveness**: The platform is fully responsive, providing a seamless experience across all devices.
- **Interactive**: Engages users with interactive elements, ensuring a user-friendly interface.
- **Chatbot**: A smart AI-powered chatbot for legal inquiries and assistance.
- **Doc Interpreter**: Easily interpret legal documents using advanced AI models.
- **NGO Connection**: Connecting NGOs with individuals seeking legal aid.
- **Lawyer Connection**: Facilitating easy connections between clients and lawyers.
- **Blogs**: A section dedicated to legal blogs, offering insights and updates.
- **Case Trackers**: Allows users to track their case progress in real-time.

---

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js, EJS
- **AI Models**: PyTorch, Hugging Face
- **Database**: MongoDB (via Mongoose)
- **Cloud Storage**: Cloudinary for file management

---

## File Structure
```sh
LawGic/
├── backend/
│   ├── views/                # EJS templates for server-side rendering
│   ├── public/               # Static assets (CSS, JS, images)
│   ├── doc_inter/            # Document interpreter logic and models
│   ├── controllers/          # Request handling logic
│   ├── db/                   # Database connection and configuration
│   ├── middlewares/          # Custom middleware for authentication, logging, etc.
│   ├── models/               # MongoDB schemas and models
│   ├── routes/               # API and page routes
│   ├── utils/                # Utility functions and helpers
│   ├── .env                  # Environment variables
│   ├── .gitignore            # Files and directories to ignore in git
│   ├── app.js                # Core Express app setup
│   ├── server.js             # Server initialization
│   ├── index.js              # Entry point for the backend
│   ├── package.json          # Node.js dependencies and scripts

```


## Clone the Repository:
```bash
git clone https://github.com/your-repo/LawGic.git
cd LawGic/backend
```

## Install Dependencies:
```bash
npm install
```

## Configure Environment Variables: 
```bash
CORS_ORIGIN=*
DB_URI=mongodb+srv://abhinav:abhi1234@cluster0.zydev.mongodb.net
ACCESS_TOKEN_SECRET=abhinav
ACCESS_TOKEN_TIME="1d"
REFRESH_TOKEN_SECRET=singh
REFRESH_TOKEN_TIME="10d"
CLOUDINARY_CLOUD_NAME=dxswnojvs
CLOUDINARY_API_KEY=885373621146264
CLOUDINARY_API_SECRET=k-gvCuWbNtG6q0L8RbwszsMOP7M
EMAIL_USER=abhinavrajput6579@gmail.com
EMAIL_PASS=ebni xyez ozma jrav
CLIENT_URL=http://localhost:8000
GEMINI_API_KEY=AIzaSyB4ybkFPFj2UDom2QZNfnP7DKHffEdXpwY
```


## Run the Application:
```bash
npm start
```

## Contact
For inquiries, reach out to:

- Email: krishsingh10386@gmail.com

- Project Repository: [GitHub Link](https://github.com/kakusingh120/final)

