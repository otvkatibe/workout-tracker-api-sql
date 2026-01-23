import Sequelize from 'sequelize';
import dbConfig from '../config/db.config.js';
import User from './User.js';
import Workout from './Workout.js';
import pg from 'pg';

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
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
            evict: dbConfig.pool.evict,
        },
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = User(sequelize, Sequelize);
db.workouts = Workout(sequelize, Sequelize);

db.users.hasMany(db.workouts, { foreignKey: 'userId', as: 'workouts' });
db.workouts.belongsTo(db.users, { foreignKey: 'userId', as: 'user' });

export default db;