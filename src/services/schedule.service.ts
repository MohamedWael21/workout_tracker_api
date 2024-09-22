import { Schedule } from "../models/schedule.model";
import Paginator from "../utils/paginator";

export async function createSchedule(schedule: ISchedule) {
  const newSchedule = new Schedule(schedule);

  await newSchedule.save();

  return newSchedule.toObject();
}

export async function getSchedules(userId: string, queryString: QueryString) {
  const query = Schedule.find({ userId });

  const paginator = new Paginator<any>(query, queryString);

  const { itemsPerPage, currentPage, totalItems, totalPages } = await paginator.paginate();

  const schedules = await paginator.query;

  const transformedSchedules = schedules.map((schedule) => schedule.toObject());

  return { schedules: transformedSchedules, currentPage, totalSchedules: totalItems, totalPages, SchedulesPerPage: itemsPerPage };
}

export async function getSchedule(id: string) {
  const schedule = await Schedule.findById(id);
  return schedule?.toObject();
}

export async function updateSchedule(id: string, ScheduleData: ISchedule) {
  const updatedSchedule = await Schedule.findByIdAndUpdate(id, ScheduleData, { new: true, runValidators: true });
  return updatedSchedule;
}

export async function deleteSchedule(id: string) {
  await Schedule.findByIdAndDelete(id);
}

export async function isScheduleExist(id: string) {
  const docNum = await Schedule.find({
    _id: id,
  }).countDocuments();

  return docNum > 0;
}

export async function isScheduleBelongToTheUser(scheduleId: string, userId: string) {
  const scheduleNum = await Schedule.find({
    userId,
    _id: scheduleId,
  }).countDocuments();

  return scheduleNum > 0;
}

export async function isWorkoutInScheduleExist(workoutId: string) {
  const scheduleNum = await Schedule.find({
    "workouts._id": workoutId,
  }).countDocuments();

  return scheduleNum > 0;
}

export async function isWorkoutInScheduleBelongToTheUser(workoutId: string, userId: string) {
  const scheduleNum = await Schedule.find({
    "workouts._id": workoutId,
    userId,
  }).countDocuments();

  return scheduleNum > 0;
}

export async function updateWorkoutInSchedule(workoutId: string, updatedWorkout: Partial<ScheduleWorkout>) {
  const updatedFields = Object.keys(updatedWorkout).reduce<{ [key: string]: any }>((acc, key) => {
    acc[`workouts.$.${key}`] = updatedWorkout[key as keyof ScheduleWorkout];
    return acc;
  }, {});

  const updatedSchedule = await Schedule.findOneAndUpdate({ "workouts._id": workoutId }, { $set: updatedFields }, { new: true });

  return updatedSchedule?.toObject();
}

export async function addWorkoutInSchedule(scheduleId: string, newWorkout: ScheduleWorkout) {
  const updatedSchedule = await Schedule.findOneAndUpdate({ _id: scheduleId }, { $push: { workouts: newWorkout } }, { new: true });
  return updatedSchedule?.toObject();
}

export async function deleteWorkoutInSchedule(workoutId: string) {
  await Schedule.findOneAndUpdate({ "workouts._id": workoutId }, { $pull: { workouts: { _id: workoutId } } }, { new: true });
}
