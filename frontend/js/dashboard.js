// Mentaly Dashboard JavaScript - Multi-Page Version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize charts if on a page that needs them
    if (document.getElementById('moodChart') || 
        document.getElementById('moodTrendChart') || 
        document.getElementById('activityChart')) {
        initCharts();
    }
    
    // Load user data
    loadUserData();
});

// Store conversation history for AI context
let conversationHistory = [];

// Initialize the dashboard
function initDashboard() {
    // Check if user has a preferred theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Set current page as active in navigation
    setActiveNavButton();
    
    // Initialize page-specific functionality
    initPageSpecificFeatures();
}

// Set active nav button based on current page
function setActiveNavButton() {
    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to current page button
    const currentButton = document.querySelector(`.nav-button[data-page="${currentPage}"]`);
    if (currentButton) {
        currentButton.classList.add('active');
        
        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = currentButton.querySelector('span').textContent;
        }
    }
}

// Initialize page-specific functionality
function initPageSpecificFeatures() {
    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
    
    switch(currentPage) {
        case 'ai-support':
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

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
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
    
    // Mood tracking - only if on mood tracker page
    if (window.location.pathname.includes('mood-tracker')) {
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
    }
    
    // AI Chat - only if on AI chat page
    if (window.location.pathname.includes('ai-support')) {
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

// Navigate to a specific page
function navigateToPage(pageId) {
    if (pageId === 'dashboard') {
        window.location.href = '/dashboard.html';
    } else {
        window.location.href = `/${pageId}.html`;
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
// ... existing code ...

// Load user data
function loadUserData() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    
    // Display user's real name if available
    const usernameElement = document.getElementById('usernameDisplay');
    if (userData && userData.first_name && userData.last_name) {
        usernameElement.textContent = `${userData.first_name} ${userData.last_name}`;
    } else if (userData && userData.first_name) {
        usernameElement.textContent = userData.first_name;
    } else {
        // Fallback to stored username or default
        const username = localStorage.getItem('username') || 'Anonymous User';
        usernameElement.textContent = username;
    }
    
    // Load notification count
    const notificationCount = Math.floor(Math.random() * 5) + 1;
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.textContent = notificationCount;
    }
}

// ... rest of the code remains the same ...
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
        case 'ai-support':
            navigateToPage('./html/ai-support');
            break;
        case 'mood-log':
            navigateToPage('./html/mood-tracker');
            break;
        case 'breathing':
            startWellnessTool('./html/breathing');
            break;
        case 'journal':
            startWellnessTool('journal');
            break;
        case 'meditation':
            startWellnessTool('meditation');
            break;
        case 'community':
            navigateToPage('./html/community');
            break;
        default:
            console.log('Action not implemented:', action);
    }
}

// Initialize AI Chat
function initAIChat() {
    console.log('🚀 Frontend: Initializing AI Chat');
    
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
    
    // Add welcome message if chat is empty
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages && chatMessages.children.length === 0) {
        console.log('💬 Frontend: Adding welcome message');
        addAIMessage("Hello! I'm here to listen and support you. Feel free to share what's on your mind - whether you're having a great day or going through something difficult. What would you like to talk about?");
        
        // Add welcome message to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: "Hello! I'm here to listen and support you. Feel free to share what's on your mind - whether you're having a great day or going through something difficult. What would you like to talk about?"
        });
    }
    
    console.log('✅ Frontend: AI Chat initialized, conversation history length:', conversationHistory.length);
}

// Start session timer
function startSessionTimer() {
    const timerElement = document.getElementById('sessionTimer');
    const progressElement = document.querySelector('.timer-progress');
    
    if (!timerElement || !progressElement) return;
    
    let timeLeft = 1 * 60; // 15 minutes in seconds
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
async function handleChatSubmit(e) {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput');
    if (!chatInput || !chatInput.value.trim()) return;
    
    const userMessage = chatInput.value.trim();
    console.log('🚀 Frontend: Sending message:', userMessage);
    
    // Add user message to UI
    addUserMessage(userMessage);
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });
    
    console.log('📚 Frontend: Conversation history length:', conversationHistory.length);
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        console.log('📡 Frontend: Making API call to /api/chat');
        
        // Send message to AI backend
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                conversationHistory: conversationHistory.slice(-10) // Only send last 10 messages to avoid too large payload
            })
        });
        
        console.log('📡 Frontend: Response received, status:', response.status);
        console.log('📡 Frontend: Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📨 Frontend: Response data:', data);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        if (data.success && data.message) {
            console.log('✅ Frontend: Adding AI message to UI');
            // Add AI response to UI
            addAIMessage(data.message);
            
            // Add to conversation history
            conversationHistory.push({
                role: 'assistant',
                content: data.message
            });
        } else {
            console.error('❌ Frontend: API returned unsuccessful response:', data);
            addAIMessage(data.message || "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.");
        }
    } catch (error) {
        console.error('❌ Frontend: Error sending message:', error);
        console.error('❌ Frontend: Error details:', error.message);
        console.error('❌ Frontend: Error stack:', error.stack);
        removeTypingIndicator();
        addAIMessage("I'm experiencing some technical difficulties. Please try again in a moment.");
    }
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const typingElement = document.createElement('article');
    typingElement.className = 'message ai-message typing-indicator';
    typingElement.id = 'typingIndicator';
    typingElement.innerHTML = `
        <figure class="message-avatar">
            <i class="fas fa-robot"></i>
        </figure>
        <section class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>
    `;
    
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
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
    console.log('🧹 Frontend: Clearing chat');
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        // Clear all messages
        chatMessages.innerHTML = '';
        
        // Clear conversation history
        conversationHistory = [];
        console.log('🧹 Frontend: Conversation history cleared');
        
        // Add welcome message
        addAIMessage("Hello! I'm here to listen and support you. Feel free to share what's on your mind - whether you're having a great day or going through something difficult. What would you like to talk about?");
        
        // Add welcome message to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: "Hello! I'm here to listen and support you. Feel free to share what's on your mind - whether you're having a great day or going through something difficult. What would you like to talk about?"
        });
        
        console.log('✅ Frontend: Chat cleared and reset');
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
            navigateToPage('./html/wellnrdd-tools')
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