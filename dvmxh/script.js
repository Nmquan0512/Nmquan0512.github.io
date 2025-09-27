// Sample data - đã xóa để test API thực
const sampleServices = [];

// API Configuration
const API_CONFIG = {
    url: 'https://smm1s.com/api/v2',
    key: '576c1b2c91732753ce0ed993e843d31a',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded'
};

// Global variables
let allServices = [];
let filteredServices = [];
let currentView = 'grid';
let usdToVndRate = 27000; // Tỷ giá USD to VNĐ (có thể cập nhật từ API)
let showCurrency = 'USD'; // 'USD' hoặc 'VND'

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
const toggleCurrencyBtn = document.getElementById('toggleCurrency');
const currencyTextEl = document.getElementById('currencyText');
const exchangeRateEl = document.getElementById('exchangeRate');

// Currency conversion functions
function convertUSDToVND(usdAmount) {
    return Math.round(parseFloat(usdAmount) * usdToVndRate);
}

function formatCurrency(amount, currency = showCurrency) {
    const numAmount = parseFloat(amount);
    // Thêm markup 25% cho giá
    const markupAmount = numAmount * 1.25;
    
    console.log(`💱 FormatCurrency: ${numAmount} → ${markupAmount} (markup 25%)`);
    
    if (currency === 'VND') {
        const vndAmount = convertUSDToVND(markupAmount);
        // Làm tròn VND (bỏ phần thập phân)
        const roundedVnd = Math.round(vndAmount);
        console.log(`🇻🇳 VND: ${markupAmount} USD × ${usdToVndRate} = ${vndAmount} → ${roundedVnd} ₫`);
        return roundedVnd.toLocaleString('vi-VN') + ' ₫';
    } else {
        console.log(`🇺🇸 USD: $${markupAmount.toFixed(2)}`);
        return '$' + markupAmount.toFixed(2);
    }
}

// Function để lấy giá gốc (không markup) - dùng cho thống kê
function getOriginalPrice(amount) {
    return parseFloat(amount);
}

// Function để lấy giá có markup
function getMarkupPrice(amount) {
    return parseFloat(amount) * 1.25;
}

function getCurrencySymbol(currency = showCurrency) {
    return currency === 'VND' ? '₫' : '$';
}

// Load exchange rate from API (optional)
async function loadExchangeRate() {
    try {
        // Có thể sử dụng API tỷ giá thực tế
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data = await response.json();
        // usdToVndRate = data.rates.VND;
        
        // Hiện tại sử dụng tỷ giá cố định
        usdToVndRate = 27000;
        console.log('Tỷ giá USD/VNĐ:', usdToVndRate);
        
        // Cập nhật hiển thị tỷ giá
        updateExchangeRateDisplay();
    } catch (error) {
        console.warn('Không thể cập nhật tỷ giá, sử dụng tỷ giá mặc định:', usdToVndRate);
    }
}

// Update exchange rate display
function updateExchangeRateDisplay() {
    if (exchangeRateEl) {
        exchangeRateEl.textContent = `1 USD = ${usdToVndRate.toLocaleString('vi-VN')} ₫`;
        console.log('🔄 Cập nhật hiển thị tỷ giá:', exchangeRateEl.textContent);
    }
}

// Force refresh để clear cache
function forceRefresh() {
    console.log('🔄 Force refresh - Clear cache...');
    // Clear localStorage
    localStorage.clear();
    // Reload page
    window.location.reload(true);
}

// Update category and type dropdowns from API data
function updateCategoryDropdowns() {
    if (allServices.length === 0) return;
    
    // Get unique categories and types
    const categories = [...new Set(allServices.map(s => s.category).filter(Boolean))];
    const types = [...new Set(allServices.map(s => s.type).filter(Boolean))];
    
    // Update category dropdown
    if (categoryFilter) {
        const currentValue = categoryFilter.value;
        categoryFilter.innerHTML = '<option value="">Tất cả</option>';
        
        categories.sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            if (category === currentValue) option.selected = true;
            categoryFilter.appendChild(option);
        });
    }
    
    // Update type dropdown
    if (typeFilter) {
        const currentValue = typeFilter.value;
        typeFilter.innerHTML = '<option value="">Tất cả</option>';
        
        types.sort().forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            if (type === currentValue) option.selected = true;
            typeFilter.appendChild(option);
        });
    }
    
    console.log('Đã cập nhật dropdown với', categories.length, 'danh mục và', types.length, 'loại');
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Khởi tạo ứng dụng...');
    console.log('💰 Tỷ giá ban đầu:', usdToVndRate);
    
    loadCurrencyPreference();
    initializeApp();
    setupEventListeners();
    loadExchangeRate();
    loadServices();
});

