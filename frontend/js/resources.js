// resources.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the resources page
    initResourcesPage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load resources data
    loadResourcesData();
    
    // Load patients for sharing
    loadPatientsData();
});

// Global variables
let resources = [];
let filteredResources = [];
let currentPage = 1;
const resourcesPerPage = 12;
let currentView = 'grid';
let currentFilters = {
    search: '',
    type: 'all',
    category: 'all',
    audience: 'all',
    favorites: false
};

// Initialize the resources page
function initResourcesPage() {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    
    // Check for high contrast mode
    if (localStorage.getItem('highContrast') === 'enabled') {
        document.body.classList.add('high-contrast');
    }
    
    // Check for large text mode
    if (localStorage.getItem('largeText') === 'enabled') {
        document.body.classList.add('large-text');
    }
    
    // Set current date
    const dateElement = document.querySelector('.date-info');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Emergency button
    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', openEmergencyModal);
    }
    
    // Font size toggle
    const fontSizeToggle = document.getElementById('fontSizeToggle');
    if (fontSizeToggle) {
        fontSizeToggle.addEventListener('click', toggleFontSize);
    }
    
    // Contrast toggle
    const contrastToggle = document.getElementById('contrastToggle');
    if (contrastToggle) {
        contrastToggle.addEventListener('click', toggleContrast);
    }
    
    // Upload resource button
    const uploadResourceBtn = document.getElementById('uploadResourceBtn');
    if (uploadResourceBtn) {
        uploadResourceBtn.addEventListener('click', openUploadModal);
    }
    
    // Modal close buttons
    const closeUploadModal = document.getElementById('closeUploadModal');
    if (closeUploadModal) {
        closeUploadModal.addEventListener('click', closeUploadModal);
    }
    
    const closeShareModal = document.getElementById('closeShareModal');
    if (closeShareModal) {
        closeShareModal.addEventListener('click', closeShareModal);
    }
    
    const closeLinkTaskModal = document.getElementById('closeLinkTaskModal');
    if (closeLinkTaskModal) {
        closeLinkTaskModal.addEventListener('click', closeLinkTaskModal);
    }
    
    const closePreviewModal = document.getElementById('closePreviewModal');
    if (closePreviewModal) {
        closePreviewModal.addEventListener('click', closePreviewModal);
    }
    
    const closeEmergencyModal = document.getElementById('closeEmergencyModal');
    if (closeEmergencyModal) {
        closeEmergencyModal.addEventListener('click', closeEmergencyModal);
    }
    
    // Cancel buttons
    const cancelUpload = document.getElementById('cancelUpload');
    if (cancelUpload) {
        cancelUpload.addEventListener('click', closeUploadModal);
    }
    
    const cancelShare = document.getElementById('cancelShare');
    if (cancelShare) {
        cancelShare.addEventListener('click', closeShareModal);
    }
    
    const cancelLinkTask = document.getElementById('cancelLinkTask');
    if (cancelLinkTask) {
        cancelLinkTask.addEventListener('click', closeLinkTaskModal);
    }
    
    // Form submissions
    const uploadResourceForm = document.getElementById('uploadResourceForm');
    if (uploadResourceForm) {
        uploadResourceForm.addEventListener('submit', handleResourceUpload);
    }
    
    const shareResourceForm = document.getElementById('shareResourceForm');
    if (shareResourceForm) {
        shareResourceForm.addEventListener('submit', handleResourceShare);
    }
    
    const linkTaskForm = document.getElementById('linkTaskForm');
    if (linkTaskForm) {
        linkTaskForm.addEventListener('submit', handleTaskLink);
    }
    
    // Search and filter inputs
    const resourceSearch = document.getElementById('resourceSearch');
    if (resourceSearch) {
        resourceSearch.addEventListener('input', handleSearch);
    }
    
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', handleFilterChange);
    }
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilterChange);
    }
    
    const audienceFilter = document.getElementById('audienceFilter');
    if (audienceFilter) {
        audienceFilter.addEventListener('change', handleFilterChange);
    }
    
    // Favorites filter
    const showFavorites = document.getElementById('showFavorites');
    if (showFavorites) {
        showFavorites.addEventListener('click', toggleFavoritesFilter);
    }
    
    // Clear filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', resetFilters);
    }
    
    // View options
    const viewOptions = document.querySelectorAll('.view-option');
    viewOptions.forEach(option => {
        option.addEventListener('click', handleViewChange);
    });
    
    // Pagination
    const prevPage = document.getElementById('prevPage');
    if (prevPage) {
        prevPage.addEventListener('click', goToPrevPage);
    }
    
    const nextPage = document.getElementById('nextPage');
    if (nextPage) {
        nextPage.addEventListener('click', goToNextPage);
    }
    
    // Resource type change in upload form
    const resourceType = document.getElementById('resourceType');
    if (resourceType) {
        resourceType.addEventListener('change', handleResourceTypeChange);
    }
    
    // Patient search in share modal
    const patientSearchShare = document.getElementById('patientSearchShare');
    if (patientSearchShare) {
        patientSearchShare.addEventListener('input', handlePatientSearch);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Open emergency modal
function openEmergencyModal() {
    const emergencyModal = document.getElementById('emergencyModal');
    emergencyModal.classList.add('active');
}

// Close emergency modal
function closeEmergencyModal() {
    const emergencyModal = document.getElementById('emergencyModal');
    emergencyModal.classList.remove('active');
}

// Toggle font size
function toggleFontSize() {
    document.body.classList.toggle('large-text');
    if (document.body.classList.contains('large-text')) {
        localStorage.setItem('largeText', 'enabled');
        showToast('Large text enabled', 'Accessibility settings have been updated.', 'success');
    } else {
        localStorage.setItem('largeText', 'disabled');
        showToast('Large text disabled', 'Accessibility settings have been updated.', 'info');
    }
}

// Toggle contrast
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    if (document.body.classList.contains('high-contrast')) {
        localStorage.setItem('highContrast', 'enabled');
        showToast('High contrast mode enabled', 'Accessibility settings have been updated.', 'success');
    } else {
        localStorage.setItem('highContrast', 'disabled');
        showToast('High contrast mode disabled', 'Accessibility settings have been updated.', 'info');
    }
}

