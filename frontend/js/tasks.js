// tasks.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initTasksPage();
    
    // Check for dark mode preference
    checkDarkModePreference();
    
    // Set current date
    setCurrentDate();
    
    // Load clients for dropdowns
    loadClients();
    
    // Load tasks
    loadTasks();
    
    // Set up event listeners
    setupEventListeners();
});

// Global variables
let tasks = [];
let clients = [];
let currentView = 'list';
let currentFilters = {
    status: 'all',
    assignee: 'all',
    priority: 'all',
    client: 'all',
    search: ''
};

// Initialize the tasks page
function initTasksPage() {
    console.log('Initializing Tasks Page...');
    
    // Check if we're coming from another page with dark mode enabled
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    
    // Check if high contrast mode is enabled
    if (localStorage.getItem('highContrast') === 'enabled') {
        document.body.classList.add('high-contrast');
    }
    
    // Check if large font mode is enabled
    if (localStorage.getItem('largeFont') === 'enabled') {
        document.body.classList.add('large-font');
    }
}

// Check dark mode preference from other pages
function checkDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

// Set current date in the header
function setCurrentDate() {
    const dateElement = document.querySelector('.date-info');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Load clients for dropdowns
function loadClients() {
    // In a real app, this would come from an API
    clients = [
        { id: '1', name: 'John Smith' },
        { id: '2', name: 'Emma Johnson' },
        { id: '3', name: 'Michael Brown' },
        { id: '4', name: 'Sarah Davis' },
        { id: '5', name: 'David Wilson' }
    ];
    
    // Populate client filter dropdown
    const clientFilter = document.getElementById('clientFilter');
    if (clientFilter) {
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            clientFilter.appendChild(option);
        });
    }
    
    // Populate client dropdown in add task modal
    const taskClient = document.getElementById('taskClient');
    const editTaskClient = document.getElementById('editTaskClient');
    
    [taskClient, editTaskClient].forEach(select => {
        if (select) {
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                select.appendChild(option);
            });
        }
    });
}

// Load tasks from localStorage or use sample data
function loadTasks() {
    // Try to load from localStorage
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        // Create sample tasks if none exist
        createSampleTasks();
    }
    
    // Update stats
    updateTaskStats();
    
    // Apply current filters and render tasks
    applyFilters();
}

// Create sample tasks for demonstration
function createSampleTasks() {
    tasks = [
        {
            id: '1',
            title: 'Finish progress note for John Smith',
            description: 'Complete the progress note for the last session with John Smith',
            assignee: 'self',
            dueDate: '2025-09-03',
            priority: 'high',
            status: 'pending',
            clientId: '1',
            reminder: 'none',
            recurrence: 'none',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: '2',
            title: 'Call Emma Johnson\'s guardian',
            description: 'Follow up on medication adherence concerns',
            assignee: 'self',
            dueDate: '2025-09-01',
            priority: 'medium',
            status: 'pending',
            clientId: '2',
            reminder: '1440',
            recurrence: 'none',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: '3',
            title: 'Weekly team meeting',
            description: 'Prepare presentation for weekly team meeting',
            assignee: 'michael',
            dueDate: '2025-09-05',
            priority: 'medium',
            status: 'in-progress',
            clientId: null,
            reminder: '30',
            recurrence: 'weekly',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: '4',
            title: 'Daily journaling check-in',
            description: 'Review patient journal entries',
            assignee: 'self',
            dueDate: '2025-09-02',
            priority: 'low',
            status: 'completed',
            clientId: null,
            reminder: 'none',
            recurrence: 'daily',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
        },
        {
            id: '5',
            title: 'Follow up with Sarah Davis',
            description: 'Check on progress after medication adjustment',
            assignee: 'emma',
            dueDate: '2025-08-30',
            priority: 'high',
            status: 'pending',
            clientId: '4',
            reminder: '60',
            recurrence: 'none',
            createdAt: new Date().toISOString(),
            completedAt: null
        }
    ];
    
    // Save to localStorage
    saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskStats();
}

