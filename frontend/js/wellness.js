// Wellness Tools JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize wellness tools
    initWellnessTools();
    
    // Load user wellness data
    loadWellnessData();
});

// Initialize all wellness tools
function initWellnessTools() {
    // Tool option selection
    const toolOptions = document.querySelectorAll('.tool-option, .music-category, .exercise-option, .sleep-option');
    toolOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parentCard = this.closest('.tool-card');
            const allOptions = parentCard.querySelectorAll('.tool-option, .music-category, .exercise-option, .sleep-option');
            
            allOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Start tool buttons
    const startButtons = document.querySelectorAll('.start-tool-btn');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const toolType = this.getAttribute('data-tool');
            startWellnessTool(toolType);
        });
    });
    
    // Buy buttons
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item');
            purchaseItem(itemId);
        });
    });
    
    // Initialize puzzle game
    initPuzzleGame();
    
    // Initialize coloring game
    initColoringGame();
    
    // Initialize gratitude game
    initGratitudeGame();
}

// Load user wellness data
async function loadWellnessData() {
    try {
        // In a real app, you would get the actual user ID
        const userId = getCurrentUserId();
        
        const response = await fetch(`/api/wellness/${userId}`);
        const result = await response.json();
        
        if (result.success) {
            updateUIWithWellnessData(result.data);
        }
    } catch (error) {
        console.error('Error loading wellness data:', error);
    }
}

// Update UI with wellness data
function updateUIWithWellnessData(data) {
    // Update points display
    const pointsElement = document.getElementById('userPoints');
    if (pointsElement) {
        pointsElement.textContent = data.points;
    }
    
    // Update journal stats
    const journalStats = document.querySelectorAll('.journal-stat .stat-number');
    if (journalStats.length >= 2) {
        // In a real app, you would use actual data
        journalStats[1].textContent = data.streak || 7;
    }
    
    // Update achievement progress
    updateAchievementProgress(data);
}

// Update achievement progress
function updateAchievementProgress(data) {
    // In a real app, you would calculate actual progress based on user data
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length >= 4) {
        // 7-Day Streak
        progressBars[0].style.width = Math.min((data.streak / 7) * 100, 100) + '%';
        
        // Breathing Master (assuming 3/10 completed)
        progressBars[1].style.width = '30%';
        
        // Journal Keeper (assuming 3/20 completed)
        progressBars[2].style.width = '15%';
        
        // Wellness Explorer (assuming 4/9 tools tried)
        progressBars[3].style.width = '45%';
    }
}

// Start a wellness tool
function startWellnessTool(toolType) {
    // Show loading state
    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
    button.disabled = true;
    
    // Simulate tool loading
    setTimeout(() => {
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
        
        // Launch the selected tool
        launchTool(toolType);
        
        // Award points for using the tool
        awardPoints(10, `Used ${toolType} tool`);
    }, 1000);
}

// Launch specific tool
function launchTool(toolType) {
    switch(toolType) {
        case 'breathing':
            startBreathingExercise();
            break;
        case 'meditation':
            startMeditation();
            break;
        case 'journal':
            openJournal();
            break;
        case 'music':
            playMusic();
            break;
        case 'exercise':
            startExercise();
            break;
        case 'sleep':
            prepareForSleep();
            break;
        case 'puzzle':
            startPuzzleGame();
            break;
        case 'coloring':
            startColoringGame();
            break;
        case 'gratitude':
            startGratitudeGame();
            break;
        default:
            console.log('Unknown tool:', toolType);
    }
}

// Start breathing exercise
function startBreathingExercise() {
    const selectedExercise = document.querySelector('.breathing-tool .tool-option.active')?.getAttribute('data-exercise') || '4-7-8';
    
    alert(`Starting ${selectedExercise} breathing exercise. In a real app, this would open a full-screen guided breathing tool.`);
    
    // In a real app, you would implement the actual breathing exercise UI
}

// Start meditation
function startMeditation() {
    const selectedDuration = document.querySelector('.meditation-tool .tool-option.active')?.getAttribute('data-duration') || '5';
    
    alert(`Starting ${selectedDuration}-minute meditation. In a real app, this would open a meditation player.`);
}

// Open journal
function openJournal() {
    alert('Opening gratitude journal. In a real app, this would open a journaling interface.');
}

// Play music
function playMusic() {
    const selectedCategory = document.querySelector('.music-tool .music-category.active')?.getAttribute('data-category') || 'nature';
    
    alert(`Playing ${selectedCategory} sounds. In a real app, this would open a music player.`);
}

// Start exercise
function startExercise() {
    const selectedType = document.querySelector('.exercise-tool .exercise-option.active')?.getAttribute('data-type') || 'yoga';
    
    alert(`Starting ${selectedType} exercise. In a real app, this would show exercise instructions.`);
}

