// telehealth.js
// Import utility functions from other modules if needed
// import { showToast, formatDate, formatTime } from './utils.js';

// DOM Elements
const startSessionBtn = document.getElementById('startSessionBtn');
const sessionModal = document.getElementById('sessionModal');
const closeSessionModal = document.getElementById('closeSessionModal');
const sessionForm = document.getElementById('sessionForm');
const patientSelect = document.getElementById('patientSelect');
const attendanceModal = document.getElementById('attendanceModal');
const closeAttendanceModal = document.getElementById('closeAttendanceModal');
const attendanceForm = document.getElementById('attendanceForm');
const chatModal = document.getElementById('chatModal');
const closeChatModal = document.getElementById('closeChatModal');
const resourceModal = document.getElementById('resourceModal');
const closeResourceModal = document.getElementById('closeResourceModal');
const resourceForm = document.getElementById('resourceForm');
const followupModal = document.getElementById('followupModal');
const closeFollowupModal = document.getElementById('closeFollowupModal');
const followupForm = document.getElementById('followupForm');
const emergencyBtn = document.getElementById('emergencyBtn');
const emergencyModal = document.getElementById('emergencyModal');
const closeEmergencyModal = document.getElementById('closeEmergencyModal');
const sessionControls = document.getElementById('sessionControls');
const videoContainer = document.getElementById('videoContainer');
const waitingRoom = document.getElementById('waitingRoom');
const closeWaitingRoom = document.getElementById('closeWaitingRoom');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const sessionLink = document.getElementById('sessionLink');
const admitAllPatients = document.getElementById('admitAllPatients');
const startWithoutPatient = document.getElementById('startWithoutPatient');
const toggleVideo = document.getElementById('toggleVideo');
const toggleAudio = document.getElementById('toggleAudio');
const shareScreen = document.getElementById('shareScreen');
const openChat = document.getElementById('openChat');
const shareResource = document.getElementById('shareResource');
const endSession = document.getElementById('endSession');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const localVideoIndicator = document.getElementById('localVideoIndicator');
const localAudioIndicator = document.getElementById('localAudioIndicator');
const connectionStatus = document.getElementById('connectionStatus');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendResourceBtn = document.getElementById('sendResourceBtn');
const resourceType = document.getElementById('resourceType');
const resourceFileGroup = document.getElementById('resourceFileGroup');
const resourceLinkGroup = document.getElementById('resourceLinkGroup');
const attendanceOptions = document.querySelectorAll('input[name="attendance"]');
const cancellationReasonGroup = document.getElementById('cancellationReasonGroup');
const upcomingSessionsList = document.getElementById('upcomingSessionsList');
const activeSessionsList = document.getElementById('activeSessionsList');
const sessionsTableBody = document.getElementById('sessionsTableBody');
const dateFilter = document.getElementById('dateFilter');
const statusFilter = document.getElementById('statusFilter');

// State management
let currentSession = null;
let isVideoEnabled = true;
let isAudioEnabled = true;
let waitingParticipants = [];
let activeSessions = [];
let sessionHistory = [];
let stream = null;
let peerConnection = null;

