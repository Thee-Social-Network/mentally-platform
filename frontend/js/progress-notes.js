// progress-notes.js
// Progress Notes JavaScript functionality

// DOM Elements
const notesSearch = document.getElementById('notesSearch');
const statusFilter = document.getElementById('statusFilter');
const patientFilter = document.getElementById('patientFilter');
const dateFilter = document.getElementById('dateFilter');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const clearFilters = document.getElementById('clearFilters');
const notesTableBody = document.getElementById('notesTableBody');
const notesGrid = document.getElementById('notesGrid');
const viewOptions = document.querySelectorAll('.view-option');
const listView = document.getElementById('listView');
const gridView = document.getElementById('gridView');
const createNoteBtn = document.getElementById('createNoteBtn');
const noteModal = document.getElementById('noteModal');
const closeNoteModal = document.getElementById('closeNoteModal');
const cancelNote = document.getElementById('cancelNote');
const noteForm = document.getElementById('noteForm');
const noteTemplate = document.getElementById('noteTemplate');
const soapTemplate = document.getElementById('soapTemplate');
const mentalyTemplate = document.getElementById('mentalyTemplate');
const viewNoteModal = document.getElementById('viewNoteModal');
const closeViewNoteModal = document.getElementById('closeViewNoteModal');
const printNoteBtn = document.getElementById('printNoteBtn');
const exportNoteBtn = document.getElementById('exportNoteBtn');
const editNoteBtn = document.getElementById('editNoteBtn');
const cosignModal = document.getElementById('cosignModal');
const closeCosignModal = document.getElementById('closeCosignModal');
const cancelCosign = document.getElementById('cancelCosign');
const cosignForm = document.getElementById('cosignForm');
const emergencyBtn = document.getElementById('emergencyBtn');
const emergencyModal = document.getElementById('emergencyModal');
const closeEmergencyModal = document.getElementById('closeEmergencyModal');
const totalNotes = document.getElementById('totalNotes');
const draftNotes = document.getElementById('draftNotes');
const completedNotes = document.getElementById('completedNotes');
const overdueNotes = document.getElementById('overdueNotes');

// Patient data (replacing the import statement)
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

// State management
let notes = JSON.parse(localStorage.getItem('progressNotes')) || [];
let filteredNotes = [...notes];
let currentView = 'list';
let currentNoteId = null;
let currentEditingNote = null;

// Initialize the page
function initProgressNotes() {
    loadNotes();
    populatePatientFilters();
    setupEventListeners();
    updateStats();
    setCurrentDate();
}

// Set current date in header
function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.querySelector('.date-info').textContent = now.toLocaleDateString('en-US', options);
}

// Load notes from localStorage or create sample data
function loadNotes() {
    if (notes.length === 0) {
        // Create sample notes if none exist
        createSampleNotes();
    }
    
    filteredNotes = [...notes];
    renderNotes();
}