// Prepare for sleep
function prepareForSleep() {
    const selectedType = document.querySelector('.sleep-tool .sleep-option.active')?.getAttribute('data-type') || 'story';
    
    alert(`Preparing ${selectedType} for sleep. In a real app, this would open sleep resources.`);
}

// Initialize puzzle game
function initPuzzleGame() {
    // This would set up the puzzle game logic
    console.log('Puzzle game initialized');
}

// Start puzzle game
function startPuzzleGame() {
    const difficulty = document.querySelector('.puzzle-tool .tool-option.active')?.getAttribute('data-difficulty') || 'easy';
    
    alert(`Starting ${difficulty} puzzle game. In a real app, this would show the puzzle interface.`);
    
    // Award points for playing the game
    awardPoints(15, 'Played puzzle game');
}

// Initialize coloring game
function initColoringGame() {
    const canvas = document.querySelector('.coloring-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Draw a simple shape for coloring
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // Draw a simple flower shape
        ctx.beginPath();
        ctx.arc(100, 60, 20, 0, Math.PI * 2); // Center circle
        ctx.stroke();
        
        // Petals
        ctx.beginPath();
        ctx.arc(80, 50, 15, 0, Math.PI * 2); // Top-left
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(120, 50, 15, 0, Math.PI * 2); // Top-right
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(80, 80, 15, 0, Math.PI * 2); // Bottom-left
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(120, 80, 15, 0, Math.PI * 2); // Bottom-right
        ctx.stroke();
        
        // Stem
        ctx.beginPath();
        ctx.moveTo(100, 80);
        ctx.lineTo(100, 110);
        ctx.stroke();
    }
    
    // Color selection
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Start coloring game
function startColoringGame() {
    alert('Starting coloring game. In a real app, this would open a full-screen coloring interface.');
    
    // Award points for playing the game
    awardPoints(12, 'Played coloring game');
}

// Initialize gratitude game
function initGratitudeGame() {
    const gratitudeInput = document.querySelector('.gratitude-input');
    const gratitudeList = document.querySelector('.gratitude-list');
    
    if (gratitudeInput) {
        gratitudeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                addGratitudeItem(this.value.trim());
                this.value = '';
            }
        });
    }
    
    // Delete button functionality
    document.querySelectorAll('.gratitude-item .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.gratitude-item').remove();
        });
    });
}

// Add gratitude item
function addGratitudeItem(text) {
    const gratitudeList = document.querySelector('.gratitude-list');
    
    const item = document.createElement('div');
    item.className = 'gratitude-item';
    item.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn"><i class="fas fa-times"></i></button>
    `;
    
    // Add delete functionality
    item.querySelector('.delete-btn').addEventListener('click', function() {
        this.closest('.gratitude-item').remove();
    });
    
    gratitudeList.appendChild(item);
    
    // Award points for gratitude practice
    awardPoints(5, 'Added gratitude item');
}

// Start gratitude game
function startGratitudeGame() {
    alert('Starting gratitude game. In a real app, this would open an expanded gratitude interface.');
}

// Award points to user
async function awardPoints(points, reason) {
    try {
        const userId = getCurrentUserId();
        
        const response = await fetch(`/api/wellness/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pointsEarned: points
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update points display
            const pointsElement = document.getElementById('userPoints');
            if (pointsElement) {
                pointsElement.textContent = result.data.points;
            }
            
            // Show notification
            showNotification(`+${points} points: ${reason}`);
        }
    } catch (error) {
        console.error('Error awarding points:', error);
    }
}

// Purchase item from shop
async function purchaseItem(itemId) {
    try {
        const userId = getCurrentUserId();
        
        const response = await fetch(`/api/wellness/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                purchase: itemId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update points display
            const pointsElement = document.getElementById('userPoints');
            if (pointsElement) {
                pointsElement.textContent = result.data.points;
            }
            
            // Update button to show owned
            const buyButton = document.querySelector(`.buy-btn[data-item="${itemId}"]`);
            if (buyButton) {
                buyButton.textContent = 'Owned';
                buyButton.classList.add('owned');
                buyButton.disabled = true;
            }
            
            showNotification('Purchase successful!');
        } else {
            showNotification(result.message || 'Purchase failed', 'error');
        }
    } catch (error) {
        console.error('Error purchasing item:', error);
        showNotification('Error making purchase', 'error');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // In a real app, you would use a proper notification system
    alert(`${type === 'success' ? '✓' : '✗'} ${message}`);
}

// Get current user ID (placeholder)
function getCurrentUserId() {
    // In a real app, you would get this from your authentication system
    return 'current-user-id';
}