import Sequelize from 'sequelize';
import pg from 'pg';
import dbConfig from '../config/db.config.js';
import User from './user.model.js';
import Workout from './workout.model.js';
import Exercise from './exercise.model.js';
import WorkoutSet from './workoutSet.model.js';

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    dialectModule: pg,
    dialectOptions: dbConfig.dialectOptions,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
        evict: dbConfig.pool.evict
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = User(sequelize, Sequelize);
db.workouts = Workout(sequelize, Sequelize);
db.exercises = Exercise(sequelize, Sequelize);
db.workoutSets = WorkoutSet(sequelize, Sequelize);

db.users.hasMany(db.workouts, { foreignKey: 'userId', as: 'workouts' });
db.workouts.belongsTo(db.users, { foreignKey: 'userId', as: 'user' });

db.users.hasMany(db.exercises, { foreignKey: 'userId', as: 'customExercises' });
db.exercises.belongsTo(db.users, { foreignKey: 'userId', as: 'creator' });

db.workouts.hasMany(db.workoutSets, { foreignKey: 'workoutId', as: 'sets', onDelete: 'CASCADE' });
db.workoutSets.belongsTo(db.workouts, { foreignKey: 'workoutId', as: 'workout' });

db.exercises.hasMany(db.workoutSets, { foreignKey: 'exerciseId', as: 'sets' });
db.workoutSets.belongsTo(db.exercises, { foreignKey: 'exerciseId', as: 'exercise' });

export default db;
