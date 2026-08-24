import React from 'react';
import { User, Mail, Phone, Building, BookOpen, ShieldCheck, Award, FileText, CheckCircle2, Radio } from 'lucide-react';
import type { PhongThi, BaiKiemTra } from '../../types/BoThuVienTypes';

interface TongQuanGiangVienProps {
  danhSachPhongThi?: PhongThi[];
  danhSachBaiKiemTra?: BaiKiemTra[];
  onChuyenToiGiamSat?: (phongThiId: string) => void;
  onChuyenToiTaoBai?: () => void;
  onChuyenToiTaoPhong?: () => void;
}

export const TongQuanGiangVien: React.FC<TongQuanGiangVienProps> = ({
  danhSachPhongThi = [],
  danhSachBaiKiemTra = []
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Thông tin tài khoản giảng viên
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          Quản lý hồ sơ công tác giảng dạy và thông tin tài khoản tại Trường ĐH Kinh tế - Kỹ thuật Công nghiệp.
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
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              alt="Avatar"
              style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  TS. Trần Văn Nam
                </h2>
                <span className="badge badge-success">● Tài khoản Hoạt động</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px', margin: 0 }}>
                MÃ GIẢNG VIÊN: GV001
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
                Khoa Công nghệ thông tin • Bộ môn Công nghệ phần mềm
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
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mã giảng viên</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>GV001</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email trường cấp</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>namtv@uneti.edu.vn</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Số điện thoại liên hệ</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>0912 345 678</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Khoa công tác</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>Công nghệ thông tin</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bộ môn sinh hoạt</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>Công nghệ phần mềm</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Chức danh / Học vị</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>Tiến sĩ (TS.) - Giảng viên chính</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trạng thái xác thực</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--success)', margin: '2px 0 0' }}>● Đã xác thực UNETI Staff ID</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Teaching Stats & Status Cards */}
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
              Thống kê công tác thi cử
            </h3>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bài kiểm tra đã tạo</span>
                <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)', margin: '2px 0 0' }}>{danhSachBaiKiemTra.length} đề thi</p>
              </div>
              <FileText size={32} color="var(--primary)" />
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Phòng thi phụ trách</span>
                <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--success)', margin: '2px 0 0' }}>{danhSachPhongThi.length} phòng</p>
              </div>
              <Radio size={32} color="var(--success)" />
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Đã chấm thành công</span>
                <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--warning)', margin: '2px 0 0' }}>450 bài làm</p>
              </div>
              <CheckCircle2 size={32} color="var(--warning)" />
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
              Hướng dẫn thao tác
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              • Giảng viên sử dụng tab <b>"Thi cử"</b> để tạo đề thi, khởi tạo phòng thi LAN và thực hiện giám sát thi.
              <br /><br />
              • Chuyển sang tab <b>"Chấm bài"</b> để thực hiện chấm điểm bài làm tự luận và công bố kết quả.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TongQuanGiangVien;
