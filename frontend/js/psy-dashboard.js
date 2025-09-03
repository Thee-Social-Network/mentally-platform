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
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleNavigation(this.dataset.page);
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
    
    // Session action buttons
    const joinButtons = document.querySelectorAll('.join-btn');
    joinButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const sessionItem = this.closest('.session-item');
            const sessionTitle = sessionItem.querySelector('h3').textContent;
            alert(`Joining session: ${sessionTitle}`);
            // Here you would typically connect to your telehealth API
        });
    });
    
    const noteButtons = document.querySelectorAll('.note-btn');
    noteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const sessionItem = this.closest('.session-item');
            const patientName = sessionItem.querySelector('p').textContent;
            alert(`Creating progress note for: ${patientName}`);
            // Here you would typically open a note editor
        });
    });
    
    // Document action buttons
    const docButtons = document.querySelectorAll('.doc-action-btn');
    docButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const docItem = this.closest('.doc-item');
            const docTitle = docItem.querySelector('h3').textContent;
            alert(`Completing document: ${docTitle}`);
            // Here you would typically open a document editor
        });
    });
    
    // Alert action buttons
    const alertButtons = document.querySelectorAll('.alert-action-btn');
    alertButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const alertItem = this.closest('.alert-item');
            const alertTitle = alertItem.querySelector('h3').textContent;
            alert(`Taking action on alert: ${alertTitle}`);
            // Here you would typically open a safety plan or assessment tool
        });
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
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
    
    // Session item click
    const sessionItems = document.querySelectorAll('.session-item');
    sessionItems.forEach(item => {
        item.addEventListener('click', function() {
            const sessionTitle = this.querySelector('h3').textContent;
            console.log(`Session clicked: ${sessionTitle}`);
            // Here you would typically navigate to session details
        });
    });
}

// Handle navigation between pages
function handleNavigation(page) {
    console.log(`Navigating to: ${page}`);
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => button.classList.remove('active'));
    
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
    
    // Here you would typically load the content for the selected page
    // For this demo, we'll just log the page change
}

// Get page title based on page identifier
function getPageTitle(page) {
    const titles = {
        'dashboard': 'My Day',
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
    // Font size toggle
    const fontSizeToggle = document.getElementById('fontSizeToggle');
    if (fontSizeToggle) {
        fontSizeToggle.addEventListener('click', () => {
            document.body.classList.toggle('large-font');
            const isLarge = document.body.classList.contains('large-font');
            fontSizeToggle.title = isLarge ? 'Decrease font size' : 'Increase font size';
            fontSizeToggle.setAttribute('aria-pressed', isLarge);
        });
    }
    
    // Contrast toggle
    const contrastToggle = document.getElementById('contrastToggle');
    if (contrastToggle) {
        contrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            contrastToggle.title = isHighContrast ? 'Normal contrast mode' : 'High contrast mode';
            contrastToggle.setAttribute('aria-pressed', isHighContrast);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close modal with Escape key
        if (e.key === 'Escape') {
            const modal = document.querySelector('dialog[open]');
            if (modal) {
                modal.removeAttribute('open');
                document.body.style.overflow = '';
            }
        }
    });
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
    const dashboardButton = document.querySelector('[data-page="dashboard"]');
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

// Export functions for use in other modules (if needed)
window.MentalyDashboard = {
    initDashboard,
    handleNavigation,
    formatDate,
    formatTime
};