// Mock data for demonstration
const mockPatients = [
    { id: 1, name: 'John Smith', email: 'john@example.com', avatar: 'JS' },
    { id: 2, name: 'Emma Johnson', email: 'emma@example.com', avatar: 'EJ' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', avatar: 'MB' },
    { id: 4, name: 'Sarah Davis', email: 'sarah@example.com', avatar: 'SD' },
    { id: 5, name: 'David Wilson', email: 'david@example.com', avatar: 'DW' }
];

const mockSessions = [
    { id: 1, patientId: 1, date: '2025-09-02', time: '10:00', duration: 45, type: 'individual', status: 'upcoming' },
    { id: 2, patientId: 2, date: '2025-09-02', time: '11:00', duration: 45, type: 'individual', status: 'upcoming' },
    { id: 3, patientId: 3, date: '2025-09-02', time: '14:00', duration: 60, type: 'couples', status: 'upcoming' },
    { id: 4, patientId: 4, date: '2025-09-02', time: '15:30', duration: 30, type: 'individual', status: 'upcoming' }
];

const mockSessionHistory = [
    { id: 101, patientId: 5, date: '2025-09-01', time: '10:00', duration: 45, status: 'completed', attendance: 'attended' },
    { id: 102, patientId: 2, date: '2025-08-30', time: '11:00', duration: 45, status: 'completed', attendance: 'attended' },
    { id: 103, patientId: 1, date: '2025-08-29', time: '14:00', duration: 0, status: 'cancelled', attendance: 'cancelled', reason: 'Patient emergency' },
    { id: 104, patientId: 3, date: '2025-08-28', time: '15:30', duration: 0, status: 'no-show', attendance: 'no-show' }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadMockData();
});

function initializePage() {
    // Set current date
    const dateInfo = document.querySelector('.date-info');
    if (dateInfo) {
        dateInfo.textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

function setupEventListeners() {
    // Session modal
    startSessionBtn.addEventListener('click', openSessionModal);
    closeSessionModal.addEventListener('click', closeModal.bind(null, sessionModal));
    sessionForm.addEventListener('submit', handleSessionStart);
    
    // Attendance modal
    closeAttendanceModal.addEventListener('click', closeModal.bind(null, attendanceModal));
    attendanceForm.addEventListener('submit', handleAttendanceSubmit);
    
    // Chat modal
    closeChatModal.addEventListener('click', closeModal.bind(null, chatModal));
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Resource modal
    closeResourceModal.addEventListener('click', closeModal.bind(null, resourceModal));
    resourceForm.addEventListener('submit', handleResourceShare);
    resourceType.addEventListener('change', toggleResourceInputs);
    
    // Follow-up modal
    closeFollowupModal.addEventListener('click', closeModal.bind(null, followupModal));
    followupForm.addEventListener('submit', handleFollowupSubmit);
    
    // Emergency modal
    emergencyBtn.addEventListener('click', openEmergencyModal);
    closeEmergencyModal.addEventListener('click', closeModal.bind(null, emergencyModal));
    
    // Session controls
    closeWaitingRoom.addEventListener('click', closeWaitingRoomHandler);
    copyLinkBtn.addEventListener('click', copySessionLink);
    admitAllPatients.addEventListener('click', admitAllParticipants);
    startWithoutPatient.addEventListener('click', startSessionWithoutPatient);
    toggleVideo.addEventListener('click', toggleVideoHandler);
    toggleAudio.addEventListener('click', toggleAudioHandler);
    shareScreen.addEventListener('click', shareScreenHandler);
    openChat.addEventListener('click', openChatHandler);
    shareResource.addEventListener('click', openResourceModal);
    endSession.addEventListener('click', endSessionHandler);
    
    // Attendance options
    attendanceOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'cancelled') {
                cancellationReasonGroup.style.display = 'block';
            } else {
                cancellationReasonGroup.style.display = 'none';
            }
        });
    });
    
    // Filters
    dateFilter.addEventListener('change', filterSessions);
    statusFilter.addEventListener('change', filterSessions);
    
    // Navigation
    setupNavigation();
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

function loadMockData() {
    // Populate patient select
    mockPatients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = `${patient.name} (${patient.email})`;
        patientSelect.appendChild(option);
    });
    
    // Load upcoming sessions
    renderUpcomingSessions();
    
    // Load session history
    renderSessionHistory();
}

function renderUpcomingSessions() {
    upcomingSessionsList.innerHTML = '';
    
    mockSessions.forEach(session => {
        const patient = mockPatients.find(p => p.id === session.patientId);
        if (!patient) return;
        
        const sessionElement = createSessionElement(session, patient);
        upcomingSessionsList.appendChild(sessionElement);
    });
}

