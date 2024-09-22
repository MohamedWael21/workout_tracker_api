import { Document, Types } from "mongoose";
import { ScheduleWorkoutStatus } from "./enums";

declare global {
  interface IUser {
    fullName: string;
    email: string;
    password: string;
  }

  interface IWorkout {
    name: string;
    note?: string;
    exercises: IExercise[];
    userId: Types.ObjectId;
  }

  interface IExercise {
    name: string;
    note?: string;
    sets: ISet[];
    instructions: string;
  }

  interface ISet {
    duration?: number; // in seconds
    reps?: number;
    weight?: number; // in kg
    equipment?: string;
  }

  interface ISchedule {
    date: ScheduleDate;
    userId: Types.ObjectId;
    workouts: ScheduleWorkout[];
  }

  interface ScheduleDate {
    from: Date;
    to: Date;
  }

  interface ScheduleWorkout {
    workoutId: Types.ObjectId;
    status: ScheduleWorkoutStatus;
    note?: string;
  }
}
