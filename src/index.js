import express from 'express';
import cors from 'cors';
import db from './models/index.model.js';
import userRoute from './routes/user.route.js';
import workoutRoute from './routes/workout.route.js';
import exerciseRoute from './routes/exercise.route.js';
import setRoute, { setStandaloneRouter } from './routes/set.route.js';
import analyticsRoute from './routes/analytics.route.js';

const app = express();
app.use(cors());
app.use(express.json());

db.sequelize
    .sync()
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

app.use('/users', userRoute);
app.use('/workouts', workoutRoute);
app.use('/workouts', setRoute);
app.use('/exercises', exerciseRoute);
app.use('/sets', setStandaloneRouter);
app.use('/analytics', analyticsRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the Workout Tracker API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
