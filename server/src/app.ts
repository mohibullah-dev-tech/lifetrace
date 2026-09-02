import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import memoryRoutes from "./routes/memory.routes.js";
import userRoutes from "./routes/user.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";
import insightsRoutes from "./routes/insights.routes.js";
import streakRoutes from "./routes/streak.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "LifeTrace API is healthy",
  });
});
app.use("/api/v1/auth", authRoutes);
app.use(errorMiddleware);
app.use(
  "/api/v1/memories",
  memoryRoutes
);
app.use(
  "/api/v1/users",
  userRoutes
);
app.use(
  "/api/v1/timeline",
  timelineRoutes
);
app.use(
  "/api/v1/insights",
  insightsRoutes
);
app.use(
  "/api/v1/streak",
  streakRoutes
);
app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);
app.use(
  "/api/v1/attachments",
  attachmentRoutes
);
export default app;