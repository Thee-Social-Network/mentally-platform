// messages.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the messages application
    initMessagesApp();
    
    // Set current date
    document.querySelector('.date-info').textContent = getCurrentDate();
    
    // Initialize event listeners
    initEventListeners();
    
    // Load conversations
    loadConversations();
    
    // Check for unread messages
    updateUnreadCount();
});

// Initialize the messages application
function initMessagesApp() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme;
    }
    
    // Check for saved auto-reply settings
    const autoReplySettings = localStorage.getItem('autoReplySettings');
    if (autoReplySettings) {
        const settings = JSON.parse(autoReplySettings);
        document.getElementById('autoReplyEnabled').checked = settings.enabled;
        document.getElementById('autoReplyMessage').value = settings.message;
        document.getElementById('autoReplyStart').value = settings.start;
        document.getElementById('autoReplyEnd').value = settings.end;
        
        // Enable/disable form based on settings
        toggleAutoReplyForm(settings.enabled);
    }
}

// Initialize event listeners
function initEventListeners() {
    // Navigation
    document.getElementById('menuToggle').addEventListener('click', toggleMobileMenu);
    document.getElementById('emergencyBtn').addEventListener('click', showEmergencyModal);
    document.getElementById('profileBtn').addEventListener('click', toggleProfileDropdown);
    
    // Accessibility
    document.getElementById('fontSizeToggle').addEventListener('click', toggleFontSize);
    document.getElementById('contrastToggle').addEventListener('click', toggleContrast);
    
    // Messages functionality
    document.getElementById('newMessageBtn').addEventListener('click', showNewMessageModal);
    document.getElementById('closeNewMessageModal').addEventListener('click', closeNewMessageModal);
    document.getElementById('cancelNewMessage').addEventListener('click', closeNewMessageModal);
    document.getElementById('newMessageForm').addEventListener('submit', sendNewMessage);
    
    // Auto-reply functionality
    document.getElementById('autoReplyEnabled').addEventListener('change', toggleAutoReply);
    document.getElementById('closeAutoReplyModal').addEventListener('click', closeAutoReplyModal);
    document.getElementById('cancelAutoReply').addEventListener('click', closeAutoReplyModal);
    document.getElementById('autoReplyForm').addEventListener('submit', saveAutoReplySettings);
    
    // Task conversion functionality
    document.getElementById('convertToTaskBtn').addEventListener('click', showConvertToTaskModal);
    document.getElementById('closeConvertTaskModal').addEventListener('click', closeConvertToTaskModal);
    document.getElementById('cancelConvertTask').addEventListener('click', closeConvertToTaskModal);
    document.getElementById('convertToTaskForm').addEventListener('submit', convertToTask);
    
    // Emergency modal
    document.getElementById('closeEmergencyModal').addEventListener('click', closeEmergencyModal);
    
    // Message input
    document.getElementById('messageText').addEventListener('input', toggleSendButton);
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('attachBtn').addEventListener('click', triggerFileUpload);
    document.getElementById('messageAttachments').addEventListener('change', handleFileUpload);
    
    // Filter functionality
    document.getElementById('patientFilter').addEventListener('change', filterConversations);
    document.getElementById('dateFilter').addEventListener('change', filterConversations);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    document.getElementById('conversationSearch').addEventListener('input', searchConversations);
    
    // Archive functionality
    document.getElementById('archiveConversationBtn').addEventListener('click', archiveConversation);
    
    // More options
    document.getElementById('moreOptionsBtn').addEventListener('click', showMoreOptions);
}

// Get current date in a formatted string
function getCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Toggle mobile menu
function toggleMobileMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

// Show emergency modal
function showEmergencyModal() {
    document.getElementById('emergencyModal').classList.add('active');
}

// Close emergency modal
function closeEmergencyModal() {
    document.getElementById('emergencyModal').classList.remove('active');
}

// Toggle profile dropdown
function toggleProfileDropdown() {
    // This would toggle a dropdown menu with profile options
    showToast('Profile menu', 'Profile options would appear here', 'info');
}

// Toggle font size
function toggleFontSize() {
    document.body.classList.toggle('large-text');
    const isLarge = document.body.classList.contains('large-text');
    showToast('Text Size', isLarge ? 'Large text enabled' : 'Large text disabled', 'info');
}

// Toggle contrast
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    showToast('High Contrast', isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled', 'info');
}

// Show new message modal
function showNewMessageModal() {
    document.getElementById('newMessageModal').classList.add('active');
}

