// Enhanced Mood Tracker with Advanced Analytics
document.addEventListener('DOMContentLoaded', function() {
    // Update date display
    updateCurrentDate();
    
    // Initialize mood tracking with enhanced features
    initEnhancedMoodTracker();
    
    // Initialize navigation and other dashboard functionality
    if (typeof initDashboardFeatures === 'function') {
        initDashboardFeatures();
    }
});

// Update date display to show current date
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

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

// Mood suggestions based on mood value
const moodSuggestions = {
    1: {
        title: "You're feeling very sad",
        suggestions: [
            "Practice deep breathing exercises",
            "Reach out to a trusted friend or family member",
            "Try a guided meditation for difficult emotions",
            "Write about your feelings in a journal",
            "Consider speaking with a mental health professional"
        ]
    },
    2: {
        title: "You're feeling sad",
        suggestions: [
            "Listen to uplifting music",
            "Take a walk in nature",
            "Practice self-compassion and acknowledge your feelings",
            "Watch a comforting movie or show",
            "Engage in a creative activity you enjoy"
        ]
    },
    3: {
        title: "You're feeling neutral",
        suggestions: [
            "Try a new activity to spark interest",
            "Practice mindfulness to stay present",
            "Set a small, achievable goal for the day",
            "Connect with someone you haven't spoken to in a while",
            "Explore a new hobby or interest"
        ]
    },
    4: {
        title: "You're feeling good",
        suggestions: [
            "Share your positive energy with others",
            "Practice gratitude by listing things you appreciate",
            "Engage in physical activity to boost your mood further",
            "Help someone else - it can enhance your own wellbeing",
            "Plan something to look forward to"
        ]
    },
    5: {
        title: "You're feeling great!",
        suggestions: [
            "Share what's working for you with others",
            "Capture this feeling in a journal for future reference",
            "Try something new while your energy is high",
            "Set ambitious but achievable goals",
            "Practice mindfulness to fully appreciate this moment"
        ]
    }
};

let moodChart = null;
let factorsChart = null;
let selectedMood = null;
let selectedTags = new Set();

function initEnhancedMoodTracker() {
    // Render enhanced mood wheel
    renderMoodWheel();
    
    // Mood option selection
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            moodOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Store selected mood value
            selectedMood = this.getAttribute('data-mood');
            
            // Show suggestions based on mood
            showMoodSuggestions(selectedMood);
            
            // Load mood history to update charts
            loadMoodHistory();
        });
    });
    
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
                        
                        // Show appropriate popup based on mood
                        if (selectedMood <= 2) {
                            showSupportModal();
                        } else if (selectedMood >= 4) {
                            showShareModal();
                        }
                        
                        // Reset form
                        moodOptions.forEach(option => option.classList.remove('active'));
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
    
    // Initialize modals
    initModals();
    
    // Initialize mood history and analytics
    loadMoodHistory();
    loadAdvancedAnalytics();
    
    // Set up periodic mood check-ins
    setupMoodCheckins();
}

function initModals() {
    // Support modal
    const supportModal = document.getElementById('supportModal');
    if (supportModal) {
        const closeSupportModal = document.getElementById('closeSupportModal');
        const dismissSupport = document.getElementById('dismissSupport');
        const connectWithProfessional = document.getElementById('connectWithProfessional');
        const aiSupport = document.getElementById('aiSupport');
        
        if (closeSupportModal) {
            closeSupportModal.addEventListener('click', () => supportModal.close());
        }
        
        if (dismissSupport) {
            dismissSupport.addEventListener('click', () => supportModal.close());
        }
        
        if (connectWithProfessional) {
            connectWithProfessional.addEventListener('click', () => {
                window.location.href = '/professionals';
                supportModal.close();
            });
        }
        
        if (aiSupport) {
            aiSupport.addEventListener('click', () => {
                window.location.href = '/ai-support';
                supportModal.close();
            });
        }
    }
    
    // Share modal
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        const closeShareModal = document.getElementById('closeShareModal');
        const dismissShare = document.getElementById('dismissShare');
        const shareToCommunity = document.getElementById('shareToCommunity');
        
        if (closeShareModal) {
            closeShareModal.addEventListener('click', () => shareModal.close());
        }
        
        if (dismissShare) {
            dismissShare.addEventListener('click', () => shareModal.close());
        }
        
        if (shareToCommunity) {
            shareToCommunity.addEventListener('click', () => {
                window.location.href = '/community';
                shareModal.close();
            });
        }
    }
}

function showSupportModal() {
    const supportModal = document.getElementById('supportModal');
    if (supportModal) {
        supportModal.showModal();
    }
}

function showShareModal() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.showModal();
    }
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
            
            // Show suggestions based on mood
            showMoodSuggestions(selectedMood);
            
            // Load mood history to update charts
            loadMoodHistory();
        });
        
        moodWheelContainer.appendChild(moodElement);
    });
    
    moodSelector.appendChild(moodWheelContainer);
}

