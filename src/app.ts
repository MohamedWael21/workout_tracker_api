import "dotenv/config";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";
import createHttpError from "http-errors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import globalErrorHandler from "./utils/global_error_handler";
import { catchAsyncError } from "./utils/helpers";
import workoutRoutes from "./routes/workout.route";
import scheduleRoutes from "./routes/schedule.route";
import rateLimit from "express-rate-limit";

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

app.use(
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1h
    message: "Too many requests from this IP, please try again in an hour!",
  }),
);

app.use("/auth", authRoutes);
app.use("/api/v1", workoutRoutes);
app.use("/api/v1", scheduleRoutes);

app.use(
  catchAsyncError(async (req: ExpressRequest) => {
    throw createHttpError.NotFound(`${req.path} resource doesn't exists`);
  }),
);

app.use(globalErrorHandler);

export default app;
