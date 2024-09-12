import { Types } from "mongoose";
import { Workout } from "./../models/workout.model";

export async function createWorkout(workoutData: IWorkout, userId: string) {
  const newWorkout = new Workout(workoutData);
  newWorkout.userId = new Types.ObjectId(userId);
  await newWorkout.save();

  return newWorkout;
}

export async function getWorkouts(userId: string) {
  const workouts = await Workout.find({ userId });
  return workouts.map((workout) => workout.toObject());
}

export async function getWorkout(id: string) {
  const workout = await Workout.findById(id);
  return workout;
}

export async function updateWorkout(id: string, workoutData: IWorkout) {
  const updatedWorkout = await Workout.findByIdAndUpdate(id, workoutData, { new: true });
  return updatedWorkout;
}

export async function deleteWorkout(id: string) {
  await Workout.findByIdAndDelete(id);
}

export async function isWorkoutExist(id: string) {
  const workoutNum = await Workout.findById(id).countDocuments();
  return workoutNum > 0;
}

export async function isWorkoutBelongToTheUser(workoutId: string, userId: string) {
  const workoutNum = await Workout.find({
    userId,
    _id: workoutId,
  }).countDocuments();

  return workoutNum > 0;
}
