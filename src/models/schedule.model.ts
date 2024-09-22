import { Schema, model } from "mongoose";
import { ScheduleWorkoutStatus } from "../types/enums";
import createHttpError from "http-errors";

const scheduleDateSchema = new Schema(
  {
    from: { type: Date, required: true, unique: true },
    to: { type: Date, required: true, unique: true },
  },
  {
    _id: false,
    toObject: {
      transform: (data) => {
        const formattedFrom = data.from.toISOString().split("T")[0];
        const formattedTo = data.from.toISOString().split("T")[0];
        return { from: formattedFrom, to: formattedTo };
      },
    },
  },
);

const scheduleWorkoutSchema = new Schema(
  {
    workoutId: { type: Schema.Types.ObjectId, ref: "Workout", required: true },
    status: { type: String, enum: ScheduleWorkoutStatus, default: ScheduleWorkoutStatus.UNFINISHED },
    note: { type: String },
  },
  { toObject: { versionKey: false } },
);

const scheduleSchema = new Schema(
  {
    date: { type: scheduleDateSchema, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workouts: { type: [scheduleWorkoutSchema], required: true },
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
    },
  },
);

scheduleSchema.pre("save", async function (next) {
  const {
    date: { from, to },
    userId,
  } = this;

  const docNum = await Schedule.find({
    userId,
    $and: [{ "date.to": { $gte: from } }, { "date.from": { $lte: to } }],
  }).countDocuments();

  if (docNum > 0) {
    return next(createHttpError.Conflict("Schedule overlaps with existing schedules."));
  }

  next();
});

scheduleSchema.pre("findOneAndUpdate", async function (next) {
  const doc = await this.model.findOne(this.getQuery());

  const data = this.getUpdate() as ISchedule;

  if (!data.date) {
    next();
  }

  const docNum = await Schedule.find({
    userId: doc.userId,
    $and: [{ "date.to": { $gte: data.date.from } }, { "date.from": { $lte: data.date.to } }],
  }).countDocuments();

  if (docNum > 0) {
    return next(createHttpError.Conflict("Schedule overlaps with existing schedules."));
  }

  next();
});

export const Schedule = model<ISchedule>("Schedule", scheduleSchema);
