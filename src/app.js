import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import groupRoutes from "./routes/group.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// 1. Fixed CORS option key (credentials must be lowercase)
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:4200',
  credentials: true,
}));

// 2. Request body parsing
app.use(express.json());

// Add right after app.use(express.json());
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   console.log('Headers:', req.headers['content-type']);
//   console.log('Body:', req.body);
//   next();
// });

app.use(express.urlencoded({ extended: true }));

// 3. Mount API Routes
app.use("/api/auth",authRoutes);
app.use('/api/groups',groupRoutes);// Register group routes here

app.use('/api/users',userRoutes);

// 4. Health Check / Root Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Working"
  });
});

// 5. Global 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});


// 6. Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


export default app;