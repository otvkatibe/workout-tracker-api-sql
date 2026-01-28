import db from '../models/index.model.js';
import { Op, fn, col, literal } from 'sequelize';

const WorkoutSet = db.workoutSets;
const Workout = db.workouts;
const Exercise = db.exercises;

const calculate1RM = (weight, reps) => {
    return weight * (1 + reps / 30);
};

export const getProgressionByExercise = async (userId, exerciseId, period = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const sets = await WorkoutSet.findAll({
        attributes: ['weight', 'reps', 'rpe', 'createdAt'],
        include: [{
            model: Workout,
            as: 'workout',
            attributes: ['date'],
            where: {
                userId,
                date: { [Op.gte]: startDate }
            }
        }, {
            model: Exercise,
            as: 'exercise',
            attributes: ['id', 'name'],
            where: { id: exerciseId }
        }],
        order: [['createdAt', 'ASC']]
    });

    const progression = sets.map(set => ({
        date: set.workout.date,
        weight: parseFloat(set.weight),
        reps: set.reps,
        rpe: set.rpe,
        estimated1RM: Math.round(calculate1RM(parseFloat(set.weight), set.reps) * 10) / 10
    }));

    return {
        exerciseId,
        exerciseName: sets[0]?.exercise?.name || null,
        period,
        dataPoints: progression.length,
        progression
    };
};

export const getWeeklyVolume = async (userId, weeks = 4) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));

    const workouts = await Workout.findAll({
        where: {
            userId,
            date: { [Op.gte]: startDate }
        },
        include: [{
            model: WorkoutSet,
            as: 'sets',
            attributes: ['reps', 'weight']
        }],
        order: [['date', 'ASC']]
    });

    const weeklyData = {};

    workouts.forEach(workout => {
        const workoutDate = new Date(workout.date);
        const weekStart = new Date(workoutDate);
        weekStart.setDate(workoutDate.getDate() - workoutDate.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
                weekStart: weekKey,
                volume: 0,
                workouts: 0,
                totalSets: 0
            };
        }

        weeklyData[weekKey].workouts++;

        workout.sets.forEach(set => {
            weeklyData[weekKey].volume += set.reps * parseFloat(set.weight);
            weeklyData[weekKey].totalSets++;
        });
    });

    const volumeByWeek = Object.values(weeklyData).map(week => ({
        ...week,
        volume: Math.round(week.volume * 10) / 10
    }));

    return {
        weeks,
        totalVolume: Math.round(volumeByWeek.reduce((sum, w) => sum + w.volume, 0) * 10) / 10,
        totalWorkouts: volumeByWeek.reduce((sum, w) => sum + w.workouts, 0),
        volumeByWeek
    };
};

export const getPersonalRecords = async (userId) => {
    const sets = await WorkoutSet.findAll({
        attributes: ['weight', 'reps'],
        include: [{
            model: Workout,
            as: 'workout',
            attributes: ['date'],
            where: { userId }
        }, {
            model: Exercise,
            as: 'exercise',
            attributes: ['id', 'name', 'muscleGroup']
        }]
    });

    const prByExercise = {};

    sets.forEach(set => {
        const exerciseId = set.exercise.id;
        const weight = parseFloat(set.weight);
        const estimated1RM = calculate1RM(weight, set.reps);

        if (!prByExercise[exerciseId]) {
            prByExercise[exerciseId] = {
                exerciseId,
                exerciseName: set.exercise.name,
                muscleGroup: set.exercise.muscleGroup,
                maxWeight: weight,
                maxWeightReps: set.reps,
                estimated1RM: estimated1RM,
                prDate: set.workout.date
            };
        } else if (estimated1RM > prByExercise[exerciseId].estimated1RM) {
            prByExercise[exerciseId] = {
                ...prByExercise[exerciseId],
                maxWeight: weight,
                maxWeightReps: set.reps,
                estimated1RM: estimated1RM,
                prDate: set.workout.date
            };
        }
    });

    const records = Object.values(prByExercise).map(pr => ({
        ...pr,
        estimated1RM: Math.round(pr.estimated1RM * 10) / 10
    }));

    return {
        totalExercises: records.length,
        records: records.sort((a, b) => b.estimated1RM - a.estimated1RM)
    };
};

export const getWorkoutFrequency = async (userId, period = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const workouts = await Workout.findAll({
        where: {
            userId,
            date: { [Op.gte]: startDate }
        },
        attributes: ['date'],
        order: [['date', 'ASC']]
    });

    const dayOfWeekCount = [0, 0, 0, 0, 0, 0, 0];
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    workouts.forEach(workout => {
        const dayOfWeek = new Date(workout.date).getDay();
        dayOfWeekCount[dayOfWeek]++;
    });

    const frequencyByDay = dayNames.map((name, index) => ({
        day: name,
        count: dayOfWeekCount[index]
    }));

    const totalWorkouts = workouts.length;
    const weeksInPeriod = period / 7;

    return {
        period,
        totalWorkouts,
        averagePerWeek: Math.round((totalWorkouts / weeksInPeriod) * 10) / 10,
        frequencyByDay,
        mostActiveDay: frequencyByDay.reduce((max, day) => day.count > max.count ? day : max, frequencyByDay[0])
    };
};
