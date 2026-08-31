# Ultra-Stealth Privacy Shield v9.0 Ultimate Fortress Edition

![Version](https://img.shields.io/badge/version-9.0.0-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![Author](https://img.shields.io/badge/author-tiennguyen2306azz--netizen-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

**Ultra-Stealth Privacy Shield** là tiện ích mở rộng Chrome (Manifest V3) bảo vệ ẩn danh toàn diện, chống theo dõi vết phần cứng (Browser Fingerprinting), rò rỉ IP (WebRTC STUN/TURN) và tự động tích hợp định tuyến Tor SOCKS5 Proxy.

---

## 🌟 Tính Năng Nổi Bật

- 🌐 **Auto Tor SOCKS5 Proxy Integration (`127.0.0.1:9150`)**: Tự động ép toàn bộ luồng kết nối Chrome đổi sang địa chỉ IP Tor Quốc Tế.
- 🔒 **WebRTC STUN/TURN Hard Block**: Triệt tiêu rủi ro đào IP gốc qua WebRTC.
- 🎨 **WebGL & WebGL2 Buffer Noise Engine**: Làm nhiễu hàm `readPixels` và giả lập Card màn hình GPU thành `NVIDIA GeForce RTX 3060`.
- 🎨 **Canvas Subpixel Jitter**: Chèn nhiễu subpixel vào `toDataURL` & `getImageData` làm thay đổi chữ ký Canvas Hash theo từng phiên.
- 🔊 **AudioContext & Speech Synthesis Noise**: Làm nhiễu mẫu tần số âm thanh và giả lập vô hiệu hóa danh sách giọng nói `speechSynthesis`.
- 🎥 **MediaDevices Hardware Spoofing**: Giả lập danh sách Webcam HD & Microphone để vượt qua các thuật toán kiểm tra Anti-Bot.
- 🌐 **Timezone & Locale Synchronization**: Tự động đồng bộ múi giờ sang `America/New_York` (UTC-5) và ngôn ngữ `en-US`.
- 🛡️ **DoNotTrack & GlobalPrivacyControl Headers**: Tự động gửi các tiêu đề từ chối bị theo dõi tới mọi trang web.

---

## 📦 Hướng Dẫn Cài Đặt

1. Tải repository này về máy hoặc clone qua Git:
   ```bash
   git clone https://github.com/tiennguyen2306azz-netizen/ultra-stealth-extension.git
   ```
2. Mở trình duyệt Chrome / Edge ➔ Truy cập `chrome://extensions` (hoặc `edge://extensions`).
3. Bật công tắc **Developer mode** ở góc trên bên phải.
4. Nhấn nút **Load unpacked** (Tải tiện ích đã giải nén).
5. Chọn thư mục dự án `ultra-stealth-extension`.

---

## 🚀 Push Lên GitHub

```bash
git push -u origin main
```

---

## 📄 Giấy Phép (License)

Phát triển bởi **tiennguyen2306azz-netizen** dưới giấy phép [MIT License](LICENSE).
