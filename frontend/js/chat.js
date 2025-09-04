// Mentaly Chatroom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const roomInfoBtn = document.getElementById('roomInfoBtn');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const roomInfoPanel = document.getElementById('roomInfoPanel');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const attachmentBtn = document.getElementById('attachmentBtn');
    const fileInput = document.getElementById('fileInput');
    const emojiBtn = document.getElementById('emojiBtn');
    const chatItems = document.querySelectorAll('.chat-item');
    const searchInput = document.getElementById('searchInput');
    const newRoomBtn = document.getElementById('newRoomBtn');
    const leaveRoomBtn = document.getElementById('leaveRoomBtn');
    
    // Toggle Room Info Panel
    roomInfoBtn.addEventListener('click', function() {
        roomInfoPanel.classList.toggle('active');
    });
    
    closePanelBtn.addEventListener('click', function() {
        roomInfoPanel.classList.remove('active');
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Enable/disable send button based on content
        sendBtn.disabled = this.value.trim() === '';
    });
    
    // Send message functionality
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Create new message element
            const messageElement = document.createElement('article');
            messageElement.className = 'message sent';
            
            const messageContent = document.createElement('section');
            messageContent.className = 'message-content';
            
            const messageText = document.createElement('p');
            messageText.className = 'message-text';
            messageText.textContent = message;
            
            const messageTime = document.createElement('time');
            messageTime.className = 'message-time';
            messageTime.textContent = getCurrentTime();
            
            const messageAvatar = document.createElement('figure');
            messageAvatar.className = 'message-avatar';
            
            const avatarIcon = document.createElement('i');
            avatarIcon.className = 'fas fa-user-astronaut';
            
            messageAvatar.appendChild(avatarIcon);
            messageContent.appendChild(messageText);
            messageContent.appendChild(messageTime);
            
            messageElement.appendChild(messageContent);
            messageElement.appendChild(messageAvatar);
            
            // Add to messages container
            messagesContainer.appendChild(messageElement);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Clear input
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendBtn.disabled = true;
            
            // Simulate response after a delay
            setTimeout(simulateResponse, 1000 + Math.random() * 2000);
        }
    }
    
    function simulateResponse() {
        const responses = [
            "That's really helpful advice, thank you for sharing.",
            "I've been feeling the same way lately. It's comforting to know I'm not alone.",
            "Has anyone tried meditation for this? I've heard it can help.",
            "Thank you for being so open. It takes courage to share these things.",
            "I appreciate everyone's support here. This community means a lot to me.",
            "Does anyone have recommendations for resources to learn more about this?",
            "I'm having a tough day today, but reading these messages helps.",
            "Remember to be kind to yourselves today. You're doing the best you can.",
            "Has anyone found a particular coping strategy that works well for them?",
            "Sending positive thoughts to everyone here. We're in this together."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const messageElement = document.createElement('article');
        messageElement.className = 'message received';
        
        const messageAvatar = document.createElement('figure');
        messageAvatar.className = 'message-avatar';
        
        const avatarIcons = ['fa-user-secret', 'fa-user-ninja', 'fa-user-graduate', 'fa-user-tie', 'fa-user-md'];
        const randomAvatar = avatarIcons[Math.floor(Math.random() * avatarIcons.length)];
        
        const avatarIcon = document.createElement('i');
        avatarIcon.className = 'fas ' + randomAvatar;
        
        messageAvatar.appendChild(avatarIcon);
        
        const messageContent = document.createElement('section');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.className = 'message-text';
        messageText.textContent = randomResponse;
        
        const messageTime = document.createElement('time');
        messageTime.className = 'message-time';
        messageTime.textContent = getCurrentTime();
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        
        messageElement.appendChild(messageAvatar);
        messageElement.appendChild(messageContent);
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // File attachment
    attachmentBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            // In a real app, you would handle file upload here
            const fileName = this.files[0].name;
            messageInput.value = `[Attached: ${fileName}] ${messageInput.value}`;
            messageInput.dispatchEvent(new Event('input'));
        }
    });
    
    // Emoji picker (simplified)
    emojiBtn.addEventListener('click', function() {
        const emojis = ['😊', '😢', '😌', '🤗', '🙏', '❤️', '🌻', '🌈'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Insert at cursor position
        const cursorPos = messageInput.selectionStart;
        const textBefore = messageInput.value.substring(0, cursorPos);
        const textAfter = messageInput.value.substring(cursorPos);
        
        messageInput.value = textBefore + randomEmoji + textAfter;
        messageInput.focus();
        messageInput.selectionEnd = cursorPos + randomEmoji.length;
        messageInput.dispatchEvent(new Event('input'));
    });
    
    // Chat room switching
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            chatItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update chat header with room name
            const roomName = this.querySelector('.chat-name').textContent;
            document.querySelector('.user-name').textContent = roomName;
            
            // Clear messages and show welcome message
            const welcomeMessage = document.querySelector('.welcome-message');
            const allMessages = document.querySelectorAll('.message:not(.welcome-message)');
            
            allMessages.forEach(msg => msg.remove());
            
            if (!document.querySelector('.welcome-message')) {
                const welcomeClone = welcomeMessage.cloneNode(true);
                messagesContainer.appendChild(welcomeClone);
            }
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        chatItems.forEach(item => {
            const roomName = item.querySelector('.chat-name').textContent.toLowerCase();
            const lastMessage = item.querySelector('.chat-last-message').textContent.toLowerCase();
            
            if (roomName.includes(searchTerm) || lastMessage.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Create new room
    newRoomBtn.addEventListener('click', function() {
        const roomName = prompt('Enter a name for your new chat room:');
        if (roomName && roomName.trim()) {
            // Create new room item
            const newRoom = document.createElement('article');
            newRoom.className = 'chat-item';
            
            newRoom.innerHTML = `
                <figure class="chat-avatar">
                    <i class="fas fa-plus-circle"></i>
                </figure>
                <section class="chat-info">
                    <h3 class="chat-name">${roomName.trim()}</h3>
                    <p class="chat-last-message">You created this room</p>
                </section>
                <section class="chat-meta">
                    <time class="chat-time">Just now</time>
                </section>
            `;
            
            // Add click event to the new room
            newRoom.addEventListener('click', function() {
                chatItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelector('.user-name').textContent = roomName.trim();
                
                // Clear messages and show welcome message
                const allMessages = document.querySelectorAll('.message:not(.welcome-message)');
                allMessages.forEach(msg => msg.remove());
                
                if (!document.querySelector('.welcome-message')) {
                    const welcomeMessage = document.createElement('article');
                    welcomeMessage.className = 'welcome-message';
                    welcomeMessage.innerHTML = `
                        <figure class="welcome-icon">
                            <i class="fas fa-comments"></i>
                        </figure>
                        <h3>Welcome to ${roomName.trim()}</h3>
                        <p>This is a safe space to share and connect with others. Remember to be kind and respectful.</p>
                    `;
                    messagesContainer.appendChild(welcomeMessage);
                }
                
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
            
            // Add to the top of the list
            document.getElementById('roomList').prepend(newRoom);
            
            // Trigger click to switch to the new room
            newRoom.click();
        }
    });
    
    // Leave room functionality
    leaveRoomBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to leave this chat room?')) {
            // In a real app, this would remove the user from the room
            alert('You have left the chat room.');
        }
    });
    
    // Initialize
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    sendBtn.disabled = true;
});