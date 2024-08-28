import { z } from "zod";
import { catchAsyncError, createValidationError } from "../utils/helpers";

export const validateSignupBody = catchAsyncError(async (req, _, next) => {
  const validationSchema = z.object({
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

  const { error, data } = validationSchema.safeParse(req.body);

  if (error) {
    next(createValidationError(error));
  }

  req.body = data;
  next();
});

export const validateLoginBody = catchAsyncError(async (req, _, next) => {
  const validationSchema = z.object({
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

  const { error, data } = validationSchema.safeParse(req.body);

  if (error) {
    next(createValidationError(error));
  }

  req.body = data;
  next();
});

export const validateRefreshTokenBody = catchAsyncError(async (req, _, next) => {
  const validationSchema = z.object({
    refreshToken: z
      .string({
        required_error: "refreshToken is Required",
        invalid_type_error: "refreshToken must be string",
      })
      .trim(),
  });

  const { error, data } = validationSchema.safeParse(req.body);

  if (error) {
    next(createValidationError(error));
  }
  req.body = data;
  next();
});