// Open upload modal
function openUploadModal() {
    const uploadResourceModal = document.getElementById('uploadResourceModal');
    uploadResourceModal.classList.add('active');
}

// Close upload modal
function closeUploadModal() {
    const uploadResourceModal = document.getElementById('uploadResourceModal');
    uploadResourceModal.classList.remove('active');
    // Reset form
    document.getElementById('uploadResourceForm').reset();
    // Hide URL fields
    document.getElementById('fileUploadGroup').style.display = 'block';
    document.getElementById('videoUrlGroup').style.display = 'none';
    document.getElementById('externalUrlGroup').style.display = 'none';
}

// Open share modal
function openShareModal(resourceId) {
    const shareResourceModal = document.getElementById('shareResourceModal');
    document.getElementById('shareResourceId').value = resourceId;
    shareResourceModal.classList.add('active');
}

// Close share modal
function closeShareModal() {
    const shareResourceModal = document.getElementById('shareResourceModal');
    shareResourceModal.classList.remove('active');
    // Reset form
    document.getElementById('shareResourceForm').reset();
    // Uncheck all patients
    const checkboxes = document.querySelectorAll('#patientsListShare input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Open link task modal
function openLinkTaskModal(resourceId) {
    const linkTaskModal = document.getElementById('linkTaskModal');
    document.getElementById('linkResourceId').value = resourceId;
    linkTaskModal.classList.add('active');
}

// Close link task modal
function closeLinkTaskModal() {
    const linkTaskModal = document.getElementById('linkTaskModal');
    linkTaskModal.classList.remove('active');
    // Reset form
    document.getElementById('linkTaskForm').reset();
}

// Open preview modal
function openPreviewModal(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const previewModal = document.getElementById('resourcePreviewModal');
    const previewTitle = document.getElementById('previewResourceTitle');
    const previewContent = document.getElementById('previewResourceContent');
    
    previewTitle.textContent = resource.title;
    
    // Clear previous content
    previewContent.innerHTML = '';
    
    // Create preview based on resource type
    if (resource.type === 'pdf') {
        previewContent.innerHTML = `
            <div class="preview-pdf">
                <div class="preview-header">
                    <i class="fas fa-file-pdf" style="font-size: 3rem; color: #e74c3c;"></i>
                    <h3>${resource.title}</h3>
                    <p>This is a PDF resource. You can download it to view the full content.</p>
                </div>
                <div class="preview-actions">
                    <button class="primary-btn" onclick="downloadResource('${resource.id}')">
                        <i class="fas fa-download"></i>
                        Download PDF
                    </button>
                </div>
            </div>
        `;
    } else if (resource.type === 'video') {
        previewContent.innerHTML = `
            <div class="preview-video">
                <div class="video-container">
                    <iframe 
                        width="100%" 
                        height="400" 
                        src="${resource.url}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="preview-info">
                    <h3>${resource.title}</h3>
                    <p>${resource.description || 'No description available.'}</p>
                </div>
            </div>
        `;
    } else if (resource.type === 'article') {
        previewContent.innerHTML = `
            <div class="preview-article">
                <div class="article-header">
                    <i class="fas fa-file-alt" style="font-size: 3rem; color: #3498db;"></i>
                    <h3>${resource.title}</h3>
                </div>
                <div class="article-content">
                    <p>${resource.description || 'No content preview available. Download the full article to read.'}</p>
                </div>
                <div class="preview-actions">
                    <button class="primary-btn" onclick="downloadResource('${resource.id}')">
                        <i class="fas fa-download"></i>
                        Download Article
                    </button>
                </div>
            </div>
        `;
    } else if (resource.type === 'link') {
        previewContent.innerHTML = `
            <div class="preview-link">
                <div class="link-header">
                    <i class="fas fa-external-link-alt" style="font-size: 3rem; color: #9b59b6;"></i>
                    <h3>${resource.title}</h3>
                </div>
                <div class="link-content">
                    <p>${resource.description || 'External resource link.'}</p>
                    <p><strong>URL:</strong> <a href="${resource.url}" target="_blank">${resource.url}</a></p>
                </div>
                <div class="preview-actions">
                    <a href="${resource.url}" target="_blank" class="primary-btn">
                        <i class="fas fa-external-link-alt"></i>
                        Visit Website
                    </a>
                </div>
            </div>
        `;
    }
    
    previewModal.classList.add('active');
}

// Close preview modal
function closePreviewModal() {
    const previewModal = document.getElementById('resourcePreviewModal');
    previewModal.classList.remove('active');
}

// Handle resource type change in upload form
function handleResourceTypeChange() {
    const type = document.getElementById('resourceType').value;
    const fileUploadGroup = document.getElementById('fileUploadGroup');
    const videoUrlGroup = document.getElementById('videoUrlGroup');
    const externalUrlGroup = document.getElementById('externalUrlGroup');
    
    // Hide all groups first
    fileUploadGroup.style.display = 'none';
    videoUrlGroup.style.display = 'none';
    externalUrlGroup.style.display = 'none';
    
    // Show relevant group based on type
    if (type === 'pdf' || type === 'article') {
        fileUploadGroup.style.display = 'block';
    } else if (type === 'video') {
        videoUrlGroup.style.display = 'block';
    } else if (type === 'link') {
        externalUrlGroup.style.display = 'block';
    }
}

// Handle resource upload
function handleResourceUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const type = formData.get('type');
    const audience = formData.get('audience');
    const categories = formData.getAll('categories');
    const tags = formData.get('tags');
    
    // Create new resource object
    const newResource = {
        id: generateId(),
        title,
        description,
        type,
        audience,
        categories,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        uploadDate: new Date().toISOString(),
        views: 0,
        shares: 0,
        favorited: false,
        file: type === 'pdf' || type === 'article' ? formData.get('file') : null,
        url: type === 'video' ? formData.get('videoUrl') : (type === 'link' ? formData.get('externalUrl') : null)
    };
    
    // Add to resources array
    resources.unshift(newResource);
    
    // Update UI
    filterResources();
    updateStats();
    
    // Close modal
    closeUploadModal();
    
    // Show success message
    showToast('Resource Uploaded', `${title} has been added to the resource library.`, 'success');
}

// Handle resource share
function handleResourceShare(e) {
    e.preventDefault();
    
    const resourceId = document.getElementById('shareResourceId').value;
    const message = document.getElementById('shareMessage').value;
    
    // Get selected patients
    const selectedPatients = [];
    const checkboxes = document.querySelectorAll('#patientsListShare input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        selectedPatients.push(checkbox.value);
    });
    
    if (selectedPatients.length === 0) {
        showToast('No Patients Selected', 'Please select at least one patient to share with.', 'warning');
        return;
    }
    
    // Find the resource
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Update resource shares count
    resource.shares += selectedPatients.length;
    
    // Update UI
    updateResourceCard(resourceId);
    updateStats();
    
    // Close modal
    closeShareModal();
    
    // Show success message
    showToast('Resource Shared', `${resource.title} has been shared with ${selectedPatients.length} patient(s).`, 'success');
}

