import { catchAsyncError, sendResponse } from "../utils/helpers";
import * as scheduleService from "../services/schedule.service";
import { Types } from "mongoose";

export const createSchedule = catchAsyncError(async (req, res) => {
  const scheduleData: ISchedule = {
    date: req.body.date,
    userId: new Types.ObjectId(req.session.userId),
    workouts: req.body.workouts,
  };
  const newSchedule = await scheduleService.createSchedule(scheduleData);

  sendResponse(res, 201, { schedule: newSchedule });
});

export const getSchedules = catchAsyncError(async (req, res) => {
  const {
    schedules,
    currentPage,
    totalSchedules: totalItems,
    totalPages,
    SchedulesPerPage: itemsPerPage,
  } = await scheduleService.getSchedules(req.session.userId, req.query as QueryString);

  sendResponse(res, 200, { schedules, currentPage, totalSchedules: totalItems, totalPages, SchedulesPerPage: itemsPerPage });
});

export const getSchedule = catchAsyncError(async (req, res) => {
  const schedule = await scheduleService.getSchedule(req.params.id);

  sendResponse(res, 200, { schedule: schedule });
});

export const updateSchedule = catchAsyncError(async (req, res) => {
  const newSchedule = await scheduleService.updateSchedule(req.params.id, req.body);

  sendResponse(res, 200, { schedule: newSchedule });
});

export const deleteSchedule = catchAsyncError(async (req, res) => {
  await scheduleService.deleteSchedule(req.params.id);

  sendResponse(res, 204);
});

export const updateWorkoutInSchedule = catchAsyncError(async (req, res) => {
  const updatedSchedule = await scheduleService.updateWorkoutInSchedule(req.params.id, req.body);
  sendResponse(res, 200, { updatedSchedule });
});

export const addWorkoutInSchedule = catchAsyncError(async (req, res) => {
  const updatedSchedule = await scheduleService.addWorkoutInSchedule(req.params.id, req.body);
  sendResponse(res, 200, { updatedSchedule });
});

export const deleteWorkoutInSchedule = catchAsyncError(async (req, res) => {
  await scheduleService.deleteWorkoutInSchedule(req.params.id);
  sendResponse(res, 204);
});
