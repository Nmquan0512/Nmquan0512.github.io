# Locket Gold IPA Download Page

Trang web tải ứng dụng IPA với giao diện đẹp, thân thiện người dùng và hỗ trợ cài đặt trực tiếp trên iOS.

## 🌟 Tính năng

- ✅ Giao diện đẹp mắt với theme dark và accent xanh lá
- ✅ Responsive design, tối ưu cho mọi thiết bị
- ✅ Phát hiện thiết bị tự động (iOS, Android, Windows, Mac)
- ✅ Copy link nhanh chóng với một click
- ✅ Cài đặt IPA trực tiếp trên iOS thông qua manifest.plist
- ✅ Thống kê lượt tải và lượt xem real-time
- ✅ Animation mượt mà và hiệu ứng đẹp
- ✅ Toast notification thông báo
- ✅ Loading overlay khi tải xuống

## 📁 Cấu trúc file

```
LocketNmquan/
├── index.html          # Trang chủ
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── manifest.plist      # File manifest cho cài đặt IPA
└── README.md           # Hướng dẫn sử dụng
```

## 🚀 Cách sử dụng

### 1. Upload lên server
- Upload tất cả file lên web server của bạn
- Đảm bảo server hỗ trợ HTTPS (bắt buộc cho iOS)

### 2. Cấu hình manifest.plist
Chỉnh sửa file `manifest.plist`:
- Thay đổi URL IPA file: `https://ipa.idapple.vn/app/2vdmh4/LocketGold.ipa`
- Cập nhật bundle identifier: `com.dvsteam.locketgold`
- Thay đổi icon URLs nếu cần

### 3. Cập nhật JavaScript
Trong file `script.js`, tìm dòng:
```javascript
window.location.href = 'itms-services://?action=download-manifest&url=https://your-domain.com/manifest.plist';
```
Thay `https://your-domain.com` bằng domain thực của bạn.

## 🔧 Tùy chỉnh

### Thay đổi thông tin app
Trong `index.html`:
- Tên app: `<h1 class="app-title">Locket Gold Hạ Cấp © DVSTEAM.VN</h1>`
- Version: `<p class="app-version">Phiên bản v2.8.0</p>`
- Download link: `value="https://ipa.idapple.vn/app/2vdmh4"`

### Thay đổi màu sắc
Trong `styles.css`, tìm các biến màu:
- Màu chính: `#00ff00` (xanh lá)
- Màu vàng: `#FFD700` (icon background)
- Background: `#1a1a1a` (dark theme)

### Thay đổi số liệu thống kê
Trong `script.js`:
```javascript
const installCount = document.getElementById('installCount');
installCount.textContent = '5,620'; // Thay đổi số lượt cài đặt

const viewCount = document.getElementById('viewCount');
viewCount.textContent = '8,214'; // Thay đổi số lượt xem
```

## 📱 Hỗ trợ thiết bị

- ✅ iPhone (iOS 12+)
- ✅ iPad (iOS 12+)
- ✅ Android (hiển thị thông báo)
- ✅ Desktop (hiển thị thông báo)

## 🛠️ Yêu cầu kỹ thuật

- Web server hỗ trợ HTTPS
- File IPA hợp lệ đã được ký
- Bundle identifier chính xác
- Manifest.plist đúng định dạng

## 🔒 Bảo mật

- Sử dụng HTTPS bắt buộc
- Validate file IPA trước khi deploy
- Kiểm tra bundle identifier
- Cập nhật manifest.plist thường xuyên

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser để xem lỗi
2. Đảm bảo HTTPS được bật
3. Verify manifest.plist format
4. Test trên thiết bị iOS thực

## 📄 License

© 2025 DVSTEAM.VN - All rights reserved

---

**Lưu ý**: Đây là trang web demo. Trong môi trường production, hãy đảm bảo:
- Sử dụng IPA file hợp lệ
- Có chứng chỉ developer hợp lệ
- Tuân thủ quy định của Apple
- Backup dữ liệu thường xuyên
