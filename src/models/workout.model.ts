import { model, Schema } from "mongoose";

const setSchema = new Schema<ISet>({
  duration: Number,
  reps: Number,
  weight: Number,
  equipment: String,
});

const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  note: String,
  instructions: { type: String, required: true },
  sets: [setSchema],
});

const workoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true },
  note: String,
  exercises: [exerciseSchema],
});

export const Workout = model<IWorkout>("Workout", workoutSchema);