function initializeApp() {
    // Hide loading initially
    loading.style.display = 'none';
    
    // Set initial view
    servicesList.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    
    // Update currency button text
    updateCurrencyButton();
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
    
    // Currency toggle
    toggleCurrencyBtn.addEventListener('click', toggleCurrency);
}

// Load services from real API
async function loadServices() {
    try {
        loading.style.display = 'block';
        
        // Tạo form data cho API request
        const formData = new FormData();
        formData.append('key', API_CONFIG.key);
        formData.append('action', 'services');
        
        // Gọi API thực
        const response = await fetch(API_CONFIG.url, {
            method: API_CONFIG.method,
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Kiểm tra response có hợp lệ không
        if (data && Array.isArray(data)) {
            allServices = data;
            console.log('API trả về', data.length, 'dịch vụ');
            
            // Debug: Log cấu trúc dữ liệu mẫu
            if (data.length > 0) {
                console.log('Cấu trúc dịch vụ đầu tiên:', data[0]);
                console.log('Các danh mục có sẵn:', [...new Set(data.map(s => s.category))]);
                console.log('Các loại có sẵn:', [...new Set(data.map(s => s.type))]);
            }
        } else {
            console.warn('API response không đúng định dạng:', data);
            allServices = [];
        }
        
        filteredServices = [...allServices];
        
        updateCategoryDropdowns();
        renderServices();
        updateStats();
        
        console.log('Đã tải thành công', allServices.length, 'dịch vụ từ API');
        
    } catch (error) {
        console.error('Error loading services from API:', error);
        console.log('Sử dụng dữ liệu mẫu thay thế');
        
        // Không có dữ liệu mẫu fallback
        allServices = [];
        filteredServices = [];
        
        renderServices();
        updateStats();
        
        showError(`Không thể kết nối API: ${error.message}. Vui lòng kiểm tra kết nối mạng và thử lại.`);
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
        
        // Rate filter (less than or equal to max rate) - sử dụng giá có markup
        if (getMarkupPrice(service.rate) > maxRate) {
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
                <div class="service-rate">${formatCurrency(service.rate)}</div>
                <div class="service-range">Min: ${parseInt(service.min).toLocaleString()} - Max: ${parseInt(service.max).toLocaleString()}</div>
                <div class="service-meta">
                    <div class="service-meta-item">
                        <i class="fas ${showCurrency === 'VND' ? 'fa-dong-sign' : 'fa-dollar-sign'}"></i>
                        <span class="price-text">Giá: ${formatCurrency(service.rate)}</span>
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
    
    // Tính giá trung bình có markup
    const avgRateUSD = filteredServices.length > 0 
        ? (filteredServices.reduce((sum, service) => sum + getMarkupPrice(service.rate), 0) / filteredServices.length).toFixed(2)
        : 0;
    
    totalServicesEl.textContent = total;
    visibleServicesEl.textContent = visible;
    
    // Hiển thị giá trung bình theo đơn vị tiền tệ hiện tại
    const avgRateText = showCurrency === 'VND' 
        ? formatCurrency(avgRateUSD, 'VND') 
        : '$' + avgRateUSD;
    avgRateEl.innerHTML = avgRateText;
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

// Toggle currency display
function toggleCurrency() {
    showCurrency = showCurrency === 'USD' ? 'VND' : 'USD';
    renderServices();
    updateStats();
    updateCurrencyButton();
    
    // Lưu preference vào localStorage
    localStorage.setItem('preferredCurrency', showCurrency);
    
    console.log('Chuyển đổi hiển thị tiền tệ sang:', showCurrency);
}

// Update currency button text
function updateCurrencyButton() {
    if (currencyTextEl) {
        currencyTextEl.textContent = showCurrency === 'USD' ? 'VND → USD' : 'USD → VND';
    }
}

// Load currency preference from localStorage
function loadCurrencyPreference() {
    const saved = localStorage.getItem('preferredCurrency');
    if (saved && (saved === 'USD' || saved === 'VND')) {
        showCurrency = saved;
    }
}

// Export functions for potential external use
window.APIUtils = {
    loadServices,
    applyFilters,
    clearAllFilters,
    switchView,
    toggleCurrency,
    formatCurrency,
    convertUSDToVND,
    getMarkupPrice,
    getOriginalPrice,
    updateCategoryDropdowns,
    forceRefresh,
    getFilteredServices: () => filteredServices,
    getAllServices: () => allServices,
    getAPIConfig: () => API_CONFIG,
    getCurrentCurrency: () => showCurrency,
    getExchangeRate: () => usdToVndRate
};

// Make forceRefresh available globally
window.forceRefresh = forceRefresh;
