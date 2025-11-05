import express from 'express';
import {
  getSwappableSlots,
  requestSwap,
  respondToSwap,
  getIncomingRequests,
  getOutgoingRequests
} from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/swappable-slots', getSwappableSlots); 
router.post('/request', requestSwap);             
router.post('/respond/:requestId', respondToSwap);
router.get('/incoming', getIncomingRequests);      
router.get('/outgoing', getOutgoingRequests);      

export default router;