import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "./jwt";
import { ZodError } from "zod";
import createHttpError from "http-errors";
export const catchAsyncError = (handleFunc: AsyncRequestHandler) => (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  Promise.resolve(handleFunc(req, res, next)).catch(next);
};

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(hashedPassword: string, password: string) {
  const isCorrect = await bcrypt.compare(password, hashedPassword);
  return isCorrect;
}

export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhdwy])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    case "w":
      return value * 60 * 60 * 24 * 7;
    case "y":
      return value * 60 * 60 * 24 * 365;
    default:
      throw new Error(`Unsupported duration unit: ${unit}`);
  }
}

export async function createTokenSet(session: Session) {
  const accessToken = await createAccessToken(session);
  const refreshToken = await createRefreshToken(session);
  return { accessToken, refreshToken };
}

export function sendResponse(res: ExpressResponse, statusCode: number, payload?: object, metaData?: object) {
  res.status(statusCode).json({
    success: true,
    ...metaData,
    data: payload,
  });
}

export function setCookie(res: ExpressResponse, name: string, value: string, maxAge: number) {
  res.cookie(name, value, {
    maxAge,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function createValidationError(error: ZodError) {
  const messages: { [key: string]: string }[] = [];

  for (const {
    message,
    path: [pathName],
  } of error.errors) {
    messages.push({ [pathName]: message });
  }

  const validationError = createHttpError(422, "Validation Error", { headers: messages });

  return validationError;
}