// Create sample notes for demonstration
function createSampleNotes() {
    const sampleNotes = [
        {
            id: 'note-1',
            patientId: 1,
            date: '2025-09-01',
            timeStart: '10:00',
            timeEnd: '10:50',
            attended: true,
            sessionType: 'individual',
            template: 'soap',
            subjective: 'Client reports increased anxiety about upcoming work presentation. States sleep has been affected, averaging 5-6 hours per night.',
            objective: 'Client appeared fidgety and made minimal eye contact during session. Speech was rapid at times.',
            assessment: 'Anxiety symptoms appear to be situational, related to work stress. Client is using coping strategies but needs reinforcement.',
            plan: 'Practice deep breathing exercises daily. Schedule follow-up in two weeks to assess progress.',
            status: 'completed',
            lastModified: '2025-09-01T10:55:00',
            assessments: ['phq9'],
            files: []
        },
        {
            id: 'note-2',
            patientId: 2,
            date: '2025-08-30',
            timeStart: '14:00',
            timeEnd: '14:50',
            attended: true,
            sessionType: 'family',
            template: 'custom',
            presentingIssue: 'Family conflict regarding household responsibilities',
            moodAffect: 'Frustrated but engaged in session',
            reportedProgress: 'Some improvement in communication but still significant tension',
            behavioralObservations: 'Family members interrupted each other frequently initially but improved with facilitation',
            mentalStatusExam: 'All family members oriented x3, appropriate affect',
            interventionsUsed: 'Family systems approach, communication skills training',
            progressGoals: 'Partial progress on improving communication patterns',
            hasRisk: false,
            riskDetails: '',
            diagnosis: 'Z63.0 Relationship distress with spouse or partner',
            nextSteps: 'Practice active listening techniques at home, schedule individual session with parents',
            nextSession: '2025-09-13',
            referrals: '',
            status: 'draft',
            lastModified: '2025-08-30T15:10:00',
            assessments: [],
            files: []
        },
        {
            id: 'note-3',
            patientId: 3,
            date: '2025-08-28',
            timeStart: '11:00',
            timeEnd: '11:50',
            attended: true,
            sessionType: 'individual',
            template: 'soap',
            subjective: 'Client reports improved mood since starting medication. Enjoying daily walks and connecting with friends.',
            objective: 'Client smiled frequently and maintained good eye contact. Appeared relaxed throughout session.',
            assessment: 'Significant improvement in depressive symptoms. Client responding well to combined treatment approach.',
            plan: 'Continue current medication regimen. Focus on maintaining social connections. Next appointment in 4 weeks.',
            status: 'awaiting-cosign',
            lastModified: '2025-08-28T12:05:00',
            assessments: ['phq9', 'gad7'],
            files: []
        }
    ];
    
    notes = sampleNotes;
    localStorage.setItem('progressNotes', JSON.stringify(notes));
    filteredNotes = [...notes];
}

// Populate patient filters with existing patients
function populatePatientFilters() {
    const patientSelect = document.getElementById('patientSelect');
    const patientFilter = document.getElementById('patientFilter');
    
    // Clear existing options except the first one
    while (patientSelect.options.length > 1) {
        patientSelect.remove(1);
    }
    
    while (patientFilter.options.length > 1) {
        patientFilter.remove(1);
    }
    
    // Add patients from patients array
    patients.forEach(patient => {
        const option1 = document.createElement('option');
        option1.value = patient.id;
        option1.textContent = `${patient.firstName} ${patient.lastName}`;
        patientSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = patient.id;
        option2.textContent = `${patient.firstName} ${patient.lastName}`;
        patientFilter.appendChild(option2);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter events
    if (notesSearch) notesSearch.addEventListener('input', filterNotes);
    if (statusFilter) statusFilter.addEventListener('change', filterNotes);
    if (patientFilter) patientFilter.addEventListener('change', filterNotes);
    if (dateFilter) dateFilter.addEventListener('change', handleDateFilterChange);
    if (startDate) startDate.addEventListener('change', filterNotes);
    if (endDate) endDate.addEventListener('change', filterNotes);
    if (clearFilters) clearFilters.addEventListener('click', clearAllFilters);
    
    // View options
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            const view = option.dataset.view;
            changeView(view);
        });
    });
    
    // Note creation and modal events
    if (createNoteBtn) createNoteBtn.addEventListener('click', openCreateNoteModal);
    if (closeNoteModal) closeNoteModal.addEventListener('click', closeModal);
    if (cancelNote) cancelNote.addEventListener('click', closeModal);
    if (noteForm) noteForm.addEventListener('submit', handleNoteSubmit);
    if (noteTemplate) noteTemplate.addEventListener('change', handleTemplateChange);
    
    // View note modal events
    if (closeViewNoteModal) closeViewNoteModal.addEventListener('click', () => viewNoteModal.close());
    if (printNoteBtn) printNoteBtn.addEventListener('click', printNote);
    if (exportNoteBtn) exportNoteBtn.addEventListener('click', exportNoteToPDF);
    if (editNoteBtn) editNoteBtn.addEventListener('click', editNote);
    
    // Co-sign modal events
    if (closeCosignModal) closeCosignModal.addEventListener('click', () => cosignModal.close());
    if (cancelCosign) cancelCosign.addEventListener('click', () => cosignModal.close());
    if (cosignForm) cosignForm.addEventListener('submit', handleCosignSubmit);
    
    // Emergency modal events
    if (emergencyBtn) emergencyBtn.addEventListener('click', () => emergencyModal.showModal());
    if (closeEmergencyModal) closeEmergencyModal.addEventListener('click', () => emergencyModal.close());
    
    // Session type other input toggle
    document.querySelectorAll('input[name="sessionType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherInput = document.getElementById('otherSessionType');
            if (otherInput) {
                otherInput.style.display = this.value === 'other' ? 'block' : 'none';
            }
        });
    });
    
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
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === noteModal) noteModal.close();
        if (e.target === viewNoteModal) viewNoteModal.close();
        if (e.target === cosignModal) cosignModal.close();
        if (e.target === emergencyModal) emergencyModal.close();
    });
}

