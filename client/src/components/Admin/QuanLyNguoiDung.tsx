import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  X,
  Check,
  ChevronRight,
  UserCheck,
  GraduationCap,
  Upload,
  CheckCircle,
  Lock,
  Trash2
} from 'lucide-react';
import type { NguoiDung, VaiTroNguoiDung, TrangThaiTaiKhoan, QuyenTruyCapNguoiDung } from '../../types/BoThuVienTypes';

interface QuanLyNguoiDungProps {
  danhSachNguoiDung: NguoiDung[];
  onCapNhatNguoiDung: (nguoiDungCapNhat: NguoiDung) => void;
  onXoaNguoiDung: (id: string) => void;
  onThemNguoiDungMoi: (nguoiDungMoi: NguoiDung) => void;
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
}

export const QuanLyNguoiDung: React.FC<QuanLyNguoiDungProps> = ({
  danhSachNguoiDung,
  onCapNhatNguoiDung,
  onXoaNguoiDung,
  onThemNguoiDungMoi,
  onHienThiToast
}) => {
  const [tabHienTai, setTabHienTai] = useState<VaiTroNguoiDung>('SINH_VIEN');
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');

  const [hienThiBoLoc, setHienThiBoLoc] = useState<boolean>(false);
  const [khoaDaChon, setKhoaDaChon] = useState<string>('TAT_CA');
  const [trangThaiDaChon, setTrangThaiDaChon] = useState<string>('TAT_CA');

  const [nguoiDungDangChon, setNguoiDungDangChon] = useState<NguoiDung | null>(null);

  const [hienThiModalThem, setHienThiModalThem] = useState<boolean>(false);
  const [buocThemNguoiDung, setBuocThemNguoiDung] = useState<number>(1);
  const [vaiTroFormThem, setVaiTroFormThem] = useState<VaiTroNguoiDung>('SINH_VIEN');
  const [formThemState, setFormThemState] = useState({
    maDinhDanh: '',
    hoTen: '',
    email: '',
    soDienThoai: '',
    khoa: 'Công nghệ thông tin',
    boMonHoacNganh: 'Công nghệ thông tin',
    lopHoacChucVu: 'DHTI15A1HN',
    khoaHoc: 'K15'
  });

  const [hienThiModalExcel, setHienThiModalExcel] = useState<boolean>(false);
  const [buocExcel, setBuocExcel] = useState<number>(1);

  const danhSachLoc = useMemo(() => {
    return danhSachNguoiDung.filter((nd) => {
      const phuHopTab = nd.vaiTro === tabHienTai;
      const phuHopTuKhoa =
        nd.hoTen.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
        nd.maDinhDanh.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
        nd.email.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
      const phuHopKhoa = khoaDaChon === 'TAT_CA' || nd.khoa === khoaDaChon;
      const phuHopTrangThai = trangThaiDaChon === 'TAT_CA' || nd.trangThai === trangThaiDaChon;

      return phuHopTab && phuHopTuKhoa && phuHopKhoa && phuHopTrangThai;
    });
  }, [danhSachNguoiDung, tabHienTai, tuKhoaTimKiem, khoaDaChon, trangThaiDaChon]);

  const soLuongSinhVien = danhSachNguoiDung.filter((n) => n.vaiTro === 'SINH_VIEN').length;
  const soLuongGiangVien = danhSachNguoiDung.filter((n) => n.vaiTro === 'GIANG_VIEN').length;

  const xuLyLuuQuyenDrawer = (quyenMoi: QuyenTruyCapNguoiDung) => {
    if (!nguoiDungDangChon) return;
    const nguoiDungCapNhat = { ...nguoiDungDangChon, quyen: quyenMoi };
    onCapNhatNguoiDung(nguoiDungCapNhat);
    setNguoiDungDangChon(nguoiDungCapNhat);
    onHienThiToast('Thành công', 'Đã cập nhật quyền truy cập tài khoản.', 'success');
  };

  const xuLyNopFormThem = (e: React.FormEvent) => {
    e.preventDefault();
    const taoMoi: NguoiDung = {
      id: `usr-new-${Date.now()}`,
      maDinhDanh: formThemState.maDinhDanh,
      hoTen: formThemState.hoTen,
      email: formThemState.email,
      soDienThoai: formThemState.soDienThoai,
      vaiTro: vaiTroFormThem,
      khoa: formThemState.khoa,
      boMonHoacNganh: formThemState.boMonHoacNganh,
      lopHoacChucVu: formThemState.lopHoacChucVu,
      khoaHoc: formThemState.khoaHoc,
      trangThai: 'HOAT_DONG',
      quyen: {
        taoBaiKiemTra: vaiTroFormThem !== 'SINH_VIEN',
        chinhSuaBaiKiemTra: vaiTroFormThem !== 'SINH_VIEN',
        taoPhongThi: vaiTroFormThem !== 'SINH_VIEN',
        giamSatThi: vaiTroFormThem !== 'SINH_VIEN',
        chamBai: vaiTroFormThem !== 'SINH_VIEN',
        xemKetQua: true,
        quanLyNguoiDung: false,
        quanLyHeThong: false
      },
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      ngayTao: new Date().toISOString().split('T')[0]
    };

    onThemNguoiDungMoi(taoMoi);
    setHienThiModalThem(false);
    setBuocThemNguoiDung(1);
    onHienThiToast('Thành công', `Đã thêm tài khoản ${taoMoi.hoTen} vào hệ thống.`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Người dùng
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Quản lý tài khoản sinh viên và giảng viên trường UNETI.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setBuocExcel(1);
              setHienThiModalExcel(true);
            }}
          >
            <FileSpreadsheet size={18} color="var(--success)" /> Nhập Excel
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setBuocThemNguoiDung(1);
              setHienThiModalThem(true);
            }}
          >
            <Plus size={18} /> Thêm tài khoản
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input
              type="text"
              className="input-custom"
              style={{ width: '100%', paddingLeft: '42px' }}
              placeholder="Tìm mã sinh viên, mã giảng viên, họ tên hoặc email..."
              value={tuKhoaTimKiem}
              onChange={(e) => setTuKhoaTimKiem(e.target.value)}
            />
            {tuKhoaTimKiem && (
              <button
                type="button"
                onClick={() => setTuKhoaTimKiem('')}
                style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setHienThiBoLoc(!hienThiBoLoc)}
            >
              <Filter size={18} /> Bộ lọc
            </button>

            {hienThiBoLoc && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '280px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '16px',
                  zIndex: 40,
                  animation: 'modalPhongTo 0.15s ease-out forwards'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Bộ Lọc Nâng Cao</h4>
                  <button type="button" onClick={() => setHienThiBoLoc(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Khoa</label>
                    <select
                      className="input-custom"
                      style={{ width: '100%', fontSize: '13px' }}
                      value={khoaDaChon}
                      onChange={(e) => setKhoaDaChon(e.target.value)}
                    >
                      <option value="TAT_CA">Tất cả các Khoa</option>
                      <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                      <option value="Điện - Điện tử">Điện - Điện tử</option>
                      <option value="Kinh tế">Kinh tế</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Trạng thái</label>
                    <select
                      className="input-custom"
                      style={{ width: '100%', fontSize: '13px' }}
                      value={trangThaiDaChon}
                      onChange={(e) => setTrangThaiDaChon(e.target.value)}
                    >
                      <option value="TAT_CA">Tất cả trạng thái</option>
                      <option value="HOAT_DONG">● Hoạt động</option>
                      <option value="BI_KHOA">● Bị khóa</option>
                      <option value="CHUA_KICH_HOAT">● Chưa kích hoạt</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {(khoaDaChon !== 'TAT_CA' || trangThaiDaChon !== 'TAT_CA') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Đang lọc:</span>
            {khoaDaChon !== 'TAT_CA' && (
              <span className="badge badge-neutral" style={{ gap: '4px', cursor: 'pointer' }} onClick={() => setKhoaDaChon('TAT_CA')}>
                Khoa: {khoaDaChon} <X size={12} />
              </span>
            )}
            {trangThaiDaChon !== 'TAT_CA' && (
              <span className="badge badge-neutral" style={{ gap: '4px', cursor: 'pointer' }} onClick={() => setTrangThaiDaChon('TAT_CA')}>
                Trạng thái: {trangThaiDaChon} <X size={12} />
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '24px' }}>
        <button
          type="button"
          onClick={() => setTabHienTai('SINH_VIEN')}
          style={{
            padding: '12px 0',
            background: 'none',
            border: 'none',
            borderBottom: tabHienTai === 'SINH_VIEN' ? '2px solid var(--primary)' : '2px solid transparent',
            color: tabHienTai === 'SINH_VIEN' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: tabHienTai === 'SINH_VIEN' ? 700 : 500,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Sinh viên <span className="badge badge-neutral">{soLuongSinhVien}</span>
        </button>

        <button
          type="button"
          onClick={() => setTabHienTai('GIANG_VIEN')}
          style={{
            padding: '12px 0',
            background: 'none',
            border: 'none',
            borderBottom: tabHienTai === 'GIANG_VIEN' ? '2px solid var(--primary)' : '2px solid transparent',
            color: tabHienTai === 'GIANG_VIEN' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: tabHienTai === 'GIANG_VIEN' ? 700 : 500,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Giảng viên <span className="badge badge-neutral">{soLuongGiangVien}</span>
        </button>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-color)', height: '44px' }}>
              <th style={{ padding: '0 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {tabHienTai === 'SINH_VIEN' ? 'MÃ SINH VIÊN' : 'MÃ GIẢNG VIÊN'}
              </th>
              <th style={{ padding: '0 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>HỌ VÀ TÊN</th>
              <th style={{ padding: '0 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {tabHienTai === 'SINH_VIEN' ? 'LỚP' : 'BỘ MÔN'}
              </th>
              <th style={{ padding: '0 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>KHOA</th>
              <th style={{ padding: '0 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>EMAIL</th>
              <th style={{ padding: '0 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>TRẠNG THÁI</th>
              <th style={{ padding: '0 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {danhSachLoc.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Không tìm thấy tài khoản phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            ) : (
              danhSachLoc.map((nd) => (
                <tr
                  key={nd.id}
                  onClick={() => setNguoiDungDangChon(nd)}
                  style={{
                    height: '60px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--primary)' }}>{nd.maDinhDanh}</td>
                  <td style={{ padding: '0 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={nd.avatarUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      {nd.hoTen}
                    </div>
                  </td>
                  <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>
                    {nd.lopHoacChucVu || nd.boMonHoacNganh}
                  </td>
                  <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{nd.khoa}</td>
                  <td style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>{nd.email}</td>
                  <td style={{ padding: '0 16px' }}>
                    <span
                      className={
                        nd.trangThai === 'HOAT_DONG'
                          ? 'badge badge-success'
                          : nd.trangThai === 'BI_KHOA'
                          ? 'badge badge-danger'
                          : 'badge badge-warning'
                      }
                    >
                      ● {nd.trangThai === 'HOAT_DONG' ? 'Hoạt động' : nd.trangThai === 'BI_KHOA' ? 'Bị khóa' : 'Chưa kích hoạt'}
                    </span>
                  </td>
                  <td style={{ padding: '0 16px', textAlign: 'right' }}>
                    <ChevronRight size={18} color="var(--text-tertiary)" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {nguoiDungDangChon && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setNguoiDungDangChon(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '460px',
              height: '100%',
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'drawerTruotVao 0.22s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              overflowY: 'auto'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Chi tiết tài khoản</h3>
                <button type="button" onClick={() => setNguoiDungDangChon(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <img src={nguoiDungDangChon.avatarUrl} alt="" style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{nguoiDungDangChon.hoTen}</h4>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>{nguoiDungDangChon.maDinhDanh}</span>
                  <div style={{ marginTop: '4px' }}>
                    <span className={nguoiDungDangChon.trangThai === 'HOAT_DONG' ? 'badge badge-success' : 'badge badge-danger'}>
                      ● {nguoiDungDangChon.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{nguoiDungDangChon.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Khoa:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{nguoiDungDangChon.khoa}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Bộ môn / Ngành:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{nguoiDungDangChon.boMonHoacNganh}</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Quyền truy cập hệ thống
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(nguoiDungDangChon.quyen).map(([key, value]) => {
                    const tenQuyen: Record<string, string> = {
                      taoBaiKiemTra: 'Tạo bài kiểm tra',
                      chinhSuaBaiKiemTra: 'Chỉnh sửa bài kiểm tra',
                      taoPhongThi: 'Tạo phòng thi',
                      giamSatThi: 'Giám sát thi',
                      chamBai: 'Chấm bài',
                      xemKetQua: 'Xem kết quả',
                      quanLyNguoiDung: 'Quản lý người dùng',
                      quanLyHeThong: 'Quản lý hệ thống'
                    };
                    return (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => {
                            const quyenMoi = { ...nguoiDungDangChon.quyen, [key]: e.target.checked };
                            xuLyLuuQuyenDrawer(quyenMoi);
                          }}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        {tenQuyen[key] || key}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const ttMoi: TrangThaiTaiKhoan = nguoiDungDangChon.trangThai === 'HOAT_DONG' ? 'BI_KHOA' : 'HOAT_DONG';
                  onCapNhatNguoiDung({ ...nguoiDungDangChon, trangThai: ttMoi });
                  setNguoiDungDangChon(null);
                  onHienThiToast('Thành công', `Đã ${ttMoi === 'BI_KHOA' ? 'khóa' : 'mở khóa'} tài khoản.`, 'warning');
                }}
              >
                <Lock size={16} /> {nguoiDungDangChon.trangThai === 'HOAT_DONG' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              </button>

              <button
                type="button"
                className="btn-danger"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  onXoaNguoiDung(nguoiDungDangChon.id);
                  setNguoiDungDangChon(null);
                  onHienThiToast('Đã xóa', 'Đã xóa tài khoản khỏi hệ thống.', 'error');
                }}
              >
                <Trash2 size={16} /> Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {hienThiModalThem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '560px', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Thêm tài khoản mới</h3>
              <button type="button" onClick={() => setHienThiModalThem(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>

            {buocThemNguoiDung === 1 ? (
              <div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Bước 1: Chọn loại tài khoản cần khởi tạo</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div
                    onClick={() => setVaiTroFormThem('SINH_VIEN')}
                    style={{
                      padding: '20px',
                      borderRadius: '14px',
                      border: vaiTroFormThem === 'SINH_VIEN' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: vaiTroFormThem === 'SINH_VIEN' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                      cursor: 'pointer'
                    }}
                  >
                    <GraduationCap size={28} color="var(--primary)" />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px', margin: 0 }}>SINH VIÊN</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>Tham gia làm bài thi LAN/Cloud</p>
                  </div>

                  <div
                    onClick={() => setVaiTroFormThem('GIANG_VIEN')}
                    style={{
                      padding: '20px',
                      borderRadius: '14px',
                      border: vaiTroFormThem === 'GIANG_VIEN' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: vaiTroFormThem === 'GIANG_VIEN' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                      cursor: 'pointer'
                    }}
                  >
                    <UserCheck size={28} color="var(--primary)" />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px', margin: 0 }}>GIẢNG VIÊN</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>Tạo đề, tổ chức thi & chấm bài</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-primary" onClick={() => setBuocThemNguoiDung(2)}>
                    Tiếp tục →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={xuLyNopFormThem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      {vaiTroFormThem === 'SINH_VIEN' ? 'Mã sinh viên' : 'Mã giảng viên'}
                    </label>
                    <input
                      type="text"
                      className="input-custom"
                      style={{ width: '100%' }}
                      required
                      value={formThemState.maDinhDanh}
                      onChange={(e) => setFormThemState({ ...formThemState, maDinhDanh: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Họ và tên</label>
                    <input
                      type="text"
                      className="input-custom"
                      style={{ width: '100%' }}
                      required
                      value={formThemState.hoTen}
                      onChange={(e) => setFormThemState({ ...formThemState, hoTen: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email trường</label>
                    <input
                      type="email"
                      className="input-custom"
                      style={{ width: '100%' }}
                      required
                      value={formThemState.email}
                      onChange={(e) => setFormThemState({ ...formThemState, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Số điện thoại</label>
                    <input
                      type="text"
                      className="input-custom"
                      style={{ width: '100%' }}
                      value={formThemState.soDienThoai}
                      onChange={(e) => setFormThemState({ ...formThemState, soDienThoai: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setBuocThemNguoiDung(1)}>
                    ← Quay lại
                  </button>
                  <button type="submit" className="btn-primary">
                    Xác nhận thêm
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {hienThiModalExcel && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '600px', backgroundColor: 'var(--bg-surface)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Nhập danh sách từ Excel</h3>
              <button type="button" onClick={() => setHienThiModalExcel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
              {['01 File', '02 Kiểm tra', '03 Xác nhận', '04 Hoàn tất'].map((stepName, idx) => {
                const currentStep = idx + 1;
                const isDone = buocExcel > currentStep;
                const isCurrent = buocExcel === currentStep;

                return (
                  <div key={stepName} style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? 'var(--primary)' : isDone ? 'var(--success)' : 'var(--bg-surface-subtle)',
                        color: isCurrent || isDone ? '#fff' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isDone ? <Check size={16} /> : currentStep}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {stepName}
                    </span>
                  </div>
                );
              })}
            </div>

            {buocExcel === 1 && (
              <div>
                <div
                  onClick={() => setBuocExcel(2)}
                  style={{
                    border: '2px dashed var(--primary)',
                    borderRadius: '14px',
                    padding: '40px',
                    textAlign: 'center',
                    backgroundColor: 'var(--primary-subtle)',
                    cursor: 'pointer',
                    marginBottom: '16px'
                  }}
                >
                  <Upload size={36} color="var(--primary)" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Thả file Excel (.xlsx, .xls) vào đây
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>hoặc bấm để chọn file từ máy tính</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <a href="#sample" onClick={(e) => e.preventDefault()} style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                    📥 Tải file mẫu danh sách sinh viên (.xlsx)
                  </a>
                </div>
              </div>
            )}

            {buocExcel === 2 && (
              <div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <span className="badge badge-success">✓ 120 dòng hợp lệ</span>
                  <span className="badge badge-danger">✕ 5 dòng bị lỗi</span>
                </div>
                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '12px' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Dòng 14: Mã sinh viên '21103100123' trùng lặp</span>
                    <span>Bỏ qua</span>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Dòng 15: Nguyễn Văn B (DHTI15A1HN)</span>
                    <span>Hợp lệ</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="button" className="btn-primary" onClick={() => setBuocExcel(3)}>
                    Tiếp tục →
                  </button>
                </div>
              </div>
            )}

            {buocExcel === 3 && (
              <div>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Xác nhận nhập <b>120 tài khoản hợp lệ</b> vào hệ thống UNETI EXAM. (5 dòng lỗi sẽ tự động bỏ qua).
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setBuocExcel(2)}>Quay lại</button>
                  <button type="button" className="btn-primary" onClick={() => setBuocExcel(4)}>Xác nhận nhập</button>
                </div>
              </div>
            )}

            {buocExcel === 4 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Nhập dữ liệu thành công!</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Đã thêm 120 tài khoản mới vào cơ sở dữ liệu.</p>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ marginTop: '16px' }}
                  onClick={() => setHienThiModalExcel(false)}
                >
                  Hoàn tất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
