// Enhanced Mood Tracker with Advanced Analytics
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mood tracking with enhanced features
    initEnhancedMoodTracker();
    
    // Initialize navigation and other dashboard functionality
    initDashboardFeatures();
});

// Enhanced mood wheel with more emotional granularity
const moodWheel = [
    { emoji: "😢", value: 1, label: "Devastated", category: "sad", intensity: 5 },
    { emoji: "😞", value: 2, label: "Sad", category: "sad", intensity: 4 },
    { emoji: "😐", value: 3, label: "Neutral", category: "neutral", intensity: 3 },
    { emoji: "🙂", value: 4, label: "Content", category: "happy", intensity: 4 },
    { emoji: "😊", value: 5, label: "Happy", category: "happy", intensity: 5 },
    { emoji: "😄", value: 6, label: "Excited", category: "happy", intensity: 6 },
    { emoji: "😰", value: 7, label: "Anxious", category: "anxious", intensity: 5 },
    { emoji: "😡", value: 8, label: "Angry", category: "angry", intensity: 5 },
    { emoji: "😴", value: 9, label: "Tired", category: "tired", intensity: 4 },
    { emoji: "😓", value: 10, label: "Stressed", category: "stressed", intensity: 5 }
];

function initEnhancedMoodTracker() {
    // Selected mood state
    let selectedMood = null;
    let selectedTags = new Set();
    
    // Render enhanced mood wheel
    renderMoodWheel();
    
    // Mood tag selection
    const moodTags = document.querySelectorAll('.mood-tag');
    moodTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            const tagValue = this.getAttribute('data-tag');
            
            if (this.classList.contains('active')) {
                selectedTags.add(tagValue);
            } else {
                selectedTags.delete(tagValue);
            }
        });
    });
    
    // Mood form submission
    const moodForm = document.getElementById('moodForm');
    if (moodForm) {
        moodForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!selectedMood) {
                showNotification('Please select a mood first', 'error');
                return;
            }
            
            const notes = document.querySelector('.mood-notes').value;
            
            try {
                // Get user data from localStorage
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!userData.id) {
                    showNotification('Please log in to save mood entries', 'error');
                    return;
                }
                
                const moodData = {
                    mood: parseInt(selectedMood),
                    tags: Array.from(selectedTags),
                    notes: notes,
                    userId: userData.id
                };
                
                // Save mood entry to backend
                const response = await fetch('/api/mood', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(moodData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        showNotification('Mood saved successfully!', 'success');
                        
                        // Reset form
                        document.querySelectorAll('.mood-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        moodTags.forEach(tag => tag.classList.remove('active'));
                        document.querySelector('.mood-notes').value = '';
                        selectedMood = null;
                        selectedTags.clear();
                        
                        // Refresh mood history and analytics
                        loadMoodHistory();
                        loadAdvancedAnalytics();
                    } else {
                        showNotification('Failed to save mood. Please try again.', 'error');
                    }
                } else {
                    showNotification('Failed to save mood. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error saving mood:', error);
                showNotification('Error saving mood. Please try again.', 'error');
            }
        });
    }
    
    // Time range selector
    const timeSelector = document.getElementById('moodHistoryRange');
    if (timeSelector) {
        timeSelector.addEventListener('change', function() {
            loadMoodHistory();
            loadAdvancedAnalytics();
        });
    }
    
    // Initialize mood history and analytics
    loadMoodHistory();
    loadAdvancedAnalytics();
    
    // Set up periodic mood check-ins
    setupMoodCheckins();
}

function renderMoodWheel() {
    const moodSelector = document.querySelector('.mood-scale');
    if (!moodSelector) {
        console.error('Mood selector element not found');
        return;
    }
    
    // Clear existing content
    moodSelector.innerHTML = '';
    
    // Create mood wheel grid
    const moodWheelContainer = document.createElement('div');
    moodWheelContainer.className = 'mood-wheel';
    
    moodWheel.forEach(mood => {
        const moodElement = document.createElement('div');
        moodElement.className = `mood-item mood-${mood.category}`;
        moodElement.innerHTML = `
            <span class="mood-emoji">${mood.emoji}</span>
            <span class="mood-label">${mood.label}</span>
        `;
        moodElement.dataset.value = mood.value;
        moodElement.dataset.category = mood.category;
        
        moodElement.addEventListener('click', function() {
            // Remove active class from all options
            document.querySelectorAll('.mood-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Store selected mood value
            selectedMood = this.getAttribute('data-value');
        });
        
        moodWheelContainer.appendChild(moodElement);
    });
    
    moodSelector.appendChild(moodWheelContainer);
}

// In mood-tracker.js, update the loadMoodHistory function:
async function loadMoodHistory() {
    try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!userData.id) {
            showLoginPrompt();
            return;
        }
        
        // Get selected time range
        const timeRange = document.getElementById('moodHistoryRange').value;
        
        // Fetch mood data from backend
        const response = await fetch(`/api/mood/${userData.id}?days=${timeRange}`);
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                // Transform the data for the chart
                const chartData = result.data.map(entry => ({
                    date: entry.date,
                    mood: entry.mood,
                    tags: entry.tags
                }));
                
                renderMoodChart(chartData);
                updateMoodInsights(chartData);
            } else {
                renderMoodChart([]);
            }
        } else {
            console.error('Failed to fetch mood history');
            renderMoodChart([]);
        }
    } catch (error) {
        console.error('Error loading mood history:', error);
        renderMoodChart([]);
    }
}

