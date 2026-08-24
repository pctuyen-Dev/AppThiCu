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

### [2026-08-24] Xây Dựng Frontend Hoàn Chỉnh Ứng Dụng Thi Cử UNETI EXAM
- **Nội dung**: Xây dựng toàn bộ giao diện ứng dụng thi cử desktop phong cách Modern Academic Desktop UI cho 3 vai trò ADMIN, GIẢNG VIÊN, SINH VIÊN.
  1. Thừa hưởng hệ thống thiết kế Light & Dark Mode (`index.css` & `ContextGiaoDien.tsx`).
  2. Phân hệ Admin: Dashboard chỉ số, Quản lý người dùng (Drawer phân quyền 8 checkboxes, Modal Thêm tài khoản, Excel Import Wizard 4 bước), Quản lý dữ liệu file/đồng bộ Cloud, Cài đặt hệ thống & Trọng số độ trễ latency.
  3. Phân hệ Giảng viên: Dashboard, Quản lý thi cử & phòng thi, Wizard Tạo đề (Trắc nghiệm/Tự luận/Kết hợp), Màn hình Giám sát thi Focus Mode (bảng sinh viên online/offline realtime, 5 stat cards, đếm ngược), Chấm bài 2 cột (xem bài nộp & chấm điểm).
  4. Phân hệ Sinh viên: Dashboard, Danh sách bài thi, Phòng chờ thi (trạng thái hệ thống & chuyển trạng thái vào thi), Giao diện làm bài Focus Mode (Question Palette 1..40, Dropzone upload tự luận, luồng nộp bài & animation thành công), Kết quả thi cử.
  5. Tuân thủ tuyệt đối quy tắc đặt tên biến/hàm Tiếng Việt và comment Tiếng Việt theo tiêu chuẩn dự án.
- **Tác vụ**: Tạo mới các file trong `client/src/` và xác nhận build production `tsc -b && vite build` thành công.

### [2026-08-24] Nâng Cấp Chuẩn Hóa Mã Phòng Thi & Cắm Cờ Câu Hỏi Phân Vân 🚩
- **Nội dung**:
  1. Thêm bộ xử lý mã phòng thi (`MaPhongUtils.ts`): Chuẩn hóa tối thiểu 4 ký tự liền nhau, không dấu cách, không ký tự đặc biệt, tự động chuyển hoa không phân biệt hoa thường.
  2. Bổ sung 2 chế độ khởi tạo mã phòng thi (Tự động sinh mã / Nhập thủ công) trong Modal tạo phòng với phản hồi validation thời gian thực.
  3. Thêm bộ lọc tìm kiếm Mã phòng thi trên giao diện Giảng viên và Widget nhập nhanh mã phòng thi cho Sinh viên.
  4. Thêm tính năng **Cắm cờ 🚩 câu hỏi phân vân** trong giao diện làm bài thi Trắc nghiệm (`ManHinhLamBai.tsx`), tích hợp hiển thị cờ trên Ma trận câu hỏi 1..40, bảng thống kê và cảnh báo trước khi nộp bài.
- **Tác vụ**: Cập nhật `MaPhongUtils.ts`, `QuanLyThiCu.tsx`, `TongQuanGiangVien.tsx`, `QuanLyBaiThiSinhVien.tsx`, `TongQuanSinhVien.tsx`, `ManHinhLamBai.tsx`, `DuLieuGia.ts`, xác nhận build `tsc -b && vite build` thành công.

### [2026-08-24] Tối Ưu Vị Trí Toast (Top-Right), Ghi Đè Thông Báo & Căn Giữa Màn Hình Làm Bài
- **Nội dung**:
  1. Chuyển khung thông báo Toast lên **Góc phải bên trên (Top-Right)** trên toàn bộ giao diện (`LayoutChung.tsx` & `index.css`).
  2. Cơ chế ghi đè thông báo: Thông báo mới sẽ tự động thay thế (overwrite) thông báo cũ trong state `App.tsx`, chỉ giữ 1 Toast tinh gọn.
  3. Lược bỏ thông báo rác khi thao tác Cắm cờ / Bỏ cắm cờ.
  4. Căn giữa giao diện làm bài thi trắc nghiệm (`ManHinhLamBai.tsx`) trong container `maxWidth: 1240px`, bổ sung khoảng thở 2 lề, làm nổi bật thông tin số câu hỏi, điểm số, đồng hồ đếm ngược và các card đáp án.
- **Tác vụ**: Cập nhật `LayoutChung.tsx`, `App.tsx`, `ManHinhLamBai.tsx`, `index.css`, xác nhận build `tsc -b && vite build` thành công 100%.