function renderActiveSessions() {
    activeSessionsList.innerHTML = '';
    
    if (activeSessions.length === 0) {
        activeSessionsList.innerHTML = '<p class="no-sessions">No active sessions</p>';
        return;
    }
    
    activeSessions.forEach(session => {
        const patient = mockPatients.find(p => p.id === session.patientId);
        if (!patient) return;
        
        const sessionElement = createSessionElement(session, patient, true);
        activeSessionsList.appendChild(sessionElement);
    });
}

function createSessionElement(session, patient, isActive = false) {
    const sessionItem = document.createElement('article');
    sessionItem.className = 'session-item';
    
    const timeElement = document.createElement('section');
    timeElement.className = 'session-time';
    timeElement.innerHTML = `
        <time>${session.time}</time>
        <span class="session-duration">${session.duration} min</span>
    `;
    
    const infoElement = document.createElement('section');
    infoElement.className = 'session-info';
    infoElement.innerHTML = `
        <h3>${patient.name}</h3>
        <p>${session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session</p>
        <span class="session-status ${isActive ? 'in-progress' : 'upcoming'}">
            ${isActive ? 'In Progress' : 'Upcoming'}
        </span>
    `;
    
    const actionsElement = document.createElement('section');
    actionsElement.className = 'session-actions';
    
    if (isActive) {
        actionsElement.innerHTML = `
            <button class="session-btn join" data-session-id="${session.id}">
                <i class="fas fa-video"></i>
                Join
            </button>
            <button class="session-btn cancel" data-session-id="${session.id}">
                <i class="fas fa-times"></i>
                End
            </button>
        `;
    } else {
        actionsElement.innerHTML = `
            <button class="session-btn join" data-session-id="${session.id}">
                <i class="fas fa-play"></i>
                Start
            </button>
            <button class="session-btn cancel" data-session-id="${session.id}">
                <i class="fas fa-times"></i>
                Cancel
            </button>
        `;
    }
    
    sessionItem.appendChild(timeElement);
    sessionItem.appendChild(infoElement);
    sessionItem.appendChild(actionsElement);
    
    // Add event listeners to buttons
    const joinBtn = sessionItem.querySelector('.session-btn.join');
    const cancelBtn = sessionItem.querySelector('.session-btn.cancel');
    
    joinBtn.addEventListener('click', function() {
        const sessionId = this.getAttribute('data-session-id');
        if (isActive) {
            joinExistingSession(sessionId);
        } else {
            startSessionFromList(sessionId);
        }
    });
    
    cancelBtn.addEventListener('click', function() {
        const sessionId = this.getAttribute('data-session-id');
        cancelSession(sessionId);
    });
    
    return sessionItem;
}

