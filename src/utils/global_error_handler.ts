import { MONGO_DB_UNIQUE_FIELD_ERROR_CODE } from "./../constants/index";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export default function (err: any, _1: Request, res: Response, _2: NextFunction) {
  // console.log(err);

  if (!createHttpError.isHttpError(err)) {
    if (err.code === MONGO_DB_UNIQUE_FIELD_ERROR_CODE) err = createHttpError(409, `This ${Object.keys(err.keyPattern)[0]} is used`);
    else err = process.env.NODE_ENV === "development" ? err : createHttpError.InternalServerError("Something went wrong");
  }
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      validationErrors: err.headers,
    },
  });
}
