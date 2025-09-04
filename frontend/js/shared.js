// shared.js - Shared functionality across all pages

// Navigation function
function navigateTo(page) {
    window.location.href = page;
}

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const pageMap = {
        'dashboard.html': 'dashboard',
        'psy-dashboard.html': 'psy-dashboard',
        'patients.html': 'patients',
        'progress-notes.html': 'progress-notes',
        'telehealth.html': 'telehealth',
        'messages.html': 'messages',
        'tasks.html': 'tasks',
        'resources.html': 'resources'
    };
    
    const currentPageId = pageMap[currentPage] || 'dashboard';
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => button.classList.remove('active'));
    
    // Add active class to current page button
    const activeButton = document.querySelector(`[data-page="${currentPageId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// High contrast mode functionality
function setupAccessibility() {
    const fontSizeToggle = document.getElementById('fontSizeToggle');
    const contrastToggle = document.getElementById('contrastToggle');
    
    // Check if high contrast mode was previously enabled
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
        if (contrastToggle) {
            contrastToggle.classList.add('active');
        }
    }
    
    // Check if large font mode was previously enabled
    if (localStorage.getItem('largeFont') === 'true') {
        document.body.classList.add('large-font');
        if (fontSizeToggle) {
            fontSizeToggle.classList.add('active');
        }
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
    
    // Update dropdown styles based on contrast mode
    updateDropdownStyles(isHighContrast);
    
    showNotification(isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled', 'info');
}

// Update dropdown styles based on contrast mode
function updateDropdownStyles(isHighContrast) {
    const dropdowns = document.querySelectorAll('select, .dropdown-content');
    dropdowns.forEach(dropdown => {
        if (isHighContrast) {
            dropdown.style.backgroundColor = '#000';
            dropdown.style.color = '#fff';
            dropdown.style.border = '1px solid #fff';
        } else {
            dropdown.style.backgroundColor = 'var(--pacer-navy)';
            dropdown.style.color = '#fff';
            dropdown.style.border = '1px solid var(--glass-border)';
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
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
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
}

// Initialize shared functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavigation();
    setupAccessibility();
    
    // Update dropdown styles based on current contrast mode
    const isHighContrast = document.body.classList.contains('high-contrast');
    updateDropdownStyles(isHighContrast);
});