import React from 'react';
import { Wifi, Cloud, Play, Clock, ArrowLeft, Shield } from 'lucide-react';
import type { PhongThi } from '../../types/BoThuVienTypes';

interface PhongChoThiProps {
  phongThi: PhongThi;
  onQuayLai: () => void;
  onVaoLamBai: () => void;
}

export const PhongChoThi: React.FC<PhongChoThiProps> = ({ phongThi, onQuayLai, onVaoLamBai }) => {
  const daSanSang = phongThi.trangThai === 'DANG_THI';

  return (
    <div
      style={{
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <button
        type="button"
        className="btn-secondary"
        onClick={onQuayLai}
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div
        style={{
          width: '540px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <span className="badge badge-neutral" style={{ fontSize: '13px', padding: '6px 14px' }}>
          PHÒNG THI {phongThi.maPhong}
        </span>

        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          {phongThi.monHoc}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
          {phongThi.tenBaiKiemTra}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Giảng viên phụ trách: <b>{phongThi.giangVienPhuTach}</b> • Thời gian: <b>{phongThi.thoiLuongPhut} phút</b>
        </p>

        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-around',
            margin: '12px 0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>
            <span className="animate-pulse-subtle" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <Wifi size={14} /> LAN Đã kết nối
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <Shield size={14} /> Server Sẵn sàng
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
            <Cloud size={14} /> Cloud Đã đồng bộ
          </div>
        </div>

        {!daSanSang ? (
          <div style={{ width: '100%', padding: '16px', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}>
            <Clock size={20} style={{ display: 'block', margin: '0 auto 6px' }} />
            Vui lòng chờ giảng viên bắt đầu kỳ thi...
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'modalPhongTo 0.2s ease-out forwards' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}>
              ✓ Phòng thi đã sẵn sàng! Chúc bạn làm bài tốt.
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '16px', fontWeight: 800 }}
              onClick={onVaoLamBai}
            >
              <Play size={20} /> VÀO THI NGAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
