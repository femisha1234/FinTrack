require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");

const app = express();
connectDB();

app.use(express.json());

const allowedOrigins = ['https://fin-track-3stn898y4-femisha1234s-projects.vercel.app'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow request
      } else {
        callback(new Error('Not allowed by CORS')); // Block request
      }
    },
    credentials: true, // Allow cookies and authentication headers
  })
);


app.use("/auth", require("./routes/authRoutes"));
app.use("/transactions", require("./routes/transactionRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use('/api/savings', require('./routes/savingsRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use("/api/payment", require('./routes/paymentRoutes'));
app.get("/", (req, res) => res.send("FinTrack Backend Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
