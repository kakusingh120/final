import app from "./app.js";
import mongoose from "mongoose";
import dbconnect from "./db/index.js"
const PORT=8000;
dbconnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });