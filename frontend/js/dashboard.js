// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Emergency button functionality
    const emergencyButton = document.getElementById('emergency-button');
    if (emergencyButton) {
        emergencyButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to call emergency services?')) {
                // In a real implementation, this would call South African emergency numbers
                window.location.href = 'tel:112';
                alert('Calling emergency services. Please stay on the line.');
            }
        });
    }

    // Mood tracking
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            // Save mood to local storage or send to server
            localStorage.setItem('dailyMood', mood);
            localStorage.setItem('moodDate', new Date().toDateString());
            
            // Visual feedback
            moodOptions.forEach(opt => opt.style.transform = 'scale(1)');
            this.style.transform = 'scale(1.3)';
            
            // Show confirmation
            alert(`Thanks for sharing! We've recorded that you're feeling ${mood} today.`);
        });
    });

    // Check if user has already set mood today
    const moodDate = localStorage.getItem('moodDate');
    if (moodDate === new Date().toDateString()) {
        const savedMood = localStorage.getItem('dailyMood');
        if (savedMood) {
            const selectedOption = document.querySelector(`.mood-option[data-mood="${savedMood}"]`);
            if (selectedOption) {
                selectedOption.style.transform = 'scale(1.3)';
            }
        }
    }

    // AI Chat functionality with time limit
    const chatTimeElement = document.getElementById('chat-time');
    const chatInput = document.querySelector('.chat-input textarea');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.querySelector('.chat-messages');
    
    let chatTimeLeft = 900; // 15 minutes in seconds
    let chatTimer;
    
    // Start chat timer
    function startChatTimer() {
        clearInterval(chatTimer);
        chatTimer = setInterval(() => {
            chatTimeLeft--;
            
            // Format time as mm:ss
            const minutes = Math.floor(chatTimeLeft / 60);
            const seconds = chatTimeLeft % 60;
            chatTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (chatTimeLeft <= 0) {
                clearInterval(chatTimer);
                chatInput.disabled = true;
                sendButton.disabled = true;
                
                // Add timeout message from AI
                addMessage("I'm glad we talked today. To support your wellbeing, I'll need to pause our conversation now. How about taking a short walk, journaling, or calling a friend? Remember, I'm here for you again tomorrow.", 'ai');
            }
        }, 1000);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle send message
    sendButton.addEventListener('click', function() {
        if (chatInput.value.trim() !== '') {
            // Add user message
            addMessage(chatInput.value, 'user');
            
            // Clear input
            const userMessage = chatInput.value;
            chatInput.value = '';
            
            // Start timer if not already started
            if (!chatTimer) {
                startChatTimer();
            }
            
            // Simulate AI response (in a real app, this would call an API)
            setTimeout(() => {
                let response;
                
                if (userMessage.toLowerCase().includes('sad') || userMessage.toLowerCase().includes('depress')) {
                    response = "I'm sorry you're feeling this way. It takes courage to share these feelings. Would you like me to help you find a professional to talk to?";
                } else if (userMessage.toLowerCase().includes('anxious') || userMessage.toLowerCase().includes('worry')) {
                    response = "Anxiety can be really challenging. Have you tried the breathing exercise in your wellness tools? I can also help you find local support groups if you're interested.";
                } else if (userMessage.toLowerCase().includes('lonely') || userMessage.toLowerCase().includes('alone')) {
                    response = "Feeling lonely is difficult. Would you like to explore community activities happening near you? Connecting with others who understand can be really helpful.";
                } else {
                    response = "Thank you for sharing. I'm here to listen and support you. Remember, I'm a first step toward feeling better. Would you like to try one of our wellness tools or explore community support options?";
                }
                
                addMessage(response, 'ai');
            }, 1000);
        }
    });
    
    // Allow sending message with Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // Suggestion buttons
    const suggestionButtons = document.querySelectorAll('.suggestion-button');
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const suggestion = this.textContent;
            
            // Add user message showing the selection
            addMessage(`I'd like to: ${suggestion}`, 'user');
            
            // Simulate AI response based on suggestion
            setTimeout(() => {
                let response;
                
                if (suggestion.includes('counselor')) {
                    response = "That's a positive step! Let me help you find qualified counselors in your area. Would you prefer in-person or online sessions?";
                } else if (suggestion.includes('support groups')) {
                    response = "Great choice! Support groups can provide wonderful community connection. I've found several options near you meeting this week. Would you like me to show you?";
                } else if (suggestion.includes('Breathing')) {
                    response = "Excellent self-care choice! Let me guide you through a simple breathing exercise. Find a comfortable position and we'll begin...";
                }
                
                addMessage(response, 'ai');
            }, 1000);
        });
    });
    
    // Wellness tools buttons
    const toolButtons = document.querySelectorAll('.tool-button');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.parentElement.querySelector('h3').textContent;
            alert(`Starting ${tool}... In a complete implementation, this would launch the selected tool.`);
            
            // Track tool usage for gamification
            const toolsUsed = JSON.parse(localStorage.getItem('toolsUsed') || '[]');
            toolsUsed.push({
                tool: tool,
                date: new Date().toISOString()
            });
            localStorage.setItem('toolsUsed', JSON.stringify(toolsUsed));
            
            // Update achievements if needed
            updateAchievements();
        });
    });
    
    // Community buttons
    const communityButtons = document.querySelectorAll('.community-button');
    communityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const communityType = this.parentElement.querySelector('h3').textContent;
            alert(`Exploring ${communityType}... In a complete implementation, this would show relevant community options.`);
        });
    });
    
    // Logout functionality
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // In a real app, this would clear authentication tokens
                window.location.href = 'index.html';
            }
        });
    }
    
    // Initialize achievements
    function updateAchievements() {
        // This would be more complex in a real implementation
        const toolsUsed = JSON.parse(localStorage.getItem('toolsUsed') || '[]');
        const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
        
        // Simple demo achievement check
        if (toolsUsed.length >= 3) {
            document.querySelector('.badge:nth-child(2)').style.display = 'inline-block';
        }
        
        if (moodEntries.length >= 5) {
            document.querySelector('.badge:nth-child(1)').style.display = 'inline-block';
        }
    }
    
    // Initialize chart (simplified version)
    function initChart() {
        const canvas = document.getElementById('mood-chart');
        if (canvas.getContext) {
            const ctx = canvas.getContext('2d');
            
            // Draw a simple chart (in a real app, use a library like Chart.js)
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, 400, 200);
            
            // Draw axes
            ctx.beginPath();
            ctx.moveTo(30, 30);
            ctx.lineTo(30, 170);
            ctx.lineTo(370, 170);
            ctx.strokeStyle = '#002D62';
            ctx.stroke();
            
            // Draw sample data
            ctx.beginPath();
            ctx.moveTo(30, 170);
            ctx.lineTo(70, 130);
            ctx.lineTo(110, 150);
            ctx.lineTo(150, 100);
            ctx.lineTo(190, 120);
            ctx.lineTo(230, 80);
            ctx.lineTo(270, 140);
            ctx.lineTo(310, 110);
            ctx.lineTo(350, 130);
            ctx.strokeStyle = '#FDBB30';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
    
    // Initialize the chart
    initChart();
    updateAchievements();
});