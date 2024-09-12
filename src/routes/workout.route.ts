import { Router } from "express";
import { isWorkoutIdValid, validateWorkoutCreateBody, validateWorkoutUpdateBody } from "../middleware/workout_validation";
import * as workoutController from "../controllers/workout.controller";
import { isAuth } from "../middleware/auth";

const router = Router();

router.use(isAuth);

router.route("/workouts").post(validateWorkoutCreateBody, workoutController.createWorkout).get(workoutController.getWorkouts);

router
  .route("/workouts/:id")
  .all(isWorkoutIdValid)
  .get(workoutController.getWorkout)
  .patch(validateWorkoutUpdateBody, workoutController.updateWorkout)
  .delete(workoutController.deleteWorkout);

export default router;
