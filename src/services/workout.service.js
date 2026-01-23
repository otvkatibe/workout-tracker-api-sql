import db from '../models/index.js';

const Workout = db.workouts;

export const createWorkout = async (data) => {
    return await Workout.create(data);
};

export const getWorkoutsByUser = async (userId) => {
    return await Workout.findAll({ where: { userId } });
};

export const getWorkoutById = async (id, userId) => {
    return await Workout.findOne({ where: { id, userId } });
};

export const updateWorkout = async (id, userId, data) => {
    const workout = await getWorkoutById(id, userId);
    if (!workout) return null;
    return await workout.update(data);
};

export const deleteWorkout = async (id, userId) => {
    const workout = await getWorkoutById(id, userId);
    if (!workout) return null;
    await workout.destroy();
    return workout;
};