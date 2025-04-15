// Core imports
import axios from "axios";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { EventEmitter } from "events";
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers['x-access-token'];
  if (!token) {
    return res.redirect('/login'); // Redirect to login if token is not present
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach decoded user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.redirect('/login'); // Redirect to login if token is invalid
  }
};




// Increase event listener limit (optional)
EventEmitter.defaultMaxListeners = 20;

// ES module fix for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment config
dotenv.config();

// Express app setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // fallback origin
    credentials: true,
  })
);

// ------------------ EJS ROUTES ------------------

app.get('/', (req, res) => res.render('beforeLogin'));
app.get('/register', (req, res) => res.render('login/RegRole'));
app.get('/lawregister', (req, res) => res.render('login/lawRegister'));
app.get('/userregister', (req, res) => res.render('login/userRegister'));
app.get('/login', (req, res) => res.render('login/loginRole'));
app.get('/loginuser', (req, res) => res.render('login/userlogin'));
app.get('/loginlawyer', (req, res) => res.render('login/lawlogin'));
app.get('/home', (req, res) => res.render('home'));
app.get('/role', (req, res) => res.render('login/Role'));
app.get('/user', (req, res) => res.render('login/user'));
app.get('/lawyer', (req, res) => res.render('login/lawyer'));
app.get('/chatbot', (req, res) => res.render('chatbot'));
app.get('/docincp', (req, res) => res.render('DocIncp'));
app.get('/blogs', (req, res) => res.render('blogs'));
app.get('/ngo', (req, res) => res.render('Ngo'));

// ------------------ API ROUTES ------------------

// Auth routes
import registerRoute from './routes/register.route.js';
app.use("/api/auth", registerRoute);

// Legal aid routes
import legalAidRoutes from './routes/legalAid.routes.js';
app.use('/api/legal-aid', legalAidRoutes);

// Address routes
import addressRoutes from './routes/addressRoutes.js';
app.use('/api/address', addressRoutes);

// Lawyer-specific address routes (consider combining paths to avoid collision)
import lawyerAddressRoutes from './routes/lawyerAddressRoutes.js';
app.use('/api/lawyer-address', lawyerAddressRoutes); // changed to avoid route conflict

// Optional: Uncomment if using
// import lawyerRoutes from './routes/lawyerRoutes.js';
// app.use('/api/auth/lawyers', lawyerRoutes);

// Export app
import userRoutes from "./routes/lawyerINcity.js";
app.use("/api", userRoutes);

app.get('/home', verifyToken, (req, res) => {
  const user = req.user; // The user object is added by the verifyToken middleware
  if (user) {
    res.render('home', { user }); // Pass user data to 'home.ejs'
  } else {
    res.redirect('/login'); // If user not authenticated, redirect to login
  }
});


import User from "./models/User.models.js";
import Lawyer from "./models/lawyer.js";
import { protect } from "./middlewares/cityFind.js";
app.get("/lawyers", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const lawyers = await Lawyer.find({ city: user.city }); 
    // console.log(lawyers)// assuming user has a `city` field
    res.render("login/lawyers", { lawyers }); // use res.json if you’re using API + React frontend
  } catch (error) {
    res.status(500).send("Server error");
  }
});


// app.get("/dashboard", protect, async (req, res) => {
//   const user = await User.findById(req.user._id);
//   const lawyer = await Lawyer.findOne({ userId: user._id });
//   const requests = lawyer?.requests || [];

//   res.render("login/lawyerDashboard", { user, lawyer, requests: [] });
// });

app.get("/dashboard", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // console.log("Logged-in user ID:", user._id);

    const lawyer = await Lawyer.findOne({ userId: user._id });
    // console.log("Lawyer found:", lawyer);

    const requests = lawyer?.requests || [];

    res.render("login/lawyerDashboard", { user, lawyer, requests });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Server Error");
  }
});


app.post("/appointment/:lawyerId", protect, async (req, res) => {
  const { lawyerId } = req.params;

  const lawyer = await Lawyer.findById(lawyerId);
  const user = await User.findById(req.user._id);

  if (!lawyer) return res.status(404).send("Lawyer not found");

  // Add a client request to the lawyer's data
  const request = {
    clientName: user.username,
    message: "New appointment request",
    createdAt: new Date(),
  };

  lawyer.requests.push(request);
  await lawyer.save();  
});


app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
      return res.status(400).json({ error: 'Message is required' });
  }

  try {
      // Concatenate the context to the user's message
      const context = " in context of Indian laws, constitution and IPC in short with maximum 100 words and minimum of 50 words";
      const prompt = `User query: ${message}${context}`;

      // Call Gemini API
      const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
          {
              contents: [
                  {
                      parts: [
                          { text: prompt },
                      ],
                  },
              ],
          },
          {
              headers: {
                  'Content-Type': 'application/json',
              },
              params: {
                  key: process.env.GEMINI_API_KEY,
              },
          }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      res.json({ response: aiResponse });
  } catch (error) {
      console.error('Gemini API Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to get response from AI' });
  }
});


export default app;
