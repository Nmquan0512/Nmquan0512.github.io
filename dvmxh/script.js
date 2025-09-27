// Sample data - trong thực tế sẽ lấy từ API
const sampleServices = [
    {
        "service": 1,
        "name": "Youtube views",
        "type": "Default",
        "category": "Youtube",
        "rate": "2.5",
        "min": "200",
        "max": "10000",
        "refill": true
    },
    {
        "service": 2,
        "name": "Facebook comments",
        "type": "Custom Comments",
        "category": "Facebook",
        "rate": "4",
        "min": "10",
        "max": "1500",
        "refill": false
    },
    {
        "service": 3,
        "name": "Instagram followers",
        "type": "Premium",
        "category": "Instagram",
        "rate": "8.5",
        "min": "100",
        "max": "50000",
        "refill": true
    },
    {
        "service": 4,
        "name": "TikTok likes",
        "type": "Default",
        "category": "TikTok",
        "rate": "1.2",
        "min": "50",
        "max": "25000",
        "refill": false
    },
    {
        "service": 5,
        "name": "Twitter retweets",
        "type": "Custom Comments",
        "category": "Twitter",
        "rate": "3.8",
        "min": "25",
        "max": "10000",
        "refill": true
    },
    {
        "service": 6,
        "name": "Youtube subscribers",
        "type": "Premium",
        "category": "Youtube",
        "rate": "12.5",
        "min": "10",
        "max": "5000",
        "refill": true
    },
    {
        "service": 7,
        "name": "Facebook page likes",
        "type": "Default",
        "category": "Facebook",
        "rate": "6.0",
        "min": "100",
        "max": "20000",
        "refill": false
    },
    {
        "service": 8,
        "name": "Instagram likes",
        "type": "Default",
        "category": "Instagram",
        "rate": "2.1",
        "min": "100",
        "max": "15000",
        "refill": true
    },
    {
        "service": 9,
        "name": "TikTok followers",
        "type": "Premium",
        "category": "TikTok",
        "rate": "15.0",
        "min": "50",
        "max": "10000",
        "refill": true
    },
    {
        "service": 10,
        "name": "Twitter followers",
        "type": "Premium",
        "category": "Twitter",
        "rate": "18.5",
        "min": "25",
        "max": "8000",
        "refill": false
    },
    {
        "service": 11,
        "name": "Youtube likes",
        "type": "Default",
        "category": "Youtube",
        "rate": "1.8",
        "min": "100",
        "max": "50000",
        "refill": true
    },
    {
        "service": 12,
        "name": "Facebook shares",
        "type": "Custom Comments",
        "category": "Facebook",
        "rate": "5.2",
        "min": "50",
        "max": "12000",
        "refill": false
    }
];

// API Configuration
const API_CONFIG = {
    url: 'https://smm1s.com/api/v2',
    key: '576c1b2c91732753ce0ed993e843d31a',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded'
};

// Global variables
let allServices = [...sampleServices];
let filteredServices = [...sampleServices];
let currentView = 'grid';

// DOM elements
const servicesList = document.getElementById('servicesList');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const typeFilter = document.getElementById('typeFilter');
const refillFilter = document.getElementById('refillFilter');
const rateFilter = document.getElementById('rateFilter');
const minFilter = document.getElementById('minFilter');
const maxFilter = document.getElementById('maxFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const loading = document.getElementById('loading');
const totalServicesEl = document.getElementById('totalServices');
const visibleServicesEl = document.getElementById('visibleServices');
const avgRateEl = document.getElementById('avgRate');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadServices();
});

function initializeApp() {
    // Hide loading initially
    loading.style.display = 'none';
    
    // Set initial view
    servicesList.classList.add('grid-view');
    gridViewBtn.classList.add('active');
}

function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    // Filter inputs
    categoryFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    refillFilter.addEventListener('change', applyFilters);
    rateFilter.addEventListener('input', debounce(applyFilters, 300));
    minFilter.addEventListener('input', debounce(applyFilters, 300));
    maxFilter.addEventListener('input', debounce(applyFilters, 300));
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // View controls
    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));
}

