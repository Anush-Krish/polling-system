// Socket event handlers for real-time polling
const pollService = (() => {
  const originalPollService = require('../service/pollService');
  
  const createPollForLive = async (pollData) => {
    // Create a new poll with default active state
    // CreatorId is not required for live polls anymore
    const poll = {
      question: pollData.question,
      options: pollData.options.map((opt, index) => ({
        id: index,
        text: opt.text || opt.text,
        votes: 0
      })),
      isActive: true,
      participants: []
    };

    // Save to database
    const pollRepository = require('../repository/pollRepository');
    const savedPoll = await pollRepository.create(poll);
    return savedPoll;
  };

  return {
    ...originalPollService,
    createPollForLive
  };
})();

const setupSocketHandlers = (io) => {
  // Global reference to the current active poll
  let currentActivePoll = null;
  const pollRepository = require('../repository/pollRepository');

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Teacher creates a new poll
    socket.on('teacher-create-poll', async (pollData) => {
      try {
        // Create a new poll in the database
        const poll = await pollService.createPollForLive(pollData);
        
        // If there's already an active poll, end it
        if (currentActivePoll) {
          io.emit('poll-ended', { pollId: currentActivePoll._id });
        }
        
        // Set the new poll as the current active poll
        currentActivePoll = poll;
        
        // Broadcast to all clients that a new poll is available
        io.emit('new-poll-available', poll);
        
        // Start the 60 second timer
        setTimeout(() => {
          // Mark the poll as inactive in the database
          pollRepository.updateById(poll._id, { isActive: false })
            .then(() => {
              console.log(`Poll ${poll._id} marked as inactive after timer`);
            })
            .catch(err => {
              console.error('Error updating poll status:', err);
            });
          
          // Broadcast that the poll has ended
          io.emit('poll-timer-expired', { pollId: poll._id });
          
          // Clear the current active poll
          currentActivePoll = null;
        }, 60000); // 60 seconds
      } catch (error) {
        console.error('Error creating poll:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Student joins the current poll
    socket.on('student-join-poll', async (studentData) => {
      try {
        console.log('Student join data received:', studentData); // Debug log
        
        if (!currentActivePoll) {
          socket.emit('no-active-poll');
          return;
        }
        
        if (!studentData.name) {
          socket.emit('error', { message: 'Student name is required' });
          return;
        }
        
        // Add the student to the current active poll with socket ID
        const updatedPoll = await pollService.addParticipant(currentActivePoll._id, studentData.name, socket.id);
        
        // Join the socket room for the poll
        socket.join(currentActivePoll._id.toString());
        
        // Broadcast that a student joined
        io.to(currentActivePoll._id.toString()).emit('student-joined', { 
          name: studentData.name, 
          id: socket.id 
        });
        
        // Send the current poll to the student
        socket.emit('poll-data', currentActivePoll);
      } catch (error) {
        console.error('Error in student-join-poll:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Student votes on the current poll
    socket.on('student-vote', async (data) => {
      try {
        const { optionIndex } = data;
        
        if (!currentActivePoll) {
          socket.emit('no-active-poll');
          return;
        }

        // Record the vote
        const updatedPoll = await pollService.voteOnPoll(currentActivePoll._id, optionIndex, null);
        
        // Update the current active poll with new vote counts
        currentActivePoll = updatedPoll;
        
        // Broadcast the updated poll results to all in the room
        io.to(currentActivePoll._id.toString()).emit('vote-updated', updatedPoll);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Teacher ends the current poll
    socket.on('teacher-end-poll', async () => {
      try {
        if (!currentActivePoll) {
          socket.emit('no-active-poll');
          return;
        }
        
        // Mark the poll as inactive in the database
        const poll = await pollRepository.updateById(currentActivePoll._id, { isActive: false });
        
        // Broadcast that the poll has ended
        io.emit('poll-ended', { pollId: currentActivePoll._id });
        
        // Clear the current active poll
        currentActivePoll = null;
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Teacher kicks out a student
    socket.on('teacher-kick-out-student', async (data) => {
      try {
        const { studentSocketId } = data;
        
        if (!currentActivePoll) {
          socket.emit('no-active-poll');
          return;
        }
        
        // Inform the kicked-out student
        io.to(studentSocketId).emit('kicked-out');
        
        // Broadcast to all in the poll room that the student was kicked out
        io.to(currentActivePoll._id.toString()).emit('student-kicked-out', { studentSocketId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // If this was a student and there's an active poll, remove them from participants
      if (currentActivePoll) {
        io.to(currentActivePoll._id.toString()).emit('student-left', { socketId: socket.id });
      }
    });
  });
};

module.exports = { 
  setupSocketHandlers
};