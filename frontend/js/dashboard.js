// Mentaly Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize charts
    initCharts();
    
    // Load user data
    loadUserData();
});

// Initialize the dashboard
function initDashboard() {
    // Check if user has a preferred theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Show the dashboard page by default
    showPage('dashboard');
    
    // Initialize the AI chat if it's the active page
    if (document.getElementById('ai-chat-page').classList.contains('active')) {
        initAIChat();
    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.nav-menu').classList.toggle('open');
        });
    }
    
    // Emergency button
    const emergencyBtn = document.getElementById('dashboardEmergencyBtn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            showEmergencyModal();
        });
    }
    
    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showSettingsModal();
        });
    }
    
    // Modal close buttons
    const closeEmergencyModal = document.getElementById('closeEmergencyModal');
    if (closeEmergencyModal) {
        closeEmergencyModal.addEventListener('click', function() {
            closeModal('emergencyModal');
        });
    }
    
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    if (closeSettingsModal) {
        closeSettingsModal.addEventListener('click', function() {
            closeModal('settingsModal');
        });
    }
    
    // Settings navigation
    const settingsNavButtons = document.querySelectorAll('.settings-nav-btn');
    settingsNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            showSettingsTab(tab);
        });
    });
    
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    // Mood tracking
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectMood(this);
        });
    });
    
    const emotionTags = document.querySelectorAll('.emotion-tag');
    emotionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            toggleEmotionTag(this);
        });
    });
    
    const saveMoodBtn = document.getElementById('saveMoodBtn');
    if (saveMoodBtn) {
        saveMoodBtn.addEventListener('click', saveMoodEntry);
    }
    
    // AI Chat
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }
    
    const quickResponses = document.querySelectorAll('.quick-response');
    quickResponses.forEach(response => {
        response.addEventListener('click', function() {
            const responseText = this.getAttribute('data-response');
            useQuickResponse(responseText);
        });
    });
    
    const clearChatBtn = document.getElementById('clearChat');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }
    
    // Wellness tools
    const startToolButtons = document.querySelectorAll('.start-tool-btn');
    startToolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.getAttribute('data-tool');
            startWellnessTool(tool);
        });
    });
}