async function loadAdvancedAnalytics() {
    try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!userData.id) {
            return;
        }
        
        // Get selected time range
        const timeRange = document.getElementById('moodHistoryRange').value;
        
        // Fetch advanced analytics from backend
        const response = await fetch(`/api/mood/analytics/${userData.id}?days=${timeRange}`);
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                renderAdvancedAnalytics(result.data);
            }
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function renderAdvancedAnalytics(analyticsData) {
    const analyticsContainer = document.getElementById('advancedAnalytics');
    if (!analyticsContainer) return;
    
    if (!analyticsData || Object.keys(analyticsData).length === 0) {
        analyticsContainer.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-chart-line"></i>
                <h4>More data needed for advanced analytics</h4>
                <p>Continue tracking your mood to unlock detailed insights</p>
            </div>
        `;
        return;
    }
    
    analyticsContainer.innerHTML = `
        <div class="analytics-section">
            <h4><i class="fas fa-brain"></i> Mood Patterns</h4>
            <div class="pattern-cards">
                ${analyticsData.patterns && analyticsData.patterns.length > 0 ? 
                    analyticsData.patterns.map(pattern => `
                        <div class="pattern-card">
                            <i class="fas ${getPatternIcon(pattern.type)}"></i>
                            <p>${pattern.message}</p>
                        </div>
                    `).join('') : 
                    '<p>No significant patterns detected yet</p>'
                }
            </div>
        </div>
        
        <div class="analytics-section">
            <h4><i class="fas fa-link"></i> Mood Correlations</h4>
            <div class="correlation-cards">
                ${analyticsData.correlations && analyticsData.correlations.length > 0 ? 
                    analyticsData.correlations.map(correlation => `
                        <div class="correlation-card">
                            <span class="correlation-strength">${correlation.strength}%</span>
                            <p>${correlation.factor} affects your mood</p>
                        </div>
                    `).join('') : 
                    '<p>No significant correlations detected yet</p>'
                }
            </div>
        </div>
        
        ${analyticsData.predictions && analyticsData.predictions.length > 0 ? `
        <div class="analytics-section">
            <h4><i class="fas fa-crystal-ball"></i> Predictions</h4>
            <div class="prediction-cards">
                ${analyticsData.predictions.map(prediction => `
                    <div class="prediction-card">
                        <i class="fas ${getPredictionIcon(prediction.trend)}"></i>
                        <p>${prediction.message}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

function getPatternIcon(patternType) {
    const icons = {
        'daily_pattern': 'fa-clock',
        'weekly_pattern': 'fa-calendar',
        'trigger_based': 'fa-bolt',
        'default': 'fa-chart-line'
    };
    return icons[patternType] || icons.default;
}

function getPredictionIcon(trend) {
    return trend === 'improving' ? 'fa-arrow-up' : 
           trend === 'declining' ? 'fa-arrow-down' : 'fa-minus';
}

function setupMoodCheckins() {
    // Check if it's time for a mood check-in (once per day)
    const lastCheckin = localStorage.getItem('lastMoodCheckin');
    const now = new Date();
    const today = now.toDateString();
    
    if (lastCheckin !== today) {
        // Check time of day - don't prompt late at night
        const currentHour = now.getHours();
        if (currentHour >= 8 && currentHour <= 22) {
            // Show check-in reminder after a delay
            setTimeout(() => {
                showCheckinReminder();
            }, 30000); // 30 seconds after page load
        }
    }
}

function showCheckinReminder() {
    const reminder = document.createElement('div');
    reminder.className = 'checkin-reminder';
    reminder.innerHTML = `
        <div class="reminder-content">
            <i class="fas fa-heart"></i>
            <div>
                <h4>How are you feeling right now?</h4>
                <p>Take a moment to check in with your emotions</p>
            </div>
            <button class="reminder-action">Check In</button>
            <button class="reminder-dismiss">&times;</button>
        </div>
    `;
    
    document.body.appendChild(reminder);
    
    // Add event listeners
    reminder.querySelector('.reminder-action').addEventListener('click', () => {
        document.querySelector('.mood-tracker-container').scrollIntoView({ behavior: 'smooth' });
        reminder.remove();
        localStorage.setItem('lastMoodCheckin', new Date().toDateString());
    });
    
    reminder.querySelector('.reminder-dismiss').addEventListener('click', () => {
        reminder.remove();
        localStorage.setItem('lastMoodCheckin', new Date().toDateString());
    });
}

function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function showLoginPrompt() {
    const moodHistory = document.querySelector('.mood-history');
    if (moodHistory) {
        moodHistory.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-user-clock"></i>
                <h4>Please log in to view your mood history</h4>
                <p>Your mood data will be saved and available across devices</p>
                <button class="login-prompt-btn" onclick="window.location.href='/login'">Sign In</button>
            </div>
        `;
    }
}

// The rest of your existing functions (initDashboardFeatures, etc.)
// ... [Keep all your existing functions from previous implementation]