// Main App Component for Live Polling System
import React, { useState, useEffect } from 'react';
import { SocketProvider, useSocket } from './context/SocketContext';
import Header from './components/Header';
import RoleSelectionPage from './pages/RoleSelectionPage';
import StudentJoinPage from './pages/StudentJoinPage';
import TeacherCreatePollPage from './pages/TeacherCreatePollPage';
import StudentPollViewPage from './pages/StudentPollViewPage';
import TeacherPollManagementPage from './pages/TeacherPollManagementPage';
import KickedOutPage from './pages/KickedOutPage';
import './styles/App.css';

// Wrapper component to provide socket context
const AppContent = () => {
  const { socket, connected } = useSocket();
  const [currentView, setCurrentView] = useState('role-selection'); // role-selection, student-join, teacher-create, student-poll, teacher-poll, kicked-out
  const [userRole, setUserRole] = useState(null); // 'student' or 'teacher'
  const [poll, setPoll] = useState(null);
  const [pollId, setPollId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [activeSocketId, setActiveSocketId] = useState(null);
  const [hasActivePoll, setHasActivePoll] = useState(false); // Whether there's currently an active poll

  useEffect(() => {
    if (!socket) return;

    // Listen for new poll available
    socket.on('new-poll-available', (pollData) => {
      console.log('New poll received:', pollData);
      setPoll(pollData);
      setPollId(pollData._id);
      setHasActivePoll(true); // Set that there's an active poll
      
      // Only change view to teacher-poll if user is a teacher
      if (userRole === 'teacher') {
        setCurrentView('teacher-poll');
      }
    });

    // Listen for when a student joins a poll
    socket.on('student-joined', (studentData) => {
      console.log('Student joined:', studentData);
      setParticipants(prev => [...prev, studentData]);
    });

    // Listen for poll data (sent to student after joining)
    socket.on('poll-data', (pollData) => {
      console.log('Poll data received for student:', pollData);
      setPoll(pollData);
      setHasActivePoll(true); // Set that there's an active poll
      
      // Only change view to student-poll if user is a student
      if (userRole === 'student') {
        setCurrentView('student-poll');
      }
    });

    // Listen for when a student has voted
    socket.on('student-voted', (studentData) => {
      console.log(`${studentData.name} has voted`);
    });

    // Listen for updated poll results
    socket.on('vote-updated', (updatedPoll) => {
      console.log('Vote updated:', updatedPoll);
      setPoll(updatedPoll);
    });

    // Listen for when a student is kicked out
    socket.on('kicked-out', () => {
      console.log('Student kicked out');
      setCurrentView('kicked-out');
    });

    // Listen for when a student is kicked out from the poll
    socket.on('student-kicked-out', (data) => {
      console.log('Student kicked out by ID:', data);
      setParticipants(prev => prev.filter(participant => participant.id !== data.studentSocketId));
    });

    // Listen for when a poll ends
    socket.on('poll-ended', (data) => {
      console.log('Poll ended:', data);
      alert('Poll has ended');
      setCurrentView('role-selection');
      setUserRole(null);
      setPoll(null);
      setPollId('');
      setStudentName('');
      setParticipants([]);
      setHasActivePoll(false); // Reset active poll status
    });

    // Listen for when a student leaves
    socket.on('student-left', (data) => {
      console.log('Student left:', data);
      setParticipants(prev => prev.filter(participant => participant.id !== data.socketId));
    });

    // Listen for errors
    socket.on('error', (errorData) => {
      console.error('Socket error:', errorData);
      alert('Error: ' + errorData.message);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('new-poll-available');
      socket.off('student-joined');
      socket.off('student-voted');
      socket.off('vote-updated');
      socket.off('kicked-out');
      socket.off('student-kicked-out');
      socket.off('poll-ended');
      socket.off('student-left');
      socket.off('error');
    };
  }, [socket, userRole]);

  const handleRoleSelect = (role) => {
    setUserRole(role);
    if (role === 'student') {
      setCurrentView('student-join');
    } else if (role === 'teacher') {
      // If there's an active poll, show the current poll instead of allowing creation of a new one
      if (hasActivePoll && poll) {
        setCurrentView('teacher-poll');
      } else {
        setCurrentView('teacher-create');
      }
    }
  };

  const handleJoinPoll = (data) => {
    if (!data.studentName) return;
    
    setStudentName(data.studentName);
    
    // Join the current poll via socket
    socket.emit('student-join-poll', { name: data.studentName });
    // The view will change when we receive the poll-data event
  };

  const handleCreatePoll = (pollData) => {
    // Create a new poll via socket
    socket.emit('teacher-create-poll', pollData);
    // The view will change when we receive the new-poll-available event
  };

  const handleVote = (optionIndex) => {
    // Vote via socket
    socket.emit('student-vote', { optionIndex });
  };

  const handleLeave = () => {
    setCurrentView('role-selection');
    setUserRole(null);
    setPoll(null);
    setPollId('');
    setStudentName('');
    setParticipants([]);
  };

  const handleEndPoll = () => {
    // End poll via socket
    socket.emit('teacher-end-poll');
  };

  const handleKickoutStudent = (studentSocketId) => {
    // Kick out student via socket
    socket.emit('teacher-kick-out-student', { studentSocketId });
  };

  const handleReturnToRoleSelection = () => {
    setCurrentView('role-selection');
    setUserRole(null);
    setPoll(null);
    setPollId('');
    setStudentName('');
    setParticipants([]);
  };

  return (
    <div className="App">
      <Header />
      {connected ? (
        <main>
          {currentView === 'role-selection' && (
            <RoleSelectionPage onRoleSelect={handleRoleSelect} />
          )}
          
          {currentView === 'student-join' && (
            <StudentJoinPage onJoinPoll={handleJoinPoll} />
          )}
          
          {currentView === 'teacher-create' && (
            <TeacherCreatePollPage onCreatePoll={handleCreatePoll} />
          )}
          
          {currentView === 'student-poll' && poll && (
            <StudentPollViewPage 
              poll={poll} 
              onVote={handleVote}
              studentName={studentName}
              onLeave={handleLeave}
            />
          )}
          
          {currentView === 'teacher-poll' && poll && (
            <TeacherPollManagementPage 
              poll={poll}
              pollId={pollId}
              onEndPoll={handleEndPoll}
              onKickoutStudent={handleKickoutStudent}
              participants={participants}
            />
          )}
          
          {currentView === 'kicked-out' && (
            <KickedOutPage onReturnToRoleSelection={handleReturnToRoleSelection} />
          )}
        </main>
      ) : (
        <div className="connecting-message">
          <p>Connecting to server...</p>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
}

export default App;