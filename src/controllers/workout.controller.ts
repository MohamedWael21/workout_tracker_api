import { catchAsyncError, sendResponse } from "../utils/helpers";
import * as workoutService from "../services/workout.service";

export const createWorkout = catchAsyncError(async (req, res) => {
  const newWorkout = await workoutService.createWorkout(req.body, req.session.userId)!;
  sendResponse(res, 201, { workout: newWorkout.toObject() });
});

export const getWorkouts = catchAsyncError(async (req, res) => {
  const { workouts, currentPage, totalPages, totalWorkouts, workoutsPerPage } = await workoutService.getWorkouts(
    req.session.userId,
    req.query as QueryString,
  );

  sendResponse(res, 200, { workouts, currentPage, totalPages, totalWorkouts, workoutsPerPage });
});

export const getWorkout = catchAsyncError(async (req, res) => {
  const workout = await workoutService.getWorkout(req.params.id);
  sendResponse(res, 200, { workout: workout?.toObject() });
});

export const updateWorkout = catchAsyncError(async (req, res) => {
  const updatedWorkout = await workoutService.updateWorkout(req.params.id, req.body);
  sendResponse(res, 200, { updatedWorkout: updatedWorkout?.toObject() });
});

export const deleteWorkout = catchAsyncError(async (req, res) => {
  await workoutService.deleteWorkout(req.params.id);
  sendResponse(res, 204);
});
