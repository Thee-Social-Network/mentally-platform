// psy-dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
    
    // Set current date
    setCurrentDate();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup accessibility features
    setupAccessibility();
    
    // Load recent notes
    loadRecentNotes();
    
    // Load stats
    updateStats();
    
    // Initialize join buttons
    const joinButtons = document.querySelectorAll('.join-btn');
    
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sessionItem = this.closest('.session-item');
            const sessionInfo = sessionItem.querySelector('.session-info');
            const patientName = sessionInfo.querySelector('h3').textContent;
            const sessionType = sessionInfo.querySelector('p').textContent.split(' - ')[0];
            
            // Start the telehealth session
            startTelehealthSession(patientName, sessionType);
        });
    });
    
    // Function to start telehealth session
    function startTelehealthSession(patientName, sessionType) {
        // Hide other cards and show session controls and video
        document.querySelectorAll('.card').forEach(card => {
            if (!card.id.includes('sessionControls') && 
                !card.id.includes('videoContainer') && 
                !card.id.includes('waitingRoom')) {
                card.style.display = 'none';
            }
        });
        
        // Show session controls and video container
        const sessionControls = document.getElementById('sessionControls');
        const videoContainer = document.getElementById('videoContainer');
        if (sessionControls) sessionControls.style.display = 'block';
        if (videoContainer) videoContainer.style.display = 'block';
        
        // Update session title
        const sessionTitle = document.getElementById('sessionTitle');
        if (sessionTitle) {
            sessionTitle.textContent = `${sessionType} with ${patientName}`;
        }
        
        // Simulate starting a session (this would be replaced with actual WebRTC code)
        simulateSessionStart();
        
        // Scroll to the video section
        if (videoContainer) {
            videoContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function simulateSessionStart() {
        // This is a simulation - in a real implementation, you would initialize WebRTC here
        console.log('Starting telehealth session simulation');
        
        // Show waiting room after a delay (simulating connection process)
        setTimeout(() => {
            const waitingRoom = document.getElementById('waitingRoom');
            const sessionLink = document.getElementById('sessionLink');
            if (waitingRoom) waitingRoom.style.display = 'block';
            if (sessionLink) sessionLink.value = window.location.href + '?session=12345';
        }, 2000);
    }
    
    // Add event listeners for session control buttons
    const endSessionBtn = document.getElementById('endSession');
    if (endSessionBtn) {
        endSessionBtn.addEventListener('click', function() {
            // End the session and return to dashboard
            document.querySelectorAll('.card').forEach(card => {
                card.style.display = 'block';
            });
            
            const sessionControls = document.getElementById('sessionControls');
            const videoContainer = document.getElementById('videoContainer');
            const waitingRoom = document.getElementById('waitingRoom');
            
            if (sessionControls) sessionControls.style.display = 'none';
            if (videoContainer) videoContainer.style.display = 'none';
            if (waitingRoom) waitingRoom.style.display = 'none';
            
            // Scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Copy link functionality
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const sessionLink = document.getElementById('sessionLink');
            if (sessionLink) {
                sessionLink.select();
                document.execCommand('copy');
                
                // Show confirmation
                alert('Session link copied to clipboard!');
            }
        });
    }
});

// Initialize dashboard
function initDashboard() {
    console.log('Mentaly Psychologist Dashboard initialized');
    
    // Animate cards on load
    animateCards();
    
    // Set active navigation based on current page
    setActiveNavigation();
}

