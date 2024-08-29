import createHttpError from "http-errors";
import { Workout } from "./../models/workout.model";

export async function createWorkout(workoutData: IWorkout) {
  const newWorkout = new Workout(workoutData);
  await newWorkout.save();

  return newWorkout;
}

export async function getWorkouts() {
  const workouts = await Workout.find();

  return workouts;
}

export async function getWorkout(id: number) {
  const workout = await Workout.findById(id);

  if (!workout) {
    throw createHttpError.NotFound("No workout with this id");
  }

  return workout;
}

export async function updateWorkout(id: number, workoutData: IWorkout) {
  const updatedWorkout = await Workout.findByIdAndUpdate(id, workoutData, { new: true });

  if (!updatedWorkout) {
    throw createHttpError.NotFound("No workout with this id");
  }
  return updatedWorkout;
}

export async function deleteWorkout(id: number) {
  const isDelete = await Workout.findByIdAndDelete(id);
  if (!isDelete) {
    throw createHttpError.NotFound("No workout with this id");
  }
}
