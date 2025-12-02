const express = require("express");
const cors = require("cors");
const Route = require("./routes/authRoute.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes API
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auth
app.use("/api/auth", require("./routes/authRoute.js"));

app.listen(3000, () => {
  console.log(`Server started on PORT http://localhost:3000`);
});
