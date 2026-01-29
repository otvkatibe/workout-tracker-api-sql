export default (sequelize, Sequelize) => {
    const Exercise = sequelize.define('exercise', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'O nome do exercício não pode ser vazio' },
                len: { args: [2, 100], msg: 'O nome deve ter entre 2 e 100 caracteres' }
            }
        },
        muscleGroup: {
            type: Sequelize.ENUM(
                'chest',
                'back',
                'shoulders',
                'arms',
                'legs',
                'core',
                'cardio',
                'full_body'
            ),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'O grupo muscular é obrigatório' }
            }
        },
        equipment: {
            type: Sequelize.STRING(50),
            allowNull: true,
            defaultValue: 'bodyweight'
        },
        difficulty: {
            type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
            allowNull: false,
            defaultValue: 'beginner'
        },
        instructions: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        externalId: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    return Exercise;
};
