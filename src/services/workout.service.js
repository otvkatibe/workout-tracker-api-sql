import db from '../models/index.model.js';

const Workout = db.workouts;

export const createWorkout = async (data) => Workout.create(data);

export const getWorkoutsByUser = async (userId) => Workout.findAll({ where: { userId } });

export const getWorkoutById = async (id, userId) => Workout.findOne({ where: { id, userId } });

export const updateWorkout = async (id, userId, data) => {
    const workout = await getWorkoutById(id, userId);
    if (!workout) {
        return null;
    }
    return workout.update(data);
};

export const deleteWorkout = async (id, userId) => {
    const workout = await getWorkoutById(id, userId);
    if (!workout) {
        return null;
    }
    await workout.destroy();
    return workout;
};