// Show a specific page
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected page
    const pageElement = document.getElementById(`${pageId}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
        
        // Update the page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = pageElement.querySelector('h2')?.textContent || 'Mentaly';
        }
        
        // Add active class to the corresponding nav button
        const navButton = document.querySelector(`.nav-button[data-page="${pageId}"]`);
        if (navButton) {
            navButton.classList.add('active');
        }
        
        // Initialize page-specific functionality
        switch(pageId) {
            case 'ai-chat':
                initAIChat();
                break;
            case 'mood-tracker':
                initMoodTracker();
                break;
            case 'progress':
                initProgressCharts();
                break;
        }
    }
    
    // Close mobile menu
    if (window.innerWidth < 992) {
        document.querySelector('.nav-menu').classList.remove('open');
    }
}

// Initialize charts
function initCharts() {
    // Mood chart
    const moodCtx = document.getElementById('moodChart');
    if (moodCtx) {
        // Sample data for the mood chart
        const moodData = {
            labels: ['1 Aug', '5 Aug', '10 Aug', '15 Aug', '20 Aug', '25 Aug', '30 Aug'],
            datasets: [{
                label: 'Mood Level',
                data: [5.2, 6.1, 5.8, 7.2, 6.5, 7.0, 7.2],
                borderColor: '#FDBB30',
                backgroundColor: 'rgba(253, 187, 48, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#FDBB30',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        };
        
        const moodConfig = {
            type: 'line',
            data: moodData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#2D3748',
                        bodyColor: '#2D3748',
                        borderColor: '#E2E8F0',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Mood: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 3,
                        max: 10,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#718096'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#718096'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        };
        
        new Chart(moodCtx, moodConfig);
    }
}

// Initialize progress charts
function initProgressCharts() {
    // Mood trend chart
    const moodTrendCtx = document.getElementById('moodTrendChart');
    if (moodTrendCtx) {
        const moodTrendData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Average Mood',
                data: [5.8, 6.2, 6.7, 6.8],
                borderColor: '#FDBB30',
                backgroundColor: 'rgba(253, 187, 48, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
        
        const moodTrendConfig = {
            type: 'line',
            data: moodTrendData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 5,
                        max: 8
                    }
                }
            }
        };
        
        new Chart(moodTrendCtx, moodTrendConfig);
    }
    
    // Activity chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        const activityData = {
            labels: ['Meditation', 'Breathing', 'Journaling', 'Exercise', 'Reading'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#FDBB30',
                    '#61A0AF',
                    '#B6E2D3',
                    '#FFAD61',
                    '#95AFFF'
                ],
                borderWidth: 0
            }]
        };
        
        const activityConfig = {
            type: 'doughnut',
            data: activityData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        };
        
        new Chart(activityCtx, activityConfig);
    }
}

// Load user data
function loadUserData() {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    
    // Load user profile
    const username = localStorage.getItem('username') || 'Anonymous User';
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
        usernameElement.textContent = username;
    }
    
    // Load notification count
    const notificationCount = Math.floor(Math.random() * 5) + 1;
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.textContent = notificationCount;
    }
}

// Show emergency modal
function showEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Show settings modal
function showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Show the first tab by default
        showSettingsTab('account');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Show settings tab
function showSettingsTab(tabId) {
    // Remove active class from all tabs
    const tabButtons = document.querySelectorAll('.settings-nav-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Hide all tab content
    const tabContents = document.querySelectorAll('.settings-tab');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to the selected tab button
    const selectedButton = document.querySelector(`.settings-nav-btn[data-tab="${tabId}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Show the selected tab content
    const selectedTab = document.getElementById(`${tabId}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// Handle quick actions
function handleQuickAction(action) {
    switch(action) {
        case 'ai-chat':
            showPage('ai-chat');
            break;
        case 'mood-log':
            showPage('mood-tracker');
            break;
        case 'breathing':
            startWellnessTool('breathing');
            break;
        case 'journal':
            startWellnessTool('journal');
            break;
        case 'meditation':
            startWellnessTool('meditation');
            break;
        case 'community':
            showPage('community');
            break;
        default:
            console.log('Action not implemented:', action);
    }
}

// Initialize AI Chat
function initAIChat() {
    // Start the session timer
    startSessionTimer();
    
    // Focus on the chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.focus();
        
        // Auto-resize textarea
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
}

// Start session timer
function startSessionTimer() {
    const timerElement = document.getElementById('sessionTimer');
    const progressElement = document.querySelector('.timer-progress');
    
    if (!timerElement || !progressElement) return;
    
    let timeLeft = 15 * 60; // 15 minutes in seconds
    const totalTime = timeLeft;
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = '00:00';
            progressElement.value = 0;
            
            // Show session expired message
            addAIMessage("Your session has ended. Would you like to extend your session or would you like me to summarize our conversation?");
        } else {
            // Update timer display
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Update progress bar
            progressElement.value = (timeLeft / totalTime) * 100;
        }
    }, 1000);
}

// Handle chat form submission
function handleChatSubmit(e) {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput');
    if (!chatInput || !chatInput.value.trim()) return;
    
    // Add user message
    addUserMessage(chatInput.value.trim());
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Simulate AI response after a short delay
    setTimeout(generateAIResponse, 1000);
}

// Add user message to chat
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('article');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <figure class="message-avatar">
            <i class="fas fa-user"></i>
        </figure>
        <section class="message-content">
            <p>${message}</p>
            <time class="message-time">Just now</time>
        </section>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add AI message to chat
function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('article');
    messageElement.className = 'message ai-message';
    messageElement.innerHTML = `
        <figure class="message-avatar">
            <i class="fas fa-robot"></i>
        </figure>
        <section class="message-content">
            <p>${message}</p>
            <time class="message-time">Just now</time>
        </section>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate AI response
function generateAIResponse() {
    // In a real app, this would call an API
    // For now, we'll use predefined responses
    
    const responses = [
        "I understand how you're feeling. It's completely normal to have ups and downs. Would you like to talk more about what's bothering you?",
        "Thank you for sharing that with me. It takes courage to open up about your feelings. How has this been affecting your daily life?",
        "I hear you. It sounds like you're going through a challenging time. Remember that it's okay to not be okay. Would you like to try a quick breathing exercise to help you feel more centered?",
        "I appreciate you being open with me. Let's explore this together. What's one small thing you could do today to help yourself feel even a little bit better?",
        "It sounds like you're dealing with a lot right now. Remember to be kind to yourself during difficult times. Would it help to discuss some coping strategies that have worked for you in the past?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addAIMessage(randomResponse);
}

// Use quick response
function useQuickResponse(responseText) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = responseText;
        chatInput.focus();
        
        // Trigger input event to resize textarea
        const event = new Event('input', { bubbles: true });
        chatInput.dispatchEvent(event);
    }
}

// Clear chat
function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        // Keep only the first message (the AI's introduction)
        while (chatMessages.children.length > 1) {
            chatMessages.removeChild(chatMessages.lastChild);
        }
    }
}

