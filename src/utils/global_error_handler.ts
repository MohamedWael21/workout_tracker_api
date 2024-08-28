import { MONGO_DB_UNIQUE_FIELD_ERROR_CODE } from "./../constants/index";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export default function (err: any, _1: Request, res: Response, _2: NextFunction) {
  if (!createHttpError.isHttpError(err)) {
    if (err.code === MONGO_DB_UNIQUE_FIELD_ERROR_CODE) err = createHttpError(422, "This Email is used");
    else err = createHttpError.InternalServerError("Something went wrong");
  }
  return res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message,
      validationErrors: err.headers,
    },
  });
}
