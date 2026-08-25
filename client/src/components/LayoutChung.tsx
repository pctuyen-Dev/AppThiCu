import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Database,
  Sliders,
  FileText,
  CheckSquare,
  Award,
  BarChart3,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wifi,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  User,
  Settings,
  BookOpen,
  Shield
} from 'lucide-react';
import type { NguoiDung, VaiTroNguoiDung, DemTrangThaiHeThong } from '../types/BoThuVienTypes';
import { useGiaoDien } from '../theme/ContextGiaoDien';

export interface ThongBaoToast {
  id: string;
  tieuDe: string;
  noiDung: string;
  loai: 'success' | 'warning' | 'error' | 'info';
}

export interface HopThoaiXacNhan {
  hienThi: boolean;
  tieuDe: string;
  noiDung: string;
  tenNutXacNhan: string;
  loaiGuyHiem?: boolean;
  onXacNhan: () => void;
  onHuy: () => void;
}

interface LayoutChungProps {
  nguoiDungHienTai: NguoiDung;
  manHinhHienTai: string;
  onChuyenManHinh: (manHinhId: string) => void;
  onDangXuat: () => void;
  trangThaiHeThong: DemTrangThaiHeThong;
  danhSachToast: ThongBaoToast[];
  onXoaToast: (id: string) => void;
  hopThoaiXacNhan: HopThoaiXacNhan;
  children: React.ReactNode;
}

