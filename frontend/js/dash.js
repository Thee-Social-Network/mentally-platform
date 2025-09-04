// Mentaly Dashboard JavaScript - Updated for AI Chatbot
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const body = document.body;
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const navButtons = document.querySelectorAll('.nav-button');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const emergencyBtn = document.querySelector('.emergency-btn');
    const themeToggle = document.getElementById('themeToggle');
    const colorSchemeSelect = document.getElementById('colorScheme');
    const notificationToggle = document.getElementById('notificationToggle');
    const dataSharingToggle = document.getElementById('dataSharingToggle');
    const exportDataBtn = document.querySelector('.export-data-btn');
    const deleteAccountBtn = document.querySelector('.delete-account-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const createPostBtn = document.querySelector('.create-post-btn');
    const moodOptions = document.querySelectorAll('.mood-option');
    const emotionTags = document.querySelectorAll('.emotion-tag');
    const saveMoodBtn = document.querySelector('.save-mood-btn');
    const moodNoteInput = document.querySelector('.mood-note-input');
    const historyFilter = document.querySelector('.history-filter');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const quickResponses = document.querySelectorAll('.quick-response');
    const refreshBtn = document.querySelector('.refresh-btn');
    const viewAllBtn = document.querySelector('.view-all-btn');
    const communityTabs = document.querySelectorAll('.community-tab');
    const resourceActions = document.querySelectorAll('.resource-action');
    const goalCheckboxes = document.querySelectorAll('.goal-checkbox');
    const profileActionBtns = document.querySelectorAll('.profile-action-btn');
    const avatarEdit = document.querySelector('.avatar-edit');
    const timeSelector = document.querySelector('.time-selector');
    
    // Initialize dashboard
    initDashboard();
    
    // Initialize functions
    function initDashboard() {
        // Set active page based on URL hash or default to dashboard
        const hash = window.location.hash.substring(1);
        const defaultPage = hash || 'dashboard';
        showPage(defaultPage);
        
        // Initialize charts
        initCharts();
        
        // Initialize timer
        initTimer();
        
        // Load user data
        loadUserData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Check for system preference for dark mode
        checkDarkModePreference();
        
        // Simulate loading data
        simulateDataLoading();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                showPage(page);
                
                // Update URL hash
                window.location.hash = page;
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
            });
        });
        
        // Sidebar navigation
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const page = button.getAttribute('data-page');
                showPage(page);
                
                // Update URL hash
                window.location.hash = page;
            });
        });
        
        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Sidebar toggle for mobile
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
        
        // Dark mode toggle
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleDarkMode);
        }
        
        // Theme toggle in settings
        if (themeToggle) {
            themeToggle.addEventListener('change', function() {
                if (this.checked) {
                    enableDarkMode();
                } else {
                    disableDarkMode();
                }
                // Save preference
                localStorage.setItem('darkMode', this.checked);
            });
        }
        
        // Emergency button
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', showEmergencyResources);
        }
        
        // Color scheme selection
        if (colorSchemeSelect) {
            colorSchemeSelect.addEventListener('change', function() {
                changeColorScheme(this.value);
                // Save preference
                localStorage.setItem('colorScheme', this.value);
            });
        }
        
        // Notification toggle
        if (notificationToggle) {
            notificationToggle.addEventListener('change', function() {
                showToast(
                    'Notifications', 
                    `Notifications ${this.checked ? 'enabled' : 'disabled'}`,
                    this.checked ? 'success' : 'info'
                );
                // Save preference
                localStorage.setItem('notifications', this.checked);
            });
        }
        
        // Data sharing toggle
        if (dataSharingToggle) {
            dataSharingToggle.addEventListener('change', function() {
                showToast(
                    'Data Sharing', 
                    `Data sharing ${this.checked ? 'enabled' : 'disabled'}`,
                    this.checked ? 'success' : 'info'
                );
                // Save preference
                localStorage.setItem('dataSharing', this.checked);
            });
        }
        
        // Export data button
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', exportUserData);
        }
        
        // Delete account button
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', confirmAccountDeletion);
        }
        
        // Logout button
        if (logoutBtn) {
            logoutBtn.addEventListener('click', confirmLogout);
        }
        
        // Create post button
        if (createPostBtn) {
            createPostBtn.addEventListener('click', createNewPost);
        }
        
        // Mood tracking
        moodOptions.forEach(option => {
            option.addEventListener('click', () => {
                selectMood(option);
            });
        });
        
        emotionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                toggleEmotionTag(tag);
            });
        });
        
        if (saveMoodBtn) {
            saveMoodBtn.addEventListener('click', saveMoodEntry);
        }
        
        if (moodNoteInput) {
            moodNoteInput.addEventListener('input', adjustTextareaHeight);
        }
        
        if (historyFilter) {
            historyFilter.addEventListener('change', filterMoodHistory);
        }
        
        // AI Chat
        if (chatInput) {
            chatInput.addEventListener('input', adjustTextareaHeight);
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                }
            });
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', sendChatMessage);
        }
        
        quickResponses.forEach(response => {
            response.addEventListener('click', () => {
                useQuickResponse(response);
            });
        });
        
        // Dashboard actions
        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshInsights);
        }
        
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', viewAllActivities);
        }
        
        // Community tabs
        communityTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchCommunityTab(tab);
            });
        });
        
        // Resource actions
        resourceActions.forEach(action => {
            action.addEventListener('click', (e) => {
                e.preventDefault();
                accessResource(action);
            });
        });
        
        // Goal tracking
        goalCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateGoal(checkbox);
            });
        });
        
        // Profile actions
        profileActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                handleProfileAction(btn);
            });
        });
        
        // Avatar edit
        if (avatarEdit) {
            avatarEdit.addEventListener('click', changeAvatar);
        }
        
        // Time selector for charts
        if (timeSelector) {
            timeSelector.addEventListener('change', updateChartData);
        }
        
        // Close toast notifications when clicking the close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toast-close')) {
                e.target.closest('.toast').remove();
            }
        });
    }
    
    // Show specific page
    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the selected page
        const activePage = document.getElementById(`${pageId}-page`);
        if (activePage) {
            activePage.classList.add('active');
        }
        
        // Update active navigation link
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update active sidebar button
        navButtons.forEach(button => {
            if (button.getAttribute('data-page') === pageId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update page title
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle && activePage) {
            const pageHeader = activePage.querySelector('.page-header h2');
            if (pageHeader) {
                pageTitle.textContent = pageHeader.textContent;
            }
        }
        
        // Initialize page-specific functionality
        switch(pageId) {
            case 'dashboard':
                updateDashboard();
                break;
            case 'chat':
                initChat();
                break;
            case 'mood':
                loadMoodHistory();
                break;
            case 'resources':
                loadResources();
                break;
            case 'community':
                loadCommunityPosts();
                break;
            case 'profile':
                loadProfileData();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }
    
    // Initialize charts
    function initCharts() {
        // Mood chart
        const moodChartCtx = document.getElementById('moodChart');
        if (moodChartCtx) {
            // Simulated mood data for the chart
            const moodData = {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Mood Level',
                    data: [3, 4, 3, 5, 4, 3, 4],
                    borderColor: '#5B8FB9',
                    backgroundColor: 'rgba(91, 143, 185, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#5B8FB9',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            };
            
            const moodChart = new Chart(moodChartCtx, {
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
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleFont: {
                                size: 14,
                                family: 'Inter'
                            },
                            bodyFont: {
                                size: 13,
                                family: 'Inter'
                            },
                            callbacks: {
                                label: function(context) {
                                    return `Mood: ${context.parsed.y}/5`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                                stepSize: 1,
                                color: 'rgba(255, 255, 255, 0.7)',
                                font: {
                                    family: 'Inter'
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                font: {
                                    family: 'Inter'
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
            
            // Store chart instance for later updates
            window.moodChart = moodChart;
        }
        
        // Additional charts can be initialized here
    }
    
    // Initialize timer
    function initTimer() {
        const timerElement = document.getElementById('sessionTimer');
        const progressElement = document.getElementById('timerProgress');
        
        if (timerElement && progressElement) {
            let seconds = 0;
            let minutes = 0;
            
            // Update timer every second
            window.timerInterval = setInterval(() => {
                seconds++;
                if (seconds === 60) {
                    minutes++;
                    seconds = 0;
                }
                
                // Format time as MM:SS
                const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                timerElement.textContent = formattedTime;
                
                // Update progress (assuming 50 minute session max)
                const totalSeconds = minutes * 60 + seconds;
                const progress = (totalSeconds / (50 * 60)) * 100;
                progressElement.value = progress;
                
            }, 1000);
        }
    }
    
    // Load user data
    function loadUserData() {
        // Simulate loading user data from localStorage or API
        const userData = JSON.parse(localStorage.getItem('userData')) || {
            name: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            streak: 7,
            mood: 4,
            sessions: 12,
            goals: 3
        };
        
        // Update UI with user data
        const userNameElements = document.querySelectorAll('.username, .user-name');
        userNameElements.forEach(element => {
            element.textContent = userData.name;
        });
        
        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(element => {
            element.textContent = userData.email;
        });
        
        const streakElement = document.querySelector('.stat-streak .stat-value');
        if (streakElement) {
            streakElement.textContent = userData.streak;
        }
        
        const moodElement = document.querySelector('.stat-mood .stat-value');
        if (moodElement) {
            moodElement.textContent = userData.mood;
        }
        
        const sessionsElement = document.querySelector('.stat-sessions .stat-value');
        if (sessionsElement) {
            sessionsElement.textContent = userData.sessions;
        }
        
        const goalsElement = document.querySelector('.stat-goals .stat-value');
        if (goalsElement) {
            goalsElement.textContent = userData.goals;
        }
        
        // Store user data in global variable
        window.userData = userData;
    }
    
    // Check system preference for dark mode
    function checkDarkModePreference() {
        const savedDarkMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedDarkMode !== null) {
            if (savedDarkMode === 'true') {
                enableDarkMode();
                if (themeToggle) themeToggle.checked = true;
            } else {
                disableDarkMode();
                if (themeToggle) themeToggle.checked = false;
            }
        } else if (systemPrefersDark) {
            enableDarkMode();
            if (themeToggle) themeToggle.checked = true;
            localStorage.setItem('darkMode', true);
        }
        
        // Check for saved color scheme
        const savedColorScheme = localStorage.getItem('colorScheme');
        if (savedColorScheme && colorSchemeSelect) {
            colorSchemeSelect.value = savedColorScheme;
            changeColorScheme(savedColorScheme);
        }
        
        // Check for saved notification preference
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications !== null && notificationToggle) {
            notificationToggle.checked = savedNotifications === 'true';
        }
        
        // Check for saved data sharing preference
        const savedDataSharing = localStorage.getItem('dataSharing');
        if (savedDataSharing !== null && dataSharingToggle) {
            dataSharingToggle.checked = savedDataSharing === 'true';
        }
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        if (body.getAttribute('data-theme') === 'dark') {
            disableDarkMode();
            if (themeToggle) themeToggle.checked = false;
            localStorage.setItem('darkMode', false);
        } else {
            enableDarkMode();
            if (themeToggle) themeToggle.checked = true;
            localStorage.setItem('darkMode', true);
        }
    }
    
    // Enable dark mode
    function enableDarkMode() {
        body.setAttribute('data-theme', 'dark');
        showToast('Dark Mode', 'Dark mode enabled', 'success');
    }
    
    // Disable dark mode
    function disableDarkMode() {
        body.removeAttribute('data-theme');
        showToast('Dark Mode', 'Dark mode disabled', 'info');
    }
    
    // Change color scheme
    function changeColorScheme(scheme) {
        // Remove existing color scheme classes
        body.classList.remove('color-pacers', 'color-calm', 'color-energetic', 'color-dark');
        
        // Add selected color scheme class
        body.classList.add(`color-${scheme}`);
        
        showToast('Color Scheme', `Color scheme changed to ${scheme}`, 'success');
    }
    
    // Show emergency resources
    function showEmergencyResources() {
        // In a real application, this would show critical emergency contact information
        const emergencyResources = [
            { name: 'National Suicide Prevention Lifeline', number: '988' },
            { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
            { name: 'Emergency Services', number: '911' },
            { name: 'Mental Health America', number: '1-800-273-TALK' }
        ];
        
        let message = "🚨 <strong>Emergency Resources</strong><br><br>";
        emergencyResources.forEach(resource => {
            message += `<strong>${resource.name}:</strong> ${resource.number}<br>`;
        });
        message += "<br>Please reach out if you're in crisis. You're not alone.";
        
        showToast('Emergency Resources', message, 'error', 10000);
    }
    
    // Export user data
    function exportUserData() {
        // Simulate exporting user data
        showToast('Export Data', 'Preparing your data for download...', 'info');
        
        // In a real application, this would generate a downloadable file
        setTimeout(() => {
            showToast('Export Complete', 'Your data has been downloaded successfully.', 'success');
        }, 2000);
    }
    
    // Confirm account deletion
    function confirmAccountDeletion() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Simulate account deletion
            showToast('Account Deletion', 'Your account has been scheduled for deletion.', 'error');
        }
    }
    
    // Confirm logout
    function confirmLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Simulate logout
            showToast('Logout', 'You have been logged out successfully.', 'info');
            
            // In a real application, this would redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }
    
    // Create new post
    function createNewPost() {
        showToast('New Post', 'Opening post creation dialog...', 'info');
        
        // In a real application, this would open a modal or new page for post creation
        setTimeout(() => {
            // Simulate successful post creation
            showToast('Post Created', 'Your post has been published to the community.', 'success');
        }, 2000);
    }
    
    // Select mood
    function selectMood(option) {
        // Remove active class from all options
        moodOptions.forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        option.classList.add('active');
        
        // Store selected mood
        window.selectedMood = option.getAttribute('data-mood');
    }
    
    // Toggle emotion tag
    function toggleEmotionTag(tag) {
        tag.classList.toggle('active');
    }
    
    // Save mood entry
    function saveMoodEntry() {
        if (!window.selectedMood) {
            showToast('Mood Tracking', 'Please select a mood first.', 'warning');
            return;
        }
        
        // Get selected emotions
        const selectedEmotions = [];
        document.querySelectorAll('.emotion-tag.active').forEach(tag => {
            selectedEmotions.push(tag.textContent);
        });
        
        // Get mood note
        const note = moodNoteInput.value;
        
        // Create mood entry object
        const moodEntry = {
            date: new Date().toISOString(),
            mood: window.selectedMood,
            emotions: selectedEmotions,
            note: note
        };
        
        // Save to localStorage (in a real app, this would go to a database)
        let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        moodHistory.unshift(moodEntry);
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
        
        // Update UI
        addMoodEntryToHistory(moodEntry);
        
        // Reset form
        moodOptions.forEach(opt => {
            opt.classList.remove('active');
        });
        emotionTags.forEach(tag => {
            tag.classList.remove('active');
        });
        moodNoteInput.value = '';
        adjustTextareaHeight(moodNoteInput);
        
        window.selectedMood = null;
        
        showToast('Mood Saved', 'Your mood entry has been saved successfully.', 'success');
    }
    
    // Add mood entry to history
    function addMoodEntryToHistory(entry) {
        const historyContainer = document.querySelector('.mood-entries');
        if (!historyContainer) return;
        
        const entryElement = document.createElement('div');
        entryElement.classList.add('mood-entry', 'fade-in');
        
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Get mood icon based on level
        let moodIcon = '';
        switch(entry.mood) {
            case '1': moodIcon = '😢'; break;
            case '2': moodIcon = '😕'; break;
            case '3': moodIcon = '😐'; break;
            case '4': moodIcon = '🙂'; break;
            case '5': moodIcon = '😄'; break;
        }
        
        entryElement.innerHTML = `
            <div class="entry-header">
                <span class="entry-date">${formattedDate}</span>
                <div class="mood-level" data-level="${entry.mood}">
                    <i>${moodIcon}</i>
                    <span>${entry.mood}/5</span>
                </div>
            </div>
            ${entry.emotions.length > 0 ? `
                <div class="entry-details">
                    ${entry.emotions.map(emotion => `
                        <span class="emotion-badge">${emotion}</span>
                    `).join('')}
                </div>
            ` : ''}
            ${entry.note ? `
                <p class="entry-note">${entry.note}</p>
            ` : ''}
        `;
        
        historyContainer.prepend(entryElement);
    }
    
    // Load mood history
    function loadMoodHistory() {
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        const historyContainer = document.querySelector('.mood-entries');
        
        if (!historyContainer) return;
        
        // Clear existing entries
        historyContainer.innerHTML = '';
        
        // Add entries to history
        moodHistory.forEach(entry => {
            addMoodEntryToHistory(entry);
        });
        
        // If no entries, show empty state
        if (moodHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center p-3">
                    <p>No mood entries yet. Track your first mood to see it here!</p>
                </div>
            `;
        }
    }
    
    // Filter mood history
    function filterMoodHistory() {
        const filterValue = historyFilter.value;
        const entries = document.querySelectorAll('.mood-entry');
        
        entries.forEach(entry => {
            entry.style.display = 'block';
        });
        
        if (filterValue === 'week') {
            // Show only entries from the past week
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            entries.forEach(entry => {
                const dateText = entry.querySelector('.entry-date').textContent;
                // This is a simplified check - in a real app you'd parse the date properly
                if (!isRecentDate(dateText, oneWeekAgo)) {
                    entry.style.display = 'none';
                }
            });
        } else if (filterValue === 'month') {
            // Show only entries from the past month
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            
            entries.forEach(entry => {
                const dateText = entry.querySelector('.entry-date').textContent;
                // This is a simplified check - in a real app you'd parse the date properly
                if (!isRecentDate(dateText, oneMonthAgo)) {
                    entry.style.display = 'none';
                }
            });
        }
    }
    
    // Helper function to check if a date is recent
    function isRecentDate(dateString, compareDate) {
        // This is a simplified implementation
        // In a real application, you would properly parse the date string
        return true; // For demo purposes, always return true
    }
    
    // Adjust textarea height
    function adjustTextareaHeight(event) {
        const textarea = event?.target || this;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    
    // Initialize chat
    function initChat() {
        // Clear chat input
        if (chatInput) {
            chatInput.value = '';
            adjustTextareaHeight(chatInput);
        }
        
        // Add welcome message if chat is empty
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages && chatMessages.children.length === 0) {
            addChatMessage('ai', 'Hello! How are you feeling today?', new Date());
        }
    }
    
    // Send chat message
    async function sendChatMessage() {
        if (!chatInput.value.trim()) return;
        
        // Add user message
        const userMessage = chatInput.value;
        addChatMessage('user', userMessage, new Date());
        
        // Get the language of the user's message
        const detectedLanguage = detectLanguage(userMessage);
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Send message to backend for AI processing
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    language: detectedLanguage
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }
            
            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add AI response
            addChatMessage('ai', data.response, new Date());
        } catch (error) {
            console.error('Error getting AI response:', error);
            // Remove typing indicator
            removeTypingIndicator();
            
            // Fallback to simple response if API fails
            const fallbackResponse = generateFallbackResponse(userMessage, detectedLanguage);
            addChatMessage('ai', fallbackResponse, new Date());
        }
        
        // Clear input
        chatInput.value = '';
        adjustTextareaHeight(chatInput);
    }
    
    // Detect language from text
    function detectLanguage(text) {
        // Simple language detection - in a real app you might use a library
        if (/[\u0600-\u06FF]/.test(text)) return 'arabic';
        if (/[\u4E00-\u9FFF]/.test(text)) return 'chinese';
        if (/[\uAC00-\uD7AF]/.test(text)) return 'korean';
        if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'japanese';
        if (/[\u0E00-\u0E7F]/.test(text)) return 'thai';
        if (/[\u0900-\u097F]/.test(text)) return 'hindi';
        
        // Default to English
        return 'english';
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;
        
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.classList.add('message', 'ai-message', 'typing');
        
        typingElement.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    // Add chat message to UI
    function addChatMessage(sender, text, timestamp) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`, 'fade-in');
        
        const formattedTime = timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        let avatar = '';
        if (sender === 'ai') {
            avatar = '<div class="message-avatar">AI</div>';
        } else {
            const userInitials = window.userData?.name ? window.userData.name.charAt(0) : 'U';
            avatar = `<div class="message-avatar">${userInitials}</div>`;
        }
        
        messageElement.innerHTML = `
            ${avatar}
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${formattedTime}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Generate fallback response if API fails
    function generateFallbackResponse(userMessage, language) {
        // Simple response generation based on keywords
        // This is just a fallback when the AI API is not available
        
        const lowerCaseMessage = userMessage.toLowerCase();
        
        // Responses in different languages
        const responses = {
            english: [
                "I hear you. How has that been affecting your day?",
                "Thank you for sharing. Would you like to explore that feeling further?",
                "I understand. What do you think might help you right now?",
                "That's interesting. Tell me more about that.",
                "I'm here to listen. How can I support you with this?",
                "I appreciate you opening up about this. How long have you been feeling this way?"
            ],
            // Add responses in other languages as needed
            spanish: [
                "Te escucho. ¿Cómo ha estado afectando eso tu día?",
                "Gracias por compartir. ¿Te gustaría explorar más ese sentimiento?",
                "Entiendo. ¿Qué crees que podría ayudarte en este momento?",
                "Eso es interesante. Cuéntame más sobre eso.",
                "Estoy aquí para escuchar. ¿Cómo puedo apoyarte con esto?",
                "Aprecio que compartas esto. ¿Cuánto tiempo has estado sintiéndote así?"
            ],
            french: [
                "Je t'entends. Comment cela a-t-il affecté ta journée?",
                "Merci d'avoir partagé. Aimeriais-tu explorer ce sentiment plus avant?",
                "Je comprends. Que penses-tu qui pourrait t'aider en ce moment?",
                "C'est intéressant. Dis-m'en plus.",
                "Je suis là pour écouter. Comment puis-je te soutenir dans cela?",
                "J'apprécie que tu m'en parles. Depuis combien de temps te sens-tu ainsi?"
            ]
            // Add more languages as needed
        };
        
        // Default to English if language not supported
        const languageResponses = responses[language] || responses.english;
        
        // Return a random response from the selected language
        return languageResponses[Math.floor(Math.random() * languageResponses.length)];
    }
    
    // Use quick response
    function useQuickResponse(response) {
        if (!chatInput) return;
        
        chatInput.value = response.textContent;
        adjustTextareaHeight(chatInput);
        chatInput.focus();
    }
    
    // Refresh insights
    function refreshInsights() {
        // Show loading state
        const originalHtml = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<div class="loading-spinner"></div>';
        refreshBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Restore button
            refreshBtn.innerHTML = originalHtml;
            refreshBtn.disabled = false;
            
            // Update insights with new data
            const insights = [
                "Practicing gratitude daily can improve your overall mood and life satisfaction.",
                "You've been consistent with your meditation practice this week. Keep it up!",
                "Your mood tends to be higher on days when you exercise in the morning.",
                "Consider trying a new wellness activity to keep your routine fresh and engaging.",
                "You've made progress on 2 of your 3 goals this month. Great work!"
            ];
            
            const insightsList = document.querySelector('.insights-list');
            if (insightsList) {
                insightsList.innerHTML = '';
                
                insights.forEach(insight => {
                    const insightElement = document.createElement('div');
                    insightElement.classList.add('insight-item', 'fade-in');
                    insightElement.innerHTML = `
                        <div class="insight-icon">
                            <i>💡</i>
                        </div>
                        <div class="insight-content">
                            <h4>Daily Insight</h4>
                            <p>${insight}</p>
                        </div>
                    `;
                    
                    insightsList.appendChild(insightElement);
                });
            }
            
            showToast('Insights Updated', 'Your daily insights have been refreshed.', 'success');
        }, 1500);
    }
    
    // View all activities
    function viewAllActivities() {
        showToast('Activities', 'Showing all wellness activities...', 'info');
        
        // In a real application, this would navigate to a dedicated activities page
        // For now, we'll just simulate loading more activities
        setTimeout(() => {
            const activities = [
                { name: 'Guided Meditation', type: 'Meditation', duration: '10 min' },
                { name: 'Evening Yoga Flow', type: 'Yoga', duration: '20 min' },
                { name: 'Breathing Exercise', type: 'Breathing', duration: '5 min' },
                { name: 'Gratitude Journaling', type: 'Journaling', duration: '15 min' }
            ];
            
            const activitiesList = document.querySelector('.activities-list');
            if (activitiesList) {
                activities.forEach(activity => {
                    const activityElement = document.createElement('div');
                    activityElement.classList.add('activity-item', 'fade-in');
                    activityElement.innerHTML = `
                        <div class="activity-image">
                            <i>🧘</i>
                        </div>
                        <div class="activity-content">
                            <h4>${activity.name}</h4>
                            <p>${activity.type}</p>
                            <span class="activity-duration">${activity.duration}</span>
                        </div>
                        <button class="activity-btn">Start</button>
                    `;
                    
                    activitiesList.appendChild(activityElement);
                });
            }
            
            // Hide the view all button since we've loaded all activities
            viewAllBtn.style.display = 'none';
        }, 1000);
    }
    
    // Switch community tab
    function switchCommunityTab(tab) {
        // Remove active class from all tabs
        communityTabs.forEach(t => {
            t.classList.remove('active');
        });
        
        // Add active class to selected tab
        tab.classList.add('active');
        
        // Filter posts based on tab
        const tabType = tab.getAttribute('data-tab');
        filterCommunityPosts(tabType);
    }
    
    // Filter community posts
    function filterCommunityPosts(filter) {
        const posts = document.querySelectorAll('.post-card');
        
        posts.forEach(post => {
            if (filter === 'all') {
                post.style.display = 'block';
            } else {
                const postType = post.getAttribute('data-type');
                if (postType === filter) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            }
        });
    }
    
    // Load community posts
    function loadCommunityPosts() {
        // Simulated community posts
        const posts = [
            {
                author: 'Sarah M.',
                time: '2 hours ago',
                title: 'My meditation journey',
                content: 'I\'ve been meditating for 30 days straight and the difference in my anxiety levels is remarkable!',
                tags: ['Meditation', 'Success'],
                type: 'success',
                likes: 24,
                comments: 8
            },
            {
                author: 'Michael T.',
                time: '5 hours ago',
                title: 'Need advice on sleep issues',
                content: 'Has anyone found effective ways to deal with insomnia? I\'ve been struggling for weeks.',
                tags: ['Sleep', 'Help'],
                type: 'question',
                likes: 15,
                comments: 12
            },
            {
                author: 'Wellness Team',
                time: '1 day ago',
                title: 'New breathing exercise available',
                content: 'Check out our new 4-7-8 breathing exercise designed to reduce anxiety and promote relaxation.',
                tags: ['Announcement', 'Breathing'],
                type: 'announcement',
                likes: 42,
                comments: 3
            }
        ];
        
        const postsGrid = document.querySelector('.posts-grid');
        if (!postsGrid) return;
        
        // Clear existing posts
        postsGrid.innerHTML = '';
        
        // Add posts to grid
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-card', 'fade-in');
            postElement.setAttribute('data-type', post.type);
            
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="post-author">${post.author.charAt(0)}</div>
                    <div class="post-info">
                        <div class="post-author-name">${post.author}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-content">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `
                            <span class="post-tag">${tag}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="post-actions">
                    <button class="post-action">
                        <i>👍</i> <span>${post.likes}</span>
                    </button>
                    <button class="post-action">
                        <i>💬</i> <span>${post.comments}</span>
                    </button>
                    <button class="post-action">
                        <i>↗️</i> <span>Share</span>
                    </button>
                </div>
            `;
            
            postsGrid.appendChild(postElement);
        });
    }
    
    // Access resource
    function accessResource(action) {
        const resourceName = action.closest('.resource-card').querySelector('h3').textContent;
        showToast('Resource', `Opening ${resourceName}...`, 'info');
        
        // In a real application, this would open the resource
        setTimeout(() => {
            showToast('Resource Started', `You've started ${resourceName}.`, 'success');
        }, 1500);
    }
    
    // Update goal
    function updateGoal(checkbox) {
        const goalLabel = checkbox.nextElementSibling;
        
        if (checkbox.checked) {
            goalLabel.classList.add('completed');
            showToast('Goal Completed', 'Great job completing your goal!', 'success');
        } else {
            goalLabel.classList.remove('completed');
        }
        
        // Save goal state to localStorage
        const goalId = checkbox.getAttribute('data-goal');
        localStorage.setItem(`goal-${goalId}`, checkbox.checked);
    }
    
    // Handle profile action
    function handleProfileAction(btn) {
        const action = btn.getAttribute('data-action');
        
        switch(action) {
            case 'edit':
                showToast('Edit Profile', 'Opening profile editor...', 'info');
                break;
            case 'privacy':
                showToast('Privacy Settings', 'Opening privacy settings...', 'info');
                break;
            case 'notifications':
                showToast('Notification Settings', 'Opening notification settings...', 'info');
                break;
            default:
                showToast('Action', 'Processing your request...', 'info');
        }
    }
    
    // Change avatar
    function changeAvatar() {
        showToast('Avatar', 'Opening avatar selector...', 'info');
        
        // In a real application, this would open an avatar selection modal
        setTimeout(() => {
            showToast('Avatar Updated', 'Your avatar has been changed successfully.', 'success');
        }, 2000);
    }
    
    // Update chart data based on time selection
    function updateChartData() {
        const timeRange = timeSelector.value;
        
        // Simulate different data based on time range
        let newData;
        
        switch(timeRange) {
            case 'week':
                newData = [3, 4, 3, 5, 4, 3, 4];
                break;
            case 'month':
                newData = [3, 4, 3, 5, 4, 3, 4, 3, 4, 5, 4, 3, 4, 5, 5, 4, 3, 4, 5, 4, 3, 4, 5, 4, 3, 4, 5, 4, 3, 4];
                break;
            case 'quarter':
                newData = [3, 4, 3, 5, 4, 3, 4, 3, 4, 5, 4, 3, 4];
                break;
            default:
                newData = [3, 4, 3, 5, 4, 3, 4];
        }
        
        // Update chart if it exists
        if (window.moodChart) {
            window.moodChart.data.datasets[0].data = newData;
            
            // Update labels based on time range
            if (timeRange === 'week') {
                window.moodChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            } else if (timeRange === 'month') {
                window.moodChart.data.labels = Array.from({length: 30}, (_, i) => `Day ${i+1}`);
            } else {
                window.moodChart.data.labels = Array.from({length: 13}, (_, i) => `Week ${i+1}`);
            }
            
            window.moodChart.update();
        }
    }
    
    // Update dashboard
    function updateDashboard() {
        // Update date info
        const dateInfo = document.querySelector('.date-info');
        if (dateInfo) {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateInfo.textContent = today.toLocaleDateString('en-US', options);
        }
        
        // Update stats with slight random variations to simulate real data
        const stats = [
            { selector: '.stat-mood .stat-value', base: 4, variation: 0.5 },
            { selector: '.stat-streak .stat-value', base: 7, variation: 2 },
            { selector: '.stat-sessions .stat-value', base: 12, variation: 3 },
            { selector: '.stat-goals .stat-value', base: 3, variation: 1 }
        ];
        
        stats.forEach(stat => {
            const element = document.querySelector(stat.selector);
            if (element) {
                // Add slight random variation to make it feel dynamic
                const variation = (Math.random() * stat.variation * 2) - stat.variation;
                const value = Math.max(1, Math.round(stat.base + variation));
                element.textContent = value;
            }
        });
    }
    
    // Load resources
    function loadResources() {
        // This would typically load from an API
        // For now, we'll just simulate that the resources are already in the HTML
        console.log('Resources loaded');
    }
    
    // Load profile data
    function loadProfileData() {
        // Load goal states from localStorage
        goalCheckboxes.forEach(checkbox => {
            const goalId = checkbox.getAttribute('data-goal');
            const isCompleted = localStorage.getItem(`goal-${goalId}`) === 'true';
            
            checkbox.checked = isCompleted;
            
            const goalLabel = checkbox.nextElementSibling;
            if (isCompleted) {
                goalLabel.classList.add('completed');
            } else {
                goalLabel.classList.remove('completed');
            }
        });
    }
    
    // Load settings
    function loadSettings() {
        // Settings are loaded in checkDarkModePreference
        console.log('Settings loaded');
    }
    
    // Simulate data loading
    function simulateDataLoading() {
        // Simulate loading delay for dashboard cards
        setTimeout(() => {
            document.querySelectorAll('.stat-card, .insight-item, .activity-item').forEach(item => {
                item.classList.add('slide-in');
            });
        }, 300);
    }
    
    // Show toast notification
    function showToast(title, message, type = 'info', duration = 5000) {
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        
        // Get appropriate icon for toast type
        let icon = 'ℹ️';
        switch(type) {
            case 'success': icon = '✅'; break;
            case 'error': icon = '❌'; break;
            case 'warning': icon = '⚠️'; break;
        }
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">×</button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
        
        return toast;
    }
    
    // Create toast container if it doesn't exist
    function createToastContainer() {
        const container = document.createElement('div');
        container.classList.add('toast-container');
        document.body.appendChild(container);
        return container;
    }
    
    // Make some functions available globally for demo purposes
    window.showToast = showToast;
});

// Additional utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = now - past;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes} min ago`;
    } else if (hours < 24) {
        return `${hours} hr ago`;
    } else {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
}

// Export function for use in other modules
export { formatDate, getTimeAgo };