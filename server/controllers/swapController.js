import SwapRequest from '../models/SwapRequest.js';
import Event from '../models/Event.js';

export const getSwappableSlots = async (req, res) => {
  try {
    const slots = await Event.find({
      status: 'SWAPPABLE',
      owner: { $ne: req.user._id }, 
    }).populate('owner', 'name'); 
    
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const requestSwap = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;

  try {
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) {
      return res.status(SAP).json({ message: 'One or both slots not found' });
    }
    if (mySlot.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'You do not own the slot you are offering' });
    }
    if (theirSlot.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot swap with yourself' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'One or both slots are not swappable' });
    }
    const swapRequest = await SwapRequest.create({
      requester: req.user._id,
      recipient: theirSlot.owner,
      requesterSlot: mySlotId,
      recipientSlot: theirSlotId,
    });

    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const respondToSwap = async (req, res) => {
  const { requestId } = req.params;
  const { accepted } = req.body; 

  try {
    const swapRequest = await SwapRequest.findById(requestId);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }
    if (swapRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to respond' });
    }
    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({ message: `Request already ${swapRequest.status}` });
    }

    const mySlot = await Event.findById(swapRequest.recipientSlot);
    const theirSlot = await Event.findById(swapRequest.requesterSlot);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or both slots were deleted' });
    }

    if (accepted === true) {
      mySlot.owner = swapRequest.requester;
      theirSlot.owner = swapRequest.recipient;

      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';

      swapRequest.status = 'ACCEPTED';
      
      await mySlot.save();
      await theirSlot.save();
      await swapRequest.save();

      res.json({ message: 'Swap Accepted!' });

    } else {
      swapRequest.status = 'REJECTED';

      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      
      await mySlot.save();
      await theirSlot.save();
      await swapRequest.save();

      res.json({ message: 'Swap Rejected' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const getIncomingRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      recipient: req.user._id,
      status: 'PENDING',
    })
    .populate('requester', 'name')
    .populate('requesterSlot')
    .populate('recipientSlot');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const getOutgoingRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ requester: req.user._id })
    .populate('recipient', 'name')
    .populate('requesterSlot')
    .populate('recipientSlot');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};