// Load services from API (currently using sample data)
async function loadServices() {
    try {
        loading.style.display = 'block';
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real implementation, this would be:
        // const response = await fetch(`${API_CONFIG.url}/services`, {
        //     method: API_CONFIG.method,
        //     headers: {
        //         'Content-Type': API_CONFIG.contentType,
        //         'Authorization': `Bearer ${API_CONFIG.key}`
        //     }
        // });
        // const data = await response.json();
        // allServices = data.services || [];
        
        allServices = [...sampleServices];
        filteredServices = [...allServices];
        
        renderServices();
        updateStats();
        
    } catch (error) {
        console.error('Error loading services:', error);
        showError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
    } finally {
        loading.style.display = 'none';
    }
}

// Apply filters to services
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const type = typeFilter.value;
    const refill = refillFilter.value;
    const maxRate = parseFloat(rateFilter.value) || Infinity;
    const maxMin = parseInt(minFilter.value) || Infinity;
    const maxMax = parseInt(maxFilter.value) || Infinity;
    
    filteredServices = allServices.filter(service => {
        // Search filter
        if (searchTerm && !service.name.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Category filter
        if (category && service.category !== category) {
            return false;
        }
        
        // Type filter
        if (type && service.type !== type) {
            return false;
        }
        
        // Refill filter
        if (refill && service.refill.toString() !== refill) {
            return false;
        }
        
        // Rate filter (less than or equal to max rate)
        if (parseFloat(service.rate) > maxRate) {
            return false;
        }
        
        // Min filter (less than or equal to max min)
        if (parseInt(service.min) > maxMin) {
            return false;
        }
        
        // Max filter (less than or equal to max max)
        if (parseInt(service.max) > maxMax) {
            return false;
        }
        
        return true;
    });
    
    renderServices();
    updateStats();
}

// Clear all filters
function clearAllFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    typeFilter.value = '';
    refillFilter.value = '';
    rateFilter.value = '';
    minFilter.value = '';
    maxFilter.value = '';
    
    applyFilters();
}

// Switch between grid and list view
function switchView(view) {
    currentView = view;
    
    if (view === 'grid') {
        servicesList.classList.remove('list-view');
        servicesList.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        servicesList.classList.remove('grid-view');
        servicesList.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }
    
    renderServices();
}

// Render services to DOM
function renderServices() {
    if (filteredServices.length === 0) {
        servicesList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Không tìm thấy dịch vụ nào</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
        `;
        return;
    }
    
    const servicesHTML = filteredServices.map(service => createServiceCard(service)).join('');
    servicesList.innerHTML = servicesHTML;
}

// Create service card HTML
function createServiceCard(service) {
    const isListView = currentView === 'list';
    
    return `
        <div class="service-card ${isListView ? 'list-view' : ''}">
            <div class="service-id">#${service.service}</div>
            <div class="service-info">
                <h3 class="service-name">${service.name}</h3>
                <div class="service-badges">
                    <span class="service-type">${service.type}</span>
                    <span class="service-category">${service.category}</span>
                </div>
                <div class="service-rate">${service.rate}</div>
                <div class="service-range">Min: ${parseInt(service.min).toLocaleString()} - Max: ${parseInt(service.max).toLocaleString()}</div>
                <div class="service-meta">
                    <div class="service-meta-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Giá: $${service.rate}</span>
                    </div>
                    <div class="service-meta-item">
                        <i class="fas fa-arrow-up"></i>
                        <span>Từ ${parseInt(service.min).toLocaleString()}</span>
                    </div>
                    <div class="service-meta-item">
                        <i class="fas fa-arrow-down"></i>
                        <span>Đến ${parseInt(service.max).toLocaleString()}</span>
                    </div>
                </div>
                <div class="refill-badge ${service.refill}">
                    <i class="fas ${service.refill ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <span>${service.refill ? 'Có refill' : 'Không refill'}</span>
                </div>
            </div>
        </div>
    `;
}

// Update statistics
function updateStats() {
    const total = allServices.length;
    const visible = filteredServices.length;
    const avgRate = filteredServices.length > 0 
        ? (filteredServices.reduce((sum, service) => sum + parseFloat(service.rate), 0) / filteredServices.length).toFixed(2)
        : 0;
    
    totalServicesEl.textContent = total;
    visibleServicesEl.textContent = visible;
    avgRateEl.textContent = avgRate;
}

// Show error message
function showError(message) {
    servicesList.innerHTML = `
        <div class="no-results">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Lỗi</h3>
            <p>${message}</p>
        </div>
    `;
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential external use
window.APIUtils = {
    loadServices,
    applyFilters,
    clearAllFilters,
    switchView,
    getFilteredServices: () => filteredServices,
    getAllServices: () => allServices,
    getAPIConfig: () => API_CONFIG
};
