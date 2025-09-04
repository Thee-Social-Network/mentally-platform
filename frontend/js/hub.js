// Hybrid Hub JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation between hub sections
    const hubNavButtons = document.querySelectorAll('.hub-nav-btn');
    const hubSections = document.querySelectorAll('.hub-section');
    
    hubNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active button
            hubNavButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            hubSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Canvas tools functionality
    const canvasTools = document.querySelectorAll('.canvas-tool');
    const canvasArea = document.getElementById('mainCanvas');
    
    canvasTools.forEach(tool => {
        tool.addEventListener('click', function() {
            canvasTools.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const toolType = this.getAttribute('data-tool');
            canvasArea.setAttribute('data-tool', toolType);
        });
    });
    
    // Make canvas items draggable
    const canvasItems = document.querySelectorAll('.canvas-item');
    
    canvasItems.forEach(item => {
        makeDraggable(item);
    });
    
    // Notebook category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const notebookEntries = document.querySelectorAll('.notebook-entry');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // In a real implementation, this would filter entries by category
            // For this demo, we'll just show all entries
            notebookEntries.forEach(entry => {
                entry.classList.remove('active');
            });
            
            // Show the first entry as "active"
            if (notebookEntries.length > 0) {
                notebookEntries[0].classList.add('active');
            }
        });
    });
    
    // Bulletin filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // In a real implementation, this would filter posts by type
        });
    });
    
    // Audio player functionality
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isPlaying = this.classList.contains('playing');
            
            if (isPlaying) {
                this.classList.remove('playing');
                this.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                this.classList.add('playing');
                this.innerHTML = '<i class="fas fa-pause"></i>';
            }
        });
    });
    
    // Join room buttons
    const joinRoomButtons = document.querySelectorAll('.join-room-btn');
    
    joinRoomButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomCard = this.closest('.room-card');
            const roomName = roomCard.querySelector('h3').textContent;
            
            alert(`Joining room: ${roomName}`);
            // In a real implementation, this would connect to the room
        });
    });
    
    // Group action buttons
    const groupActionButtons = document.querySelectorAll('.group-action');
    
    groupActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const groupCard = this.closest('.group-card');
            const groupName = groupCard.querySelector('h3').textContent;
            const action = this.textContent.trim();
            
            alert(`${action} group: ${groupName}`);
        });
    });
    
    // Add item modal
    const addItemModal = document.getElementById('addItemModal');
    const addItemButtons = document.querySelectorAll('.add-btn');
    const closeAddItemModal = document.getElementById('closeAddItemModal');
    const cancelAddItem = document.getElementById('cancelAddItem');
    const addItemForm = document.getElementById('addItemForm');
    const itemTypeSelect = document.getElementById('itemType');
    const contentField = document.getElementById('contentField');
    const imageField = document.getElementById('imageField');
    
    addItemButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.hub-section');
            const sectionId = section.id;
            
            let modalTitle = 'Add New Item';
            
            if (sectionId === 'canvas-section') {
                modalTitle = 'Add to Canvas';
            } else if (sectionId === 'notebook-section') {
                modalTitle = 'New Notebook Entry';
            } else if (sectionId === 'bulletin-section') {
                modalTitle = 'New Bulletin Post';
            } else if (sectionId === 'event-rooms-section') {
                modalTitle = 'Create Event Room';
            } else if (sectionId === 'groups-section') {
                modalTitle = 'Create New Group';
            }
            
            document.getElementById('addItemModalTitle').textContent = modalTitle;
            addItemModal.showModal();
        });
    });
    
    closeAddItemModal.addEventListener('click', function() {
        addItemModal.close();
    });
    
    cancelAddItem.addEventListener('click', function() {
        addItemModal.close();
    });
    
    itemTypeSelect.addEventListener('change', function() {
        const value = this.value;
        
        if (value === 'image') {
            contentField.classList.add('hidden');
            imageField.classList.remove('hidden');
        } else {
            contentField.classList.remove('hidden');
            imageField.classList.add('hidden');
        }
    });
    
    addItemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('itemTitle').value;
        const type = document.getElementById('itemType').value;
        
        alert(`Added new ${type}: ${title}`);
        addItemModal.close();
        addItemForm.reset();
    });
    
    // AI Panel functionality
    const aiPanel = document.getElementById('aiPanel');
    const aiToggle = document.getElementById('aiToggle');
    const aiClose = document.getElementById('aiClose');
    const aiOptions = document.querySelectorAll('.ai-option');
    const aiOutput = document.getElementById('aiOutput');
    const aiResult = document.getElementById('aiResult');
    
    aiToggle.addEventListener('click', function() {
        aiPanel.classList.toggle('open');
    });
    
    aiClose.addEventListener('click', function() {
        aiPanel.classList.remove('open');
    });
    
    aiOptions.forEach(option => {
        option.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            // Show loading state
            aiResult.innerHTML = '<p>Generating content...<p>';
            aiOutput.classList.remove('hidden');
            
            // Simulate AI processing
            setTimeout(() => {
                let content = '';
                
                switch(action) {
                    case 'generate-mindmap':
                        content = `
                            <h5>Mind Map: Wellness Activities</h5>
                            <p>Based on your recent activities and notes, I've generated a mind map to visualize connections between your wellness practices:</p>
                            <ul>
                                <li><strong>Central Theme:</strong> Holistic Wellness</li>
                                <li><strong>Main Branches:</strong> Physical Activity, Mental Health, Social Connection</li>
                                <li><strong>Physical Activity:</strong> Morning Walks, Yoga, Stretching</li>
                                <li><strong>Mental Health:</strong> Meditation, Journaling, Therapy</li>
                                <li><strong>Social Connection:</strong> Group Activities, Community Sharing, Support Networks</li>
                            </ul>
                            <button class="btn-primary">View Full Mind Map</button>
                        `;
                        break;
                    case 'create-recap':
                        content = `
                            <h5>Session Recap: Morning Meditation</h5>
                            <p>Here's a summary of your meditation session from today:</p>
                            <ul>
                                <li><strong>Duration:</strong> 15 minutes</li>
                                <li><strong>Focus:</strong> Breath awareness and body scan</li>
                                <li><strong>Key Insights:</strong> Noticed tension in shoulders, achieved deeper relaxation after 5 minutes</li>
                                <li><strong>Mood Before:</strong> Somewhat anxious</li>
                                <li><strong>Mood After:</strong> Calm and centered</li>
                            </ul>
                            <audio controls style="width: 100%; margin-top: 10px;">
                                <source src="#" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        `;
                        break;
                    case 'extract-highlights':
                        content = `
                            <h5>Highlights from Group Sessions</h5>
                            <p>Based on recent group activities, here are the key themes and insights:</p>
                            <ul>
                                <li><strong>Common Challenge:</strong> Maintaining consistency with morning routines</li>
                                <li><strong>Shared Solution:</strong> Accountability partners and setting small, achievable goals</li>
                                <li><strong>Popular Activity:</strong> Nature walks combined with mindfulness practices</li>
                                <li><strong>Emerging Trend:</strong> Combining physical activity with audio meditation</li>
                            </ul>
                            <button class="btn-primary">Save Highlights</button>
                        `;
                        break;
                    case 'suggest-content':
                        content = `
                            <h5>Content Suggestions</h5>
                            <p>Based on your interests and activities, you might enjoy:</p>
                            <ul>
                                <li><strong>Article:</strong> "The Science of Mindfulness and Walking Meditation"</li>
                                <li><strong>Audio:</strong> "Forest Ambience with Gentle Rain" soundscape</li>
                                <li><strong>Group:</strong> "Mindful Gardeners" community</li>
                                <li><strong>Exercise:</strong> 5-minute breathing technique before walks</li>
                            </ul>
                            <button class="btn-primary">Explore Suggestions</button>
                        `;
                        break;
                }
                
                aiResult.innerHTML = content;
            }, 1500);
        });
    });
    
    // Emergency modal
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyModal = document.getElementById('emergencyModal');
    const closeEmergencyModal = document.getElementById('closeEmergencyModal');
    
    emergencyBtn.addEventListener('click', function() {
        emergencyModal.showModal();
    });
    
    closeEmergencyModal.addEventListener('click', function() {
        emergencyModal.close();
    });
    
    // Make elements draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
            
            // Bring to front
            element.style.zIndex = '10';
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
            
            // Return to normal z-index after a delay
            setTimeout(() => {
                element.style.zIndex = '1';
            }, 100);
        }
    }
});