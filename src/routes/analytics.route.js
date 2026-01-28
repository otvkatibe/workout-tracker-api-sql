import { Router } from 'express';
import * as analyticsController from '../controller/analytics.controller.js';
import verifyToken from '../middlewares/jwt.token.middleware.js';

const router = Router();

router.get('/progression/:exerciseId', verifyToken, analyticsController.getProgression);
router.get('/volume', verifyToken, analyticsController.getVolume);
router.get('/records', verifyToken, analyticsController.getRecords);
router.get('/frequency', verifyToken, analyticsController.getFrequency);

export default router;
