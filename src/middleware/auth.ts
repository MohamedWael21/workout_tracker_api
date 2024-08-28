import createHttpError from "http-errors";
import { catchAsyncError } from "../utils/helpers";
import { verifyAccessToken } from "../utils/jwt";

export const isAuth = catchAsyncError(async (req, _, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw createHttpError.Unauthorized("Access token missing");
  }

  const session = await verifyAccessToken(accessToken);

  req.session = session;
  next();
});
