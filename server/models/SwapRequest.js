import mongoose from 'mongoose';

const SwapRequestSchema = new mongoose.Schema({
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  requesterSlot: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  },
  recipientSlot: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
  },
}, {
  timestamps: true 
});

const SwapRequest = mongoose.model('SwapRequest', SwapRequestSchema);
export default SwapRequest;