import { Router } from "express";
import { isAuth } from "../middleware/auth";
import * as scheduleController from "../controllers/schedule.controller";
import {
  isScheduleIdValid,
  isWorkoutIdInScheduleValid,
  validateScheduleCreateBody,
  validateScheduleUpdateBody,
  validateScheduleWorkoutCreateBody,
  validateScheduleWorkoutUpdateBody,
} from "../middleware/schedule_validation";

const router = Router();

router.use(isAuth);

router.route("/schedules").get(scheduleController.getSchedules).post(validateScheduleCreateBody, scheduleController.createSchedule);

router
  .route("/schedules/:id")
  .all(isScheduleIdValid)
  .get(scheduleController.getSchedule)
  .patch(validateScheduleUpdateBody, scheduleController.updateSchedule)
  .delete(scheduleController.deleteSchedule);

router
  .route("/schedules/workouts/:id")
  .all(isWorkoutIdInScheduleValid)
  .patch(validateScheduleWorkoutUpdateBody, scheduleController.updateWorkoutInSchedule)
  .delete(scheduleController.deleteWorkoutInSchedule);

router.route("/schedules/:id/workouts").post(isScheduleIdValid, validateScheduleWorkoutCreateBody, scheduleController.addWorkoutInSchedule);

export default router;
