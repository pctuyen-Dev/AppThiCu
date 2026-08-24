# Lịch Sử Thay Đổi & Quy Tắc Dự Án

> [!IMPORTANT]
> Đây là file theo dõi lịch sử chỉnh sửa, thay đổi logic, cùng các nguyên tắc phát triển chung của toàn bộ dự án.

---

## 📌 Quy Tắc Phát Triển Dự Án

1. **Cấu Trúc Directory Rõ Ràng**:
   - Giao diện UI nằm trong thư mục `frontend` (hoặc `client`).
   - Xử lý logic/API/CSDL nằm trong thư mục `backend`.

2. **Số Lượng & Quy Tắc Đặt Tên (File, Hàm, Biến)**:
   - Cân bằng số lượng file: không xao nhãng bởi quá nhiều file nhỏ lẻ, không gom quá nhiều code vào 1 file duy nhất.
   - Tên file đặt theo **Tiếng Việt viết hoa chữ cái đầu** (PascalCase), ví dụ: `TrangChu.tsx`, `QuanLyNguoiDung.ts`.
   - **Tên hàm và biến**: Nếu có thể nên đặt bằng Tiếng Việt (ví dụ: `layDanhSachSinhVien`, `danhSachThiSinh`), các thuật ngữ chuyên ngành hoặc thuật ngữ thông dụng vẫn có thể giữ Tiếng Anh để dễ hiểu (ví dụ: `render`, `fetchData`, `token`, `id`, `req`, `res`).

3. **Cấu Trúc Kiểm Thử (Test)**:
   - Tất cả các test nằm trong thư mục gốc `Test/` (tách biệt khỏi `frontend` và `backend`).
   - Chia thành các thư mục con: `Test/Frontend`, `Test/Backend`,...

4. **Ghi Chú Code (Comments)**:
   - Thêm ghi chú/comment đủ chi tiết cho logic, hàm, component để dễ đọc và dễ bảo trì sau này.

5. **Lịch Sử Thay Đổi & Ghi Chú Nổi Bật**:
   - Ghi nhận đầy đủ thay đổi trong file lịch sử (`LichSuThayDoi.md`).
   - Làm nổi bật (highlight) các câu lệnh CLI, cấu hình hoặc lưu ý quan trọng.

---

## 🕒 Lịch Sử Chỉnh Sửa

### [2026-08-24] Cập nhật Quy tắc Đặt tên Hàm/Biến
- **Nội dung**: Bổ sung quy tắc đặt tên hàm và biến ưu tiên bằng Tiếng Việt (ví dụ: `layDanhSachSinhVien`), cho phép dùng Tiếng Anh đối với các thuật ngữ chuyên ngành / kỹ thuật thông dụng.
- **Tác vụ**: Cập nhật file `LichSuThayDoi.md`.

### [2026-08-24] Khởi tạo Nguyên tắc Dự án
- **Nội dung**: Thiết lập file lưu trữ lịch sử thay đổi `LichSuThayDoi.md` và xác nhận 5 quy tắc phát triển cốt lõi từ người dùng.
- **Tác vụ**: Sẵn sàng tiếp nhận yêu cầu phát triển tiếp theo theo đúng tiêu chuẩn đã thỏa thuận.
