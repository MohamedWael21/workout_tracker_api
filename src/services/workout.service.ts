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
  return workout;
}

export async function updateWorkout(id: number, workoutData: IWorkout) {
  const updatedWorkout = await Workout.findByIdAndUpdate(id, workoutData, { new: true });
  return updatedWorkout;
}

export async function deleteWorkout(id: number) {
  await Workout.findByIdAndDelete(id);
}

export async function isWorkoutExist(id: string) {
  const workoutNum = await Workout.findById(id).countDocuments();
  return workoutNum > 0;
}
