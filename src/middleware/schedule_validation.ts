import { z } from "zod";
import { createIdValidationMiddleware, createValidationError, createValidationMiddleware, makeSchemaOptional } from "../utils/helpers";
import {
  isScheduleBelongToTheUser,
  isScheduleExist,
  isWorkoutInScheduleBelongToTheUser,
  isWorkoutInScheduleExist,
} from "../services/schedule.service";
import { ScheduleWorkoutStatus } from "../types/enums";

const scheduleCreateBodySchema = z.object({
  workouts: z
    .array(
      z.object({
        workoutId: z.string().trim(),
        note: z.string().trim().optional(),
      }),
    )
    .min(1, "Schedule must at least include one workout"),
  date: z
    .object({
      from: z.string({ required_error: "You must specify 'from' property" }).date(),
      to: z.string({ required_error: "You must specify 'to' property" }).date(),
    })
    .refine(({ from }) => new Date(from) >= new Date(), {
      message: "Date should be in the future",
    })
    .refine(
      ({ from, to }) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        return fromDate <= toDate;
      },
      {
        message: "Start date should be smaller than end date",
      },
    ),
});

const scheduleUpdateBodySchema = z.object({
  date: z
    .object({
      from: z.string({ required_error: "You must specify 'from' property" }).date(),
      to: z.string({ required_error: "You must specify 'to' property" }).date(),
    })
    .refine(({ from }) => new Date(from) >= new Date(), {
      message: "Date should be in the future",
    })
    .refine(
      ({ from, to }) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        return fromDate <= toDate;
      },
      {
        message: "Start date should be smaller than end date",
      },
    ),
});

const scheduleWorkoutUpdateBodySchema = z.object({
  workoutId: z.string().trim(),
  note: z.string().trim().optional(),
});

export const validateScheduleCreateBody = createValidationMiddleware(scheduleCreateBodySchema);
export const validateScheduleUpdateBody = createValidationMiddleware(scheduleUpdateBodySchema);
export const validateScheduleWorkoutCreateBody = createValidationMiddleware(scheduleWorkoutUpdateBodySchema);
export const validateScheduleWorkoutUpdateBody = createValidationMiddleware(makeSchemaOptional(scheduleWorkoutUpdateBodySchema));

export const isScheduleIdValid = createIdValidationMiddleware("schedule", isScheduleExist, isScheduleBelongToTheUser);

export const isWorkoutIdInScheduleValid = createIdValidationMiddleware("workout", isWorkoutInScheduleExist, isWorkoutInScheduleBelongToTheUser);