// Set current date in the header
function setCurrentDate() {
    const dateElement = document.querySelector('.date-info');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    if (navButtons.length > 0) {
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleNavigation(this.dataset.page);
            });
        });
    }
    
    // Emergency button
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyModal = document.getElementById('emergencyModal');
    const closeEmergencyModal = document.getElementById('closeEmergencyModal');
    
    if (emergencyBtn && emergencyModal) {
        emergencyBtn.addEventListener('click', () => {
            emergencyModal.showModal();
        });
    }
    
    if (closeEmergencyModal && emergencyModal) {
        closeEmergencyModal.addEventListener('click', () => {
            emergencyModal.close();
        });
        
        // Close modal when clicking outside
        emergencyModal.addEventListener('click', (e) => {
            if (e.target === emergencyModal) {
                emergencyModal.close();
            }
        });
    }
    
    // Session action buttons
    const joinButtons = document.querySelectorAll('.join-btn');
    if (joinButtons.length > 0) {
        joinButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const sessionItem = this.closest('.session-item');
                const sessionTitle = sessionItem.querySelector('h3').textContent;
                alert(`Joining session: ${sessionTitle}`);
                // Here you would typically connect to your telehealth API
            });
        });
    }
    
    // Note buttons in Today's Sessions
    const noteButtons = document.querySelectorAll('.note-btn');
    const noteModal = document.getElementById('noteModal');
    
    if (noteButtons.length > 0 && noteModal) {
        noteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const sessionItem = this.closest('.session-item');
                const patientName = sessionItem.querySelector('p').textContent.split(' - ')[0];
                const sessionType = sessionItem.querySelector('h3').textContent;
                
                // Set patient and session type in the modal
                populatePatientSelect(patientName);
                
                // Check the appropriate session type radio button
                const sessionTypeRadios = document.querySelectorAll('input[name="sessionType"]');
                sessionTypeRadios.forEach(radio => {
                    if (radio.value === sessionType.toLowerCase().replace(' ', '-')) {
                        radio.checked = true;
                    } else if (sessionType === 'Group Therapy' && radio.value === 'group') {
                        radio.checked = true;
                    }
                });
                
                // Set today's date
                const today = new Date().toISOString().split('T')[0];
                const sessionDate = document.getElementById('sessionDate');
                if (sessionDate) sessionDate.value = today;
                
                // Show the modal
                noteModal.showModal();
                
                // Update modal title
                const noteModalTitle = document.getElementById('noteModalTitle');
                if (noteModalTitle) {
                    noteModalTitle.textContent = `Create Note for ${patientName}`;
                }
            });
        });
    }
    
    // Document action buttons
    const docButtons = document.querySelectorAll('.doc-action-btn');
    if (docButtons.length > 0) {
        docButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const docItem = this.closest('.doc-item');
                const docTitle = docItem.querySelector('h3').textContent;
                alert(`Completing document: ${docTitle}`);
                // Here you would typically open a document editor
            });
        });
    }
    
    // Alert action buttons
    const alertButtons = document.querySelectorAll('.alert-action-btn');
    if (alertButtons.length > 0) {
        alertButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const alertItem = this.closest('.alert-item');
                const alertTitle = alertItem.querySelector('h3').textContent;
                alert(`Taking action on alert: ${alertTitle}`);
                // Here you would typically open a safety plan or assessment tool
            });
        });
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Handle filter change
                handleFilterChange(this.dataset.filter);
            });
        });
    }
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Modal close buttons
    const closeNoteModal = document.getElementById('closeNoteModal');
    const cancelNote = document.getElementById('cancelNote');
    
    if (closeNoteModal && noteModal) {
        closeNoteModal.addEventListener('click', () => {
            noteModal.close();
        });
    }
    
    if (cancelNote && noteModal) {
        cancelNote.addEventListener('click', () => {
            noteModal.close();
        });
    }
    
    // Form submission
    const noteForm = document.getElementById('noteForm');
    
    if (noteForm) {
        noteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const saveAction = e.submitter.value;
            
            // Create note object
            const note = {
                id: `note-${Date.now()}`, // Generate unique ID
                patientId: getPatientIdByName(formData.get('patientId')),
                date: formData.get('date'),
                timeStart: formData.get('timeStart'),
                timeEnd: formData.get('timeEnd'),
                attended: formData.get('attended') === 'yes',
                sessionType: formData.get('sessionType'),
                template: formData.get('template'),
                status: saveAction === 'draft' ? 'draft' : 'completed',
                lastModified: new Date().toISOString(),
                assessments: [],
                files: []
            };
            
            // Handle other session type
            if (note.sessionType === 'other') {
                note.sessionType = formData.get('otherType') || 'other';
            }
            
            // Add template-specific fields
            if (note.template === 'soap') {
                note.subjective = formData.get('subjective');
                note.objective = formData.get('objective');
                note.assessment = formData.get('assessment');
                note.plan = formData.get('plan');
            } else if (note.template === 'custom') {
                note.presentingIssue = formData.get('presentingIssue');
                note.moodAffect = formData.get('moodAffect');
                note.reportedProgress = formData.get('reportedProgress');
                note.behavioralObservations = formData.get('behavioralObservations');
                note.mentalStatusExam = formData.get('mentalStatusExam');
                note.interventionsUsed = formData.get('interventionsUsed');
                note.progressGoals = formData.get('progressGoals');
                note.hasRisk = formData.get('hasRisk') === 'yes';
                note.riskDetails = formData.get('riskDetails');
                note.diagnosis = formData.get('diagnosis');
                note.nextSteps = formData.get('nextSteps');
                note.nextSession = formData.get('nextSession');
                note.referrals = formData.get('referrals');
            }
            
            // Get assessments
            if (formData.getAll('assessments').includes('phq9')) {
                note.assessments.push('phq9');
            }
            if (formData.getAll('assessments').includes('gad7')) {
                note.assessments.push('gad7');
            }
            
            // Save the note
            saveNote(note);
            
            // Close the modal
            if (noteModal) noteModal.close();
            
            // Reset the form
            this.reset();
            
            // Update the recent notes list
            loadRecentNotes();
            
            // Update stats
            updateStats();
            
            // Show success message
            showNotification(`Note ${saveAction === 'draft' ? 'saved as draft' : 'completed successfully'}!`, 'success');
        });
    }
    
    // Session type other input toggle
    const sessionTypeRadios = document.querySelectorAll('input[name="sessionType"]');
    if (sessionTypeRadios.length > 0) {
        sessionTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const otherInput = document.getElementById('otherSessionType');
                if (otherInput) {
                    otherInput.style.display = this.value === 'other' ? 'block' : 'none';
                }
            });
        });
    }
    
    // Risk assessment toggle
    const hasRiskCheckbox = document.getElementById('hasRisk');
    if (hasRiskCheckbox) {
        hasRiskCheckbox.addEventListener('change', function() {
            const riskDetails = document.getElementById('riskDetails');
            if (riskDetails) {
                riskDetails.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
    
    // Note template change
    const noteTemplate = document.getElementById('noteTemplate');
    if (noteTemplate) {
        noteTemplate.addEventListener('change', function() {
            const template = this.value;
            const soapTemplate = document.getElementById('soapTemplate');
            const mentalyTemplate = document.getElementById('mentalyTemplate');
            
            if (soapTemplate && mentalyTemplate) {
                if (template === 'soap' || template === 'dap' || template === 'freeform') {
                    soapTemplate.style.display = 'block';
                    mentalyTemplate.style.display = 'none';
                } else if (template === 'custom') {
                    soapTemplate.style.display = 'none';
                    mentalyTemplate.style.display = 'block';
                } else {
                    soapTemplate.style.display = 'none';
                    mentalyTemplate.style.display = 'none';
                }
            }
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (noteModal && e.target === noteModal) noteModal.close();
        if (emergencyModal && e.target === emergencyModal) emergencyModal.close();
    });
}

// Handle navigation between pages
function handleNavigation(page) {
    console.log(`Navigating to: ${page}`);
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
    if (navButtons.length > 0) {
        navButtons.forEach(button => button.classList.remove('active'));
    }
    
    // Add active class to clicked button
    const activeButton = document.querySelector(`[data-page="${page}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = getPageTitle(page);
    }
    
    // Redirect to the appropriate page
    redirectToPage(page);
}

// Redirect to the appropriate HTML page
function redirectToPage(page) {
    const pageMap = {
        'psy-dashboard': 'pys-dashboard.html',
        'patients': 'patients.html',
        'notes': 'progress-notes.html',
        'telehealth': 'telehealth.html',
        'messages': 'messages.html',
        'tasks': 'tasks.html',
        'resources': 'resources.html'
    };
    
    const targetPage = pageMap[page];
    if (targetPage && page !== 'psy-dashboard') {
        // Use relative path from the current location
        window.location.href = `../html/${targetPage}`;
    }
}

// Get page title based on page identifier
function getPageTitle(page) {
    const titles = {
        'psy-dashboard': 'My Day',
        'patients': 'Patients',
        'notes': 'Progress Notes',
        'telehealth': 'Telehealth',
        'messages': 'Messages',
        'tasks': 'Tasks',
        'resources': 'Resources'
    };
    
    return titles[page] || 'Mentaly Dashboard';
}

// Handle filter change
function handleFilterChange(filter) {
    console.log(`Filter changed to: ${filter}`);
    
    // Here you would typically filter the dashboard content
    // For this demo, we'll just log the filter change
}

// Setup accessibility features
function setupAccessibility() {
    const fontSizeToggle = document.getElementById('fontSizeToggle');
    const contrastToggle = document.getElementById('contrastToggle');
    
    // Check if high contrast mode was previously enabled
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Check if large font mode was previously enabled
    if (localStorage.getItem('largeFont') === 'true') {
        document.body.classList.add('large-font');
    }
    
    if (fontSizeToggle) {
        fontSizeToggle.addEventListener('click', toggleFontSize);
    }
    
    if (contrastToggle) {
        contrastToggle.addEventListener('click', toggleContrast);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close modal with Escape key
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('dialog');
            modals.forEach(modal => {
                if (modal.open) {
                    modal.close();
                }
            });
        }
    });
}

// Toggle font size for accessibility
function toggleFontSize() {
    document.body.classList.toggle('large-font');
    
    const isLargeFont = document.body.classList.contains('large-font');
    localStorage.setItem('largeFont', isLargeFont);
    showNotification(isLargeFont ? 'Large font enabled' : 'Large font disabled', 'info');
}

// Toggle contrast for accessibility
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    
    const isHighContrast = document.body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHighContrast);
    showNotification(isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled', 'info');
}

// Animate cards on page load
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
    });
}

// Set active navigation based on current page
function setActiveNavigation() {
    // For this demo, we'll set the dashboard as active by default
    // In a real application, you would determine the current page from the URL
    const dashboardButton = document.querySelector('[data-page="psy-dashboard"]');
    if (dashboardButton) {
        dashboardButton.classList.add('active');
    }
}

// Utility function to format dates
function formatDate(date, format = 'long') {
    const options = format === 'short' ? 
        { month: 'short', day: 'numeric' } : 
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    return date.toLocaleDateString('en-US', options);
}

// Utility function to format times
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification.success {
                background: #28a745;
                color: white;
            }
            
            .notification.error {
                background: #dc3545;
                color: white;
            }
            
            .notification.info {
                background: var(--pacer-navy);
                color: white;
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: var(--transition);
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Set timeout to remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }
}

// Patient data (same as in progress-notes.js)
const patients = [
    {
        id: 1,
        firstName: "Anna",
        lastName: "Smith",
        dateOfBirth: "1993-05-15",
        age: 32,
        gender: "female",
        email: "anna.smith@example.com",
        phone: "+1234567890",
        address: "123 Main St",
        city: "Indianapolis",
        zipCode: "46201",
        status: "active",
        riskLevel: "high",
        tags: ["suicide-risk", "consent-needed"],
        presentingProblem: "Severe depression with suicidal ideation",
        referralSource: "physician",
        lastSession: "2025-09-01"
    },
    {
        id: 2,
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1997-11-22",
        age: 28,
        gender: "male",
        email: "john.doe@example.com",
        phone: "+1234567891",
        address: "456 Oak Ave",
        city: "Indianapolis",
        zipCode: "46202",
        status: "active",
        riskLevel: "medium",
        tags: ["self-harm"],
        presentingProblem: "Anxiety disorder with self-harm tendencies",
        referralSource: "self",
        lastSession: "2025-08-30"
    },
    {
        id: 3,
        firstName: "Mike",
        lastName: "Johnson",
        dateOfBirth: "1980-03-10",
        age: 45,
        gender: "male",
        email: "mike.johnson@example.com",
        phone: "+1234567892",
        address: "789 Pine Rd",
        city: "Indianapolis",
        zipCode: "46203",
        status: "active",
        riskLevel: "low",
        tags: ["treatment-plan"],
        presentingProblem: "Adjustment disorder with mild anxiety",
        referralSource: "other-provider",
        lastSession: "2025-09-02"
    },
    {
        id: 4,
        firstName: "Lisa",
        lastName: "Wilson",
        dateOfBirth: "1996-07-18",
        age: 29,
        gender: "female",
        email: "lisa.wilson@example.com",
        phone: "+1234567893",
        address: "321 Elm St",
        city: "Indianapolis",
        zipCode: "46204",
        status: "intake",
        riskLevel: "medium",
        tags: ["consent-needed"],
        presentingProblem: "Relationship issues and mild depression",
        referralSource: "family",
        lastSession: null
    },
    {
        id: 5,
        firstName: "David",
        lastName: "Brown",
        dateOfBirth: "1987-12-05",
        age: 38,
        gender: "male",
        email: "david.brown@example.com",
        phone: "+1234567894",
        address: "654 Maple Ave",
        city: "Indianapolis",
        zipCode: "46205",
        status: "archived",
        riskLevel: "low",
        tags: ["completed"],
        presentingProblem: "Generalized anxiety disorder - treatment completed",
        referralSource: "physician",
        lastSession: "2025-06-15"
    }
];

// Get patient ID by name
function getPatientIdByName(name) {
    const patient = patients.find(p => `${p.firstName} ${p.lastName}` === name);
    return patient ? patient.id : null;
}

// Populate patient select dropdown
function populatePatientSelect(selectedPatient = null) {
    const patientSelect = document.getElementById('patientSelect');
    if (!patientSelect) return;
    
    // Clear existing options except the first one
    while (patientSelect.options.length > 1) {
        patientSelect.remove(1);
    }
    
    // Add patients from patients array
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = `${patient.firstName} ${patient.lastName}`;
        option.textContent = `${patient.firstName} ${patient.lastName}`;
        
        // Select if it matches the provided patient name
        if (selectedPatient && option.value === selectedPatient) {
            option.selected = true;
        }
        
        patientSelect.appendChild(option);
    });
}

// Save note to localStorage
function saveNote(note) {
    // Get existing notes
    let notes = JSON.parse(localStorage.getItem('progressNotes')) || [];
    
    // Add new note at the beginning
    notes.unshift(note);
    
    // Save to localStorage
    localStorage.setItem('progressNotes', JSON.stringify(notes));
    
    return note;
}

// Load recent notes
function loadRecentNotes() {
    const notesList = document.getElementById('newNotesList');
    if (!notesList) return;
    
    // Get notes from localStorage
    const notes = JSON.parse(localStorage.getItem('progressNotes')) || [];
    
    // Clear the list
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p class="no-notes">No recent notes. Create your first note!</p>';
        return;
    }
    
    // Sort by creation date (newest first)
    notes.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
    // Display the 5 most recent notes
    const recentNotes = notes.slice(0, 5);
    
    recentNotes.forEach(note => {
        const patient = patients.find(p => p.id === note.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
        
        // Format date for display
        const noteDate = new Date(note.date);
        const formattedDate = noteDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Status badge
        let statusClass = '';
        let statusText = '';
        
        switch(note.status) {
            case 'draft':
                statusClass = 'status-draft';
                statusText = 'Draft';
                break;
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'Completed';
                break;
            case 'awaiting-cosign':
                statusClass = 'status-awaiting';
                statusText = 'Awaiting Co-sign';
                break;
        }
        
        const noteElement = document.createElement('article');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <i class="fas fa-file-medical"></i>
            <section class="note-info">
                <h3>${patientName}</h3>
                <p>${formattedDate} | ${note.sessionType.charAt(0).toUpperCase() + note.sessionType.slice(1)}</p>
            </section>
            <span class="status-badge ${statusClass}">${statusText}</span>
        `;
        
        notesList.appendChild(noteElement);
    });
}

// Update statistics
function updateStats() {
    const totalNotesEl = document.getElementById('totalNotes');
    const draftNotesEl = document.getElementById('draftNotes');
    const completedNotesEl = document.getElementById('completedNotes');
    const overdueNotesEl = document.getElementById('overdueNotes');
    
    if (!totalNotesEl || !draftNotesEl || !completedNotesEl || !overdueNotesEl) return;
    
    // Get notes from localStorage
    const notes = JSON.parse(localStorage.getItem('progressNotes')) || [];
    
    // Update counts
    totalNotesEl.textContent = notes.length;
    draftNotesEl.textContent = notes.filter(note => note.status === 'draft').length;
    completedNotesEl.textContent = notes.filter(note => note.status === 'completed').length;
    
    // Calculate overdue notes (draft notes older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const overdueCount = notes.filter(note => {
        if (note.status !== 'draft') return false;
        
        const noteDate = new Date(note.lastModified);
        return noteDate < sevenDaysAgo;
    }).length;
    
    overdueNotesEl.textContent = overdueCount;
}

// Export functions for use in other modules (if needed)
window.MentalyDashboard = {
    initDashboard,
    handleNavigation,
    formatDate,
    formatTime,
    showNotification,
    saveNote,
    loadRecentNotes,
    updateStats
};