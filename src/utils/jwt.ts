import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import createHttpError from "http-errors";
import { redisClient } from "../config/redis_db";
import { parseDuration } from "./helpers";
import { JWT_ACCESS_TOKEN_EXPIRE, JWT_REFRESH_TOKEN_EXPIRE } from "../constants";

function checkEnvVariable(variable: string | undefined, name: string): void {
  if (!variable) {
    throw new Error(`Environment variable ${name} is not set.`);
  }
}

export function createAccessToken(payload: Session): Promise<string> {
  return new Promise((resolve, reject) => {
    checkEnvVariable(process.env.JWT_ACCESS_TOKEN_SECRET, "JWT_ACCESS_TOKEN_SECRET");
    jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET!, { expiresIn: JWT_ACCESS_TOKEN_EXPIRE }, (err, token) => {
      if (err) {
        reject(createHttpError.InternalServerError(err.message));
      } else {
        resolve(token as string);
      }
    });
  });
}

export async function verifyAccessToken(token: string): Promise<Session> {
  checkEnvVariable(process.env.JWT_ACCESS_TOKEN_SECRET, "JWT_ACCESS_TOKEN_SECRET");
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as Session;
    return decoded;
  } catch (error) {
    let message = "Invalid access token";
    if (error instanceof TokenExpiredError) {
      message = "Access token expired";
    } else if (error instanceof JsonWebTokenError) {
      message = "Access token tampered with or malformed";
    }
    throw createHttpError.Unauthorized(message);
  }
}

export function createRefreshToken(payload: Session): Promise<string> {
  return new Promise((resolve, reject) => {
    checkEnvVariable(process.env.JWT_REFRESH_TOKEN_SECRET, "JWT_REFRESH_TOKEN_SECRET");
    jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET!, { expiresIn: JWT_REFRESH_TOKEN_EXPIRE }, async (err, token) => {
      if (err) {
        reject(createHttpError.InternalServerError(err.message));
        return;
      }
      if (!token) {
        reject(createHttpError.InternalServerError("Failed to create refresh token"));
        return;
      }

      try {
        const expireTime = parseDuration(JWT_REFRESH_TOKEN_EXPIRE);
        await redisClient.setEx(`auth:${payload.userId}`, expireTime, token);
        resolve(token);
      } catch (redisErr: any) {
        reject(createHttpError.InternalServerError(redisErr.message));
      }
    });
  });
}

export async function verifyRefreshToken(token: string): Promise<Session> {
  checkEnvVariable(process.env.JWT_REFRESH_TOKEN_SECRET, "JWT_REFRESH_TOKEN_SECRET");
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!) as Session;
    const storedRefreshToken = await redisClient.get(`auth:${decoded.userId}`);
    if (!storedRefreshToken || storedRefreshToken !== token) {
      throw new Error("Stored refresh token does not match");
    }
    return decoded;
  } catch (error: any) {
    let message = "Invalid refresh token";
    if (error instanceof TokenExpiredError) {
      message = "Refresh token expired";
    } else if (error instanceof JsonWebTokenError) {
      message = "Refresh token tampered with or malformed";
    } else if (error.message === "Stored refresh token does not match") {
      message = "Refresh token mismatch - possible unauthorized access";
    }
    throw createHttpError.Unauthorized(message);
  }
}

export async function removeStoredRefreshToken(session: Session) {
  await redisClient.del(`auth:${session.userId}`);
}
