import { z } from "zod";
import { catchAsyncError, createValidationError, createValidationMiddleware } from "../utils/helpers";

const signupPayloadSchema = z.object({
  fullName: z.string().trim(),
  email: z.string().email(),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

const loginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().trim(),
});

const refreshTokenPayloadSchema = z.object({
  refreshToken: z.string().trim(),
});

export const validateSignupBody = createValidationMiddleware(signupPayloadSchema);

export const validateLoginBody = createValidationMiddleware(loginPayloadSchema);

export const validateRefreshTokenBody = createValidationMiddleware(refreshTokenPayloadSchema);
