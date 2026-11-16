import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

// Enable CORS for frontend PWA
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "apikey"],
  })
);

app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({
    app: "Lokarasa API",
    description: "Backend Web Service untuk Aplikasi Eksplorasi & Rekomendasi Tempat Makan Berbasis Mobile",
    version: "1.0.0",
    status: "Active & Running",
    endpoints: {
      categories: "/api/categories",
      restaurants: "/api/restaurants",
      reviews: "/api/reviews",
      health: "/api/health"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Main API Endpoints
app.use("/api/categories", categoryRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    error: "Terjadi kesalahan internal pada server",
    message: err.message,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Lokarasa Server running on port ${port}`);
});

export default app;