function showMoodSuggestions(moodValue) {
    const suggestionsContainer = document.getElementById('suggestionsContent');
    if (!suggestionsContainer) return;
    
    const moodInt = parseInt(moodValue);
    const suggestions = moodSuggestions[moodInt] || moodSuggestions[3]; // Default to neutral
    
    suggestionsContainer.innerHTML = `
        <h5>${suggestions.title}</h5>
        <ul>
            ${suggestions.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
        </ul>
    `;
}

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
                
                // Also fetch factors data for the bar chart
                const factorsResponse = await fetch(`/api/mood/factors/${userData.id}?days=${timeRange}`);
                if (factorsResponse.ok) {
                    const factorsResult = await factorsResponse.json();
                    if (factorsResult.success) {
                        renderFactorsChart(factorsResult.data);
                    }
                }
                
                updateMoodInsights(chartData);
            } else {
                renderMoodChart([]);
                renderFactorsChart({});
            }
        } else {
            console.error('Failed to fetch mood history');
            renderMoodChart([]);
            renderFactorsChart({});
        }
    } catch (error) {
        console.error('Error loading mood history:', error);
        renderMoodChart([]);
        renderFactorsChart({});
    }
}

function renderMoodChart(moodData) {
    const ctx = document.getElementById('moodHistoryChart');
    if (!ctx) return;
    
    // Filter data for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentData = moodData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= sevenDaysAgo;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Prepare chart data
    const labels = recentData.map(entry => {
        const date = new Date(entry.date);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });
    
    const data = recentData.map(entry => entry.mood);
    
    // Destroy previous chart if it exists
    if (moodChart) {
        moodChart.destroy();
    }
    
    // Create new chart
    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Level',
                data: data,
                borderColor: '#FDBB30',
                backgroundColor: 'rgba(253, 187, 48, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#FDBB30',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 1,
                    max: 10,
                    ticks: {
                        stepSize: 1,
                        color: '#FFFFFF',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Mood Level',
                        color: '#FDBB30',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    ticks: {
                        color: '#FFFFFF',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Date',
                        color: '#FDBB30',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Your Mood Over the Last 7 Days',
                    color: '#FFFFFF',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    labels: {
                        color: '#FFFFFF',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 45, 98, 0.9)',
                    titleColor: '#FDBB30',
                    bodyColor: '#FFFFFF',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    callbacks: {
                        label: function(context) {
                            return `Mood: ${context.raw}/10`;
                        }
                    }
                }
            }
        }
    });
}

function renderFactorsChart(factorsData) {
    const ctx = document.getElementById('factorsChart');
    if (!ctx) return;
    
    // Prepare chart data
    const labels = Object.keys(factorsData).map(key => key.charAt(0).toUpperCase() + key.slice(1));
    const data = Object.values(factorsData);
    
    // Destroy previous chart if it exists
    if (factorsChart) {
        factorsChart.destroy();
    }
    
    // Create new chart
    factorsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Times Selected',
                data: data,
                backgroundColor: 'rgba(253, 187, 48, 0.7)',
                borderColor: 'rgba(253, 187, 48, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#FFFFFF',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Number of Times Selected',
                        color: '#FDBB30',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    ticks: {
                        color: '#FFFFFF',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Factors',
                        color: '#FDBB30',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'What Has Been Affecting Your Mood',
                    color: '#FFFFFF',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    labels: {
                        color: '#FFFFFF',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 45, 98, 0.9)',
                    titleColor: '#FDBB30',
                    bodyColor: '#FFFFFF',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    }
                }
            }
        }
    });
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

function updateMoodInsights(moodData) {
    // Simple insights based on mood data
    if (moodData.length > 0) {
        const avgMood = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;
        
        let insight = '';
        if (avgMood <= 3) {
            insight = 'Your mood has been lower recently. Consider trying some of our wellness tools.';
        } else if (avgMood <= 6) {
            insight = 'Your mood has been moderate. Keep tracking to identify patterns.';
        } else {
            insight = 'Your mood has been positive! Keep doing what works for you.';
        }
        
        const insightsElement = document.querySelector('.mood-insights');
        if (insightsElement) {
            insightsElement.textContent = insight;
        }
    }
}

function setupMoodCheckins() {
    // Check if user has already completed a mood check-in today
    const lastCheckin = localStorage.getItem('lastMoodCheckin');
    const today = new Date().toDateString();
    
    if (lastCheckin !== today) {
        // Show a gentle reminder after a delay
        setTimeout(() => {
            showNotification('Remember to track your mood today!', 'info');
        }, 30000); // 30 seconds after page load
    }
}

function showLoginPrompt() {
    const moodHistory = document.querySelector('.mood-history');
    if (moodHistory) {
        moodHistory.innerHTML = `
            <div class="login-prompt">
                <i class="fas fa-user-circle"></i>
                <h3>Log in to track your mood history</h3>
                <p>Sign in or create an account to save your mood entries and view your trends over time.</p>
                <button class="login-btn" onclick="window.location.href='/login'">Log In</button>
            </div>
        `;
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}