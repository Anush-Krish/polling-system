// PollController for Live Polling System
const pollService = require('../service/pollService');

const createPoll = async (req, res) => {
  try {
    const poll = await pollService.createPoll(req.body, req.userId);
    res.status(201).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const polls = await pollService.getAllPolls();
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPollById = async (req, res) => {
  try {
    const poll = await pollService.getPollById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePoll = async (req, res) => {
  try {
    const poll = await pollService.updatePoll(req.params.id, req.body, req.userId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePoll = async (req, res) => {
  try {
    const poll = await pollService.deletePoll(req.params.id, req.userId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const voteOnPoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    // For the socket-based system, we can accept votes without user ID
    const poll = await pollService.voteOnPoll(req.params.id, optionIndex, null);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addParticipant = async (req, res) => {
  try {
    const { name } = req.body;
    const poll = await pollService.addParticipant(req.params.id, name);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeParticipant = async (req, res) => {
  try {
    const poll = await pollService.removeParticipant(req.params.id, req.params.participantId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const endPoll = async (req, res) => {
  try {
    const poll = await pollService.endPoll(req.params.id, req.userId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPoll,
  getAllPolls,
  getPollById,
  updatePoll,
  deletePoll,
  voteOnPoll,
  addParticipant,
  removeParticipant,
  endPoll
};