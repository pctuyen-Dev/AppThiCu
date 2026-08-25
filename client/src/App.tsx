import { useState } from 'react';
import { ContextGiaoDienProvider } from './theme/ContextGiaoDien';
import type {
  NguoiDung,
  VaiTroNguoiDung,
  BaiKiemTra,
  PhongThi,
  BaiNopSinhVien,
  FileHệThong,
  DemTrangThaiHeThong,
  NhatKyHeThong
} from './types/BoThuVienTypes';
import {
  danhSachNguoiDungGia,
  danhSachBaiKiemTraGia,
  danhSachPhongThiGia,
  danhSachBaiNopGia,
  danhSachFileGia,
  danhSachNhatKyGia,
  duLieuTrangThaiHeThongGia
} from './mock/DuLieuGia';

import { LayoutChung, type ThongBaoToast, type HopThoaiXacNhan } from './components/LayoutChung';
import { ManHinhDangNhap } from './components/ManHinhDangNhap';

// Admin Components
import { TongQuanAdmin } from './components/Admin/TongQuanAdmin';
import { QuanLyNguoiDung } from './components/Admin/QuanLyNguoiDung';
import { QuanLyDuLieu } from './components/Admin/QuanLyDuLieu';
import { QuanLyHeThong } from './components/Admin/QuanLyHeThong';

// Teacher Components
import { TongQuanGiangVien } from './components/GiangVien/TongQuanGiangVien';
import { QuanLyThiCu } from './components/GiangVien/QuanLyThiCu';
import { PhongChoGiangVien } from './components/GiangVien/PhongChoGiangVien';
import { ManHinhGiamSat } from './components/GiangVien/ManHinhGiamSat';
import { ChamBai } from './components/GiangVien/ChamBai';

// Student Components
import { TongQuanSinhVien } from './components/SinhVien/TongQuanSinhVien';
import { QuanLyBaiThiSinhVien } from './components/SinhVien/QuanLyBaiThiSinhVien';
import { PhongChoThi } from './components/SinhVien/PhongChoThi';
import { ManHinhLamBai } from './components/SinhVien/ManHinhLamBai';
import { KetQuaSinhVien } from './components/SinhVien/KetQuaSinhVien';

