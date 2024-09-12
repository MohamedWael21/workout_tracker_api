import createHttpError from "http-errors";
import { User } from "../models/user.model";
import { comparePassword, createTokenSet } from "../utils/helpers";
import { removeStoredRefreshToken, verifyRefreshToken } from "../utils/jwt";

export async function signup({ fullName, email, password }: IUser) {
  const newUser = new User();
  newUser.fullName = fullName;
  newUser.email = email;
  newUser.password = password;
  await newUser.save();

  const userObject = newUser.toObject();

  const { accessToken, refreshToken } = await createTokenSet({ userId: newUser.id });

  return { newUser: userObject, accessToken, refreshToken };
}

export async function login({ email, password }: IUser) {
  const user = await User.findOne({ email });

  let isValidCredential = false;

  if (user) {
    isValidCredential = await comparePassword(user.password, password);
  }

  if (!isValidCredential) {
    throw createHttpError.Unauthorized("Invalid email or password");
  }

  const { accessToken, refreshToken } = await createTokenSet({ userId: user?.id });

  return { user: user?.toObject(), accessToken, refreshToken };
}

export async function refreshToken(refreshToken: string) {
  const session = await verifyRefreshToken(refreshToken);

  const { accessToken, refreshToken: newRefreshToken } = await createTokenSet({ userId: session.userId });

  return { accessToken, newRefreshToken };
}

export async function logout(session: Session) {
  await removeStoredRefreshToken(session);
}