// Update task statistics
function updateTaskStats() {
    const totalTasks = tasks.length;
    const overdueTasks = tasks.filter(task => isTaskOverdue(task) && task.status !== 'completed').length;
    const assignedTasks = tasks.filter(task => task.assignee === 'self' && task.status !== 'completed').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('overdueTasks').textContent = overdueTasks;
    document.getElementById('assignedTasks').textContent = assignedTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

// Check if a task is overdue
function isTaskOverdue(task) {
    if (!task.dueDate || task.status === 'completed') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
}

// Apply current filters to tasks
function applyFilters() {
    let filteredTasks = [...tasks];
    
    // Apply status filter
    if (currentFilters.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === currentFilters.status);
    }
    
    // Apply assignee filter
    if (currentFilters.assignee === 'me') {
        filteredTasks = filteredTasks.filter(task => task.assignee === 'self');
    } else if (currentFilters.assignee === 'others') {
        filteredTasks = filteredTasks.filter(task => task.assignee !== 'self');
    }
    
    // Apply priority filter
    if (currentFilters.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === currentFilters.priority);
    }
    
    // Apply client filter
    if (currentFilters.client !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.clientId === currentFilters.client);
    }
    
    // Apply search filter
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            (task.description && task.description.toLowerCase().includes(searchTerm)) ||
            (task.clientId && getClientName(task.clientId).toLowerCase().includes(searchTerm))
        );
    }
    
    // Render filtered tasks
    renderTasks(filteredTasks);
}

// Render tasks based on current view
function renderTasks(tasksToRender) {
    if (currentView === 'list') {
        renderTasksList(tasksToRender);
    } else {
        renderTasksGrid(tasksToRender);
    }
    
    // Update showing count
    document.getElementById('showingCount').textContent = `Showing ${tasksToRender.length} of ${tasks.length} tasks`;
}