export const LayoutChung: React.FC<LayoutChungProps> = ({
  nguoiDungHienTai,
  manHinhHienTai,
  onChuyenManHinh,
  onDangXuat,
  trangThaiHeThong,
  danhSachToast,
  onXoaToast,
  hopThoaiXacNhan,
  children
}) => {
  const { cheDoGiaoDien, chuyenDoiCheDoGiaoDien } = useGiaoDien();
  const [sidebarThuNho, setSidebarThuNho] = useState<boolean>(false);
  const [hienThiMenuNguoiDung, setHienThiMenuNguoiDung] = useState<boolean>(false);
  const [hienThiMenuThongBao, setHienThiMenuThongBao] = useState<boolean>(false);
  const [menuThiCuMo, setMenuThiCuMo] = useState<boolean>(true);
  const [menuChamBaiMo, setMenuChamBaiMo] = useState<boolean>(true);

  // Danh mục Menu theo vai trò
  const layDanhSachMenu = (vaiTro: VaiTroNguoiDung) => {
    switch (vaiTro) {
      case 'ADMIN':
        return [
          { id: 'admin-dashboard', ten: 'Tổng quan', icon: LayoutDashboard },
          { id: 'admin-users', ten: 'Người dùng', icon: Users },
          { id: 'admin-data', ten: 'Dữ liệu', icon: Database },
          { id: 'admin-system', ten: 'Hệ thống', icon: Sliders }
        ];
      case 'GIANG_VIEN':
        return [
          { id: 'teacher-dashboard', ten: 'Tổng quan', icon: LayoutDashboard },
          { id: 'teacher-exams', ten: 'Thi cử', icon: FileText },
          { id: 'teacher-grading', ten: 'Chấm bài', icon: CheckSquare },
          { id: 'teacher-results', ten: 'Thống kê điểm', icon: BarChart3 }
        ];
      case 'SINH_VIEN':
        return [
          { id: 'student-dashboard', ten: 'Tổng quan', icon: LayoutDashboard },
          { id: 'student-exams', ten: 'Bài thi', icon: FileText },
          { id: 'student-results', ten: 'Kết quả', icon: Award },
          { id: 'student-notifications', ten: 'Thông báo', icon: Bell }
        ];
      default:
        return [];
    }
  };

  const danhSachMenu = layDanhSachMenu(nguoiDungHienTai.vaiTro);

  const layTieuDeManHinh = () => {
    if (manHinhHienTai === 'teacher-grading-archive') return 'Kho bài nộp';
    if (manHinhHienTai === 'teacher-grading-appeals') return 'Phúc khảo';
    if (manHinhHienTai === 'teacher-exams-list' || manHinhHienTai === 'teacher-exams' || manHinhHienTai === 'teacher-exams-create-exam') return 'Bài kiểm tra';
    if (manHinhHienTai === 'teacher-rooms-list' || manHinhHienTai === 'teacher-exams-create-room') return 'Phòng thi';
    const itemMenu = danhSachMenu.find((m) => m.id === manHinhHienTai);
    if (itemMenu) return itemMenu.ten;
    if (manHinhHienTai === 'teacher-monitoring') return 'Giám sát phòng thi';
    if (manHinhHienTai === 'teacher-waiting-room') return 'Phòng chờ thi';
    if (manHinhHienTai === 'student-waiting') return 'Phòng chờ thi';
    if (manHinhHienTai === 'student-taking-exam') return 'Giao diện làm bài';
    return 'UNETI EXAM';
  };

  const laManHinhTapTrung = manHinhHienTai === 'student-taking-exam';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {!laManHinhTapTrung && (
        <aside
          style={{
            width: sidebarThuNho ? '76px' : '250px',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'width var(--transition-normal)',
            zIndex: 30,
            position: 'sticky',
            top: 0,
            height: '100vh'
          }}
        >
          <div>
            <div
              style={{
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarThuNho ? 'center' : 'space-between',
                padding: sidebarThuNho ? '0' : '0 20px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  <BookOpen size={20} />
                </div>
                {!sidebarThuNho && (
                  <div>
                    <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      UNETI EXAM
                    </h1>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Hệ Thống Thi LAN/Cloud
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSidebarThuNho(!sidebarThuNho)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: sidebarThuNho ? 'none' : 'block'
                }}
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {danhSachMenu.map((item) => {
                const IconComponent = item.icon;
                const laThiCu = item.id === 'teacher-exams';
                const laChamBai = item.id === 'teacher-grading';
                const dangActive =
                  manHinhHienTai === item.id ||
                  (laThiCu && (manHinhHienTai.startsWith('teacher-exams') || manHinhHienTai === 'teacher-rooms-list' || manHinhHienTai === 'teacher-waiting-room' || manHinhHienTai === 'teacher-monitoring')) ||
                  (laChamBai && manHinhHienTai.startsWith('teacher-grading'));

                return (
                  <React.Fragment key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChuyenManHinh(item.id);
                        if (laThiCu) setMenuThiCuMo(!menuThiCuMo);
                        if (laChamBai) setMenuChamBaiMo(!menuChamBaiMo);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: sidebarThuNho ? 'center' : 'space-between',
                        padding: sidebarThuNho ? '12px' : '10px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: dangActive ? 'var(--primary-subtle)' : 'transparent',
                        color: dangActive ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: dangActive ? 700 : 500,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {dangActive && (
                          <div
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: '20%',
                              height: '60%',
                              width: '4px',
                              backgroundColor: 'var(--primary)',
                              borderRadius: '0 4px 4px 0'
                            }}
                          />
                        )}
                        <IconComponent size={20} color={dangActive ? 'var(--primary)' : 'currentColor'} />
                        {!sidebarThuNho && <span style={{ fontSize: '14px' }}>{item.ten}</span>}
                      </div>

                      {laThiCu && !sidebarThuNho && (
                        menuThiCuMo ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                      {laChamBai && !sidebarThuNho && (
                        menuChamBaiMo ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                    </button>

                    {/* 2 LỰA CHỌN HIỆN NGAY DƯỚI THI CỬ VỚI CẤU TRÚC CÂY (TREE-VIEW) */}
                    {laThiCu && menuThiCuMo && !sidebarThuNho && (
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          paddingLeft: '36px',
                          marginTop: '4px',
                          marginBottom: '8px'
                        }}
                      >
                        {/* Thân cây dọc (Vertical Tree Trunk Line) */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '23px',
                            top: '-4px',
                            bottom: '18px',
                            width: '2px',
                            backgroundColor: 'var(--border-color)',
                            borderRadius: '1px'
                          }}
                        />

                        {/* Nhánh cây 1: Bài kiểm tra */}
                        <div style={{ position: 'relative' }}>
                          {/* Đường nối ngang nhánh cây 1 (Branch line) */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '-13px',
                              top: '50%',
                              width: '10px',
                              height: '2px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-exams-list' || manHinhHienTai === 'teacher-exams'
                                  ? 'var(--primary)'
                                  : 'var(--border-color)',
                              transform: 'translateY(-50%)',
                              transition: 'all var(--transition-fast)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => onChuyenManHinh('teacher-exams-list')}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-exams-list' || manHinhHienTai === 'teacher-exams'
                                  ? 'var(--primary-light)'
                                  : 'transparent',
                              color:
                                manHinhHienTai === 'teacher-exams-list' || manHinhHienTai === 'teacher-exams'
                                  ? 'var(--primary)'
                                  : 'var(--text-secondary)',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor:
                                  manHinhHienTai === 'teacher-exams-list' || manHinhHienTai === 'teacher-exams'
                                    ? 'var(--primary)'
                                    : 'var(--text-tertiary)',
                                flexShrink: 0,
                                transition: 'all var(--transition-fast)'
                              }}
                            />
                            Bài kiểm tra
                          </button>
                        </div>

                        {/* Nhánh cây 2: Phòng thi */}
                        <div style={{ position: 'relative' }}>
                          {/* Đường nối ngang nhánh cây 2 (Branch line) */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '-13px',
                              top: '50%',
                              width: '10px',
                              height: '2px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-rooms-list'
                                  ? 'var(--success)'
                                  : 'var(--border-color)',
                              transform: 'translateY(-50%)',
                              transition: 'all var(--transition-fast)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => onChuyenManHinh('teacher-rooms-list')}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-rooms-list' ? 'var(--success-light)' : 'transparent',
                              color:
                                manHinhHienTai === 'teacher-rooms-list' ? 'var(--success)' : 'var(--text-secondary)',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor:
                                  manHinhHienTai === 'teacher-rooms-list' ? 'var(--success)' : 'var(--text-tertiary)',
                                flexShrink: 0,
                                transition: 'all var(--transition-fast)'
                              }}
                            />
                            Phòng thi
                          </button>
                        </div>

                        {/* Nhánh cây 3: Phòng chờ thi (Phê duyệt) */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: '-13px',
                              top: '50%',
                              width: '10px',
                              height: '2px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-waiting-room'
                                  ? 'var(--warning)'
                                  : 'var(--border-color)',
                              transform: 'translateY(-50%)',
                              transition: 'all var(--transition-fast)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => onChuyenManHinh('teacher-waiting-room')}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-waiting-room' ? '#fef3c7' : 'transparent',
                              color:
                                manHinhHienTai === 'teacher-waiting-room' ? '#b45309' : 'var(--text-secondary)',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor:
                                  manHinhHienTai === 'teacher-waiting-room' ? '#d97706' : 'var(--text-tertiary)',
                                flexShrink: 0,
                                transition: 'all var(--transition-fast)'
                              }}
                            />
                            Phòng chờ thi
                          </button>
                        </div>

                        {/* Nhánh cây 4: Giám sát thi */}
                        <div style={{ position: 'relative' }}>
                          {/* Đường nối ngang nhánh cây 4 (Branch line) */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '-13px',
                              top: '50%',
                              width: '10px',
                              height: '2px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-monitoring'
                                  ? 'var(--warning)'
                                  : 'var(--border-color)',
                              transform: 'translateY(-50%)',
                              transition: 'all var(--transition-fast)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => onChuyenManHinh('teacher-monitoring')}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-monitoring' ? 'var(--warning-light)' : 'transparent',
                              color:
                                manHinhHienTai === 'teacher-monitoring' ? 'var(--warning)' : 'var(--text-secondary)',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor:
                                  manHinhHienTai === 'teacher-monitoring' ? 'var(--warning)' : 'var(--text-tertiary)',
                                flexShrink: 0,
                                transition: 'all var(--transition-fast)'
                              }}
                            />
                            Giám sát thi
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3 LỰA CHỌN HIỆN NGAY DƯỚI CHẤM BÀI VỚI CẤU TRÚC CÂY (TREE-VIEW) */}
                    {laChamBai && menuChamBaiMo && !sidebarThuNho && (
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          paddingLeft: '36px',
                          marginTop: '4px',
                          marginBottom: '8px'
                        }}
                      >
                        {/* Thân cây dọc (Vertical Tree Trunk Line) */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '23px',
                            top: '-4px',
                            bottom: '18px',
                            width: '2px',
                            backgroundColor: 'var(--border-color)',
                            borderRadius: '1px'
                          }}
                        />

                        {/* Nhánh cây 1: Kho bài nộp */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: '-13px',
                              top: '50%',
                              width: '10px',
                              height: '2px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-grading-archive'
                                  ? 'var(--primary)'
                                  : 'var(--border-color)',
                              transform: 'translateY(-50%)',
                              transition: 'all var(--transition-fast)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => onChuyenManHinh('teacher-grading-archive')}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-grading-archive'
                                  ? 'var(--primary-light)'
                                  : 'transparent',
                              color:
                                manHinhHienTai === 'teacher-grading-archive'
                                  ? 'var(--primary)'
                                  : 'var(--text-secondary)',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor:
                                  manHinhHienTai === 'teacher-grading-archive'
                                    ? 'var(--primary)'
                                    : 'var(--text-tertiary)',
                                flexShrink: 0,
                                transition: 'all var(--transition-fast)'
                              }}
                            />
                            Kho bài nộp
                          </button>
                        </div>

                        {/* Nhánh cây 2: Chấm điểm */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: '-13px',
                              top: '50%',
                              width: '10px',
                              height: '2px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-grading'
                                  ? 'var(--primary)'
                                  : 'var(--border-color)',
                              transform: 'translateY(-50%)',
                              transition: 'all var(--transition-fast)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => onChuyenManHinh('teacher-grading')}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-grading'
                                  ? 'var(--primary-light)'
                                  : 'transparent',
                              color:
                                manHinhHienTai === 'teacher-grading'
                                  ? 'var(--primary)'
                                  : 'var(--text-secondary)',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor:
                                  manHinhHienTai === 'teacher-grading'
                                    ? 'var(--primary)'
                                    : 'var(--text-tertiary)',
                                flexShrink: 0,
                                transition: 'all var(--transition-fast)'
                              }}
                            />
                            Chấm điểm
                          </button>
                        </div>

                        {/* Nhánh cây 3: Phúc khảo */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: '-13px',
                              top: '50%',
                              width: '10px',
                              height: '2px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-grading-appeals'
                                  ? 'var(--primary)'
                                  : 'var(--border-color)',
                              transform: 'translateY(-50%)',
                              transition: 'all var(--transition-fast)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => onChuyenManHinh('teacher-grading-appeals')}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                manHinhHienTai === 'teacher-grading-appeals'
                                  ? 'var(--primary-light)'
                                  : 'transparent',
                              color:
                                manHinhHienTai === 'teacher-grading-appeals'
                                  ? 'var(--primary)'
                                  : 'var(--text-secondary)',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor:
                                  manHinhHienTai === 'teacher-grading-appeals'
                                    ? 'var(--primary)'
                                    : 'var(--text-tertiary)',
                                flexShrink: 0,
                                transition: 'all var(--transition-fast)'
                              }}
                            />
                            Phúc khảo
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-surface-subtle)',
                justifyContent: sidebarThuNho ? 'center' : 'flex-start'
              }}
            >
              <img
                src={nguoiDungHienTai.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt="Avatar"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              {!sidebarThuNho && (
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {nguoiDungHienTai.hoTen}
                  </p>
                  <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '2px 6px', marginTop: '2px' }}>
                    {nguoiDungHienTai.vaiTro}
                  </span>
                </div>
              )}
            </div>

            {sidebarThuNho && (
              <button
                type="button"
                onClick={() => setSidebarThuNho(false)}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </aside>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {!laManHinhTapTrung && (
          <header
            style={{
              height: '68px',
              backgroundColor: 'var(--bg-header)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              position: 'sticky',
              top: 0,
              zIndex: 20
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {layTieuDeManHinh()}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '99px',
                  backgroundColor: trangThaiHeThong.lanServerOnline ? 'var(--success-light)' : 'var(--danger-light)',
                  color: trangThaiHeThong.lanServerOnline ? 'var(--success)' : 'var(--danger)',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <span
                  className="animate-pulse-subtle"
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: trangThaiHeThong.lanServerOnline ? 'var(--success)' : 'var(--danger)'
                  }}
                />
                <Wifi size={14} />
                <span>LAN {trangThaiHeThong.lanServerOnline ? 'Hoạt động' : 'Mất kết nối'}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '99px',
                  backgroundColor: trangThaiHeThong.cloudConnected ? 'var(--primary-light)' : 'var(--warning-light)',
                  color: trangThaiHeThong.cloudConnected ? 'var(--primary)' : 'var(--warning)',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: trangThaiHeThong.cloudConnected ? 'var(--primary)' : 'var(--warning)'
                  }}
                />
                <Cloud size={14} />
                <span>Cloud {trangThaiHeThong.cloudConnected ? 'Đã kết nối' : 'Đang chờ'}</span>
              </div>

              <button
                type="button"
                onClick={() => chuyenDoiCheDoGiaoDien()}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={cheDoGiaoDien === 'sang' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
              >
                {cheDoGiaoDien === 'sang' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setHienThiMenuThongBao(!hienThiMenuThongBao)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <Bell size={18} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--danger)',
                      borderRadius: '50%'
                    }}
                  />
                </button>

                {hienThiMenuThongBao && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '320px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '16px',
                      zIndex: 50
                    }}
                  >
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                      Thông Báo Hệ Thống
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', fontSize: '13px' }}>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Phòng thi A102 đang diễn ra</p>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>43 sinh viên đã vào làm bài.</span>
                      </div>
                      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', fontSize: '13px' }}>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Đồng bộ dữ liệu Cloud thành công</p>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>12 bản ghi bài nộp đã lưu.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setHienThiMenuNguoiDung(!hienThiMenuNguoiDung)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <img
                    src={nguoiDungHienTai.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="Avatar"
                    style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                </button>

                {hienThiMenuNguoiDung && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '220px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '8px',
                      zIndex: 50
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {nguoiDungHienTai.hoTen}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{nguoiDungHienTai.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setHienThiMenuNguoiDung(false)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      <User size={16} /> Thông tin tài khoản
                    </button>

                    <button
                      type="button"
                      onClick={() => setHienThiMenuNguoiDung(false)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Settings size={16} /> Cài đặt
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setHienThiMenuNguoiDung(false);
                        onDangXuat();
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        marginTop: '4px'
                      }}
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        <main style={{ flex: 1, padding: laManHinhTapTrung ? '0' : '24px', overflowY: 'auto' }}>
          <div className="animate-page-enter">{children}</div>
        </main>
      </div>

      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 9999,
          maxWidth: '380px',
          pointerEvents: 'none'
        }}
      >
        {danhSachToast.slice(0, 1).map((toast) => {
          const isSuccess = toast.loai === 'success';
          const isWarning = toast.loai === 'warning';
          const isError = toast.loai === 'error';

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                borderLeft: `4px solid ${
                  isSuccess
                    ? 'var(--success)'
                    : isWarning
                    ? 'var(--warning)'
                    : isError
                    ? 'var(--danger)'
                    : 'var(--primary)'
                }`,
                boxShadow: 'var(--shadow-lg)',
                animation: 'thongBaoTruotVao 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            >
              {isSuccess && <CheckCircle2 size={20} color="var(--success)" style={{ marginTop: '2px' }} />}
              {isWarning && <AlertTriangle size={20} color="var(--warning)" style={{ marginTop: '2px' }} />}
              {isError && <X size={20} color="var(--danger)" style={{ marginTop: '2px' }} />}
              {!isSuccess && !isWarning && !isError && <Info size={20} color="var(--primary)" style={{ marginTop: '2px' }} />}

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {toast.tieuDe}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  {toast.noiDung}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onXoaToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {hopThoaiXacNhan.hienThi && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: '420px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'modalPhongTo 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: hopThoaiXacNhan.loaiGuyHiem ? 'var(--danger-light)' : 'var(--primary-light)',
                  color: hopThoaiXacNhan.loaiGuyHiem ? 'var(--danger)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Shield size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {hopThoaiXacNhan.tieuDe}
              </h3>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {hopThoaiXacNhan.noiDung}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={hopThoaiXacNhan.onHuy}>
                Hủy bỏ
              </button>
              <button
                type="button"
                className={hopThoaiXacNhan.loaiGuyHiem ? 'btn-danger' : 'btn-primary'}
                onClick={hopThoaiXacNhan.onXacNhan}
              >
                {hopThoaiXacNhan.tenNutXacNhan}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