// Close new message modal
function closeNewMessageModal() {
    document.getElementById('newMessageModal').classList.remove('active');
    document.getElementById('newMessageForm').reset();
}

// Send new message
function sendNewMessage(e) {
    e.preventDefault();
    
    const recipient = document.getElementById('recipientSelect').value;
    const subject = document.getElementById('messageSubject').value;
    const message = document.getElementById('newMessageText').value;
    
    if (!recipient || !message) {
        showToast('Error', 'Please select a recipient and enter a message', 'error');
        return;
    }
    
    // Simulate sending message
    setTimeout(() => {
        showToast('Message Sent', 'Your message has been sent successfully', 'success');
        closeNewMessageModal();
        
        // Add to conversations if new
        addNewConversation(recipient, subject, message);
    }, 1000);
}

// Toggle auto-reply
function toggleAutoReply() {
    const isEnabled = document.getElementById('autoReplyEnabled').checked;
    toggleAutoReplyForm(isEnabled);
}

// Toggle auto-reply form fields
function toggleAutoReplyForm(isEnabled) {
    document.getElementById('autoReplyMessage').disabled = !isEnabled;
    document.getElementById('autoReplyStart').disabled = !isEnabled;
    document.getElementById('autoReplyEnd').disabled = !isEnabled;
    document.querySelector('#autoReplyForm .save-btn').disabled = !isEnabled;
}

// Show auto-reply modal
function showAutoReplyModal() {
    document.getElementById('autoReplyModal').classList.add('active');
}

// Close auto-reply modal
function closeAutoReplyModal() {
    document.getElementById('autoReplyModal').classList.remove('active');
}

// Save auto-reply settings
function saveAutoReplySettings(e) {
    e.preventDefault();
    
    const enabled = document.getElementById('autoReplyEnabled').checked;
    const message = document.getElementById('autoReplyMessage').value;
    const start = document.getElementById('autoReplyStart').value;
    const end = document.getElementById('autoReplyEnd').value;
    
    const settings = {
        enabled,
        message,
        start,
        end
    };
    
    localStorage.setItem('autoReplySettings', JSON.stringify(settings));
    
    showToast('Auto-Reply Settings', 'Your auto-reply settings have been saved', 'success');
    closeAutoReplyModal();
}

// Show convert to task modal
function showConvertToTaskModal() {
    const messageId = document.getElementById('messageIdForTask').value;
    if (!messageId) {
        showToast('Error', 'Please select a message first', 'error');
        return;
    }
    
    // Pre-fill task title with message excerpt
    const messageText = document.getElementById('messageText').value;
    if (messageText) {
        document.getElementById('taskTitle').value = 'Follow up: ' + messageText.substring(0, 30) + '...';
    }
    
    document.getElementById('convertToTaskModal').classList.add('active');
}

// Close convert to task modal
function closeConvertToTaskModal() {
    document.getElementById('convertToTaskModal').classList.remove('active');
    document.getElementById('convertToTaskForm').reset();
}

// Convert to task
function convertToTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    
    // Simulate task creation
    setTimeout(() => {
        showToast('Task Created', 'The message has been converted to a task successfully', 'success');
        closeConvertToTaskModal();
    }, 1000);
}

// Toggle send button based on message input
function toggleSendButton() {
    const messageText = document.getElementById('messageText').value.trim();
    const sendBtn = document.getElementById('sendBtn');
    const convertToTaskBtn = document.getElementById('convertToTaskBtn');
    
    sendBtn.disabled = !messageText;
    convertToTaskBtn.disabled = !messageText;
}

// Send message
function sendMessage() {
    const messageText = document.getElementById('messageText').value.trim();
    if (!messageText) return;
    
    const currentConversation = document.querySelector('.conversation-item.active');
    if (!currentConversation) {
        showToast('Error', 'Please select a conversation first', 'error');
        return;
    }
    
    // Add message to UI
    addMessageToUI('sent', messageText, new Date());
    
    // Clear input
    document.getElementById('messageText').value = '';
    toggleSendButton();
    
    // Simulate reply after a short delay
    setTimeout(() => {
        const conversationId = currentConversation.dataset.conversationId;
        const patientName = currentConversation.querySelector('.conversation-name').textContent;
        
        // Simulate auto-reply if enabled
        const autoReplySettings = localStorage.getItem('autoReplySettings');
        if (autoReplySettings) {
            const settings = JSON.parse(autoReplySettings);
            if (settings.enabled) {
                addMessageToUI('received', settings.message, new Date());
                showToast('Auto-Reply', 'Auto-reply message sent', 'info');
                return;
            }
        }
        
        // Otherwise simulate a typical reply
        const replies = [
            "Thanks for your message. I'll get back to you soon.",
            "I appreciate you reaching out. Let's discuss this in our next session.",
            "Thank you for the update. How have you been feeling since our last session?",
            "I've received your message. Let me know if this is urgent."
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        addMessageToUI('received', randomReply, new Date());
    }, 2000);
    
    showToast('Message Sent', 'Your message has been sent', 'success');
}

// Trigger file upload
function triggerFileUpload() {
    document.getElementById('messageAttachments').click();
}

// Handle file upload
function handleFileUpload(e) {
    const files = e.target.files;
    if (!files.length) return;
    
    // Check file size (max 5MB)
    for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
            showToast('File Too Large', 'Files must be less than 5MB', 'error');
            e.target.value = '';
            return;
        }
    }
    
    showToast('Files Attached', `${files.length} file(s) attached successfully`, 'success');
}