// Handle task link
function handleTaskLink(e) {
    e.preventDefault();
    
    const resourceId = document.getElementById('linkResourceId').value;
    const taskTitle = document.getElementById('taskTitle').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const patientId = document.getElementById('taskPatient').value;
    const notes = document.getElementById('taskNotes').value;
    
    // Find the resource
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Create task (in a real app, this would be saved to a database)
    const task = {
        id: generateId(),
        title: taskTitle,
        dueDate,
        patientId,
        notes,
        resourceId,
        status: 'assigned',
        created: new Date().toISOString()
    };
    
    // Close modal
    closeLinkTaskModal();
    
    // Show success message
    showToast('Task Created', `"${taskTitle}" has been created and linked to ${resource.title}.`, 'success');
}

// Handle search input
function handleSearch(e) {
    currentFilters.search = e.target.value.toLowerCase();
    filterResources();
}

// Handle filter changes
function handleFilterChange() {
    currentFilters.type = document.getElementById('typeFilter').value;
    currentFilters.category = document.getElementById('categoryFilter').value;
    currentFilters.audience = document.getElementById('audienceFilter').value;
    filterResources();
}

// Toggle favorites filter
function toggleFavoritesFilter() {
    const favoritesBtn = document.getElementById('showFavorites');
    currentFilters.favorites = !currentFilters.favorites;
    
    if (currentFilters.favorites) {
        favoritesBtn.classList.add('active');
        favoritesBtn.innerHTML = '<i class="fas fa-star"></i> Show All';
    } else {
        favoritesBtn.classList.remove('active');
        favoritesBtn.innerHTML = '<i class="fas fa-star"></i> Favorites Only';
    }
    
    filterResources();
}

