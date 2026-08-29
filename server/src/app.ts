import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";

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

app.use(errorMiddleware);
export default app;