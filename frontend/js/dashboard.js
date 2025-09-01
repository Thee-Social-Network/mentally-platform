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
            // Save mood to memory (not localStorage)
            window.dailyMood = mood;
            window.moodDate = new Date().toDateString();
            
            // Visual feedback
            moodOptions.forEach(opt => opt.style.transform = 'scale(1)');
            this.style.transform = 'scale(1.3)';
            
            // Show confirmation
            alert(`Thanks for sharing! We've recorded that you're feeling ${mood} today.`);
        });
    });

    // Check if user has already set mood today
    if (window.moodDate === new Date().toDateString() && window.dailyMood) {
        const selectedOption = document.querySelector(`.mood-option[data-mood="${window.dailyMood}"]`);
        if (selectedOption) {
            selectedOption.style.transform = 'scale(1.3)';
        }
    }

    // AI Chat functionality with time limit
    const chatTimeElement = document.getElementById('chat-time');
    const chatInput = document.querySelector('.chat-input textarea');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.querySelector('.chat-messages');
    
    let chatTimeLeft = 900; // 15 minutes in seconds
    let chatTimer;
    let conversationHistory = []; // Store conversation for context
    let isWaitingForResponse = false; // Prevent multiple requests
    
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
        
        // Add to conversation history
        conversationHistory.push({
            text: text,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 messages for context (to manage API limits)
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-10);
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'ai-message', 'typing-indicator');
        typingDiv.innerHTML = `<p>typing...</p>`;
        typingDiv.id = 'typing-indicator';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Send message to AI backend
    async function sendToAI(userMessage) {
        try {
            isWaitingForResponse = true;
            showTypingIndicator();
            
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: conversationHistory.slice(-6) // Send last 6 messages for context
                })
            });
            
            const data = await response.json();
            
            removeTypingIndicator();
            
            if (data.success && data.response) {
                addMessage(data.response, 'ai');
            } else {
                addMessage("I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 'ai');
            }
            
        } catch (error) {
            console.error('Error sending message to AI:', error);
            removeTypingIndicator();
            addMessage("I'm having some connection issues right now. Please try again in a moment.", 'ai');
        } finally {
            isWaitingForResponse = false;
        }
    }
    
    // Handle send message
    sendButton.addEventListener('click', async function() {
        if (chatInput.value.trim() !== '' && !isWaitingForResponse) {
            const userMessage = chatInput.value.trim();
            
            // Add user message
            addMessage(userMessage, 'user');
            
            // Clear input
            chatInput.value = '';
            
            // Start timer if not already started
            if (!chatTimer) {
                startChatTimer();
            }
            
            // Send to AI
            await sendToAI(userMessage);
        }
    });
    
    // Allow sending message with Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey && !isWaitingForResponse) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // Suggestion buttons
    const suggestionButtons = document.querySelectorAll('.suggestion-button');
    suggestionButtons.forEach(button => {
        button.addEventListener('click', async function() {
            if (isWaitingForResponse) return;
            
            const suggestion = this.textContent;
            
            // Add user message showing the selection
            const userMessage = `I'd like to: ${suggestion}`;
            addMessage(userMessage, 'user');
            
            // Start timer if not already started
            if (!chatTimer) {
                startChatTimer();
            }
            
            // Send to AI
            await sendToAI(userMessage);
        });
    });
    
    // Wellness tools buttons
    const toolButtons = document.querySelectorAll('.tool-button');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.parentElement.querySelector('h3').textContent;
            alert(`Starting ${tool}... In a complete implementation, this would launch the selected tool.`);
            
            // Track tool usage in memory
            if (!window.toolsUsed) window.toolsUsed = [];
            window.toolsUsed.push({
                tool: tool,
                date: new Date().toISOString()
            });
            
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
                // Clear conversation history
                conversationHistory = [];
                // In a real app, this would clear authentication tokens
                window.location.href = 'index.html';
            }
        });
    }
    
    // Initialize achievements
    function updateAchievements() {
        const toolsUsed = window.toolsUsed || [];
        const moodEntries = window.moodEntries || [];
        
        // Simple demo achievement check
        const badges = document.querySelectorAll('.badge');
        if (badges.length >= 2) {
            if (toolsUsed.length >= 3) {
                badges[1].style.display = 'inline-block';
            }
            
            if (moodEntries.length >= 5) {
                badges[0].style.display = 'inline-block';
            }
        }
    }
    
    // Initialize chart (simplified version)
    function initChart() {
        const canvas = document.getElementById('mood-chart');
        if (canvas && canvas.getContext) {
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
    
    // Add initial AI greeting
    setTimeout(() => {
        addMessage("Hi there! I'm here to listen and support you. How are you feeling today? Feel free to share anything that's on your mind - I'm here for you.", 'ai');
    }, 1000);
});