// Initialize mood tracker
function initMoodTracker() {
    // Load previous mood entries
    loadMoodHistory();
}

// Select mood
function selectMood(element) {
    // Remove active class from all mood options
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    // Add active class to the selected mood
    element.classList.add('active');
    
    // Store the selected mood value
    const selectedMood = element.getAttribute('data-mood');
    element.closest('.mood-tracker-container').setAttribute('data-selected-mood', selectedMood);
}

// Toggle emotion tag
function toggleEmotionTag(element) {
    element.classList.toggle('active');
}

// Save mood entry
function saveMoodEntry() {
    const moodContainer = document.querySelector('.mood-tracker-container');
    const selectedMood = moodContainer.getAttribute('data-selected-mood');
    
    if (!selectedMood) {
        alert('Please select a mood first.');
        return;
    }
    
    const selectedEmotions = [];
    const activeEmotionTags = document.querySelectorAll('.emotion-tag.active');
    activeEmotionTags.forEach(tag => {
        selectedEmotions.push(tag.getAttribute('data-emotion'));
    });
    
    const moodNote = document.querySelector('.mood-note-input').value;
    
    // In a real app, this would save to a database
    // For now, we'll just add it to the history UI
    
    addMoodToHistory(selectedMood, selectedEmotions, moodNote);
    
    // Reset the form
    document.querySelectorAll('.mood-option.active, .emotion-tag.active').forEach(element => {
        element.classList.remove('active');
    });
    document.querySelector('.mood-note-input').value = '';
    moodContainer.removeAttribute('data-selected-mood');
    
    // Show success message
    alert('Mood entry saved successfully!');
}

// Add mood to history
function addMoodToHistory(moodValue, emotions, note) {
    const moodEntries = document.querySelector('.mood-entries');
    if (!moodEntries) return;
    
    const moodIcons = {
        '1': 'fas fa-sad-cry',
        '2': 'fas fa-frown',
        '3': 'fas fa-meh',
        '4': 'fas fa-smile',
        '5': 'fas fa-grin-beam'
    };
    
    const moodLabels = {
        '1': 'Very Sad',
        '2': 'Sad',
        '3': 'Neutral',
        '4': 'Good',
        '5': 'Great'
    };
    
    const emotionChips = emotions.map(emotion => 
        `<span class="emotion-chip">${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>`
    ).join('');
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    
    const entryElement = document.createElement('article');
    entryElement.className = 'mood-entry';
    entryElement.innerHTML = `
        <time class="entry-date">Today, ${timeString}</time>
        <section class="entry-mood">
            <i class="${moodIcons[moodValue]}"></i>
            <span>${moodLabels[moodValue]}</span>
        </section>
        <section class="entry-emotions">
            ${emotionChips}
        </section>
        <p class="entry-note">${note || 'No additional notes'}</p>
    `;
    
    // Add to the top of the history
    moodEntries.insertBefore(entryElement, moodEntries.firstChild);
}

// Load mood history
function loadMoodHistory() {
    // In a real app, this would load from a database
    // For now, we'll just use the existing HTML content
}

// Start wellness tool
function startWellnessTool(tool) {
    switch(tool) {
        case 'breathing':
            alert('Starting breathing exercise...');
            // In a real app, this would open a breathing exercise interface
            break;
        case 'meditation':
            alert('Starting meditation session...');
            // In a real app, this would open a meditation interface
            break;
        case 'journal':
            alert('Opening journal...');
            // In a real app, this would open a journal interface
            break;
        case 'music':
            alert('Opening music library...');
            // In a real app, this would open a music interface
            break;
        case 'exercise':
            alert('Starting mindful movement...');
            // In a real app, this would open an exercise interface
            break;
        case 'sleep':
            alert('Opening sleep support...');
            // In a real app, this would open a sleep interface
            break;
        default:
            console.log('Tool not implemented:', tool);
    }
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const emergencyModal = document.getElementById('emergencyModal');
    if (emergencyModal && e.target === emergencyModal) {
        closeModal('emergencyModal');
    }
    
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal && e.target === settingsModal) {
        closeModal('settingsModal');
    }
});

// Handle keyboard events
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        closeModal('emergencyModal');
        closeModal('settingsModal');
    }
});

// Add animation to elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.stat-card, .tool-card, .community-card, .professional-card');
    cards.forEach(card => {
        observer.observe(card);
    });
});