// Filter notes based on search and filter criteria
function filterNotes() {
    const searchTerm = notesSearch.value.toLowerCase();
    const status = statusFilter.value;
    const patientId = patientFilter.value;
    const dateRange = dateFilter.value;
    
    filteredNotes = notes.filter(note => {
        const patient = patients.find(p => p.id == note.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
        
        // Search term filter
        const matchesSearch = searchTerm === '' || 
            patientName.includes(searchTerm) ||
            (note.subjective && note.subjective.toLowerCase().includes(searchTerm)) ||
            (note.objective && note.objective.toLowerCase().includes(searchTerm)) ||
            (note.assessment && note.assessment.toLowerCase().includes(searchTerm)) ||
            (note.plan && note.plan.toLowerCase().includes(searchTerm)) ||
            (note.presentingIssue && note.presentingIssue.toLowerCase().includes(searchTerm));
        
        // Status filter
        const matchesStatus = status === 'all' || note.status === status;
        
        // Patient filter
        const matchesPatient = patientId === 'all' || note.patientId == patientId;
        
        // Date filter
        let matchesDate = true;
        if (dateRange !== 'all') {
            const noteDate = new Date(note.date);
            const today = new Date();
            
            switch(dateRange) {
                case 'today':
                    matchesDate = noteDate.toDateString() === today.toDateString();
                    break;
                case 'week':
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay());
                    matchesDate = noteDate >= startOfWeek;
                    break;
                case 'month':
                    matchesDate = noteDate.getMonth() === today.getMonth() && 
                                 noteDate.getFullYear() === today.getFullYear();
                    break;
                case 'custom':
                    if (startDate.value && endDate.value) {
                        const start = new Date(startDate.value);
                        const end = new Date(endDate.value);
                        end.setDate(end.getDate() + 1); // Include end date
                        matchesDate = noteDate >= start && noteDate < end;
                    }
                    break;
            }
        }
        
        return matchesSearch && matchesStatus && matchesPatient && matchesDate;
    });
    
    renderNotes();
    updateStats();
}

// Handle date filter change
function handleDateFilterChange() {
    const customDateRange = document.getElementById('customDateRange');
    const customDateRangeEnd = document.getElementById('customDateRangeEnd');
    
    if (dateFilter.value === 'custom') {
        customDateRange.style.display = 'flex';
        customDateRangeEnd.style.display = 'flex';
    } else {
        customDateRange.style.display = 'none';
        customDateRangeEnd.style.display = 'none';
    }
    
    filterNotes();
}

// Clear all filters
function clearAllFilters() {
    notesSearch.value = '';
    statusFilter.value = 'all';
    patientFilter.value = 'all';
    dateFilter.value = 'all';
    startDate.value = '';
    endDate.value = '';
    
    document.getElementById('customDateRange').style.display = 'none';
    document.getElementById('customDateRangeEnd').style.display = 'none';
    
    filteredNotes = [...notes];
    renderNotes();
    updateStats();
}

