# Quy Tắc Phát Triển Dự Án

1. **Đặt Tên Hàm & Biến (Ưu Tiên Tiếng Việt, Hạn Chế Tối Đa Tiếng Anh)**:
   - **Hạn chế tối đa việc đặt tên biến và hàm bằng Tiếng Anh** vì gây khó hiểu khi đọc lại.
   - Bắt buộc/ưu tiên đặt tên biến, hàm bằng **Tiếng Việt rõ nghĩa** (ví dụ: `danhSachSinhVien`, `layThongTinPhongThi`, `trangThaiDangNhap`).
   - Chỉ dùng Tiếng Anh cho các biến kỹ thuật/API hệ thống bắt buộc của thư viện hoặc mặc định (ví dụ: `req`, `res`, `token`, `id`).

2. **Ghi Chú Code (Comments)**:
   - Các ghi chú/comment trong code bắt buộc/ưu tiên viết bằng Tiếng Việt.
   - Cho phép giữ lại các thuật ngữ Tiếng Anh thông dụng hoặc kỹ thuật (ví dụ: `render`, `fetchData`, `state`, `props`, `API`, `token`, `id`, `req`, `res`).

3. **Quản Lý File (Không Vibe Code Tách File Tràn Lan)**:
   - Hạn chế tách ra quá nhiều file nhỏ lẻ không cần thiết.
   - Nếu các component, helper, hoặc logic có **cùng chức năng** hoặc thuộc **cùng giao diện/màn hình**, phải gom chung trong một file để giữ cho dự án gọn gàng, tránh phình số lượng file.

4. **Cấu Trúc Directory & Đặt Tên File**:
   - Giao diện UI nằm trong thư mục `frontend` (hoặc `client`), backend nằm trong `backend`.
   - Tên file đặt theo Tiếng Việt viết hoa chữ cái đầu (PascalCase), ví dụ: `TrangChu.tsx`, `QuanLyNguoiDung.ts`.
