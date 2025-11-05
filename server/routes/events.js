import express from 'express';
import {
  createEvent,
  getMyEvents,
  updateEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyEvents)   
  .post(createEvent);  

router.route('/:id')
  .put(updateEvent);   

export default router;