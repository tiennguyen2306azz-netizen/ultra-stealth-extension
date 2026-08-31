# Ultra-Stealth Privacy Shield v11.0 Quantum Apex Edition

![Version](https://img.shields.io/badge/version-11.0.0-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![Author](https://img.shields.io/badge/author-TienNguyen%20Hacker-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

**Ultra-Stealth Privacy Shield** là tiện ích mở rộng Chrome (Manifest V3) bảo vệ ẩn danh toàn diện, chống theo dõi vết phần cứng (Browser Fingerprinting), rò rỉ IP (WebRTC STUN/TURN) và tự động tích hợp định tuyến Tor SOCKS5 Proxy.

---

## 🌟 Tính Năng Nổi Bật v11.0 Quantum Apex

- 🌐 **Auto Tor SOCKS5 Proxy Integration (`127.0.0.1:9150`)**: Tự động ép toàn bộ luồng kết nối Chrome đổi sang địa chỉ IP Tor Quốc Tế.
- 🔒 **WebRTC STUN/TURN Hard Block**: Triệt tiêu rủi ro đào IP gốc qua WebRTC.
- 🛡️ **Native Function Masking (`[native code]`)**: Ngụy trang mã nguồn JavaScript đã can thiệp, bypass 100% các công cụ quét Anti-Bot (CreepJS, FingerprintJS v4).
- 🌐 **Domain-Isolated Fingerprinting**: Mỗi tên miền website nhận một chữ ký vân tay hoàn toàn riêng biệt, chặn đứng Cross-Site Tracking.
- 🔤 **Font Enumeration Shield**: Chặn đứng các kỹ thuật quét danh sách Font chữ cài trong máy Windows.
- 🎨 **WebGL & WebGL2 Buffer Noise Engine**: Làm nhiễu hàm `readPixels` và giả lập Card màn hình GPU thành `NVIDIA GeForce RTX 3060`.
- 🎨 **Canvas Subpixel Jitter & OffscreenCanvas Shield**: Chèn nhiễu subpixel vào Canvas và OffscreenCanvas Worker Threads.
- 🔊 **AudioContext & Speech Synthesis Noise**: Làm nhiễu mẫu tần số âm thanh và giả lập vô hiệu hóa danh sách giọng nói `speechSynthesis`.
- ⏱️ **Performance Timing Jitter**: Bơm nhiễu micro-float vào `performance.now()` chặn đứng Side-Channel Attacks.
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

## 📄 Giấy Phép (License)

Phát triển bởi **TienNguyen Hacker** dưới giấy phép [MIT License](LICENSE).
