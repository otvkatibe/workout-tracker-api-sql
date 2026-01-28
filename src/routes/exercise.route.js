import { Router } from 'express';
import * as exerciseController from '../controller/exercise.controller.js';
import verifyToken from '../middlewares/jwt.token.middleware.js';

const router = Router();

router.get('/', verifyToken, exerciseController.listExercises);
router.get('/:id', verifyToken, exerciseController.getExercise);
router.post('/', verifyToken, exerciseController.createExercise);
router.post('/import', verifyToken, exerciseController.importExercises);
router.put('/:id', verifyToken, exerciseController.updateExercise);
router.delete('/:id', verifyToken, exerciseController.deleteExercise);

export default router;
