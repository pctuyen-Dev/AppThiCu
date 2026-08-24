import React from 'react';
import { User, Mail, Phone, Building, ShieldCheck, Database, Cpu, Users } from 'lucide-react';
import type { DemTrangThaiHeThong, PhongThi, NhatKyHeThong } from '../../types/BoThuVienTypes';

interface TongQuanAdminProps {
  trangThaiHeThong?: DemTrangThaiHeThong;
  danhSachPhongThi?: PhongThi[];
  danhSachNhatKy?: NhatKyHeThong[];
  onChuyenToiNguoiDung?: () => void;
  onChuyenToiDuLieu?: () => void;
}

export const TongQuanAdmin: React.FC<TongQuanAdminProps> = ({
  trangThaiHeThong = {
    lanServerOnline: true,
    cloudConnected: true,
    databaseActive: true,
    storageActive: true,
    latencyLanMs: 12,
    latencyDatabaseMs: 24,
    latencyCloudMs: 85,
    storageUsedGB: 68.4,
    storageTotalGB: 100,
    pendingSyncCount: 0
  }
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Thông tin tài khoản quản trị viên
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          Quản lý lý lịch quản trị hệ thống và kiểm tra hạ tầng máy chủ UNETI EXAM.
        </p>
      </div>

      {/* Main 2-Column Profile Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Account Detail Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Header Profile Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Avatar"
              style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Nguyễn Quản Trị
                </h2>
                <span className="badge badge-success">● Super Admin</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px', margin: 0 }}>
                MÃ QUẢN TRỊ: ADM001
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
                Trung tâm CNTT & Máy tính • Trường ĐH Kinh tế - Kỹ thuật Công nghiệp
              </p>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mã quản trị</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>ADM001</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email trường cấp</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>admin.uneti@uneti.edu.vn</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Số điện thoại liên hệ</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>0988 123 456</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Đơn vị công tác</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>Trung tâm CNTT & Máy tính</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Chức vụ quản lý</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>Trưởng phòng KT-CNTT</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cấp độ phân quyền</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--success)', margin: '2px 0 0' }}>● Quản trị tối cao (Super Admin)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Infrastructure & System Overview Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Thống kê hệ thống máy chủ
            </h3>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tài khoản quản lý</span>
                <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', margin: '2px 0 0' }}>13.066 tài khoản</p>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>12.580 SV • 486 GV</span>
              </div>
              <Users size={32} color="var(--primary)" />
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trạng thái mạng LAN</span>
                <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success)', margin: '2px 0 0' }}>{trangThaiHeThong.latencyLanMs}ms</p>
                <span style={{ fontSize: '11px', color: 'var(--success)' }}>● 192.168.1.100 Hoạt động</span>
              </div>
              <Database size={32} color="var(--success)" />
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Dung lượng Cloud Storage</span>
                <b style={{ fontSize: '13px', color: 'var(--primary)' }}>{trangThaiHeThong.storageUsedGB} / 100 GB</b>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${trangThaiHeThong.storageUsedGB}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '99px' }} />
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 10px', color: 'var(--text-primary)' }}>
              Hướng dẫn dành cho Admin
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              • Sử dụng các tab <b>"Người dùng"</b>, <b>"Dữ liệu"</b>, <b>"Hệ thống"</b> trên sidebar để quản lý tài khoản, đồng bộ Cloud và cấu hình máy chủ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TongQuanAdmin;
