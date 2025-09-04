// patients.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the patients page
    initPatientsPage();
    
    // Set current date
    setCurrentDate();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup accessibility features
    setupAccessibility();

    setupNavigation();
});

// Patient data structure
let patients = [
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

// Initialize patients page
function initPatientsPage() {
    console.log('Mentaly Patients Management initialized');
    
    // Load patient data
    loadPatientData();
    
    // Animate cards on load
    animateCards();
    
    // Set active navigation
    setActiveNavigation('patients');
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
    // Navigation - changed to use anchor tags instead of buttons
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Let the browser handle the navigation
            setActiveNavigation(this.dataset.page);
        });
    });
    
    // Emergency button
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyModal = document.getElementById('emergencyModal');
    const closeEmergencyModal = document.getElementById('closeEmergencyModal');
    
    if (emergencyBtn && emergencyModal) {
        emergencyBtn.addEventListener('click', () => {
            emergencyModal.setAttribute('open', 'true');
            document.body.style.overflow = 'hidden';
        });
        
        closeEmergencyModal.addEventListener('click', () => {
            emergencyModal.removeAttribute('open');
            document.body.style.overflow = '';
        });
        
        // Close modal when clicking outside
        emergencyModal.addEventListener('click', (e) => {
            if (e.target === emergencyModal) {
                emergencyModal.removeAttribute('open');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Add patient button
    const addPatientBtn = document.getElementById('addPatientBtn');
    const addPatientModal = document.getElementById('addPatientModal');
    const closeAddPatientModal = document.getElementById('closeAddPatientModal');
    const cancelAddPatient = document.getElementById('cancelAddPatient');
    
    if (addPatientBtn && addPatientModal) {
        addPatientBtn.addEventListener('click', () => {
            addPatientModal.setAttribute('open', 'true');
            document.body.style.overflow = 'hidden';
        });
        
        closeAddPatientModal.addEventListener('click', closeAddPatientModalHandler);
        
        if (cancelAddPatient) {
            cancelAddPatient.addEventListener('click', closeAddPatientModalHandler);
        }
        
        // Close modal when clicking outside
        addPatientModal.addEventListener('click', (e) => {
            if (e.target === addPatientModal) {
                closeAddPatientModalHandler();
            }
        });
    }
    
    // Add patient form submission
    const addPatientForm = document.getElementById('addPatientForm');
    if (addPatientForm) {
        addPatientForm.addEventListener('submit', handleAddPatientForm);
    }
    
    // Edit patient form submission
    const editPatientForm = document.getElementById('editPatientForm');
    if (editPatientForm) {
        editPatientForm.addEventListener('submit', handleEditPatientForm);
    }
    
    // Close edit patient modal
    const closeEditPatientModal = document.getElementById('closeEditPatientModal');
    const cancelEditPatient = document.getElementById('cancelEditPatient');
    
    if (closeEditPatientModal) {
        closeEditPatientModal.addEventListener('click', closeEditPatientModalHandler);
    }
    
    if (cancelEditPatient) {
        cancelEditPatient.addEventListener('click', closeEditPatientModalHandler);
    }
    
    // Patient search
    const patientSearch = document.getElementById('patientSearch');
    if (patientSearch) {
        patientSearch.addEventListener('input', handlePatientSearch);
    }
    
    // Filter changes
    const statusFilter = document.getElementById('statusFilter');
    const riskFilter = document.getElementById('riskFilter');
    const tagFilter = document.getElementById('tagFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', handleFilterChange);
    }
    
    if (riskFilter) {
        riskFilter.addEventListener('change', handleFilterChange);
    }
    
    if (tagFilter) {
        tagFilter.addEventListener('change', handleFilterChange);
    }
    
    // Clear filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', handleClearFilters);
    }
    
    // View options
    const viewOptions = document.querySelectorAll('.view-option');
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleViewChange(this.dataset.view);
        });
    });
    
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
}

// Close add patient modal handler
function closeAddPatientModalHandler() {
    const addPatientModal = document.getElementById('addPatientModal');
    if (addPatientModal) {
        addPatientModal.removeAttribute('open');
        document.body.style.overflow = '';
        
        // Reset form
        const addPatientForm = document.getElementById('addPatientForm');
        if (addPatientForm) {
            addPatientForm.reset();
        }
    }
}