// Render tasks in list view
function renderTasksList(tasksToRender) {
    const tableBody = document.getElementById('tasksTableBody');
    tableBody.innerHTML = '';
    
    if (tasksToRender.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" class="text-center">
                <i class="fas fa-tasks" style="font-size: 2rem; margin-bottom: 1rem; color: var(--pacer-silver);"></i>
                <p>No tasks found matching your filters</p>
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    tasksToRender.forEach(task => {
        const row = document.createElement('tr');
        
        // Add class if task is overdue
        if (isTaskOverdue(task)) {
            row.classList.add('overdue');
        }
        
        // Add class if task is completed
        if (task.status === 'completed') {
            row.classList.add('completed');
        }
        
        const clientName = task.clientId ? getClientName(task.clientId) : 'None';
        const assigneeName = getAssigneeName(task.assignee);
        const isOverdue = isTaskOverdue(task);
        
        row.innerHTML = `
            <td>
                <div class="task-title">${task.title}</div>
            </td>
            <td>
                <div class="task-client">
                    <i class="fas fa-user"></i>
                    ${clientName}
                </div>
            </td>
            <td>
                <div class="task-assignee">
                    <i class="fas fa-user-md"></i>
                    ${assigneeName}
                </div>
            </td>
            <td>
                <div class="task-due-date ${isOverdue ? 'overdue' : ''}">
                    <i class="fas fa-calendar"></i>
                    ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                </div>
            </td>
            <td>
                <span class="task-priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            </td>
            <td>
                <span class="task-status ${task.status}">${task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}</span>
            </td>
            <td>
                <div class="task-actions">
                    ${task.status !== 'completed' ? `
                        <button class="action-btn complete" data-id="${task.id}" title="Mark Complete">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : `
                        <button class="action-btn reopen" data-id="${task.id}" title="Reopen Task">
                            <i class="fas fa-redo"></i>
                        </button>
                    `}
                    <button class="action-btn edit" data-id="${task.id}" title="Edit Task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-id="${task.id}" title="Delete Task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addTaskActionListeners();
}

// Render tasks in grid view
function renderTasksGrid(tasksToRender) {
    const tasksGrid = document.getElementById('tasksGrid');
    tasksGrid.innerHTML = '';
    
    if (tasksToRender.length === 0) {
        tasksGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks" style="font-size: 3rem; margin-bottom: 1rem; color: var(--pacer-silver);"></i>
                <h3>No tasks found</h3>
                <p>No tasks match your current filters</p>
            </div>
        `;
        return;
    }
    
    tasksToRender.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        
        // Add class if task is overdue
        if (isTaskOverdue(task)) {
            card.classList.add('overdue');
        }
        
        // Add class if task is completed
        if (task.status === 'completed') {
            card.classList.add('completed');
        }
        
        const clientName = task.clientId ? getClientName(task.clientId) : 'None';
        const assigneeName = getAssigneeName(task.assignee);
        const isOverdue = isTaskOverdue(task);
        
        card.innerHTML = `
            <div class="task-card-header">
                <h3 class="task-card-title">${task.title}</h3>
                <div class="task-card-actions">
                    ${task.status !== 'completed' ? `
                        <button class="action-btn complete" data-id="${task.id}" title="Mark Complete">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : `
                        <button class="action-btn reopen" data-id="${task.id}" title="Reopen Task">
                            <i class="fas fa-redo"></i>
                        </button>
                    `}
                    <button class="action-btn edit" data-id="${task.id}" title="Edit Task">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
            <div class="task-card-body">
                ${task.description ? `
                    <p class="task-card-description">${task.description}</p>
                ` : ''}
                <div class="task-card-meta">
                    <div class="task-card-meta-item">
                        <i class="fas fa-user"></i>
                        <span>Client: ${clientName}</span>
                    </div>
                    <div class="task-card-meta-item">
                        <i class="fas fa-user-md"></i>
                        <span>Assignee: ${assigneeName}</span>
                    </div>
                    <div class="task-card-meta-item ${isOverdue ? 'overdue' : ''}">
                        <i class="fas fa-calendar"></i>
                        <span>Due: ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
                    </div>
                    <div class="task-card-meta-item">
                        <i class="fas fa-bell"></i>
                        <span>Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                    </div>
                </div>
            </div>
            <div class="task-card-footer">
                <span class="task-card-status ${task.status}">${task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}</span>
                <button class="action-btn delete" data-id="${task.id}" title="Delete Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        tasksGrid.appendChild(card);
    });
    
    // Add event listeners to action buttons
    addTaskActionListeners();
}

// Add event listeners to task action buttons
function addTaskActionListeners() {
    // Complete task buttons
    document.querySelectorAll('.action-btn.complete').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            completeTask(taskId);
        });
    });
    
    // Reopen task buttons
    document.querySelectorAll('.action-btn.reopen').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            reopenTask(taskId);
        });
    });
    
    // Edit task buttons
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            openEditTaskModal(taskId);
        });
    });
    
    // Delete task buttons
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            deleteTask(taskId);
        });
    });
}

// Get client name by ID
function getClientName(clientId) {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
}

// Get assignee name by ID
function getAssigneeName(assigneeId) {
    const assignees = {
        'self': 'Me',
        'sarah': 'Dr. Sarah Johnson',
        'michael': 'Dr. Michael Chen',
        'emma': 'Dr. Emma Wilson'
    };
    
    return assignees[assigneeId] || 'Unknown Assignee';
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Set up event listeners
function setupEventListeners() {
    // Add task button
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', openAddTaskModal);
    }
    
    // Modal close buttons
    const closeAddTaskModal = document.getElementById('closeAddTaskModal');
    const closeEditTaskModal = document.getElementById('closeEditTaskModal');
    const closeEmergencyModal = document.getElementById('closeEmergencyModal');
    
    if (closeAddTaskModal) closeAddTaskModal.addEventListener('click', closeModal);
    if (closeEditTaskModal) closeEditTaskModal.addEventListener('click', closeModal);
    if (closeEmergencyModal) closeEmergencyModal.addEventListener('click', closeModal);
    
    // Modal cancel buttons
    const cancelAddTask = document.getElementById('cancelAddTask');
    const cancelEditTask = document.getElementById('cancelEditTask');
    
    if (cancelAddTask) cancelAddTask.addEventListener('click', closeModal);
    if (cancelEditTask) cancelEditTask.addEventListener('click', closeModal);
    
    // Form submissions
    const addTaskForm = document.getElementById('addTaskForm');
    const editTaskForm = document.getElementById('editTaskForm');
    
    if (addTaskForm) addTaskForm.addEventListener('submit', handleAddTask);
    if (editTaskForm) editTaskForm.addEventListener('submit', handleEditTask);
    
    // Filter changes
    const statusFilter = document.getElementById('statusFilter');
    const assigneeFilter = document.getElementById('assigneeFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const clientFilter = document.getElementById('clientFilter');
    const taskSearch = document.getElementById('taskSearch');
    const clearFilters = document.getElementById('clearFilters');
    
    if (statusFilter) statusFilter.addEventListener('change', updateFilters);
    if (assigneeFilter) assigneeFilter.addEventListener('change', updateFilters);
    if (priorityFilter) priorityFilter.addEventListener('change', updateFilters);
    if (clientFilter) clientFilter.addEventListener('change', updateFilters);
    if (taskSearch) taskSearch.addEventListener('input', updateFilters);
    if (clearFilters) clearFilters.addEventListener('click', resetFilters);
    
    // View options
    const viewOptions = document.querySelectorAll('.view-option');
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });
    
    // Emergency button
    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', openEmergencyModal);
    }
    
    // Close modal on outside click
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal();
            }
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// Update filters based on user input
function updateFilters() {
    currentFilters.status = document.getElementById('statusFilter').value;
    currentFilters.assignee = document.getElementById('assigneeFilter').value;
    currentFilters.priority = document.getElementById('priorityFilter').value;
    currentFilters.client = document.getElementById('clientFilter').value;
    currentFilters.search = document.getElementById('taskSearch').value;
    
    applyFilters();
}

// Reset all filters
function resetFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('assigneeFilter').value = 'all';
    document.getElementById('priorityFilter').value = 'all';
    document.getElementById('clientFilter').value = 'all';
    document.getElementById('taskSearch').value = '';
    
    currentFilters = {
        status: 'all',
        assignee: 'all',
        priority: 'all',
        client: 'all',
        search: ''
    };
    
    applyFilters();
    
    // Show toast notification
    showToast('Filters cleared', 'All filters have been reset.', 'success');
}

// Switch between list and grid views
function switchView(view) {
    if (view === currentView) return;
    
    currentView = view;
    
    // Update view option buttons
    document.querySelectorAll('.view-option').forEach(option => {
        if (option.getAttribute('data-view') === view) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Show/hide views
    if (view === 'list') {
        document.getElementById('listView').style.display = 'block';
        document.getElementById('gridView').style.display = 'none';
    } else {
        document.getElementById('listView').style.display = 'none';
        document.getElementById('gridView').style.display = 'block';
    }
    
    // Re-render tasks with current view
    applyFilters();
}

// Open add task modal
function openAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('taskTitle').focus();
    }
}

// Open edit task modal
function openEditTaskModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Populate form fields
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskAssignee').value = task.assignee;
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskDueDate').value = task.dueDate || '';
    document.getElementById('editTaskReminder').value = task.reminder || 'none';
    document.getElementById('editTaskRecurrence').value = task.recurrence || 'none';
    document.getElementById('editTaskStatus').value = task.status;
    document.getElementById('editTaskClient').value = task.clientId || '';
    
    // Show modal
    const modal = document.getElementById('editTaskModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('editTaskTitle').focus();
    }
}

// Open emergency modal
function openEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Close modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Handle add task form submission
function handleAddTask(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newTask = {
        id: generateId(),
        title: formData.get('title'),
        description: formData.get('description'),
        assignee: formData.get('assignee'),
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority'),
        status: 'pending',
        clientId: formData.get('clientId') || null,
        reminder: formData.get('reminder'),
        recurrence: formData.get('recurrence'),
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    // Add the new task
    tasks.push(newTask);
    saveTasks();
    applyFilters();
    
    // Close modal
    closeModal();
    
    // Show success toast
    showToast('Task Created', 'Your task has been successfully created.', 'success');
    
    // Reset form
    event.target.reset();
}

// Handle edit task form submission
function handleEditTask(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const taskId = formData.get('id');
    
    // Find the task to update
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    // Update the task
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: formData.get('title'),
        description: formData.get('description'),
        assignee: formData.get('assignee'),
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority'),
        status: formData.get('status'),
        clientId: formData.get('clientId') || null,
        reminder: formData.get('reminder'),
        recurrence: formData.get('recurrence')
    };
    
    saveTasks();
    applyFilters();
    
    // Close modal
    closeModal();
    
    // Show success toast
    showToast('Task Updated', 'Your task has been successfully updated.', 'success');
}

// Complete a task
function completeTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    tasks[taskIndex].status = 'completed';
    tasks[taskIndex].completedAt = new Date().toISOString();
    
    saveTasks();
    applyFilters();
    
    // Add animation class to the task
    const taskElement = document.querySelector(`[data-id="${taskId}"]`).closest('tr, .task-card');
    if (taskElement) {
        taskElement.classList.add('task-completed');
        setTimeout(() => {
            taskElement.classList.remove('task-completed');
        }, 500);
    }
    
    // Show success toast
    showToast('Task Completed', 'The task has been marked as completed.', 'success');
}

// Reopen a task
function reopenTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    tasks[taskIndex].status = 'pending';
    tasks[taskIndex].completedAt = null;
    
    saveTasks();
    applyFilters();
    
    // Show success toast
    showToast('Task Reopened', 'The task has been reopened.', 'success');
}

// Delete a task
function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    // Remove the task
    tasks.splice(taskIndex, 1);
    saveTasks();
    applyFilters();
    
    // Show success toast
    showToast('Task Deleted', 'The task has been successfully deleted.', 'success');
}

// Generate a unique ID for new tasks
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show toast notification
function showToast(title, message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        createToastContainer();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type];
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.querySelector('.toast-container').appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Add event listener to close button
    toast.querySelector('.toast-close').addEventListener('click', function() {
        hideToast(toast);
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideToast(toast);
    }, 5000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
}

// Hide toast with animation
function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Calendar sync functionality (stretch feature)
function syncWithCalendar() {
    // This would integrate with calendar APIs in a real application
    showToast('Calendar Sync', 'This feature would sync tasks with your personal calendar in a production environment.', 'info');
}

// Recurring tasks functionality
function handleRecurringTasks() {
    // This would handle creating recurring tasks based on their recurrence pattern
    // For now, we'll just show a toast notification
    showToast('Recurring Tasks', 'Recurring tasks are automatically managed by the system.', 'info');
}

// Supervisor view functionality
function enableSupervisorView() {
    // This would show tasks across all supervisees for supervisors
    // For now, we'll just show a toast notification
    showToast('Supervisor View', 'Supervisor view shows tasks across all team members.', 'info');
}

// Initialize calendar sync if requested
if (window.location.search.includes('calendar-sync')) {
    setTimeout(syncWithCalendar, 2000);
}

// Check for overdue tasks and show notification
function checkOverdueTasks() {
    const overdueTasks = tasks.filter(task => isTaskOverdue(task) && task.status !== 'completed');
    
    if (overdueTasks.length > 0) {
        showToast(
            'Overdue Tasks', 
            `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} that need attention.`, 
            'warning'
        );
    }
}

// Check for overdue tasks on page load
setTimeout(checkOverdueTasks, 3000);

// Export tasks functionality (for future use)
function exportTasks() {
    // This would export tasks to CSV or PDF
    showToast('Export Tasks', 'Task export functionality would be implemented here.', 'info');
}

// Import tasks functionality (for future use)
function importTasks() {
    // This would import tasks from CSV or other formats
    showToast('Import Tasks', 'Task import functionality would be implemented here.', 'info');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + N to add new task
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        openAddTaskModal();
    }
    
    // Escape to close modals
    if (event.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + F to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.getElementById('taskSearch');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Initialize tooltips for better UX
function initTooltips() {
    const elements = document.querySelectorAll('[title]');
    elements.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            const title = this.getAttribute('title');
            if (!title) return;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = title;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            
            this.setAttribute('data-tooltip', title);
            this.removeAttribute('title');
        });
        
        el.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
            
            const title = this.getAttribute('data-tooltip');
            if (title) {
                this.setAttribute('title', title);
                this.removeAttribute('data-tooltip');
            }
        });
    });
}

// Initialize tooltips after DOM is fully loaded
setTimeout(initTooltips, 1000);