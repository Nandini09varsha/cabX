import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log("---- RESPONSE ----");
    console.log("METHOD:", req.method);
    console.log("URL:", req.url);
    console.log("STATUS:", res.statusCode);
    console.log("ALLOW-ORIGIN:", res.getHeader("Access-Control-Allow-Origin"));
    console.log(
      "ALLOW-METHODS:",
      res.getHeader("Access-Control-Allow-Methods"),
    );
    console.log(
      "ALLOW-HEADERS:",
      res.getHeader("Access-Control-Allow-Headers"),
    );
    console.log("------------------");
  });

  next();
});
connectDB();

console.log("CORS CONFIG LOADED");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options(
  /.*/,
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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
