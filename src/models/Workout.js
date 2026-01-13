export default (sequelize, Sequelize) => {
    const Workout = sequelize.define("workout", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'O nome do treino não pode ser vazio' },
            },
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        duration: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg: 'A duração deve ser um número inteiro' },
                min: { args: [1], msg: 'A duração deve ser maior que 0' },
            },
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {
                isDate: { msg: 'A data deve ser uma data válida' },
                isAfter: { args: new Date().toISOString(), msg: 'A data deve ser futura' },
            },
        },
    });

    return Workout;
};