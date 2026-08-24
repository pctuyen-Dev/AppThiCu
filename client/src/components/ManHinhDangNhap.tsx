import React, { useState } from 'react';
import { BookOpen, ShieldCheck, UserCheck, GraduationCap, Wifi, Lock, User as UserIcon } from 'lucide-react';
import type { VaiTroNguoiDung } from '../types/BoThuVienTypes';

interface ManHinhDangNhapProps {
  onDangNhapThanhCong: (vaiTroChon: VaiTroNguoiDung, tenDangNhap: string) => void;
}

export const ManHinhDangNhap: React.FC<ManHinhDangNhapProps> = ({ onDangNhapThanhCong }) => {
  const [vaiTroChon, setVaiTroChon] = useState<VaiTroNguoiDung>('ADMIN');
  const [tenDangNhap, setTenDangNhap] = useState<string>('admin.uneti');
  const [matKhau, setMatKhau] = useState<string>('••••••••');
  const [ghiNhoTaiKhoan, setGhiNhoTaiKhoan] = useState<boolean>(true);

  const xuLyDoiVaiTro = (vaiTro: VaiTroNguoiDung) => {
    setVaiTroChon(vaiTro);
    if (vaiTro === 'ADMIN') setTenDangNhap('admin.uneti');
    if (vaiTro === 'GIANG_VIEN') setTenDangNhap('namtv@uneti.edu.vn');
    if (vaiTro === 'SINH_VIEN') setTenDangNhap('21103100123');
  };

  const xuLyNopForm = (e: React.FormEvent) => {
    e.preventDefault();
    onDangNhapThanhCong(vaiTroChon, tenDangNhap);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--bg-app)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
          opacity: 0.6
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-subtle) 0%, transparent 70%)',
          opacity: 0.6
        }}
      />

      <div
        style={{
          width: '460px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)',
          padding: '36px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <BookOpen size={30} />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', margin: 0 }}>
          HỆ THỐNG THI CỬ UNETI
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center', marginBottom: '20px' }}>
          Trường Đại Học Kinh Tế - Kỹ Thuật Công Nghiệp
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '99px',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '24px'
          }}
        >
          <span className="animate-pulse-subtle" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
          <Wifi size={14} />
          <span>Máy chủ LAN Khai Thác: Đã sẵn sàng (192.168.1.100)</span>
        </div>

        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '4px',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '4px',
            marginBottom: '24px'
          }}
        >
          <button
            type="button"
            onClick={() => xuLyDoiVaiTro('ADMIN')}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: vaiTroChon === 'ADMIN' ? 'var(--bg-surface)' : 'transparent',
              color: vaiTroChon === 'ADMIN' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: vaiTroChon === 'ADMIN' ? 600 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: vaiTroChon === 'ADMIN' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <ShieldCheck size={15} /> Admin
          </button>

          <button
            type="button"
            onClick={() => xuLyDoiVaiTro('GIANG_VIEN')}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: vaiTroChon === 'GIANG_VIEN' ? 'var(--bg-surface)' : 'transparent',
              color: vaiTroChon === 'GIANG_VIEN' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: vaiTroChon === 'GIANG_VIEN' ? 600 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: vaiTroChon === 'GIANG_VIEN' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <UserCheck size={15} /> Giảng viên
          </button>

          <button
            type="button"
            onClick={() => xuLyDoiVaiTro('SINH_VIEN')}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: vaiTroChon === 'SINH_VIEN' ? 'var(--bg-surface)' : 'transparent',
              color: vaiTroChon === 'SINH_VIEN' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: vaiTroChon === 'SINH_VIEN' ? 600 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: vaiTroChon === 'SINH_VIEN' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <GraduationCap size={15} /> Sinh viên
          </button>
        </div>

        <form onSubmit={xuLyNopForm} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Tên đăng nhập / MSV / Mã GV
            </label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="input-custom"
                style={{ width: '100%', paddingLeft: '38px' }}
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
                placeholder="Nhập mã định danh của bạn"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="password"
                className="input-custom"
                style={{ width: '100%', paddingLeft: '38px' }}
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={ghiNhoTaiKhoan}
                onChange={(e) => setGhiNhoTaiKhoan(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              Ghi nhớ máy này
            </label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}>
            ĐĂNG NHẬP HỆ THỐNG
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
          Được bảo mật bởi Supabase Cloud & LAN Encrypted Protocol 2026
        </div>
      </div>
    </div>
  );
};