// Reset all filters
function resetFilters() {
    document.getElementById('resourceSearch').value = '';
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('audienceFilter').value = 'all';
    
    const favoritesBtn = document.getElementById('showFavorites');
    favoritesBtn.classList.remove('active');
    favoritesBtn.innerHTML = '<i class="fas fa-star"></i> Favorites Only';
    
    currentFilters = {
        search: '',
        type: 'all',
        category: 'all',
        audience: 'all',
        favorites: false
    };
    
    filterResources();
}

// Handle view change (grid/list)
function handleViewChange(e) {
    const view = e.currentTarget.dataset.view;
    const gridView = document.getElementById('resourcesGrid');
    const listView = document.getElementById('resourcesList');
    const viewOptions = document.querySelectorAll('.view-option');
    
    // Update active button
    viewOptions.forEach(option => {
        option.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show/hide views
    if (view === 'grid') {
        gridView.style.display = 'grid';
        listView.style.display = 'none';
        currentView = 'grid';
    } else {
        gridView.style.display = 'none';
        listView.style.display = 'block';
        currentView = 'list';
    }
}

// Go to previous page
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderResources();
        updatePagination();
    }
}

// Go to next page
function goToNextPage() {
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderResources();
        updatePagination();
    }
}

// Handle patient search in share modal
function handlePatientSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const patientItems = document.querySelectorAll('.patient-item-share');
    
    patientItems.forEach(item => {
        const name = item.querySelector('.patient-name-share').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter resources based on current filters
function filterResources() {
    filteredResources = resources.filter(resource => {
        // Search filter
        if (currentFilters.search && 
            !resource.title.toLowerCase().includes(currentFilters.search) &&
            !resource.description.toLowerCase().includes(currentFilters.search) &&
            !resource.tags.some(tag => tag.toLowerCase().includes(currentFilters.search)) &&
            !resource.categories.some(cat => cat.toLowerCase().includes(currentFilters.search))) {
            return false;
        }
        
        // Type filter
        if (currentFilters.type !== 'all' && resource.type !== currentFilters.type) {
            return false;
        }
        
        // Category filter
        if (currentFilters.category !== 'all' && !resource.categories.includes(currentFilters.category)) {
            return false;
        }
        
        // Audience filter
        if (currentFilters.audience !== 'all' && resource.audience !== currentFilters.audience) {
            return false;
        }
        
        // Favorites filter
        if (currentFilters.favorites && !resource.favorited) {
            return false;
        }
        
        return true;
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Render filtered resources
    renderResources();
    updatePagination();
    updateShowingCount();
}

// Render resources based on current view
function renderResources() {
    if (currentView === 'grid') {
        renderResourcesGrid();
    } else {
        renderResourcesList();
    }
}

// Render resources in grid view
function renderResourcesGrid() {
    const resourcesGrid = document.getElementById('resourcesGrid');
    resourcesGrid.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * resourcesPerPage;
    const endIndex = Math.min(startIndex + resourcesPerPage, filteredResources.length);
    const paginatedResources = filteredResources.slice(startIndex, endIndex);
    
    if (paginatedResources.length === 0) {
        resourcesGrid.innerHTML = `
            <div class="no-resources">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>No resources found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
        `;
        return;
    }
    
    paginatedResources.forEach(resource => {
        const resourceCard = createResourceCard(resource);
        resourcesGrid.appendChild(resourceCard);
    });
}

// Render resources in list view
function renderResourcesList() {
    const tableBody = document.getElementById('resourcesTableBody');
    tableBody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * resourcesPerPage;
    const endIndex = Math.min(startIndex + resourcesPerPage, filteredResources.length);
    const paginatedResources = filteredResources.slice(startIndex, endIndex);
    
    if (paginatedResources.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-resources">
                    <i class="fas fa-search" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
                    No resources found. Try adjusting your search or filters.
                </td>
            </tr>
        `;
        return;
    }
    
    paginatedResources.forEach(resource => {
        const tableRow = createResourceTableRow(resource);
        tableBody.appendChild(tableRow);
    });
}

// Create resource card for grid view
function createResourceCard(resource) {
    const card = document.createElement('article');
    card.className = 'resource-card';
    card.dataset.id = resource.id;
    
    // Get icon based on type
    let typeIcon = 'fa-file';
    if (resource.type === 'pdf') typeIcon = 'fa-file-pdf';
    if (resource.type === 'video') typeIcon = 'fa-video';
    if (resource.type === 'article') typeIcon = 'fa-file-alt';
    if (resource.type === 'link') typeIcon = 'fa-external-link-alt';
    
    // Format date
    const uploadDate = new Date(resource.uploadDate);
    const formattedDate = uploadDate.toLocaleDateString();
    
    card.innerHTML = `
        <header class="resource-header">
            <div class="resource-type">
                <i class="fas ${typeIcon}"></i>
            </div>
            <div class="resource-actions">
                <button class="resource-action-btn favorite-btn ${resource.favorited ? 'favorited' : ''}" 
                        onclick="toggleFavorite('${resource.id}')" title="${resource.favorited ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas ${resource.favorited ? 'fa-star' : 'fa-star'}"></i>
                </button>
                <button class="resource-action-btn" onclick="openShareModal('${resource.id}')" title="Share resource">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </header>
        <h3 class="resource-title">${resource.title}</h3>
        <p class="resource-description">${resource.description || 'No description available.'}</p>
        <div class="resource-meta">
            <div class="resource-categories">
                ${resource.categories.map(cat => `<span class="resource-category">${cat}</span>`).join('')}
            </div>
            <div class="resource-stats">
                <span class="resource-stat">
                    <i class="fas fa-eye"></i> ${resource.views}
                </span>
                <span class="resource-stat">
                    <i class="fas fa-share"></i> ${resource.shares}
                </span>
                <span class="resource-stat">
                    <i class="fas fa-calendar"></i> ${formattedDate}
                </span>
            </div>
        </div>
        <footer class="resource-footer">
            <span class="resource-audience ${resource.audience}">${resource.audience}</span>
            <div class="resource-cta">
                <button class="cta-btn secondary" onclick="openPreviewModal('${resource.id}')">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button class="cta-btn primary" onclick="downloadResource('${resource.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </footer>
    `;
    
    return card;
}

// Create resource table row for list view
function createResourceTableRow(resource) {
    const row = document.createElement('tr');
    row.dataset.id = resource.id;
    
    // Get icon based on type
    let typeIcon = 'fa-file';
    if (resource.type === 'pdf') typeIcon = 'fa-file-pdf';
    if (resource.type === 'video') typeIcon = 'fa-video';
    if (resource.type === 'article') typeIcon = 'fa-file-alt';
    if (resource.type === 'link') typeIcon = 'fa-external-link-alt';
    
    // Format date
    const uploadDate = new Date(resource.uploadDate);
    const formattedDate = uploadDate.toLocaleDateString();
    
    row.innerHTML = `
        <td>
            <div class="resource-title-list">
                <i class="fas ${typeIcon}" style="color: ${getTypeColor(resource.type)}; margin-right: 0.5rem;"></i>
                ${resource.title}
            </div>
        </td>
        <td>${resource.type.toUpperCase()}</td>
        <td>
            <div class="resource-categories">
                ${resource.categories.map(cat => `<span class="resource-category">${cat}</span>`).join('')}
            </div>
        </td>
        <td>${resource.views}</td>
        <td>${resource.shares}</td>
        <td>
            <div class="table-row-actions">
                <button class="resource-action-btn favorite-btn ${resource.favorited ? 'favorited' : ''}" 
                        onclick="toggleFavorite('${resource.id}')" title="${resource.favorited ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas ${resource.favorited ? 'fa-star' : 'fa-star'}"></i>
                </button>
                <button class="resource-action-btn" onclick="openShareModal('${resource.id}')" title="Share resource">
                    <i class="fas fa-share"></i>
                </button>
                <button class="resource-action-btn" onclick="openLinkTaskModal('${resource.id}')" title="Link to task">
                    <i class="fas fa-tasks"></i>
                </button>
                <button class="resource-action-btn" onclick="openPreviewModal('${resource.id}')" title="Preview">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="resource-action-btn" onclick="downloadResource('${resource.id}')" title="Download">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Get color for resource type
function getTypeColor(type) {
    const colors = {
        pdf: '#e74c3c',
        video: '#9b59b6',
        article: '#3498db',
        link: '#2ecc71'
    };
    return colors[type] || '#95a5a6';
}

// Update resource card after changes
function updateResourceCard(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    if (currentView === 'grid') {
        const card = document.querySelector(`.resource-card[data-id="${resourceId}"]`);
        if (card) {
            const newCard = createResourceCard(resource);
            card.parentNode.replaceChild(newCard, card);
        }
    } else {
        const row = document.querySelector(`tr[data-id="${resourceId}"]`);
        if (row) {
            const newRow = createResourceTableRow(resource);
            row.parentNode.replaceChild(newRow, row);
        }
    }
}

// Toggle favorite status
function toggleFavorite(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    resource.favorited = !resource.favorited;
    
    // Update UI
    updateResourceCard(resourceId);
    updateStats();
    
    // Show notification
    if (resource.favorited) {
        showToast('Added to Favorites', `${resource.title} has been added to your favorites.`, 'success');
    } else {
        showToast('Removed from Favorites', `${resource.title} has been removed from your favorites.`, 'info');
    }
}

// Download resource
function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Increment view count
    resource.views++;
    
    // Update UI
    updateResourceCard(resourceId);
    updateStats();
    
    // Simulate download
    showToast('Download Started', `Downloading ${resource.title}...`, 'info');
    
    // In a real application, this would trigger an actual download
    setTimeout(() => {
        showToast('Download Complete', `${resource.title} has been downloaded successfully.`, 'success');
    }, 1500);
}

// Update stats overview
function updateStats() {
    const totalResources = document.getElementById('totalResources');
    const favoriteResources = document.getElementById('favoriteResources');
    const sharedResources = document.getElementById('sharedResources');
    const viewedResources = document.getElementById('viewedResources');
    
    if (totalResources) {
        totalResources.textContent = resources.length;
    }
    
    if (favoriteResources) {
        const favoritesCount = resources.filter(r => r.favorited).length;
        favoriteResources.textContent = favoritesCount;
    }
    
    if (sharedResources) {
        const sharesCount = resources.reduce((total, resource) => total + resource.shares, 0);
        sharedResources.textContent = sharesCount;
    }
    
    if (viewedResources) {
        const viewsCount = resources.reduce((total, resource) => total + resource.views, 0);
        viewedResources.textContent = viewsCount;
    }
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const paginationContainer = document.querySelector('.pagination');
    
    // Update prev/next buttons
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
    
    // Clear existing page buttons (except prev/next)
    const existingPageButtons = paginationContainer.querySelectorAll('.pagination-btn:not(#prevPage):not(#nextPage)');
    existingPageButtons.forEach(btn => btn.remove());
    
    // Add page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderResources();
            updatePagination();
        });
        
        paginationContainer.insertBefore(pageBtn, nextPage);
    }
}

// Update showing count
function updateShowingCount() {
    const showingCount = document.getElementById('showingCount');
    const startIndex = (currentPage - 1) * resourcesPerPage + 1;
    const endIndex = Math.min(startIndex + resourcesPerPage - 1, filteredResources.length);
    
    if (showingCount) {
        if (filteredResources.length === 0) {
            showingCount.textContent = 'Showing 0 resources';
        } else {
            showingCount.textContent = `Showing ${startIndex}-${endIndex} of ${filteredResources.length} resources`;
        }
    }
}

// Load resources data
function loadResourcesData() {
    // In a real application, this would be an API call
    // For demo purposes, we're using mock data
    resources = [
        {
            id: '1',
            title: 'Coping with Anxiety',
            description: 'A comprehensive guide to understanding and managing anxiety symptoms.',
            type: 'pdf',
            audience: 'client',
            categories: ['anxiety', 'cbt'],
            tags: ['coping', 'mindfulness', 'relaxation'],
            uploadDate: '2025-08-15T10:30:00Z',
            views: 42,
            shares: 15,
            favorited: true,
            file: 'coping-with-anxiety.pdf',
            url: null
        },
        {
            id: '2',
            title: 'DBT Skills Introduction',
            description: 'An introductory video to Dialectical Behavior Therapy skills for emotion regulation.',
            type: 'video',
            audience: 'clinician',
            categories: ['dbt', 'emotion-regulation'],
            tags: ['skills', 'therapy', 'introduction'],
            uploadDate: '2025-08-20T14:15:00Z',
            views: 28,
            shares: 8,
            favorited: false,
            file: null,
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: '3',
            title: 'Mindfulness Meditation Guide',
            description: 'Step-by-step instructions for practicing mindfulness meditation.',
            type: 'article',
            audience: 'client',
            categories: ['mindfulness', 'meditation'],
            tags: ['guide', 'practice', 'techniques'],
            uploadDate: '2025-08-10T09:45:00Z',
            views: 67,
            shares: 22,
            favorited: true,
            file: 'mindfulness-guide.pdf',
            url: null
        },
        {
            id: '4',
            title: 'Crisis Intervention Protocol',
            description: 'Protocol for clinicians handling mental health crisis situations.',
            type: 'pdf',
            audience: 'clinician',
            categories: ['crisis', 'protocol'],
            tags: ['intervention', 'safety', 'emergency'],
            uploadDate: '2025-08-05T16:20:00Z',
            views: 35,
            shares: 12,
            favorited: false,
            file: 'crisis-protocol.pdf',
            url: null
        },
        {
            id: '5',
            title: 'Understanding Depression',
            description: 'Educational resource about depression symptoms and treatment options.',
            type: 'article',
            audience: 'client',
            categories: ['depression', 'education'],
            tags: ['symptoms', 'treatment', 'psychoeducation'],
            uploadDate: '2025-08-18T11:30:00Z',
            views: 53,
            shares: 18,
            favorited: false,
            file: 'understanding-depression.pdf',
            url: null
        },
        {
            id: '6',
            title: 'SADAG Website',
            description: 'South African Depression and Anxiety Group - Mental health resources and helplines.',
            type: 'link',
            audience: 'both',
            categories: ['crisis', 'support'],
            tags: ['helpline', 'resources', 'support'],
            uploadDate: '2025-08-22T13:10:00Z',
            views: 89,
            shares: 31,
            favorited: true,
            file: null,
            url: 'https://www.sadag.org'
        },
        {
            id: '7',
            title: 'CBT Thought Record Worksheet',
            description: 'Worksheet for clients to record and challenge negative thoughts.',
            type: 'pdf',
            audience: 'client',
            categories: ['cbt', 'worksheet'],
            tags: ['thoughts', 'challenge', 'exercise'],
            uploadDate: '2025-08-12T15:45:00Z',
            views: 76,
            shares: 27,
            favorited: true,
            file: 'cbt-worksheet.pdf',
            url: null
        },
        {
            id: '8',
            title: 'Trauma-Informed Care Principles',
            description: 'Video explaining the key principles of trauma-informed care.',
            type: 'video',
            audience: 'clinician',
            categories: ['trauma', 'education'],
            tags: ['principles', 'care', 'approach'],
            uploadDate: '2025-08-25T10:15:00Z',
            views: 31,
            shares: 9,
            favorited: false,
            file: null,
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
    ];
    
    // Apply filters and render
    filterResources();
    updateStats();
}

// Load patients data for sharing
function loadPatientsData() {
    // In a real application, this would be an API call
    // For demo purposes, we're using mock data
    const patients = [
        { id: '1', name: 'John Smith', avatar: 'JS' },
        { id: '2', name: 'Sarah Johnson', avatar: 'SJ' },
        { id: '3', name: 'Michael Brown', avatar: 'MB' },
        { id: '4', name: 'Emily Davis', avatar: 'ED' },
        { id: '5', name: 'David Wilson', avatar: 'DW' },
        { id: '6', name: 'Jennifer Taylor', avatar: 'JT' },
        { id: '7', name: 'Robert Anderson', avatar: 'RA' },
        { id: '8', name: 'Jessica Thomas', avatar: 'JT' }
    ];
    
    const patientsList = document.getElementById('patientsListShare');
    if (patientsList) {
        patientsList.innerHTML = '';
        
        patients.forEach(patient => {
            const patientItem = document.createElement('div');
            patientItem.className = 'patient-item-share';
            patientItem.innerHTML = `
                <input type="checkbox" id="patient-${patient.id}" value="${patient.id}">
                <div class="patient-avatar-share">${patient.avatar}</div>
                <label for="patient-${patient.id}" class="patient-name-share">${patient.name}</label>
            `;
            patientsList.appendChild(patientItem);
        });
    }
    
    // Also populate patient dropdown in task linking
    const taskPatientSelect = document.getElementById('taskPatient');
    if (taskPatientSelect) {
        // Clear existing options except the first one
        while (taskPatientSelect.options.length > 1) {
            taskPatientSelect.remove(1);
        }
        
        // Add patient options
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = patient.name;
            taskPatientSelect.appendChild(option);
        });
    }
}

// Generate a unique ID
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
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas ${icon} toast-icon"></i>
        <div class="toast-content">
            <h4 class="toast-title">${title}</h4>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.querySelector('.toast-container').appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
}

// Global functions for HTML onclick attributes
window.toggleFavorite = toggleFavorite;
window.openShareModal = openShareModal;
window.openLinkTaskModal = openLinkTaskModal;
window.openPreviewModal = openPreviewModal;
window.downloadResource = downloadResource;