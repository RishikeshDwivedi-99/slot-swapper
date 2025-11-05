import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  const { title, startTime, endTime } = req.body;
  try {
    const event = await Event.create({
      title,
      startTime,
      endTime,
      owner: req.user._id,
      status: 'BUSY',
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const updateEvent = async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    event.title = title || event.title;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.status = status || event.status;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};