// Close edit patient modal handler
function closeEditPatientModalHandler() {
    const editPatientModal = document.getElementById('editPatientModal');
    if (editPatientModal) {
        editPatientModal.removeAttribute('open');
        document.body.style.overflow = '';
    }
}

// Handle add patient form submission
function handleAddPatientForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const patientData = Object.fromEntries(formData.entries());
    
    // Calculate age from date of birth
    if (patientData.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(patientData.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        patientData.age = age;
    }
    
    // Generate a patient ID
    patientData.id = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    
    // Set default values
    patientData.status = "active";
    patientData.lastSession = null;
    
    // Convert tags to array if it's a string
    if (typeof patientData.tags === 'string') {
        patientData.tags = [patientData.tags];
    } else if (!patientData.tags) {
        patientData.tags = [];
    }
    
    // Add the new patient
    patients.push(patientData);
    
    // Update the UI
    loadPatientData();
    updateStats();
    
    // Close the modal
    closeAddPatientModalHandler();
    
    // Show success message
    showNotification('Patient added successfully!', 'success');
}

// Handle edit patient form submission
function handleEditPatientForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const patientData = Object.fromEntries(formData.entries());
    const patientId = parseInt(patientData.id);
    
    // Find patient index
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex !== -1) {
        // Convert tags to array if it's a string
        if (typeof patientData.tags === 'string') {
            patientData.tags = [patientData.tags];
        } else if (!patientData.tags) {
            patientData.tags = [];
        }
        
        // Update patient data
        patients[patientIndex] = {
            ...patients[patientIndex],
            ...patientData
        };
        
        // Update the UI
        loadPatientData();
        updateStats();
        
        // Close the modal
        closeEditPatientModalHandler();
        
        // Show success message
        showNotification('Patient updated successfully!', 'success');
    }
}

// Handle patient search
function handlePatientSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterPatients();
}

// Handle filter changes
function handleFilterChange() {
    filterPatients();
}

// Handle clear filters
function handleClearFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const riskFilter = document.getElementById('riskFilter');
    const tagFilter = document.getElementById('tagFilter');
    const patientSearch = document.getElementById('patientSearch');
    
    if (statusFilter) statusFilter.value = 'all';
    if (riskFilter) riskFilter.value = 'all';
    if (tagFilter) tagFilter.value = 'all';
    if (patientSearch) patientSearch.value = '';
    
    filterPatients();
}

// Handle view change (list/grid)
function handleViewChange(viewType) {
    const listView = document.getElementById('listView');
    const gridView = document.getElementById('gridView');
    const viewOptions = document.querySelectorAll('.view-option');
    
    viewOptions.forEach(option => {
        if (option.dataset.view === viewType) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    if (viewType === 'list') {
        listView.style.display = 'block';
        gridView.style.display = 'none';
    } else {
        listView.style.display = 'none';
        gridView.style.display = 'block';
    }
}

// Filter patients based on search and filters
function filterPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const riskFilter = document.getElementById('riskFilter').value;
    const tagFilter = document.getElementById('tagFilter').value;
    
    const filteredPatients = patients.filter(patient => {
        // Search term filter
        const matchesSearch = searchTerm === '' || 
            patient.firstName.toLowerCase().includes(searchTerm) ||
            patient.lastName.toLowerCase().includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm) ||
            patient.phone.toLowerCase().includes(searchTerm);
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
        
        // Risk level filter
        const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter;
        
        // Tag filter
        const matchesTag = tagFilter === 'all' || 
            (Array.isArray(patient.tags) && patient.tags.includes(tagFilter));
        
        return matchesSearch && matchesStatus && matchesRisk && matchesTag;
    });
    
    // Update the UI with filtered patients
    renderPatients(filteredPatients);
}

// Load patient data and render it
function loadPatientData() {
    renderPatients(patients);
    updateStats();
}

// Render patients in both list and grid views
function renderPatients(patientsArray) {
    renderPatientsList(patientsArray);
    renderPatientsGrid(patientsArray);
    updateShowingCount(patientsArray.length);
}

