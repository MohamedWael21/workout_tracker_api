import "dotenv/config";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./utils/global_error_handler";
import createHttpError from "http-errors";
import { catchAsyncError } from "./utils/helpers";
const app = express();

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(
  catchAsyncError(async (req: ExpressRequest) => {
    throw createHttpError.NotFound(`${req.path} resource doesn't exists`);
  }),
);

app.use(globalErrorHandler);

export default app;
