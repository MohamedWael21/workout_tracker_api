interface IUser {
  fullName: string;
  email: string;
  password: string;
}

interface IWorkout {
  name: string;
  note?: string;
  exercises: IExercise[];
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