### [2026-08-24] Tinh Chỉnh Bảng Màu Dark Mode Sang Màu Xám Dark Neutral & Accent Nhẹ
- **Nội dung**:
  1. Loại bỏ toàn bộ tông màu xanh navy đậm cũ, chuyển sang tông **Màu xám dark trung tính** (`#121214` cho nền app, `#09090B` cho sidebar, `#1F1F23` cho card surface).
  2. Đường viền xám tối giản `#2F2F35`, chữ chính trắng ngà `#F4F4F5` và chữ phụ xám dịu `#A1A1AA`.
  3. Giảm độ chói của các mảng highlight & badge (`12% opacity`), tạo cảm giác sang trọng và dịu mắt khi sử dụng ban đêm.
- **Tác vụ**: Cập nhật file `index.css`, xác nhận build `tsc -b && vite build` thành công 100%.

### [2026-08-24] Nâng Cấp Luồng Chấm Bài Theo Mã Phòng Thi & Giao Diện Thi Tự Luận
- **Nội dung**:
  1. Giảng viên Chấm bài (`ChamBai.tsx`): Bổ sung bộ lọc Mã phòng thi (`A102`, `B201`, `C305`...), bảng dữ liệu hiển thị tất cả bài nộp của sinh viên theo phòng, bấm `Xem & Chấm bài` mới mở màn hình chi tiết.
  2. Bổ sung các nút **"Tải bài làm sinh viên về máy"** và **"Tải đề thi tự luận về máy (.pdf)"** kèm khung xem trực tiếp nội dung đề thi tự luận gốc.
  3. Sinh viên Thi Tự Luận (`ManHinhLamBai.tsx`): Cung cấp khung xem đề thi tự luận trực tiếp + Nút **"Tải đề thi về máy (.pdf)"**, đính kèm file bài làm và nút **"NỘP BÀI THI TỰ LUẬN"** nổi bật.
- **Tác vụ**: Cập nhật `ChamBai.tsx`, `ManHinhLamBai.tsx`, `BoThuVienTypes.ts`, `DuLieuGia.ts`, xác nhận build `tsc -b && vite build` thành công 100%.

### [2026-08-24] Hỗ Trợ Tải File Nén Bài Làm (.ZIP, .RAR, .7Z) & Trang Lý Lịch Sinh Viên
- **Nội dung**:
  1. Sinh viên Thi Tự Luận (`ManHinhLamBai.tsx`): Cho phép tải lên file nén `.zip`, `.rar`, `.7z`. Bổ sung chú thích các định dạng chứa bên trong (Source Code, Word, PDF, Excel, PPTX), thanh tiến trình tải lên 0%->100% và Card xác thực file đã đính kèm.
  2. Trang Tổng Quan Sinh Viên (`TongQuanSinhVien.tsx`): Loại bỏ toàn bộ khung tạo/vào phòng thi. Tối ưu thành trang Hồ sơ lý lịch sinh viên hiển thị đầy đủ Mã SV, Email trường cấp, Họ tên, Lớp, Khoa, Ngành, Khóa học K15, SĐT và Điểm tích lũy.
- **Tác vụ**: Cập nhật `ManHinhLamBai.tsx`, `TongQuanSinhVien.tsx`, xác nhận build `tsc -b && vite build` thành công 100%.

### [2026-08-24] Đồng Bộ Cấu Trúc Trang Tổng Quan (Lý Lịch & Hồ Sơ Tài Khoản) Cho Cả Giảng Viên & Admin
- **Nội dung**:
  1. Tổng Quan Giảng Viên (`TongQuanGiangVien.tsx`): Chuyển đổi thành màn hình Lý lịch giảng viên chuyên nghiệp hiển thị Mã GV (`GV001`), Email trường, Họ tên (`TS. Trần Văn Nam`), SĐT, Khoa, Bộ môn, Học hàm/Học vị Tiến sĩ và thống kê bài thi/bài chấm.
  2. Tổng Quan Admin (`TongQuanAdmin.tsx`): Chuyển đổi thành màn hình Lý lịch quản trị viên hiển thị Mã Admin (`ADM001`), Email trường, Họ tên (`Nguyễn Quản Trị`), SĐT, Đơn vị, Chức vụ Trưởng phòng KT-CNTT, Cấp độ Super Admin và thống kê 13.066 tài khoản / hạ tầng máy chủ.
- **Tác vụ**: Cập nhật `TongQuanGiangVien.tsx`, `TongQuanAdmin.tsx`, xác nhận build `tsc -b && vite build` thành công 100%.

