import { model, Schema } from "mongoose";

const setSchema = new Schema<ISet>(
  {
    duration: Number,
    reps: Number,
    weight: Number,
    equipment: String,
  },
  { _id: false },
);

const exerciseSchema = new Schema<IExercise>(
  {
    name: { type: String, required: true },
    note: String,
    instructions: { type: String, required: true },
    sets: [setSchema],
  },
  { _id: false },
);

const workoutSchema = new Schema<IWorkout>(
  {
    name: { type: String, required: true },
    note: String,
    exercises: [exerciseSchema],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { toObject: { versionKey: false }, timestamps: true },
);

export const Workout = model<IWorkout>("Workout", workoutSchema);
