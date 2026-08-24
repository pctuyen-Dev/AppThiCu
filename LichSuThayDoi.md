# Lịch Sử Thay Đổi & Quy Tắc Dự Án

> [!IMPORTANT]
> Đây là file theo dõi lịch sử chỉnh sửa, thay đổi logic, cùng các nguyên tắc phát triển chung của toàn bộ dự án.

---

## 📌 Quy Tắc Phát Triển Dự Án

1. **Cấu Trúc Directory Rõ Ràng**:
   - Giao diện UI nằm trong thư mục `frontend` (hoặc `client`).
   - Xử lý logic/API/CSDL nằm trong thư mục `backend`.

2. **Gom File & Hạn Chế Chia Nhỏ (Tránh Vibe Code Quá Nhiều File)**:
   - Không vibe code tạo ra quá nhiều file nhỏ lẻ không cần thiết.
   - Nếu các phần code, component hoặc helper có **cùng chức năng** hoặc thuộc **cùng giao diện/màn hình**, nên đặt chung trong một file để tránh làm phình số lượng file dự án.

3. **Số Lượng & Quy Tắc Đặt Tên (File, Hàm, Biến)**:
   - Tên file đặt theo **Tiếng Việt viết hoa chữ cái đầu** (PascalCase), ví dụ: `TrangChu.tsx`, `QuanLyNguoiDung.ts`.
   - **Tên hàm và biến**: **Hạn chế tối đa đặt bằng Tiếng Anh** để tránh gây khó hiểu khi đọc lại code. Bắt buộc ưu tiên đặt tên hàm và biến bằng **Tiếng Việt rõ nghĩa** (ví dụ: `danhSachSinhVien`, `layThongTinPhongThi`, `trangThaiDangNhap`). Chỉ dùng Tiếng Anh cho các biến kỹ thuật/API hệ thống bắt buộc của thư viện (ví dụ: `req`, `res`, `token`, `id`).

4. **Ghi Chú Code (Comments bằng Tiếng Việt)**:
   - Tất cả ghi chú/comment giải thích trong code **nên được viết bằng Tiếng Việt** (có thể giữ lại một số từ/thuật ngữ Tiếng Anh thông dụng hoặc kỹ thuật).
   - Thêm ghi chú/comment đủ chi tiết cho logic, hàm, component để dễ đọc và dễ bảo trì.

5. **Cấu Trúc Kiểm Thử (Test)**:
   - Tất cả các test nằm trong thư mục gốc `Test/` (tách biệt khỏi `frontend` và `backend`).
   - Chia thành các thư mục con: `Test/Frontend`, `Test/Backend`,...

6. **Lịch Sử Thay Đổi & Ghi Chú Nổi Bật**:
   - Ghi nhận đầy đủ thay đổi trong file lịch sử (`LichSuThayDoi.md`).
   - Làm nổi bật (highlight) các câu lệnh CLI, cấu hình hoặc lưu ý quan trọng.

---

## 🕒 Lịch Sử Chỉnh Sửa

### [2026-08-24] Siết Chặt Quy Tắc Đặt Tên Biến & Hàm (Ưu Tiên Tiếng Việt)
- **Nội dung**: Hạn chế tối đa việc đặt tên hàm và biến bằng Tiếng Anh (tránh đọc lại không hiểu), bắt buộc chuyển sang đặt bằng Tiếng Việt rõ nghĩa.
- **Tác vụ**: Cập nhật `LichSuThayDoi.md` và `.agents/rules/quy_tac_du_an.md`.

### [2026-08-24] Bổ Sung Nguyên Tắc Ghi Chú & Quản Lý File
- **Nội dung**:
  1. Ghi chú/comment trong code nên là Tiếng Việt (được dùng một số từ Tiếng Anh hay gặp/chuyên ngành).
  2. Hạn chế vibe code tách ra quá nhiều file nhỏ lẻ; các thành phần cùng chức năng hoặc giao diện nên gom chung file.
- **Tác vụ**: Cập nhật file `LichSuThayDoi.md`.

### [2026-08-24] Cập nhật Quy tắc Đặt tên Hàm/Biến
- **Nội dung**: Bổ sung quy tắc đặt tên hàm và biến ưu tiên bằng Tiếng Việt (ví dụ: `layDanhSachSinhVien`), cho phép dùng Tiếng Anh đối với các thuật ngữ chuyên ngành / kỹ thuật thông dụng.
- **Tác vụ**: Cập nhật file `LichSuThayDoi.md`.

### [2026-08-24] Khởi tạo Nguyên tắc Dự án
- **Nội dung**: Thiết lập file lưu trữ lịch sử thay đổi `LichSuThayDoi.md` và xác nhận 5 quy tắc phát triển cốt lõi từ người dùng.
- **Tác vụ**: Sẵn sàng tiếp nhận yêu cầu phát triển tiếp theo theo đúng tiêu chuẩn đã thỏa thuận.