export function App() {
  // Trạng thái Đăng Nhập
  const [trangThaiDangNhap, setTrangThaiDangNhap] = useState<boolean>(true);
  const [nguoiDungHienTai, setNguoiDungHienTai] = useState<NguoiDung>(danhSachNguoiDungGia[0]);
  const [manHinhHienTai, setManHinhHienTai] = useState<string>('admin-dashboard');

  // Trạng thái Dữ Liệu
  const [danhSachNguoiDung, setDanhSachNguoiDung] = useState<NguoiDung[]>(danhSachNguoiDungGia);
  const [danhSachBaiKiemTra, setDanhSachBaiKiemTra] = useState<BaiKiemTra[]>(danhSachBaiKiemTraGia);
  const [danhSachPhongThi, setDanhSachPhongThi] = useState<PhongThi[]>(danhSachPhongThiGia);
  const [danhSachBaiNop] = useState<BaiNopSinhVien[]>(danhSachBaiNopGia);
  const [danhSachFile] = useState<FileHệThong[]>(danhSachFileGia);
  const [danhSachNhatKy] = useState<NhatKyHeThong[]>(danhSachNhatKyGia);
  const [trangThaiHeThong] = useState<DemTrangThaiHeThong>(duLieuTrangThaiHeThongGia);

  // ID Phòng Thi đang Chọn (khi chuyển sang màn hình Giám Sát / Phòng Chờ / Làm Bài)
  const [phongThiDangChonId, setPhongThiDangChonId] = useState<string>('room-101');

  // Toast System State
  const [danhSachToast, setDanhSachToast] = useState<ThongBaoToast[]>([
    {
      id: 'toast-welcome',
      tieuDe: 'Hệ thống thi cử UNETI',
      noiDung: 'Máy chủ LAN & Supabase Cloud đã sẵn sàng.',
      loai: 'success'
    }
  ]);

  // Confirmation Modal State
  const [hopThoaiXacNhan, setHopThoaiXacNhan] = useState<HopThoaiXacNhan>({
    hienThi: false,
    tieuDe: '',
    noiDung: '',
    tenNutXacNhan: 'Xác nhận',
    loaiGuyHiem: false,
    onXacNhan: () => {},
    onHuy: () => {}
  });

  // Helper Hợp thoại Toast - Thông báo mới sẽ ghi đè thông báo cũ
  const xuLyHienThiToast = (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => {
    const idMoi = `toast-${Date.now()}`;
    const toastMoi: ThongBaoToast = { id: idMoi, tieuDe, noiDung, loai };
    setDanhSachToast([toastMoi]);

    setTimeout(() => {
      setDanhSachToast((prev) => prev.filter((t) => t.id !== idMoi));
    }, 3500);
  };

  const xuLyXoaToast = (id: string) => {
    setDanhSachToast((prev) => prev.filter((t) => t.id !== id));
  };

  // Đăng Nhập
  const xuLyDangNhap = (vaiTroChon: VaiTroNguoiDung) => {
    const ndTim = danhSachNguoiDung.find((n) => n.vaiTro === vaiTroChon) || danhSachNguoiDung[0];
    setNguoiDungHienTai(ndTim);
    setTrangThaiDangNhap(true);

    if (vaiTroChon === 'ADMIN') setManHinhHienTai('admin-dashboard');
    if (vaiTroChon === 'GIANG_VIEN') setManHinhHienTai('teacher-dashboard');
    if (vaiTroChon === 'SINH_VIEN') setManHinhHienTai('student-dashboard');

    xuLyHienThiToast('Đăng nhập thành công', `Chào mừng ${ndTim.hoTen} (${ndTim.vaiTro}) trở lại hệ thống.`, 'success');
  };

  // Đăng Xuất
  const xuLyDangXuat = () => {
    setTrangThaiDangNhap(false);
  };

  // Thao tác Admin Người dùng
  const xuLyCapNhatNguoiDung = (nguoiDungCapNhat: NguoiDung) => {
    setDanhSachNguoiDung((prev) =>
      prev.map((n) => (n.id === nguoiDungCapNhat.id ? nguoiDungCapNhat : n))
    );
  };

  const xuLyXoaNguoiDung = (id: string) => {
    const nd = danhSachNguoiDung.find((n) => n.id === id);
    setHopThoaiXacNhan({
      hienThi: true,
      tieuDe: 'Xóa tài khoản khỏi hệ thống?',
      noiDung: `Bạn có chắc chắn muốn xóa tài khoản ${nd?.hoTen} (${nd?.maDinhDanh})? Thao tác này không thể hoàn tác.`,
      tenNutXacNhan: 'Xóa tài khoản',
      loaiGuyHiem: true,
      onXacNhan: () => {
        setDanhSachNguoiDung((prev) => prev.filter((n) => n.id !== id));
        setHopThoaiXacNhan((prev) => ({ ...prev, hienThi: false }));
        xuLyHienThiToast('Đã xóa tài khoản', `Đã xóa tài khoản ${nd?.hoTen} khỏi CSDL.`, 'error');
      },
      onHuy: () => setHopThoaiXacNhan((prev) => ({ ...prev, hienThi: false }))
    });
  };

  const xuLyThemNguoiDung = (nguoiDungMoi: NguoiDung) => {
    setDanhSachNguoiDung((prev) => [nguoiDungMoi, ...prev]);
  };

  // Thao tác Giảng viên Bài thi & Phòng thi
  const xuLyTaoBaiKiemTra = (baiMoi: BaiKiemTra) => {
    setDanhSachBaiKiemTra((prev) => [baiMoi, ...prev]);
  };

  const xuLyTaoPhongThi = (phongMoi: PhongThi) => {
    setDanhSachPhongThi((prev) => [phongMoi, ...prev]);
  };

  const xuLyMoPhongThi = (phongThiId: string) => {
    setDanhSachPhongThi((prev) =>
      prev.map((p) => (p.id === phongThiId ? { ...p, trangThai: 'DANG_THI' } : p))
    );
    setPhongThiDangChonId(phongThiId);
    xuLyHienThiToast('Phòng thi đã mở', 'Hệ thống đã bật máy chủ LAN cho phòng thi.', 'success');
  };

  const xuLyXoaPhongThi = (phongThiId: string) => {
    setDanhSachPhongThi((prev) => prev.filter((p) => p.id !== phongThiId));
    xuLyHienThiToast('Xóa phòng', 'Đã xóa phòng thi.', 'warning');
  };

  const phongThiDangXem =
    danhSachPhongThi.find((p) => p.id === phongThiDangChonId) || danhSachPhongThi[0];

  const baiKiemTraDangXem =
    danhSachBaiKiemTra.find((b) => b.id === phongThiDangXem.baiKiemTraId) || danhSachBaiKiemTra[0];

  return (
    <ContextGiaoDienProvider>
      {!trangThaiDangNhap ? (
        <ManHinhDangNhap onDangNhapThanhCong={xuLyDangNhap} />
      ) : (
        <LayoutChung
          nguoiDungHienTai={nguoiDungHienTai}
          manHinhHienTai={manHinhHienTai}
          onChuyenManHinh={(id) => setManHinhHienTai(id)}
          onDangXuat={xuLyDangXuat}
          trangThaiHeThong={trangThaiHeThong}
          danhSachToast={danhSachToast}
          onXoaToast={xuLyXoaToast}
          hopThoaiXacNhan={hopThoaiXacNhan}
        >
          {/* ADMIN SCREENS */}
          {manHinhHienTai === 'admin-dashboard' && (
            <TongQuanAdmin
              trangThaiHeThong={trangThaiHeThong}
              danhSachPhongThi={danhSachPhongThi}
              danhSachNhatKy={danhSachNhatKy}
              onChuyenToiNguoiDung={() => setManHinhHienTai('admin-users')}
              onChuyenToiDuLieu={() => setManHinhHienTai('admin-data')}
            />
          )}

          {manHinhHienTai === 'admin-users' && (
            <QuanLyNguoiDung
              danhSachNguoiDung={danhSachNguoiDung}
              onCapNhatNguoiDung={xuLyCapNhatNguoiDung}
              onXoaNguoiDung={xuLyXoaNguoiDung}
              onThemNguoiDungMoi={xuLyThemNguoiDung}
              onHienThiToast={xuLyHienThiToast}
            />
          )}

          {manHinhHienTai === 'admin-data' && (
            <QuanLyDuLieu
              trangThaiHeThong={trangThaiHeThong}
              danhSachFile={danhSachFile}
              onHienThiToast={xuLyHienThiToast}
            />
          )}

          {manHinhHienTai === 'admin-system' && (
            <QuanLyHeThong
              trangThaiHeThong={trangThaiHeThong}
              danhSachNhatKy={danhSachNhatKy}
              onHienThiToast={xuLyHienThiToast}
            />
          )}

          {/* TEACHER SCREENS */}
          {manHinhHienTai === 'teacher-dashboard' && (
            <TongQuanGiangVien
              danhSachPhongThi={danhSachPhongThi}
              danhSachBaiKiemTra={danhSachBaiKiemTra}
              onChuyenToiGiamSat={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('teacher-monitoring');
              }}
              onChuyenToiTaoBai={() => setManHinhHienTai('teacher-exams')}
              onChuyenToiTaoPhong={() => setManHinhHienTai('teacher-exams')}
            />
          )}

          {(manHinhHienTai.startsWith('teacher-exams') || manHinhHienTai === 'teacher-rooms-list') && (
            <QuanLyThiCu
              danhSachBaiKiemTra={danhSachBaiKiemTra}
              danhSachPhongThi={danhSachPhongThi}
              danhSachSinhVien={danhSachNguoiDung.filter((n) => n.vaiTro === 'SINH_VIEN')}
              onTaoBaiKiemTra={xuLyTaoBaiKiemTra}
              onTaoPhongThi={xuLyTaoPhongThi}
              onMoPhongThi={xuLyMoPhongThi}
              onXoaPhongThi={xuLyXoaPhongThi}
              onChuyenToiGiamSat={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('teacher-monitoring');
              }}
              onChuyenToiPhongCho={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('teacher-waiting-room');
              }}
              onHienThiToast={xuLyHienThiToast}
              tabBanDau={manHinhHienTai === 'teacher-rooms-list' ? 'PHONG_THI' : 'BAI_KIEM_TRA'}
              modeMoModalBanDau={
                manHinhHienTai === 'teacher-exams-create-exam'
                  ? 'TAO_BAI'
                  : manHinhHienTai === 'teacher-exams-create-room'
                  ? 'TAO_PHONG'
                  : null
              }
            />
          )}

          {manHinhHienTai === 'teacher-waiting-room' && (
            <PhongChoGiangVien
              phongThi={phongThiDangXem}
              danhSachPhongThi={danhSachPhongThi}
              onChonPhongThi={(id) => setPhongThiDangChonId(id)}
              onBatDauCaThi={(id) => {
                setDanhSachPhongThi((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, trangThai: 'DANG_THI' } : p))
                );
                setPhongThiDangChonId(id);
                xuLyHienThiToast('Bắt đầu ca thi', 'Ca thi đã chính thức bắt đầu!', 'success');
                setManHinhHienTai('teacher-monitoring');
              }}
              onChuyenToiGiamSat={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('teacher-monitoring');
              }}
              onHienThiToast={xuLyHienThiToast}
              onQuayLai={() => setManHinhHienTai('teacher-dashboard')}
            />
          )}

          {manHinhHienTai === 'teacher-monitoring' && (
            <ManHinhGiamSat
              phongThi={phongThiDangXem}
              danhSachPhongThi={danhSachPhongThi}
              onChonPhongThi={(id) => setPhongThiDangChonId(id)}
              onChuyenToiPhongCho={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('teacher-waiting-room');
              }}
              onQuayLai={() => setManHinhHienTai('teacher-dashboard')}
              onKetThucPhong={() => {
                setDanhSachPhongThi((prev) =>
                  prev.map((p) => (p.id === phongThiDangXem.id ? { ...p, trangThai: 'DA_KET_THUC' } : p))
                );
                xuLyHienThiToast('Đã kết thúc', 'Phòng thi đã đóng và tự động khóa bài làm.', 'success');
                setManHinhHienTai('teacher-grading');
              }}
              onHienThiToast={xuLyHienThiToast}
            />
          )}

          {manHinhHienTai.startsWith('teacher-grading') && (
            <ChamBai
              danhSachBaiNop={danhSachBaiNop}
              onHienThiToast={xuLyHienThiToast}
              tabBanDau={
                manHinhHienTai === 'teacher-grading-archive'
                  ? 'KHO_BAI_NOP'
                  : manHinhHienTai === 'teacher-grading-appeals'
                  ? 'PHUC_KHAO'
                  : 'CHAM_DIEM'
              }
            />
          )}

          {manHinhHienTai === 'teacher-results' && (
            <KetQuaSinhVien danhSachBaiNop={danhSachBaiNop} />
          )}

          {/* STUDENT SCREENS */}
          {manHinhHienTai === 'student-dashboard' && (
            <TongQuanSinhVien
              danhSachPhongThi={danhSachPhongThi}
              onVaoPhongCho={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('student-waiting');
              }}
              onVaoLamBai={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('student-taking-exam');
              }}
            />
          )}

          {manHinhHienTai === 'student-exams' && (
            <QuanLyBaiThiSinhVien
              danhSachPhongThi={danhSachPhongThi}
              onVaoPhongCho={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('student-waiting');
              }}
              onVaoLamBai={(id) => {
                setPhongThiDangChonId(id);
                setManHinhHienTai('student-taking-exam');
              }}
            />
          )}

          {manHinhHienTai === 'student-waiting' && (
            <PhongChoThi
              phongThi={phongThiDangXem}
              onQuayLai={() => setManHinhHienTai('student-dashboard')}
              onVaoLamBai={() => setManHinhHienTai('student-taking-exam')}
            />
          )}

          {manHinhHienTai === 'student-taking-exam' && (
            <ManHinhLamBai
              phongThi={phongThiDangXem}
              baiKiemTra={baiKiemTraDangXem}
              onNopBaiThanhCong={() => setManHinhHienTai('student-results')}
              onHienThiToast={xuLyHienThiToast}
            />
          )}

          {manHinhHienTai === 'student-results' && (
            <KetQuaSinhVien danhSachBaiNop={danhSachBaiNop} />
          )}

          {manHinhHienTai === 'student-notifications' && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px' }}>Thông báo từ Nhà trường & Giảng viên</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Không có thông báo mới.</p>
            </div>
          )}
        </LayoutChung>
      )}
    </ContextGiaoDienProvider>
  );
}

export default App;
