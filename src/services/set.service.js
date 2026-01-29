import db from '../models/index.model.js';

const WorkoutSet = db.workoutSets;
const Workout = db.workouts;
const Exercise = db.exercises;

export const getSetsByWorkout = async (workoutId, userId) => {
    const workout = await Workout.findOne({
        where: { id: workoutId, userId }
    });

    if (!workout) {
        return null;
    }

    return WorkoutSet.findAll({
        where: { workoutId },
        include: [
            {
                model: Exercise,
                as: 'exercise',
                attributes: ['id', 'name', 'muscleGroup', 'equipment']
            }
        ],
        order: [['setNumber', 'ASC']]
    });
};

export const getSetById = async (setId, userId) => {
    const set = await WorkoutSet.findByPk(setId, {
        include: [
            {
                model: Workout,
                as: 'workout',
                attributes: ['id', 'userId']
            },
            {
                model: Exercise,
                as: 'exercise',
                attributes: ['id', 'name', 'muscleGroup']
            }
        ]
    });

    if (!set || set.workout.userId !== userId) {
        return null;
    }

    return set;
};

export const createSet = async (workoutId, userId, data) => {
    const workout = await Workout.findOne({
        where: { id: workoutId, userId }
    });

    if (!workout) {
        return null;
    }

    const exercise = await Exercise.findByPk(data.exerciseId);
    if (!exercise) {
        return null;
    }

    const lastSet = await WorkoutSet.findOne({
        where: { workoutId },
        order: [['setNumber', 'DESC']]
    });

    const setNumber = lastSet ? lastSet.setNumber + 1 : 1;

    return WorkoutSet.create({
        workoutId,
        exerciseId: data.exerciseId,
        setNumber,
        reps: data.reps,
        weight: data.weight,
        rpe: data.rpe || null,
        notes: data.notes || null
    });
};

export const updateSet = async (setId, userId, data) => {
    const set = await getSetById(setId, userId);

    if (!set) {
        return null;
    }

    if (data.exerciseId) {
        const exercise = await Exercise.findByPk(data.exerciseId);
        if (!exercise) {
            return null;
        }
    }

    return set.update(data);
};

export const deleteSet = async (setId, userId) => {
    const set = await getSetById(setId, userId);

    if (!set) {
        return null;
    }

    await set.destroy();
    return set;
};

export const bulkCreateSets = async (workoutId, userId, setsArray) => {
    const workout = await Workout.findOne({
        where: { id: workoutId, userId }
    });

    if (!workout) {
        return null;
    }

    const lastSet = await WorkoutSet.findOne({
        where: { workoutId },
        order: [['setNumber', 'DESC']]
    });

    let currentSetNumber = lastSet ? lastSet.setNumber + 1 : 1;
    const createdSets = [];

    for (const setData of setsArray) {
        const exercise = await Exercise.findByPk(setData.exerciseId);
        if (!exercise) {
            continue;
        }

        const newSet = await WorkoutSet.create({
            workoutId,
            exerciseId: setData.exerciseId,
            setNumber: currentSetNumber++,
            reps: setData.reps,
            weight: setData.weight,
            rpe: setData.rpe || null,
            notes: setData.notes || null
        });

        createdSets.push(newSet);
    }

    return createdSets;
};
