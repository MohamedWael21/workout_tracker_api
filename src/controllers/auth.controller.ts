import { catchAsyncError, sendResponse, setCookie } from "../utils/helpers";
import * as authService from "../services/auth.service";
import { ACCESS_TOKEN_COOKIE_MAX_AGE } from "../constants";

export const signup = catchAsyncError(async (req, res) => {
  const { newUser, refreshToken, accessToken } = await authService.signup(req.body);
  setCookie(res, "accessToken", accessToken, ACCESS_TOKEN_COOKIE_MAX_AGE);
  sendResponse(res, 201, { refreshToken, newUser });
});

export const login = catchAsyncError(async (req, res) => {
  const { user, refreshToken, accessToken } = await authService.login(req.body);
  setCookie(res, "accessToken", accessToken, ACCESS_TOKEN_COOKIE_MAX_AGE);
  sendResponse(res, 201, { refreshToken, user });
});

export const refreshToken = catchAsyncError(async (req, res) => {
  const { refreshToken } = req.body;
  const { accessToken, newRefreshToken } = await authService.refreshToken(refreshToken);
  setCookie(res, "accessToken", accessToken, ACCESS_TOKEN_COOKIE_MAX_AGE);
  sendResponse(res, 201, { refreshToken: newRefreshToken });
});

export const logout = catchAsyncError(async (req, res) => {
  await authService.logout(req.session);
  res.clearCookie("accessToken");
  sendResponse(res, 204);
});
