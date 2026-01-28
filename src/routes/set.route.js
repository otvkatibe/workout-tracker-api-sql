import { Router } from 'express';
import * as setController from '../controller/set.controller.js';
import verifyToken from '../middlewares/jwt.token.middleware.js';

const router = Router();

router.get('/:workoutId/sets', verifyToken, setController.listSets);
router.post('/:workoutId/sets', verifyToken, setController.createSet);
router.post('/:workoutId/sets/bulk', verifyToken, setController.bulkCreateSets);

export const setStandaloneRouter = Router();
setStandaloneRouter.get('/:id', verifyToken, setController.getSet);
setStandaloneRouter.put('/:id', verifyToken, setController.updateSet);
setStandaloneRouter.delete('/:id', verifyToken, setController.deleteSet);

export default router;
