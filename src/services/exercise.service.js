import db from '../models/index.model.js';

const Exercise = db.exercises;
const { Op } = db.Sequelize;

export const getExercises = async (userId, filters = {}) => {
    const where = {
        isActive: true,
        [Op.or]: [
            { userId: null },
            { userId: userId }
        ]
    };

    if (filters.muscleGroup) {
        where.muscleGroup = filters.muscleGroup;
    }
    if (filters.difficulty) {
        where.difficulty = filters.difficulty;
    }
    if (filters.equipment) {
        where.equipment = { [Op.iLike]: `%${filters.equipment}%` };
    }
    if (filters.name) {
        where.name = { [Op.iLike]: `%${filters.name}%` };
    }

    return await Exercise.findAll({ where, order: [['name', 'ASC']] });
};

export const getExerciseById = async (id) => {
    return await Exercise.findByPk(id);
};

export const createExercise = async (userId, data) => {
    return await Exercise.create({
        ...data,
        userId: userId,
        isActive: true
    });
};

export const updateExercise = async (id, userId, data) => {
    const exercise = await Exercise.findOne({
        where: { id, userId }
    });

    if (!exercise) return null;

    return await exercise.update(data);
};

export const deleteExercise = async (id, userId) => {
    const exercise = await Exercise.findOne({
        where: { id, userId }
    });

    if (!exercise) return null;

    await exercise.update({ isActive: false });
    return exercise;
};

export const importFromExternalApi = async (exercisesData, userId = null) => {
    const createdExercises = [];

    for (const exerciseData of exercisesData) {
        const existingExercise = await Exercise.findOne({
            where: {
                name: exerciseData.name,
                [Op.or]: [{ userId: null }, { userId: userId }]
            }
        });

        if (!existingExercise) {
            const muscleGroupMap = {
                'chest': 'chest',
                'back': 'back',
                'shoulders': 'shoulders',
                'biceps': 'arms',
                'triceps': 'arms',
                'forearms': 'arms',
                'quadriceps': 'legs',
                'hamstrings': 'legs',
                'calves': 'legs',
                'glutes': 'legs',
                'abdominals': 'core',
                'lower_back': 'core',
                'middle_back': 'back',
                'neck': 'shoulders',
                'traps': 'back',
                'lats': 'back',
                'cardio': 'cardio'
            };

            const difficultyMap = {
                'beginner': 'beginner',
                'intermediate': 'intermediate',
                'expert': 'advanced'
            };

            const newExercise = await Exercise.create({
                name: exerciseData.name,
                muscleGroup: muscleGroupMap[exerciseData.muscle] || 'full_body',
                equipment: exerciseData.equipment || 'bodyweight',
                difficulty: difficultyMap[exerciseData.difficulty] || 'beginner',
                instructions: exerciseData.instructions,
                externalId: exerciseData.name.toLowerCase().replace(/\s+/g, '-'),
                userId: userId,
                isActive: true
            });

            createdExercises.push(newExercise);
        }
    }

    return createdExercises;
};