// Add message to UI
function addMessageToUI(type, content, timestamp) {
    const messagesContainer = document.getElementById('messagesContainer');
    
    // Remove no conversation selected message if it exists
    const noConversation = messagesContainer.querySelector('.no-conversation-selected');
    if (noConversation) {
        noConversation.remove();
    }
    
    const messageItem = document.createElement('div');
    messageItem.className = `message-item ${type}`;
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    const messageMeta = document.createElement('div');
    messageMeta.className = 'message-meta';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = formatTime(timestamp);
    
    const messageStatus = document.createElement('span');
    messageStatus.className = 'message-status';
    
    if (type === 'sent') {
        messageStatus.innerHTML = '<i class="fas fa-check-double"></i> Delivered';
    }
    
    messageMeta.appendChild(messageTime);
    messageMeta.appendChild(messageStatus);
    
    messageBubble.appendChild(messageContent);
    messageBubble.appendChild(messageMeta);
    
    messageItem.appendChild(messageBubble);
    messagesContainer.appendChild(messageItem);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Format time for display
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Load conversations
function loadConversations() {
    const conversationsList = document.getElementById('conversationsList');
    conversationsList.innerHTML = '';
    
    // Sample conversation data
    const conversations = [
        {
            id: 'conv-1',
            name: 'Anna Smith',
            preview: 'Looking forward to our session tomorrow',
            time: '2:45 PM',
            unread: 2,
            archived: false
        },
        {
            id: 'conv-2',
            name: 'John Doe',
            preview: 'Thanks for the resources you sent',
            time: 'Yesterday',
            unread: 0,
            archived: false
        },
        {
            id: 'conv-3',
            name: 'Mike Johnson',
            preview: 'I\'ve been experiencing more anxiety lately',
            time: 'Monday',
            unread: 1,
            archived: false
        },
        {
            id: 'conv-4',
            name: 'Lisa Wilson',
            preview: 'Can we reschedule our appointment?',
            time: 'Last week',
            unread: 0,
            archived: true
        }
    ];
    
    // Filter out archived conversations (unless we're viewing archived)
    const activeConversations = conversations.filter(conv => !conv.archived);
    
    activeConversations.forEach(conv => {
        const conversationItem = createConversationElement(conv);
        conversationsList.appendChild(conversationItem);
    });
}

// Create conversation element
function createConversationElement(conversation) {
    const item = document.createElement('div');
    item.className = `conversation-item ${conversation.unread > 0 ? 'unread' : ''}`;
    item.dataset.conversationId = conversation.id;
    
    const avatar = document.createElement('figure');
    avatar.className = 'conversation-avatar';
    avatar.innerHTML = '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'conversation-content';
    
    const name = document.createElement('div');
    name.className = 'conversation-name';
    name.textContent = conversation.name;
    
    const preview = document.createElement('div');
    preview.className = 'conversation-preview';
    preview.textContent = conversation.preview;
    
    content.appendChild(name);
    content.appendChild(preview);
    
    const meta = document.createElement('div');
    meta.className = 'conversation-meta';
    
    const time = document.createElement('div');
    time.className = 'conversation-time';
    time.textContent = conversation.time;
    
    meta.appendChild(time);
    
    if (conversation.unread > 0) {
        const unread = document.createElement('div');
        unread.className = 'conversation-unread';
        unread.textContent = conversation.unread;
        meta.appendChild(unread);
    }
    
    item.appendChild(avatar);
    item.appendChild(content);
    item.appendChild(meta);
    
    // Add click event to load conversation
    item.addEventListener('click', () => loadConversation(conversation));
    
    return item;
}

// Load conversation
function loadConversation(conversation) {
    // Set active conversation
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-conversation-id="${conversation.id}"]`).classList.add('active');
    
    // Update conversation header
    document.getElementById('conversationTitle').textContent = conversation.name;
    document.getElementById('conversationSubtitle').textContent = 'Last active: ' + conversation.time;
    
    // Enable message input
    document.getElementById('messageText').disabled = false;
    document.getElementById('messageText').placeholder = 'Type your message here...';
    
    // Clear messages container
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';
    
    // Load sample messages
    const messages = [
        {
            type: 'received',
            content: 'Hello, I wanted to check in about our upcoming appointment.',
            time: new Date(Date.now() - 3600000)
        },
        {
            type: 'sent',
            content: 'Hi there! Yes, we\'re still on for tomorrow at 2 PM. Looking forward to our session.',
            time: new Date(Date.now() - 3500000)
        },
        {
            type: 'received',
            content: 'That\'s great. I\'ve been practicing the techniques we discussed last time.',
            time: new Date(Date.now() - 3400000)
        },
        {
            type: 'sent',
            content: 'I\'m glad to hear that! How have you been feeling since our last session?',
            time: new Date(Date.now() - 3300000)
        }
    ];
    
    // Add messages to UI
    messages.forEach(msg => {
        addMessageToUI(msg.type, msg.content, msg.time);
    });
    
    // Mark as read
    conversation.unread = 0;
    updateUnreadCount();
    
    // Store current conversation for task conversion
    document.getElementById('messageIdForTask').value = conversation.id;
}

// Update unread count badge
function updateUnreadCount() {
    const unreadItems = document.querySelectorAll('.conversation-item.unread');
    const totalUnread = unreadItems.length;
    
    const badge = document.getElementById('unreadCountBadge');
    badge.textContent = totalUnread;
    
    if (totalUnread === 0) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'flex';
    }
}

// Filter conversations
function filterConversations() {
    const patientFilter = document.getElementById('patientFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    // This would filter conversations based on the selected filters
    showToast('Filter Applied', `Filtering by ${patientFilter !== 'all' ? patientFilter : ''} ${dateFilter !== 'all' ? dateFilter : ''}`, 'info');
}

// Clear filters
function clearFilters() {
    document.getElementById('patientFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('conversationSearch').value = '';
    
    showToast('Filters Cleared', 'All filters have been cleared', 'info');
}

// Search conversations
function searchConversations() {
    const searchTerm = document.getElementById('conversationSearch').value.toLowerCase();
    
    document.querySelectorAll('.conversation-item').forEach(item => {
        const name = item.querySelector('.conversation-name').textContent.toLowerCase();
        const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || preview.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Archive conversation
function archiveConversation() {
    const activeConversation = document.querySelector('.conversation-item.active');
    if (!activeConversation) {
        showToast('Error', 'Please select a conversation to archive', 'error');
        return;
    }
    
    const conversationId = activeConversation.dataset.conversationId;
    
    // Remove from UI
    activeConversation.remove();
    
    // Clear messages container
    document.getElementById('messagesContainer').innerHTML = `
        <section class="no-conversation-selected">
            <i class="fas fa-comments"></i>
            <h3>Select a conversation to start messaging</h3>
            <p>Your secure messages will appear here</p>
        </section>
    `;
    
    // Reset conversation header
    document.getElementById('conversationTitle').textContent = 'Select a conversation';
    document.getElementById('conversationSubtitle').textContent = 'Choose a conversation from the sidebar to view messages';
    
    // Disable message input
    document.getElementById('messageText').disabled = true;
    document.getElementById('messageText').placeholder = 'Select a conversation to message';
    document.getElementById('messageText').value = '';
    toggleSendButton();
    
    showToast('Conversation Archived', 'The conversation has been moved to archives', 'success');
}

// Show more options
function showMoreOptions() {
    // This would show a dropdown with more options like auto-reply settings
    showAutoReplyModal();
}

// Add new conversation (for demo purposes)
function addNewConversation(recipientId, subject, message) {
    const conversationsList = document.getElementById('conversationsList');
    
    const newConversation = {
        id: 'conv-new-' + Date.now(),
        name: document.querySelector(`#recipientSelect option[value="${recipientId}"]`).textContent,
        preview: message.length > 30 ? message.substring(0, 30) + '...' : message,
        time: 'Just now',
        unread: 0,
        archived: false
    };
    
    const conversationItem = createConversationElement(newConversation);
    conversationsList.insertBefore(conversationItem, conversationsList.firstChild);
}

// Show toast notification
function showToast(title, message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${iconMap[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add close event
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}