// Change view between list and grid
function changeView(view) {
    currentView = view;
    
    viewOptions.forEach(option => {
        if (option.dataset.view === view) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    if (view === 'list') {
        listView.style.display = 'block';
        gridView.style.display = 'none';
    } else {
        listView.style.display = 'none';
        gridView.style.display = 'flex';
    }
    
    renderNotes();
}

// Render notes based on current view
function renderNotes() {
    if (currentView === 'list') {
        renderNotesList();
    } else {
        renderNotesGrid();
    }
    
    // Update showing count
    const showingCount = document.getElementById('showingCount');
    if (showingCount) {
        showingCount.textContent = `Showing ${filteredNotes.length} of ${notes.length} notes`;
    }
}

// Render notes in list view
function renderNotesList() {
    if (!notesTableBody) return;
    
    notesTableBody.innerHTML = '';
    
    if (filteredNotes.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 2rem;">
                No notes found matching your criteria.
            </td>
        `;
        notesTableBody.appendChild(tr);
        return;
    }
    
    filteredNotes.forEach(note => {
        const patient = patients.find(p => p.id == note.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
        
        const tr = document.createElement('tr');
        
        // Format date
        const noteDate = new Date(note.date);
        const formattedDate = noteDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Format last modified
        const lastModified = new Date(note.lastModified);
        const formattedLastModified = lastModified.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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
        
        tr.innerHTML = `
            <td>${patientName}</td>
            <td>${formattedDate}</td>
            <td>${note.sessionType.charAt(0).toUpperCase() + note.sessionType.slice(1)}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${formattedLastModified}</td>
            <td>
                <button class="action-btn view-note-btn" data-id="${note.id}" title="View Note">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-note-btn" data-id="${note.id}" title="Edit Note">
                    <i class="fas fa-edit"></i>
                </button>
                ${note.status === 'awaiting-cosign' ? `
                <button class="action-btn cosign-note-btn" data-id="${note.id}" title="Co-sign Note">
                    <i class="fas fa-signature"></i>
                </button>
                ` : ''}
                <button class="action-btn delete-note-btn" data-id="${note.id}" title="Delete Note">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        notesTableBody.appendChild(tr);
    });
    
    // Add event listeners to action buttons
    addNoteActionListeners();
}

// Render notes in grid view
function renderNotesGrid() {
    if (!notesGrid) return;
    
    notesGrid.innerHTML = '';
    
    if (filteredNotes.length === 0) {
        notesGrid.innerHTML = `
            <div class="no-notes" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                No notes found matching your criteria.
            </div>
        `;
        return;
    }
    
    filteredNotes.forEach(note => {
        const patient = patients.find(p => p.id == note.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
        
        // Format date
        const noteDate = new Date(note.date);
        const formattedDate = noteDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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
        
        // Preview text
        let previewText = '';
        if (note.template === 'soap') {
            previewText = note.subjective?.substring(0, 100) + '...' || 'No content';
        } else if (note.template === 'custom') {
            previewText = note.presentingIssue?.substring(0, 100) + '...' || 'No content';
        }
        
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <div class="note-card-header">
                <div class="note-patient">${patientName}</div>
                <div class="note-date">${formattedDate}</div>
            </div>
            <div class="note-session-type">
                ${note.sessionType.charAt(0).toUpperCase() + note.sessionType.slice(1)} Session
            </div>
            <div class="note-preview">
                ${previewText}
            </div>
            <div class="note-card-footer">
                <span class="status-badge ${statusClass}">${statusText}</span>
                <div class="note-actions">
                    <button class="action-btn view-note-btn" data-id="${note.id}" title="View Note">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-note-btn" data-id="${note.id}" title="Edit Note">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${note.status === 'awaiting-cosign' ? `
                    <button class="action-btn cosign-note-btn" data-id="${note.id}" title="Co-sign Note">
                        <i class="fas fa-signature"></i>
                    </button>
                    ` : ''}
                    <button class="action-btn delete-note-btn" data-id="${note.id}" title="Delete Note">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        notesGrid.appendChild(noteCard);
    });
    
    // Add event listeners to action buttons
    addNoteActionListeners();
}

// Add event listeners to note action buttons
function addNoteActionListeners() {
    // View note buttons
    document.querySelectorAll('.view-note-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const noteId = btn.dataset.id;
            viewNote(noteId);
        });
    });
    
    // Edit note buttons
    document.querySelectorAll('.edit-note-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const noteId = btn.dataset.id;
            editNote(noteId);
        });
    });
    
    // Co-sign note buttons
    document.querySelectorAll('.cosign-note-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const noteId = btn.dataset.id;
            openCosignModal(noteId);
        });
    });
    
    // Delete note buttons
    document.querySelectorAll('.delete-note-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const noteId = btn.dataset.id;
            deleteNote(noteId);
        });
    });
}

// Update statistics
function updateStats() {
    if (totalNotes) totalNotes.textContent = notes.length;
    if (draftNotes) draftNotes.textContent = notes.filter(note => note.status === 'draft').length;
    if (completedNotes) completedNotes.textContent = notes.filter(note => note.status === 'completed').length;
    
    // Calculate overdue notes (draft notes older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const overdueCount = notes.filter(note => {
        if (note.status !== 'draft') return false;
        
        const noteDate = new Date(note.lastModified);
        return noteDate < sevenDaysAgo;
    }).length;
    
    if (overdueNotes) overdueNotes.textContent = overdueCount;
}

// Open create note modal
function openCreateNoteModal() {
    document.getElementById('noteModalTitle').textContent = 'Create Progress Note';
    noteForm.reset();
    document.getElementById('noteId').value = '';
    document.getElementById('noteStatus').value = '';
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sessionDate').value = today;
    
    // Show SOAP template by default
    soapTemplate.style.display = 'block';
    mentalyTemplate.style.display = 'none';
    
    // Reset template selector
    noteTemplate.value = 'soap';
    
    noteModal.showModal();
}

// Close modal
function closeModal() {
    noteModal.close();
}

// Handle note form submission
function handleNoteSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(noteForm);
    const saveAction = e.submitter.value;
    const noteId = formData.get('id') || `note-${Date.now()}`;
    
    // Get patient info
    const patientId = formData.get('patientId');
    const patient = patients.find(p => p.id == patientId);
    
    if (!patient) {
        alert('Please select a patient');
        return;
    }
    
    // Create note object based on template
    let note = {
        id: noteId,
        patientId: parseInt(patientId),
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
    
    // Update or add note
    const existingIndex = notes.findIndex(n => n.id === noteId);
    if (existingIndex !== -1) {
        notes[existingIndex] = note;
    } else {
        notes.unshift(note); // Add new note at the beginning
    }
    
    // Save to localStorage
    localStorage.setItem('progressNotes', JSON.stringify(notes));
    
    // Update UI
    filteredNotes = [...notes];
    renderNotes();
    updateStats();
    
    // Close modal
    noteModal.close();
    
    // Show success message
    showToast(`Note ${saveAction === 'draft' ? 'saved as draft' : 'completed successfully'}`, 'success');
}

// Handle template change
function handleTemplateChange() {
    const template = noteTemplate.value;
    
    if (template === 'soap') {
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

// View note
function viewNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const patient = patients.find(p => p.id == note.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    
    // Format date and time
    const noteDate = new Date(note.date);
    const formattedDate = noteDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const timeStart = note.timeStart ? formatTime(note.timeStart) : '';
    const timeEnd = note.timeEnd ? formatTime(note.timeEnd) : '';
    
    let noteContent = '';
    
    if (note.template === 'soap') {
        noteContent = `
            <div class="view-note-section">
                <h3>Session Information</h3>
                <p><strong>Patient:</strong> ${patientName}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${timeStart} - ${timeEnd}</p>
                <p><strong>Session Type:</strong> ${note.sessionType.charAt(0).toUpperCase() + note.sessionType.slice(1)}</p>
                <p><strong>Attended:</strong> ${note.attended ? 'Yes' : 'No'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Subjective</h3>
                <p>${note.subjective || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Objective</h3>
                <p>${note.objective || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Assessment</h3>
                <p>${note.assessment || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Plan</h3>
                <p>${note.plan || 'No content'}</p>
            </div>
        `;
    } else if (note.template === 'custom') {
        noteContent = `
            <div class="view-note-section">
                <h3>Session Information</h3>
                <p><strong>Patient:</strong> ${patientName}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${timeStart} - ${timeEnd}</p>
                <p><strong>Session Type:</strong> ${note.sessionType.charAt(0).toUpperCase() + note.sessionType.slice(1)}</p>
                <p><strong>Attended:</strong> ${note.attended ? 'Yes' : 'No'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Client's presenting issue/chief complaint</h3>
                <p>${note.presentingIssue || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Mood/Affect</h3>
                <p>${note.moodAffect || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Reported progress or challenges since last session</h3>
                <p>${note.reportedProgress || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Behavioral Observations</h3>
                <p>${note.behavioralObservations || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Mental Status Exam (MSE)</h3>
                <p>${note.mentalStatusExam || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Interventions Used</h3>
                <p>${note.interventionsUsed || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Progress on Treatment Goals</h3>
                <p>${note.progressGoals || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Assessment of Risk</h3>
                <p>${note.hasRisk ? 'Yes - ' + (note.riskDetails || 'No details provided') : 'No'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Diagnosis (if applicable)</h3>
                <p>${note.diagnosis || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Next Steps/Homework</h3>
                <p>${note.nextSteps || 'No content'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Next Session Scheduled</h3>
                <p>${note.nextSession ? new Date(note.nextSession).toLocaleDateString() : 'Not scheduled'}</p>
            </div>
            
            <div class="view-note-section">
                <h3>Referrals/Consultations (if any)</h3>
                <p>${note.referrals || 'None'}</p>
            </div>
        `;
    }
    
    // Add assessments section
    if (note.assessments.length > 0) {
        const assessmentsList = note.assessments.map(assessment => {
            return `<li>${assessment.toUpperCase()}</li>`;
        }).join('');
        
        noteContent += `
            <div class="view-note-section">
                <h3>Attached Assessments</h3>
                <ul>${assessmentsList}</ul>
            </div>
        `;
    }
    
    document.getElementById('viewNoteContent').innerHTML = noteContent;
    currentNoteId = noteId;
    viewNoteModal.showModal();
}

// Format time (HH:MM) to 12-hour format
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
}

// Print note
function printNote() {
    const printContent = document.getElementById('viewNoteContent').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 2rem; font-family: Arial, sans-serif;">
            <h1 style="text-align: center; margin-bottom: 2rem;">Progress Note</h1>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    renderNotes(); // Re-render notes after printing
}

// Export note to PDF
function exportNoteToPDF() {
    // In a real application, this would use a PDF generation library
    // For this example, we'll simulate the process
    showToast('Preparing PDF download...', 'info');
    
    setTimeout(() => {
        showToast('PDF downloaded successfully', 'success');
        
        // Simulate download
        const a = document.createElement('a');
        a.href = '#'; // In a real app, this would be the PDF URL
        a.download = `progress-note-${currentNoteId}.pdf`;
        a.click();
    }, 1500);
}

// Edit note
function editNote(noteId = null) {
    const noteToEdit = noteId ? notes.find(n => n.id === noteId) : notes.find(n => n.id === currentNoteId);
    if (!noteToEdit) return;
    
    // Close view modal if open
    viewNoteModal.close();
    
    // Populate form with note data
    document.getElementById('noteModalTitle').textContent = 'Edit Progress Note';
    document.getElementById('noteId').value = noteToEdit.id;
    document.getElementById('noteStatus').value = noteToEdit.status;
    document.getElementById('patientSelect').value = noteToEdit.patientId;
    document.getElementById('sessionDate').value = noteToEdit.date;
    document.getElementById('treatmentTimeStart').value = noteToEdit.timeStart;
    document.getElementById('treatmentTimeEnd').value = noteToEdit.timeEnd;
    document.getElementById('attended').checked = noteToEdit.attended;
    
    // Set session type
    document.querySelectorAll(`input[name="sessionType"]`).forEach(radio => {
        radio.checked = radio.value === noteToEdit.sessionType;
    });
    
    // Handle other session type
    if (noteToEdit.sessionType === 'other') {
        document.getElementById('otherSessionType').style.display = 'block';
        document.getElementById('otherSessionType').value = noteToEdit.sessionType;
    }
    
    // Set template
    document.getElementById('noteTemplate').value = noteToEdit.template;
    handleTemplateChange();
    
    // Populate template-specific fields
    if (noteToEdit.template === 'soap') {
        document.getElementById('subjective').value = noteToEdit.subjective || '';
        document.getElementById('objective').value = noteToEdit.objective || '';
        document.getElementById('assessment').value = noteToEdit.assessment || '';
        document.getElementById('plan').value = noteToEdit.plan || '';
    } else if (noteToEdit.template === 'custom') {
        document.getElementById('presentingIssue').value = noteToEdit.presentingIssue || '';
        document.getElementById('moodAffect').value = noteToEdit.moodAffect || '';
        document.getElementById('reportedProgress').value = noteToEdit.reportedProgress || '';
        document.getElementById('behavioralObservations').value = noteToEdit.behavioralObservations || '';
        document.getElementById('mentalStatusExam').value = noteToEdit.mentalStatusExam || '';
        document.getElementById('interventionsUsed').value = noteToEdit.interventionsUsed || '';
        document.getElementById('progressGoals').value = noteToEdit.progressGoals || '';
        document.getElementById('hasRisk').checked = noteToEdit.hasRisk || false;
        document.getElementById('riskDetails').value = noteToEdit.riskDetails || '';
        document.getElementById('riskDetails').style.display = noteToEdit.hasRisk ? 'block' : 'none';
        document.getElementById('diagnosis').value = noteToEdit.diagnosis || '';
        document.getElementById('nextSteps').value = noteToEdit.nextSteps || '';
        document.getElementById('nextSession').value = noteToEdit.nextSession || '';
        document.getElementById('referrals').value = noteToEdit.referrals || '';
    }
    
    // Set assessments
    document.querySelectorAll('input[name="assessments"]').forEach(checkbox => {
        checkbox.checked = noteToEdit.assessments.includes(checkbox.value);
    });
    
    noteModal.showModal();
}

// Open co-sign modal
function openCosignModal(noteId) {
    document.getElementById('cosignNoteId').value = noteId;
    cosignModal.showModal();
}

// Handle co-sign form submission
function handleCosignSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(cosignForm);
    const noteId = formData.get('noteId');
    const action = formData.get('action');
    
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex === -1) return;
    
    if (action === 'approve') {
        notes[noteIndex].status = 'completed';
        notes[noteIndex].cosignedBy = formData.get('supervisorName');
        notes[noteIndex].cosignedTitle = formData.get('supervisorTitle');
        notes[noteIndex].cosignedComments = formData.get('comments');
        notes[noteIndex].lastModified = new Date().toISOString();
        
        showToast('Note approved and signed successfully', 'success');
    } else if (action === 'return') {
        notes[noteIndex].status = 'draft';
        notes[noteIndex].supervisorComments = formData.get('comments');
        notes[noteIndex].lastModified = new Date().toISOString();
        
        showToast('Note returned for revision', 'info');
    }
    
    // Save to localStorage
    localStorage.setItem('progressNotes', JSON.stringify(notes));
    
    // Update UI
    filteredNotes = [...notes];
    renderNotes();
    updateStats();
    
    // Close modal and reset form
    cosignModal.close();
    cosignForm.reset();
}

// Delete note
function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        return;
    }
    
    notes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('progressNotes', JSON.stringify(notes));
    
    filteredNotes = filteredNotes.filter(note => note.id !== noteId);
    renderNotes();
    updateStats();
    
    showToast('Note deleted successfully', 'success');
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Set timeout to remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initProgressNotes);