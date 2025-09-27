# API Management System

Hệ thống quản lý dịch vụ API với khả năng lọc và tìm kiếm mạnh mẽ.

## Tính năng chính

### 🔍 Tìm kiếm và Lọc
- **Tìm kiếm theo tên**: Tìm kiếm nhanh theo tên dịch vụ
- **Lọc theo danh mục**: Youtube, Facebook, Instagram, TikTok, Twitter
- **Lọc theo loại**: Default, Custom Comments, Premium
- **Lọc theo Refill**: Có/Không có refill
- **Lọc theo giá**: Giá tối đa
- **Lọc theo số lượng**: Min/Max tối đa

### 📊 Thống kê
- Tổng số dịch vụ
- Số dịch vụ đang hiển thị
- Giá trung bình

### 👁️ Giao diện
- **Chế độ lưới**: Hiển thị dạng card
- **Chế độ danh sách**: Hiển thị dạng bảng
- **Responsive**: Tương thích mobile
- **Dark theme**: Giao diện đẹp mắt

## Cấu trúc dữ liệu

Mỗi dịch vụ có cấu trúc:
```json
{
    "service": 1,
    "name": "Youtube views",
    "type": "Default",
    "category": "Youtube",
    "rate": "2.5",
    "min": "200",
    "max": "10000",
    "refill": true
}
```

### Giải thích các trường:
- **service**: ID dịch vụ
- **name**: Tên dịch vụ
- **type**: Loại dịch vụ (Default, Custom Comments, Premium)
- **category**: Danh mục (Youtube, Facebook, Instagram, TikTok, Twitter)
- **rate**: Giá dịch vụ (USD)
- **min**: Số lượng tăng tối thiểu
- **max**: Số lượng tăng tối đa
- **refill**: Có refill hay không (true/false)

## Cấu hình API

```javascript
const API_CONFIG = {
    url: 'https://smm1s.com/api/v2',
    key: '576c1b2c91732753ce0ed993e843d31a',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded'
};
```

## Cách sử dụng

1. **Mở file `index.html`** trong trình duyệt
2. **Tìm kiếm**: Nhập từ khóa vào ô tìm kiếm
3. **Lọc**: Sử dụng các dropdown và input để lọc
4. **Xem thống kê**: Thống kê được cập nhật tự động
5. **Chuyển đổi chế độ xem**: Sử dụng nút Grid/List

## API Functions

Có thể sử dụng các function JavaScript:

```javascript
// Lấy danh sách dịch vụ đã lọc
APIUtils.getFilteredServices()

// Lấy tất cả dịch vụ
APIUtils.getAllServices()

// Áp dụng bộ lọc
APIUtils.applyFilters()

// Xóa tất cả bộ lọc
APIUtils.clearAllFilters()

// Chuyển đổi chế độ xem
APIUtils.switchView('grid') // hoặc 'list'

// Tải lại dịch vụ từ API
APIUtils.loadServices()

// Lấy cấu hình API
APIUtils.getAPIConfig()
```

## Tùy chỉnh

### Thêm dịch vụ mới
Chỉnh sửa array `sampleServices` trong file `script.js`:

```javascript
{
    "service": 13,
    "name": "Dịch vụ mới",
    "type": "Default",
    "category": "Instagram",
    "rate": "5.0",
    "min": "100",
    "max": "20000",
    "refill": true
}
```

### Thêm danh mục mới
Cập nhật dropdown trong file `index.html`:

```html
<option value="DanhMucMoi">Danh Mục Mới</option>
```

### Kết nối API thực
Thay thế function `loadServices()` trong `script.js`:

```javascript
async function loadServices() {
    try {
        const response = await fetch(`${API_CONFIG.url}/services`, {
            method: API_CONFIG.method,
            headers: {
                'Content-Type': API_CONFIG.contentType,
                'Authorization': `Bearer ${API_CONFIG.key}`
            }
        });
        const data = await response.json();
        allServices = data.services || [];
        filteredServices = [...allServices];
        renderServices();
        updateStats();
    } catch (error) {
        console.error('Error loading services:', error);
    }
}
```

## Yêu cầu hệ thống

- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Kết nối internet (cho Font Awesome icons)

## License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.
