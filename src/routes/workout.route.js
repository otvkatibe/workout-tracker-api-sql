import express from 'express';
import * as workoutController from '../controller/workout.controller.js';
import verifyToken from '../middlewares/jwt.token.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', workoutController.createWorkout);
router.get('/', workoutController.getWorkouts);
router.get('/:id', workoutController.getWorkout);
router.put('/:id', workoutController.updateWorkout);
//router.patch('/:id', workoutController.patchWorkout);
router.delete('/:id', workoutController.deleteWorkout);

export default router;