// Render patients in list view
function renderPatientsList(patientsArray) {
    const tableBody = document.getElementById('patientsTableBody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    patientsArray.forEach(patient => {
        const row = document.createElement('tr');
        row.className = `patient-row ${patient.riskLevel}-risk ${patient.status}`;
        
        row.innerHTML = `
            <td>
                <section class="patient-info">
                    <figure class="patient-avatar">
                        <i class="fas fa-user"></i>
                    </figure>
                    <section class="patient-details">
                        <h3>${patient.firstName} ${patient.lastName}</h3>
                        <p>ID: PT-${patient.id.toString().padStart(3, '0')}</p>
                    </section>
                </section>
            </td>
            <td>${patient.age}</td>
            <td><span class="status-badge ${patient.status}">${formatStatus(patient.status)}</span></td>
            <td><span class="risk-badge ${patient.riskLevel}">${formatRiskLevel(patient.riskLevel)}</span></td>
            <td>${patient.lastSession ? formatDate(patient.lastSession) : '-'}</td>
            <td>
                <section class="tags">
                    ${renderTags(patient.tags)}
                </section>
            </td>
            <td>
                <section class="action-buttons">
                    <button class="action-btn view-btn" data-patient-id="${patient.id}" title="View Profile">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-patient-id="${patient.id}" title="Edit Patient">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${patient.status === 'archived' ? 
                        `<button class="action-btn restore-btn" data-patient-id="${patient.id}" title="Restore Patient">
                            <i class="fas fa-undo"></i>
                         </button>` : 
                        `<button class="action-btn archive-btn" data-patient-id="${patient.id}" title="Archive Patient">
                            <i class="fas fa-archive"></i>
                         </button>`
                    }
                </section>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addActionButtonListeners();
}

// Render patients in grid view
function renderPatientsGrid(patientsArray) {
    const patientsGrid = document.getElementById('patientsGrid');
    
    if (!patientsGrid) return;
    
    patientsGrid.innerHTML = '';
    
    patientsArray.forEach(patient => {
        const card = document.createElement('article');
        card.className = `patient-card ${patient.riskLevel}-risk ${patient.status}`;
        
        card.innerHTML = `
            <header class="patient-card-header">
                <figure class="patient-card-avatar">
                    <i class="fas fa-user"></i>
                </figure>
                <section class="patient-card-details">
                    <h3>${patient.firstName} ${patient.lastName}</h3>
                    <p>ID: PT-${patient.id.toString().padStart(3, '0')}</p>
                    <p>${patient.phone}</p>
                </section>
            </header>
            
            <section class="patient-card-info">
                <section class="patient-card-info-item">
                    <span class="patient-card-info-label">Age:</span>
                    <span class="patient-card-info-value">${patient.age}</span>
                </section>
                <section class="patient-card-info-item">
                    <span class="patient-card-info-label">Status:</span>
                    <span class="patient-card-info-value">
                        <span class="status-badge ${patient.status}">${formatStatus(patient.status)}</span>
                    </span>
                </section>
                <section class="patient-card-info-item">
                    <span class="patient-card-info-label">Risk Level:</span>
                    <span class="patient-card-info-value">
                        <span class="risk-badge ${patient.riskLevel}">${formatRiskLevel(patient.riskLevel)}</span>
                    </span>
                </section>
                <section class="patient-card-info-item">
                    <span class="patient-card-info-label">Last Session:</span>
                    <span class="patient-card-info-value">
                        ${patient.lastSession ? formatDate(patient.lastSession) : 'No sessions'}
                    </span>
                </section>
            </section>
            
            <section class="patient-card-tags">
                ${renderTags(patient.tags)}
            </section>
            
            <footer class="patient-card-footer">
                <section class="action-buttons">
                    <button class="action-btn view-btn" data-patient-id="${patient.id}" title="View Profile">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-patient-id="${patient.id}" title="Edit Patient">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${patient.status === 'archived' ? 
                        `<button class="action-btn restore-btn" data-patient-id="${patient.id}" title="Restore Patient">
                            <i class="fas fa-undo"></i>
                         </button>` : 
                        `<button class="action-btn archive-btn" data-patient-id="${patient.id}" title="Archive Patient">
                            <i class="fas fa-archive"></i>
                         </button>`
                    }
                </section>
            </footer>
        `;
        
        patientsGrid.appendChild(card);
    });
    
    // Add event listeners to action buttons
    addActionButtonListeners();
}

// Add event listeners to action buttons
function addActionButtonListeners() {
    // View buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = parseInt(this.dataset.patientId);
            openPatientProfile(patientId);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = parseInt(this.dataset.patientId);
            openEditPatient(patientId);
        });
    });
    
    // Archive buttons
    const archiveButtons = document.querySelectorAll('.archive-btn');
    archiveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = parseInt(this.dataset.patientId);
            toggleArchivePatient(patientId, true);
        });
    });
    
    // Restore buttons
    const restoreButtons = document.querySelectorAll('.restore-btn');
    restoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = parseInt(this.dataset.patientId);
            toggleArchivePatient(patientId, false);
        });
    });
}

// Open patient profile modal
function openPatientProfile(patientId) {
    const patient = patients.find(p => p.id === patientId);
    const modal = document.getElementById('patientProfileModal');
    const content = document.getElementById('patientProfileContent');
    
    if (!patient || !modal || !content) return;
    
    content.innerHTML = `
        <section class="patient-profile-header">
            <figure class="patient-avatar-large">
                <i class="fas fa-user"></i>
            </figure>
            <section class="patient-header-info">
                <h2>${patient.firstName} ${patient.lastName}</h2>
                <p>${patient.email} | ${patient.phone}</p>
                <section class="patient-status-info">
                    <span class="status-badge ${patient.status}">${formatStatus(patient.status)}</span>
                    <span class="risk-badge ${patient.riskLevel}">${formatRiskLevel(patient.riskLevel)}</span>
                </section>
            </section>
        </section>
        
        <section class="patient-profile-details">
            <section class="detail-section">
                <h3>Personal Information</h3>
                <section class="detail-grid">
                    <section class="detail-item">
                        <span class="detail-label">Date of Birth:</span>
                        <span class="detail-value">${formatDate(patient.dateOfBirth)}</span>
                    </section>
                    <section class="detail-item">
                        <span class="detail-label">Age:</span>
                        <span class="detail-value">${patient.age}</span>
                    </section>
                    <section class="detail-item">
                        <span class="detail-label">Gender:</span>
                        <span class="detail-value">${formatGender(patient.gender)}</span>
                    </section>
                </section>
            </section>
            
            <section class="detail-section">
                <h3>Contact Information</h3>
                <section class="detail-grid">
                    <section class="detail-item">
                        <span class="detail-label">Address:</span>
                        <span class="detail-value">${patient.address || 'Not provided'}</span>
                    </section>
                    <section class="detail-item">
                        <span class="detail-label">City:</span>
                        <span class="detail-value">${patient.city || 'Not provided'}</span>
                    </section>
                    <section class="detail-item">
                        <span class="detail-label">ZIP Code:</span>
                        <span class="detail-value">${patient.zipCode || 'Not provided'}</span>
                    </section>
                </section>
            </section>
            
            <section class="detail-section">
                <h3>Clinical Information</h3>
                <section class="detail-grid">
                    <section class="detail-item">
                        <span class="detail-label">Referral Source:</span>
                        <span class="detail-value">${formatReferralSource(patient.referralSource)}</span>
                    </section>
                    <section class="detail-item">
                        <span class="detail-label">Last Session:</span>
                        <span class="detail-value">${patient.lastSession ? formatDate(patient.lastSession) : 'No sessions'}</span>
                    </section>
                </section>
                <section class="detail-item-full">
                    <span class="detail-label">Presenting Problem:</span>
                    <p class="detail-value">${patient.presentingProblem}</p>
                </section>
            </section>
            
            <section class="detail-section">
                <h3>Tags</h3>
                <section class="tags-container">
                    ${renderTags(patient.tags)}
                </section>
            </section>
        </section>
    `;
    
    // Show the modal
    modal.setAttribute('open', 'true');
    document.body.style.overflow = 'hidden';
    
    // Add event listener to close the modal
    const closeButton = document.getElementById('closePatientModal');
    if (closeButton) {
        closeButton.onclick = () => {
            modal.removeAttribute('open');
            document.body.style.overflow = '';
        };
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.removeAttribute('open');
            document.body.style.overflow = '';
        }
    });
}

// Open edit patient modal
function openEditPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    const modal = document.getElementById('editPatientModal');
    
    if (!patient || !modal) return;
    
    // Populate the form with patient data
    document.getElementById('editPatientId').value = patient.id;
    document.getElementById('editFirstName').value = patient.firstName;
    document.getElementById('editLastName').value = patient.lastName;
    document.getElementById('editDateOfBirth').value = patient.dateOfBirth;
    document.getElementById('editGender').value = patient.gender;
    document.getElementById('editEmail').value = patient.email;
    document.getElementById('editPhone').value = patient.phone;
    document.getElementById('editAddress').value = patient.address || '';
    document.getElementById('editCity').value = patient.city || '';
    document.getElementById('editZipCode').value = patient.zipCode || '';
    document.getElementById('editStatus').value = patient.status;
    document.getElementById('editRiskLevel').value = patient.riskLevel;
    document.getElementById('editPresentingProblem').value = patient.presentingProblem;
    
    // Set tags (multiple selection)
    const tagsSelect = document.getElementById('editTags');
    if (tagsSelect) {
        // Clear any previous selections
        Array.from(tagsSelect.options).forEach(option => {
            option.selected = false;
        });
        
        // Select the patient's tags
        if (Array.isArray(patient.tags)) {
            patient.tags.forEach(tag => {
                const option = Array.from(tagsSelect.options).find(opt => opt.value === tag);
                if (option) {
                    option.selected = true;
                }
            });
        }
    }
    
    // Show the modal
    modal.setAttribute('open', 'true');
    document.body.style.overflow = 'hidden';
}

// Toggle patient archive status
function toggleArchivePatient(patientId, archive) {
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex !== -1) {
        patients[patientIndex].status = archive ? 'archived' : 'active';
        
        // Update the UI
        loadPatientData();
        updateStats();
        
        // Show notification
        showNotification(`Patient ${archive ? 'archived' : 'restored'} successfully!`, 'success');
    }
}

// Update stats cards
function updateStats() {
    const totalPatients = patients.length;
    const intakePatients = patients.filter(p => p.status === 'intake').length;
    const activePatients = patients.filter(p => p.status === 'active').length;
    const archivedPatients = patients.filter(p => p.status === 'archived').length;
    
    document.getElementById('totalPatients').textContent = totalPatients;
    document.getElementById('intakePatients').textContent = intakePatients;
    document.getElementById('activePatients').textContent = activePatients;
    document.getElementById('archivedPatients').textContent = archivedPatients;
}

// Update showing count
function updateShowingCount(count) {
    const showingCount = document.getElementById('showingCount');
    if (showingCount) {
        showingCount.textContent = `Showing ${count} of ${patients.length} patients`;
    }
}

// Helper function to format status
function formatStatus(status) {
    const statusMap = {
        'active': 'Active',
        'intake': 'Intake Process',
        'archived': 'Archived'
    };
    
    return statusMap[status] || status;
}

// Helper function to format risk level
function formatRiskLevel(riskLevel) {
    const riskMap = {
        'low': 'Low Risk',
        'medium': 'Medium Risk',
        'high': 'High Risk'
    };
    
    return riskMap[riskLevel] || riskLevel;
}

// Helper function to format gender
function formatGender(gender) {
    const genderMap = {
        'male': 'Male',
        'female': 'Female',
        'non-binary': 'Non-binary',
        'other': 'Other',
        'prefer-not-to-say': 'Prefer not to say'
    };
    
    return genderMap[gender] || gender;
}

// Helper function to format referral source
function formatReferralSource(source) {
    const sourceMap = {
        'self': 'Self',
        'physician': 'Physician',
        'other-provider': 'Other Healthcare Provider',
        'family': 'Family/Friend',
        'community': 'Community Organization'
    };
    
    return sourceMap[source] || source;
}

// Helper function to render tags
function renderTags(tags) {
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return '<span class="no-tags">No tags</span>';
    }
    
    return tags.map(tag => {
        const tagClass = tag.toLowerCase().replace(/\s+/g, '-');
        return `<span class="tag ${tagClass}">${formatTagName(tag)}</span>`;
    }).join('');
}

// Helper function to format tag names for display
function formatTagName(tag) {
    const tagMap = {
        'suicide-risk': 'Suicide Risk',
        'self-harm': 'Self-Harm',
        'consent-needed': 'Consent Needed',
        'treatment-plan': 'Treatment Plan Due',
        'completed': 'Completed'
    };
    
    return tagMap[tag] || tag;
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Set active navigation
function setActiveNavigation(page) {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        if (button.dataset.page === page) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close event
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Animate cards on load
function animateCards() {
    const cards = document.querySelectorAll('.stat-card, .patients-table tbody tr');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
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
// Add to patients.js and psy-dashboard.js
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // The actual navigation is handled by the onclick attribute
        });
    });
}