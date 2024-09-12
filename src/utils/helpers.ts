import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "./jwt";
import { ZodError, ZodObject, ZodRawShape, ZodSchema } from "zod";
import createHttpError from "http-errors";
import { Types } from "mongoose";
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

  for (const { message, path } of error.errors) {
    const pathName = path[0] ?? "error";
    messages.push({ [pathName]: message });
  }

  const validationError = createHttpError(422, "Validation Error", { headers: messages });

  return validationError;
}

export function createValidationMiddleware(validationSchema: ZodSchema) {
  return catchAsyncError(async (req, _, next) => {
    const result = validationSchema.safeParse(req.body);

    if (!result.success) {
      return next(createValidationError(result.error));
    }

    req.body = result.data;
    next();
  });
}

export function makeSchemaOptional<T extends ZodRawShape>(schema: ZodObject<T>) {
  return schema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });
}

export function createIdValidationMiddleware(
  resourceName: string,
  isExist: (id: string) => Promise<boolean>,
  isBelongToUser: (resourceId: string, userId: string) => Promise<boolean>,
) {
  return catchAsyncError(async (req, _, next) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return next(createHttpError.BadRequest("Not a valid ID"));
    }

    const isDocExist = await isExist(req.params.id);

    if (!isDocExist) {
      return next(createHttpError.NotFound(`${resourceName} not found`));
    }

    const isAuthorized = await isBelongToUser(req.params.id, req.session.userId);

    if (!isAuthorized) {
      return next(createHttpError.Forbidden("You do not have access to this resource"));
    }

    next();
  });
}
