import { isWorkoutBelongToTheUser, isWorkoutExist } from "../services/workout.service";
import { createIdValidationMiddleware, createValidationMiddleware, makeSchemaOptional } from "../utils/helpers";
import { z } from "zod";

const setSchema = z
  .object({
    duration: z.number().min(5).optional(),
    reps: z.number().min(1).optional(),
    weight: z.number().min(1).optional(),
    equipment: z.string().trim().min(3).optional(),
  })
  .refine((data) => data.duration || data.reps || data.weight || data.equipment, {
    message: "At least one set property (duration, reps, weight, equipment) is required.",
  });

const exerciseSchema = z.object({
  name: z.string().trim().min(3),
  note: z.string().trim().min(3).optional(),
  instructions: z.string().trim().min(3),
  sets: z.array(setSchema).min(1, "Each exercise must have at least one set."),
});

const workoutSchema = z.object({
  name: z.string().trim().min(3),
  note: z.string().trim().min(3).optional(),
  exercises: z.array(exerciseSchema).min(1, "Workout must include at least one exercise."),
});

export const validateWorkoutCreateBody = createValidationMiddleware(workoutSchema);
export const validateWorkoutUpdateBody = createValidationMiddleware(makeSchemaOptional(workoutSchema));
export const isWorkoutIdValid = createIdValidationMiddleware("workout", isWorkoutExist, isWorkoutBelongToTheUser);
