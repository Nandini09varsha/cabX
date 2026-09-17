import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import miscRoutes from "./routes/miscRoutes.js";
import oracleRoutes from "./routes/oracleRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((value) => value.trim())
      : true,
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "CabX API is running",
    programId: process.env.PROGRAM_ID,
    rpcUrl: process.env.SOLANA_RPC_URL,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/oracle", oracleRoutes);
app.use("/api", miscRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CabX server running on port ${PORT}`);
  console.log(`Solana RPC: ${process.env.SOLANA_RPC_URL}`);
  console.log(`Program: ${process.env.PROGRAM_ID}`);
});