### [2026-08-24] Xác Nhận Đồng Bộ Trang Tổng Quan Của 3 Vai Trò & Chuẩn Hóa Interface Props
- **Nội dung**:
  1. Xác nhận `TongQuanSinhVien.tsx` đã được chỉnh sửa hoàn chỉnh theo đúng cấu trúc Hồ sơ lý lịch tài khoản (Mã SV 21103100123, Email trường, Họ tên, Lớp, Khoa, Ngành, Khóa học K15, SĐT, GPA 8.5).
  2. Chuẩn hóa `TongQuanSinhVienProps`, `TongQuanGiangVienProps`, `TongQuanAdminProps` sang dạng optional props (`?`) kèm default fallback data để đảm bảo render linh hoạt không bị lỗi thiếu props.
- **Tác vụ**: Cập nhật `TongQuanSinhVien.tsx`, `TongQuanGiangVien.tsx`, `TongQuanAdmin.tsx`, xác nhận build `npm run build` trong thư mục `client` thành công 100% (0 lỗi).

### [2026-08-24] Phân Tách 2 Lựa Chọn Giảng Viên & Xây Dựng Modal Tạo Bài Kiểm Tra 3 Bước
- **Nội dung**:
  1. Phân Hệ Thi Cử Giảng Viên (`QuanLyThiCu.tsx`): Tách hẳn 2 khung lựa chọn lớn độc lập `[1. Tạo bài kiểm tra]` và `[2. Tạo phòng thi]`. Bổ sung tab phân loại bộ lọc đề thi `Trắc nghiệm` vs `Tự luận`.
  2. Modal "Tạo Bài Kiểm Tra" 3 Bước (Wizard Stepper):
     - Bước 1: Chọn loại đề (Trắc nghiệm, Tự luận, Kết hợp).
     - Bước 2: Thiết lập thông tin (Tên đề, Mã đề, Môn học, Thời lượng, Thang điểm) + Đăng tải file đề PDF/Word (.docx).
     - Bước 3: Xem trước (Preview thông tin + Trình xem đề thi đính kèm inline) và Nút `Lưu đề` ở góc dưới bên phải.
     - Phía dưới luôn có nút `Hủy tạo đề` bên trái và nút `Tiếp theo` / `Lưu đề` bên phải.
- **Tác vụ**: Cập nhật `QuanLyThiCu.tsx`, xác nhận build `npm run build` trong thư mục `client` thành công 100% (0 lỗi).

### [2026-08-24] Bổ Sung Sub-Menu 2 Lựa Chọn Trực Tiếp Ngay Dưới Mục "Thi Cử" Trên Sidebar
- **Nội dung**:
  1. Thanh Điều Hướng Sidebar Giảng Viên (`LayoutChung.tsx`): Bổ sung sub-menu accordion ngay bên dưới mục **Thi cử**. Khi bấm vào Thi cử, hiển thị trực tiếp 2 mục con `• Tạo bài kiểm tra` và `• Tạo phòng thi`.
  2. Tự Động Kích Hoạt Modal (`App.tsx` & `QuanLyThiCu.tsx`): Bấm vào `Tạo bài kiểm tra` trên menu trái sẽ tự động mở ngay Modal Tạo bài kiểm tra 3 bước; bấm vào `Tạo phòng thi` sẽ tự động mở ngay Modal Tạo phòng thi.
- **Tác vụ**: Cập nhật `LayoutChung.tsx`, `App.tsx`, `QuanLyThiCu.tsx`, xác nhận build `npm run build` trong thư mục `client` thành công 100% (0 lỗi).

### [2026-08-24] Định Tuyến Sub-Menu 'Bài Kiểm Tra' & 'Phòng Thi' Sang Không Gian Quản Lý Tương Ứng
- **Nội dung**:
  1. Sub-menu Sidebar dưới mục **Thi cử** (`LayoutChung.tsx`): Chuẩn hóa 2 lựa chọn `• Bài kiểm tra` và `• Phòng thi`.
  2. Quản Lý Giao Diện (`QuanLyThiCu.tsx` & `App.tsx`): Bấm `Bài kiểm tra` sẽ chuyển ngay sang Giao diện Quản lý Bài Kiểm Tra & Đề Thi (tab `BAI_KIEM_TRA`). Bấm `Phòng thi` sẽ chuyển ngay sang Giao diện Quản lý Phòng Thi & Mã Phòng (tab `PHONG_THI`).
- **Tác vụ**: Cập nhật `LayoutChung.tsx`, `App.tsx`, `QuanLyThiCu.tsx`, xác nhận build `npm run build` trong thư mục `client` thành công 100% (0 lỗi).











