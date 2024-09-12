import { z } from "zod";
import { catchAsyncError, createValidationError, createValidationMiddleware } from "../utils/helpers";

const signupPayloadSchema = z.object({
  fullName: z
    .string({
      required_error: "fullName is Required",
      invalid_type_error: "fullName must be string",
    })
    .trim(),
  email: z
    .string({
      required_error: "email is Required",
      invalid_type_error: "email must be string",
    })
    .email(),
  password: z
    .string({
      required_error: "password is Required",
      invalid_type_error: "password must be string",
    })
    .trim()
    .min(8, "Password must be at least 8 characters"),
});

const loginPayloadSchema = z.object({
  email: z
    .string({
      required_error: "email is Required",
      invalid_type_error: "email must be string",
    })
    .email(),
  password: z
    .string({
      required_error: "password is Required",
      invalid_type_error: "password must be string",
    })
    .trim(),
});

const refreshTokenPayloadSchema = z.object({
  refreshToken: z
    .string({
      required_error: "refreshToken is Required",
      invalid_type_error: "refreshToken must be string",
    })
    .trim(),
});

export const validateSignupBody = createValidationMiddleware(signupPayloadSchema);

export const validateLoginBody = createValidationMiddleware(loginPayloadSchema);

export const validateRefreshTokenBody = createValidationMiddleware(refreshTokenPayloadSchema);
