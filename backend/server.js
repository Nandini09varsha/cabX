import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CabX API is running 🚕",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api/driver", driverRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CabX server running on port ${PORT}`);
});