function renderSessionHistory() {
    sessionsTableBody.innerHTML = '';
    
    let filteredHistory = [...mockSessionHistory];
    
    // Apply date filter
    const dateFilterValue = dateFilter.value;
    const today = new Date();
    
    if (dateFilterValue === 'today') {
        filteredHistory = filteredHistory.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate.toDateString() === today.toDateString();
        });
    } else if (dateFilterValue === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        filteredHistory = filteredHistory.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= weekStart;
        });
    } else if (dateFilterValue === 'month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        filteredHistory = filteredHistory.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= monthStart;
        });
    }
    
    // Apply status filter
    const statusFilterValue = statusFilter.value;
    if (statusFilterValue !== 'all') {
        filteredHistory = filteredHistory.filter(session => session.status === statusFilterValue);
    }
    
    filteredHistory.forEach(session => {
        const patient = mockPatients.find(p => p.id === session.patientId);
        if (!patient) return;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${session.date} at ${session.time}</td>
            <td>${patient.name}</td>
            <td>${session.duration > 0 ? `${session.duration} min` : 'N/A'}</td>
            <td>
                <span class="session-status ${session.status}">
                    ${session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>
            </td>
            <td>
                <button class="table-action-btn" data-session-id="${session.id}" data-action="attendance">
                    <i class="fas fa-clipboard-check"></i>
                </button>
                <button class="table-action-btn" data-session-id="${session.id}" data-action="followup">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="table-action-btn" data-session-id="${session.id}" data-action="details">
                    <i class="fas fa-info-circle"></i>
                </button>
            </td>
        `;
        
        sessionsTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    const actionButtons = sessionsTableBody.querySelectorAll('.table-action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sessionId = this.getAttribute('data-session-id');
            const action = this.getAttribute('data-action');
            
            handleHistoryAction(sessionId, action);
        });
    });
}

function handleHistoryAction(sessionId, action) {
    const session = mockSessionHistory.find(s => s.id === parseInt(sessionId));
    if (!session) return;
    
    const patient = mockPatients.find(p => p.id === session.patientId);
    if (!patient) return;
    
    switch (action) {
        case 'attendance':
            openAttendanceModal(session, patient);
            break;
        case 'followup':
            openFollowupModal(session, patient);
            break;
        case 'details':
            showSessionDetails(session, patient);
            break;
    }
}

function openSessionModal() {
    sessionModal.showModal();
}

function openAttendanceModal(session, patient) {
    const attendanceSessionId = document.getElementById('attendanceSessionId');
    attendanceSessionId.value = session.id;
    
    // Set the correct radio button based on session attendance
    const attendanceValue = session.attendance || 'attended';
    document.querySelector(`input[name="attendance"][value="${attendanceValue}"]`).checked = true;
    
    // Show/hide cancellation reason field
    if (attendanceValue === 'cancelled') {
        cancellationReasonGroup.style.display = 'block';
        document.getElementById('cancellationReason').value = session.reason || '';
    } else {
        cancellationReasonGroup.style.display = 'none';
    }
    
    attendanceModal.showModal();
}

function openFollowupModal(session, patient) {
    const followupSessionId = document.getElementById('followupSessionId');
    const followupPatient = document.getElementById('followupPatient');
    
    followupSessionId.value = session.id;
    followupPatient.value = patient.name;
    
    followupModal.showModal();
}

function openResourceModal() {
    resourceModal.showModal();
}

function openEmergencyModal() {
    emergencyModal.showModal();
}

function openChatHandler() {
    chatModal.showModal();
}

function closeModal(modal) {
    modal.close();
}

function handleSessionStart(e) {
    e.preventDefault();
    
    const patientId = parseInt(patientSelect.value);
    const sessionType = document.getElementById('sessionType').value;
    const sessionDuration = parseInt(document.getElementById('sessionDuration').value);
    const sessionNotes = document.getElementById('sessionNotes').value;
    const sendInvite = document.getElementById('sendInvite').checked;
    
    if (!patientId) {
        showToast('Error', 'Please select a patient', 'error');
        return;
    }
    
    const patient = mockPatients.find(p => p.id === patientId);
    if (!patient) {
        showToast('Error', 'Patient not found', 'error');
        return;
    }
    
    // Create a new session
    const newSession = {
        id: Date.now(),
        patientId: patientId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: sessionDuration,
        type: sessionType,
        notes: sessionNotes,
        status: 'waiting'
    };
    
    currentSession = newSession;
    
    // Generate a unique session link
    const sessionId = generateSessionId();
    sessionLink.value = `${window.location.origin}/join-session/${sessionId}`;
    
    // Show waiting room
    waitingRoom.style.display = 'block';
    sessionModal.close();
    
    showToast('Session Created', 'Waiting room is ready. Share the link with your patient.', 'success');
    
    // If sendInvite is checked, simulate sending an invite
    if (sendInvite) {
        setTimeout(() => {
            simulatePatientJoining(patient);
        }, 3000);
    }
}

function generateSessionId() {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

function simulatePatientJoining(patient) {
    // Add patient to waiting room
    waitingParticipants.push({
        id: Date.now(),
        patient: patient,
        joinTime: new Date()
    });
    
    updateWaitingRoom();
    
    showToast('Patient Joining', `${patient.name} is waiting to join the session`, 'info');
}

function updateWaitingRoom() {
    const waitingParticipantsContainer = document.getElementById('waitingParticipants');
    waitingParticipantsContainer.innerHTML = '';
    
    if (waitingParticipants.length === 0) {
        waitingParticipantsContainer.innerHTML = '<p class="no-participants">No participants waiting</p>';
        admitAllPatients.disabled = true;
        admitAllPatients.textContent = 'Admit All (0)';
        return;
    }
    
    admitAllPatients.disabled = false;
    admitAllPatients.textContent = `Admit All (${waitingParticipants.length})`;
    
    waitingParticipants.forEach(participant => {
        const participantElement = document.createElement('article');
        participantElement.className = 'waiting-participant';
        
        participantElement.innerHTML = `
            <section class="participant-info">
                <figure class="participant-avatar">${participant.patient.avatar}</figure>
                <section class="participant-details">
                    <h4>${participant.patient.name}</h4>
                    <p>${participant.patient.email}</p>
                </section>
            </section>
            <section class="waiting-actions">
                <button class="primary-btn admit-btn" data-participant-id="${participant.id}">
                    Admit
                </button>
                <button class="secondary-btn deny-btn" data-participant-id="${participant.id}">
                    Deny
                </button>
            </section>
        `;
        
        waitingParticipantsContainer.appendChild(participantElement);
        
        // Add event listeners
        const admitBtn = participantElement.querySelector('.admit-btn');
        const denyBtn = participantElement.querySelector('.deny-btn');
        
        admitBtn.addEventListener('click', function() {
            admitParticipant(participant.id);
        });
        
        denyBtn.addEventListener('click', function() {
            denyParticipant(participant.id);
        });
    });
}

function admitParticipant(participantId) {
    const participantIndex = waitingParticipants.findIndex(p => p.id === participantId);
    if (participantIndex === -1) return;
    
    const participant = waitingParticipants[participantIndex];
    
    // Remove from waiting room
    waitingParticipants.splice(participantIndex, 1);
    updateWaitingRoom();
    
    // Start the session
    startVideoSession(participant.patient);
    
    showToast('Participant Admitted', `${participant.patient.name} has joined the session`, 'success');
}

function denyParticipant(participantId) {
    const participantIndex = waitingParticipants.findIndex(p => p.id === participantId);
    if (participantIndex === -1) return;
    
    const participant = waitingParticipants[participantIndex];
    
    // Remove from waiting room
    waitingParticipants.splice(participantIndex, 1);
    updateWaitingRoom();
    
    showToast('Participant Denied', `${participant.patient.name} was not admitted to the session`, 'warning');
}

function admitAllParticipants() {
    if (waitingParticipants.length === 0) return;
    
    // Admit the first participant (in a real app, you might admit all)
    const participant = waitingParticipants[0];
    waitingParticipants = [];
    updateWaitingRoom();
    
    // Start the session
    startVideoSession(participant.patient);
    
    showToast('Participants Admitted', 'All participants have joined the session', 'success');
}

function startSessionWithoutPatient() {
    // Start a session without a patient (for testing or notes)
    startVideoSession(null);
    showToast('Session Started', 'Session started without a patient', 'info');
}

function closeWaitingRoomHandler() {
    waitingRoom.style.display = 'none';
    currentSession = null;
    waitingParticipants = [];
    
    showToast('Session Cancelled', 'The session has been cancelled', 'warning');
}

function copySessionLink() {
    sessionLink.select();
    document.execCommand('copy');
    
    showToast('Link Copied', 'Session link copied to clipboard', 'success');
}

async function startVideoSession(patient) {
    try {
        // Hide waiting room, show video and controls
        waitingRoom.style.display = 'none';
        sessionControls.style.display = 'block';
        videoContainer.style.display = 'block';
        
        // Update session title
        const sessionTitle = document.getElementById('sessionTitle');
        if (patient) {
            sessionTitle.textContent = `Session with ${patient.name}`;
            document.getElementById('remoteParticipantName').textContent = patient.name;
        } else {
            sessionTitle.textContent = 'Session (No Patient)';
            document.getElementById('remoteParticipantName').textContent = 'No Patient';
        }
        
        // Get user media
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        
        // Set local video stream
        localVideo.srcObject = stream;
        
        // Simulate remote connection (in a real app, this would use WebRTC)
        simulateRemoteConnection();
        
        // Add to active sessions
        if (currentSession) {
            currentSession.status = 'active';
            activeSessions.push(currentSession);
            renderActiveSessions();
        }
        
        showToast('Session Started', 'Video session is now active', 'success');
    } catch (error) {
        console.error('Error starting video session:', error);
        showToast('Error', 'Could not access camera or microphone', 'error');
    }
}

function simulateRemoteConnection() {
    // Simulate connection status changes
    connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>Connecting...</span>';
    
    setTimeout(() => {
        connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>Connected</span>';
        
        // Simulate remote video (in a real app, this would be the actual remote stream)
        // For demo purposes, we'll use a placeholder
        remoteVideo.src = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        remoteVideo.loop = true;
        remoteVideo.muted = true; // Mute to avoid feedback
    }, 2000);
}

function toggleVideoHandler() {
    if (!stream) return;
    
    isVideoEnabled = !isVideoEnabled;
    
    const videoTracks = stream.getVideoTracks();
    videoTracks.forEach(track => {
        track.enabled = isVideoEnabled;
    });
    
    toggleVideo.innerHTML = `
        <i class="fas fa-video${isVideoEnabled ? '' : '-slash'}"></i>
        <span>Video ${isVideoEnabled ? 'On' : 'Off'}</span>
    `;
    
    localVideoIndicator.className = `control-indicator ${isVideoEnabled ? '' : 'video-off'}`;
    localVideoIndicator.innerHTML = `<i class="fas fa-video${isVideoEnabled ? '' : '-slash'}"></i>`;
    
    showToast('Video', `Video ${isVideoEnabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleAudioHandler() {
    if (!stream) return;
    
    isAudioEnabled = !isAudioEnabled;
    
    const audioTracks = stream.getAudioTracks();
    audioTracks.forEach(track => {
        track.enabled = isAudioEnabled;
    });
    
    toggleAudio.innerHTML = `
        <i class="fas fa-microphone${isAudioEnabled ? '' : '-slash'}"></i>
        <span>Audio ${isAudioEnabled ? 'On' : 'Off'}</span>
    `;
    
    localAudioIndicator.className = `control-indicator ${isAudioEnabled ? '' : 'audio-off'}`;
    localAudioIndicator.innerHTML = `<i class="fas fa-microphone${isAudioEnabled ? '' : '-slash'}"></i>`;
    
    showToast('Audio', `Audio ${isAudioEnabled ? 'enabled' : 'disabled'}`, 'info');
}

async function shareScreenHandler() {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });
        
        // Replace the video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnection ? peerConnection.getSenders().find(s => s.track && s.track.kind === 'video') : null;
        
        if (sender) {
            sender.replaceTrack(videoTrack);
        }
        
        // Handle when the user stops screen sharing
        videoTrack.onended = function() {
            if (stream) {
                const originalVideoTrack = stream.getVideoTracks()[0];
                if (sender) {
                    sender.replaceTrack(originalVideoTrack);
                }
            }
        };
        
        showToast('Screen Sharing', 'Your screen is now being shared', 'success');
    } catch (error) {
        console.error('Error sharing screen:', error);
        showToast('Error', 'Could not share screen', 'error');
    }
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add message to chat
    addChatMessage(message, 'sent');
    
    // Simulate response (in a real app, this would come from the other participant)
    setTimeout(() => {
        addChatMessage('Thank you for the information.', 'received');
    }, 1000);
    
    // Clear input
    chatInput.value = '';
}

function addChatMessage(message, type) {
    const messageElement = document.createElement('article');
    messageElement.className = `chat-message ${type}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
        <p>${message}</p>
        <span class="message-time">${timeString}</span>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleResourceShare(e) {
    e.preventDefault();
    
    const resourceTypeValue = resourceType.value;
    const resourceMessage = document.getElementById('resourceMessage').value;
    
    if (resourceTypeValue === 'pdf') {
        const fileInput = document.getElementById('resourceFile');
        if (!fileInput.files.length) {
            showToast('Error', 'Please select a PDF file', 'error');
            return;
        }
        
        const file = fileInput.files[0];
        addChatMessage(`Shared a PDF: ${file.name}${resourceMessage ? ` - ${resourceMessage}` : ''}`, 'sent');
        
        // Simulate response
        setTimeout(() => {
            addChatMessage('Thank you for the resource.', 'received');
        }, 1000);
        
    } else if (resourceTypeValue === 'link') {
        const link = document.getElementById('resourceLink').value;
        if (!link) {
            showToast('Error', 'Please enter a web address', 'error');
            return;
        }
        
        addChatMessage(`Shared a link: ${link}${resourceMessage ? ` - ${resourceMessage}` : ''}`, 'sent');
        
        // Simulate response
        setTimeout(() => {
            addChatMessage('Thank you for the link.', 'received');
        }, 1000);
    }
    
    resourceModal.close();
    showToast('Resource Shared', 'Resource has been sent to the chat', 'success');
}

function toggleResourceInputs() {
    const resourceTypeValue = resourceType.value;
    
    if (resourceTypeValue === 'pdf') {
        resourceFileGroup.style.display = 'block';
        resourceLinkGroup.style.display = 'none';
    } else if (resourceTypeValue === 'link') {
        resourceFileGroup.style.display = 'none';
        resourceLinkGroup.style.display = 'block';
    } else {
        resourceFileGroup.style.display = 'none';
        resourceLinkGroup.style.display = 'none';
    }
}

function endSessionHandler() {
    if (!currentSession) return;
    
    // Stop all tracks
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    // Hide video and controls
    sessionControls.style.display = 'none';
    videoContainer.style.display = 'none';
    
    // Remove from active sessions
    const sessionIndex = activeSessions.findIndex(s => s.id === currentSession.id);
    if (sessionIndex !== -1) {
        activeSessions.splice(sessionIndex, 1);
    }
    
    // Add to history
    const endedSession = {
        ...currentSession,
        status: 'completed',
        attendance: 'attended',
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    mockSessionHistory.unshift(endedSession);
    renderSessionHistory();
    renderActiveSessions();
    
    // Show attendance modal
    const patient = mockPatients.find(p => p.id === currentSession.patientId);
    if (patient) {
        openAttendanceModal(endedSession, patient);
    }
    
    // Generate note stub (simulated)
    generateNoteStub();
    
    currentSession = null;
    showToast('Session Ended', 'The video session has been ended', 'info');
}

function generateNoteStub() {
    // In a real app, this would create a note in the database
    // For demo purposes, we'll just show a toast
    showToast('Note Created', 'A session note stub has been generated', 'success');
}

function handleAttendanceSubmit(e) {
    e.preventDefault();
    
    const sessionId = document.getElementById('attendanceSessionId').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const cancellationReason = document.getElementById('cancellationReason').value;
    
    // Update session history
    const sessionIndex = mockSessionHistory.findIndex(s => s.id === parseInt(sessionId));
    if (sessionIndex !== -1) {
        mockSessionHistory[sessionIndex].attendance = attendance;
        if (attendance === 'cancelled') {
            mockSessionHistory[sessionIndex].reason = cancellationReason;
        }
    }
    
    attendanceModal.close();
    showToast('Attendance Updated', 'Attendance status has been saved', 'success');
}

function handleFollowupSubmit(e) {
    e.preventDefault();
    
    const sessionId = document.getElementById('followupSessionId').value;
    const message = document.getElementById('followupMessage').value;
    const includeSummary = document.getElementById('includeSummary').checked;
    const scheduleNext = document.getElementById('scheduleNext').checked;
    
    // In a real app, this would send a message to the patient
    // For demo purposes, we'll just show a toast
    
    let toastMessage = 'Follow-up message sent';
    if (includeSummary) toastMessage += ' with session summary';
    if (scheduleNext) toastMessage += ' and next session scheduled';
    
    followupModal.close();
    showToast('Message Sent', toastMessage, 'success');
}

function startSessionFromList(sessionId) {
    const session = mockSessions.find(s => s.id === parseInt(sessionId));
    if (!session) return;
    
    const patient = mockPatients.find(p => p.id === session.patientId);
    if (!patient) return;
    
    currentSession = session;
    
    // Generate a unique session link
    const uniqueSessionId = generateSessionId();
    sessionLink.value = `${window.location.origin}/join-session/${uniqueSessionId}`;
    
    // Show waiting room
    waitingRoom.style.display = 'block';
    
    showToast('Session Ready', 'Waiting room is ready. Share the link with your patient.', 'success');
    
    // Simulate patient joining after a delay
    setTimeout(() => {
        simulatePatientJoining(patient);
    }, 3000);
}

function joinExistingSession(sessionId) {
    const session = activeSessions.find(s => s.id === parseInt(sessionId));
    if (!session) return;
    
    const patient = mockPatients.find(p => p.id === session.patientId);
    if (!patient) return;
    
    currentSession = session;
    startVideoSession(patient);
}

function cancelSession(sessionId) {
    const sessionIndex = mockSessions.findIndex(s => s.id === parseInt(sessionId));
    if (sessionIndex === -1) return;
    
    const session = mockSessions[sessionIndex];
    const patient = mockPatients.find(p => p.id === session.patientId);
    
    mockSessions.splice(sessionIndex, 1);
    renderUpcomingSessions();
    
    showToast('Session Cancelled', `Session with ${patient ? patient.name : 'patient'} has been cancelled`, 'warning');
}

function showSessionDetails(session, patient) {
    // In a real app, this would show a detailed view of the session
    // For demo purposes, we'll just show a toast
    showToast('Session Details', `Viewing details for session with ${patient.name} on ${session.date}`, 'info');
}

function filterSessions() {
    renderSessionHistory();
}

function showToast(title, message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('section');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('article');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
        <section class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </section>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add close event
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Pre-session checks
function triggerPreSessionChecks() {
    // Check camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            stream.getTracks().forEach(track => track.stop());
            showToast('Camera Test', 'Camera is working properly', 'success');
        })
        .catch(error => {
            showToast('Camera Test', 'Camera access failed: ' + error.message, 'error');
        });
    
    // Check microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            stream.getTracks().forEach(track => track.stop());
            showToast('Microphone Test', 'Microphone is working properly', 'success');
        })
        .catch(error => {
            showToast('Microphone Test', 'Microphone access failed: ' + error.message, 'error');
        });
}

// Admin functionality for viewing logs
function viewTelehealthLogs() {
    // In a real app, this would fetch and display logs from the server
    // For demo purposes, we'll just show a toast
    showToast('Telehealth Logs', 'Viewing telehealth usage statistics', 'info');
}

// Initialize pre-session checks on page load if needed
// triggerPreSessionChecks();

// Export functions for use in other modules if needed
// export { showToast, triggerPreSessionChecks, viewTelehealthLogs };