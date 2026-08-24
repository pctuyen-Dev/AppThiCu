import React from 'react';
import { User, Mail, Phone, GraduationCap, Building, BookOpen, ShieldCheck, Calendar, Award, CheckCircle2 } from 'lucide-react';
import type { PhongThi } from '../../types/BoThuVienTypes';

interface TongQuanSinhVienProps {
  danhSachPhongThi?: PhongThi[];
  onVaoPhongCho?: (phongThiId: string) => void;
  onVaoLamBai?: (phongThiId: string) => void;
}

export const TongQuanSinhVien: React.FC<TongQuanSinhVienProps> = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Thông tin tài khoản sinh viên
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          Quản lý lý lịch cá nhân và tiến trình học tập tại Trường ĐH Kinh tế - Kỹ thuật Công nghiệp.
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
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
              alt="Avatar"
              style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Nguyễn Văn Minh
                </h2>
                <span className="badge badge-success">● Tài khoản Hoạt động</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px', margin: 0 }}>
                MÃ SINH VIÊN: 21103100123
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
                Khoa Công nghệ thông tin • Lớp DHTI15A1HN
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
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mã sinh viên</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>21103100123</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email trường cấp</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>21103100123@sv.uneti.edu.vn</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Số điện thoại liên hệ</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>0355 112 233</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lớp sinh hoạt</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>DHTI15A1HN</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Khoa quản lý</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>Công nghệ thông tin</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ngành / Hệ đào tạo</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>Công nghệ thông tin (Chính quy)</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Khóa học</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>K15 (2021 - 2025)</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trạng thái xác thực</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--success)', margin: '2px 0 0' }}>● Đã xác thực UNETI ID</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Academic Summary & Policy Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Academic Stats Summary */}
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
              Kết quả học tập tích lũy
            </h3>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Điểm trung bình (GPA)</span>
                <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)', margin: '2px 0 0' }}>8.5 / 10</p>
              </div>
              <Award size={32} color="var(--primary)" />
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tổng bài thi đã nộp</span>
                <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--success)', margin: '2px 0 0' }}>12 bài thi</p>
              </div>
              <CheckCircle2 size={32} color="var(--success)" />
            </div>
          </div>

          {/* UNETI Examination Board Notice */}
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
              Lưu ý quy chế thi cử UNETI
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              • Sinh viên truy cập tab <b>"Danh sách bài thi"</b> để tham gia các phòng thi LAN/Cloud đúng lịch thi.
              <br /><br />
              • Chuẩn bị sẵn thẻ Sinh viên và kiểm tra kết nối mạng LAN phòng máy trước khi làm bài.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TongQuanSinhVien;
