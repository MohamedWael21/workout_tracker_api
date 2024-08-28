import mongoose, { Schema } from "mongoose";
import { hashPassword } from "../utils/helpers";

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

userSchema.set("toObject", {
  transform: (_1, ret, _2) => {
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
