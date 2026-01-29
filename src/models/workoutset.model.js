export default (sequelize, Sequelize) => {
    const WorkoutSet = sequelize.define('workout_set', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        workoutId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'workouts',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        exerciseId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'exercises',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        setNumber: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: { args: [1], msg: 'O número da série deve ser maior que 0' }
            }
        },
        reps: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: { args: [1], msg: 'O número de repetições deve ser maior que 0' }
            }
        },
        weight: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: { args: [0], msg: 'O peso não pode ser negativo' }
            }
        },
        rpe: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
                min: { args: [1], msg: 'O RPE deve ser entre 1 e 10' },
                max: { args: [10], msg: 'O RPE deve ser entre 1 e 10' }
            }
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });

    return WorkoutSet;
};
