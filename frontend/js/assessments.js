// Clinical Assessments JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize assessments
    initAssessments();
    
    // Load assessment history
    loadAssessmentHistory();
});

let currentAssessment = null;
let currentQuestions = [];
let currentAnswers = [];
let currentQuestionIndex = 0;

function initAssessments() {
    // Assessment selection
    const assessmentCards = document.querySelectorAll('.assessment-card');
    assessmentCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('start-assessment')) {
                const assessmentType = this.dataset.type;
                startAssessment(assessmentType);
            }
        });
    });
    
    // Back button
    document.getElementById('backToSelection').addEventListener('click', function() {
        showSection('assessmentSelection');
        resetAssessment();
    });
    
    // Navigation buttons
    document.getElementById('prevButton').addEventListener('click', goToPreviousQuestion);
    document.getElementById('nextButton').addEventListener('click', goToNextQuestion);
    
    // Form submission
    document.getElementById('assessmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        completeAssessment();
    });
    
    // Results actions
    document.getElementById('saveResults').addEventListener('click', saveAssessmentResults);
    document.getElementById('newAssessment').addEventListener('click', function() {
        showSection('assessmentSelection');
        resetAssessment();
    });
}

async function startAssessment(type) {
    try {
        // Show loading state
        showLoading(true);
        
        // Fetch assessment questions
        const response = await fetch(`/api/assessments/${type}`);
        
        if (response.ok) {
            const result = await response.json();
            
            if (result.success) {
                currentAssessment = type;
                currentQuestions = result.data.questions;
                currentAnswers = Array(currentQuestions.length).fill(null);
                currentQuestionIndex = 0;
                
                // Set assessment info
                document.getElementById('assessmentTitle').textContent = result.data.title;
                document.getElementById('assessmentDescription').textContent = result.data.description;
                document.getElementById('assessmentInstructions').textContent = result.data.instructions;
                
                // Show assessment container
                showSection('assessmentContainer');
                
                // Render first question
                renderQuestion(0);
                
                // Update progress
                updateProgress();
            }
        } else {
            throw new Error('Failed to load assessment');
        }
    } catch (error) {
        console.error('Error starting assessment:', error);
        alert('Failed to load assessment. Please try again.');
    } finally {
        showLoading(false);
    }
}

function renderQuestion(index) {
    const question = currentQuestions[index];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="question-item">
            <div class="question-text">${question.text}</div>
            <div class="options-grid">
                ${getAssessmentOptions().map((option, i) => `
                    <label class="option-button ${currentAnswers[index] === option.value ? 'selected' : ''}">
                        <input type="radio" name="question-${question.id}" value="${option.value}" 
                               ${currentAnswers[index] === option.value ? 'checked' : ''}>
                        <span class="option-label">${option.label}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add event listeners to options
    const optionButtons = container.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all options
            optionButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Get the selected value
            const input = this.querySelector('input');
            const value = parseInt(input.value);
            
            // Store the answer
            currentAnswers[index] = value;
            
            // Enable next button
            document.getElementById('nextButton').disabled = false;
        });
    });
    
    // Update navigation buttons
    updateNavigation();
}

function getAssessmentOptions() {
    // Default options for most clinical assessments
    return [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
    ];
}

function updateNavigation() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    
    // Previous button
    if (currentQuestionIndex > 0) {
        prevButton.classList.remove('hidden');
    } else {
        prevButton.classList.add('hidden');
    }
    
    // Next/Submit buttons
    if (currentQuestionIndex < currentQuestions.length - 1) {
        nextButton.classList.remove('hidden');
        submitButton.classList.add('hidden');
    } else {
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');
    }
    
    // Disable next button if no answer selected
    nextButton.disabled = currentAnswers[currentQuestionIndex] === null;
}

function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(currentQuestionIndex);
        updateProgress();
    }
}

function goToNextQuestion() {
    if (currentAnswers[currentQuestionIndex] !== null && currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
        updateProgress();
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
}

async function completeAssessment() {
    try {
        // Show loading state
        showLoading(true);
        
        // Get user data
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!userData.id) {
            alert('Please log in to save assessment results');
            window.location.href = '/login';
            return;
        }
        
        // Prepare answers
        const answers = currentQuestions.map((question, index) => ({
            questionId: question.id,
            value: currentAnswers[index],
            text: question.text
        }));
        
        // Submit assessment
        const response = await fetch('/api/assessments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userData.id,
                type: currentAssessment,
                answers: answers
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            
            if (result.success) {
                // Show results
                showResults(result.data);
                
                // Reload history
                loadAssessmentHistory();
            }
        } else {
            throw new Error('Failed to submit assessment');
        }
    } catch (error) {
        console.error('Error completing assessment:', error);
        alert('Failed to complete assessment. Please try again.');
    } finally {
        showLoading(false);
    }
}

function showResults(data) {
    // Update results elements
    document.getElementById('scoreValue').textContent = data.score;
    document.getElementById('severityText').textContent = data.severity;
    document.getElementById('resultsSubtitle').textContent = `${currentAssessment} Assessment Results`;
    document.getElementById('interpretationText').textContent = data.interpretation.description;
    
    // Update severity badge class
    const severityBadge = document.getElementById('severityBadge');
    severityBadge.className = 'severity-badge';
    severityBadge.classList.add(`severity-${data.severity.toLowerCase().replace(' ', '-')}`);
    
    // Update recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = data.recommendations.map(rec => 
        `<li>${rec}</li>`
    ).join('');
    
    // Show results section
    showSection('resultsContainer');
}

async function saveAssessmentResults() {
    // This would typically generate a PDF or save results
    alert('Assessment results saved to your history');
}

async function loadAssessmentHistory() {
    try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!userData.id) {
            return;
        }
        
        const response = await fetch(`/api/assessments/history/${userData.id}?limit=5`);
        
        if (response.ok) {
            const result = await response.json();
            const container = document.getElementById('historyContainer');
            
            if (result.success && result.data.length > 0) {
                container.innerHTML = result.data.map(assessment => `
                    <div class="history-item">
                        <div class="history-info">
                            <span class="history-type">${assessment.type}</span>
                            <span class="history-date">${new Date(assessment.date).toLocaleDateString()}</span>
                        </div>
                        <div class="history-score">
                            <span class="score-value">Score: ${assessment.score}</span>
                            <span class="score-severity severity-${assessment.severity.toLowerCase().replace(' ', '-')}">
                                ${assessment.severity}
                            </span>
                        </div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <p>You haven't completed any assessments yet</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading assessment history:', error);
    }
}

function showSection(sectionId) {
    // Hide all sections
    document.getElementById('assessmentSelection').classList.add('hidden');
    document.getElementById('assessmentContainer').classList.add('hidden');
    document.getElementById('resultsContainer').classList.add('hidden');
    
    // Show requested section
    document.getElementById(sectionId).classList.remove('hidden');
}

function resetAssessment() {
    currentAssessment = null;
    currentQuestions = [];
    currentAnswers = [];
    currentQuestionIndex = 0;
}

function showLoading(show) {
    // Simple loading indicator
    if (show) {
        document.body.style.opacity = '0.7';
        document.body.style.pointerEvents = 'none';
    } else {
        document.body.style.opacity = '1';
        document.body.style.pointerEvents = 'auto';
    }
}