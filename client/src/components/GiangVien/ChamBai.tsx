import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Send,
  Download,
  Search,
  Edit3,
  X,
  MoreVertical,
  Eye,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  FileCode,
  FileImage,
  ChevronRight,
  ChevronDown,
  FileArchive,
  RotateCcw
} from 'lucide-react';
import type { BaiNopSinhVien } from '../../types/BoThuVienTypes';
import { chuanHoaMaPhong } from '../../utils/MaPhongUtils';

export interface DonPhucKhao {
  id: string;
  maSinhVien: string;
  hoTenSinhVien: string;
  lop: string;
  tenBaiKiemTra: string;
  maPhong: string;
  ngayNopDon: string;
  diemBanDau: number;
  diemSauPhucKhao?: number;
  lyDoPhucKhao: string;
  trangThai: 'CHO_XU_LY' | 'DA_CHAP_NHAN' | 'TU_CHOI';
  phanHoiGiangVien?: string;
}

export interface FileInZip {
  id: string;
  name: string;
  type: 'code' | 'pdf' | 'image' | 'text' | 'folder';
  size: string;
  content?: string;
  children?: FileInZip[];
}

const mockZipStructure: FileInZip[] = [
  {
    id: 'f-src',
    name: 'Mã Nguồn (src/)',
    type: 'folder',
    size: '1.2 MB',
    children: [
      {
        id: 'f-sql',
        name: 'database_schema.sql',
        type: 'code',
        size: '15 KB',
        content: `-- HE THONG QUAN LY DAO TAO UNETI\n-- Create Table SinhVien\nCREATE TABLE SinhVien (\n    MaSV VARCHAR(20) PRIMARY KEY,\n    HoTen NVARCHAR(100) NOT NULL,\n    Lop VARCHAR(20) NOT NULL\n);\n\n-- Create Table Diem\nCREATE TABLE Diem (\n    MaSV VARCHAR(20),\n    MaMon VARCHAR(20),\n    DiemExam FLOAT,\n    PRIMARY KEY (MaSV, MaMon)\n);\n\n-- Store Procedure Cap Nhat Diem\nCREATE PROCEDURE SP_CapNhatDiem\n    @MaSV VARCHAR(20),\n    @DiemMoi FLOAT\nAS\nBEGIN\n    UPDATE Diem SET DiemExam = @DiemMoi WHERE MaSV = @MaSV;\nEND;`
      },
      {
        id: 'f-js',
        name: 'app.js',
        type: 'code',
        size: '28 KB',
        content: `// React Web Node.js Controller\nimport express from 'express';\nconst app = express();\n\napp.get('/api/sinhvien', async (req, res) => {\n  try {\n    const data = await db.query('SELECT * FROM SinhVien');\n    res.json({ success: true, data });\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n});`
      },
      {
        id: 'f-html',
        name: 'index.html',
        type: 'code',
        size: '8 KB',
        content: `<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <meta charset="UTF-8">\n  <title>Ứng dụng Bài làm UNETI</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>`
      }
    ]
  },
  {
    id: 'f-docs',
    name: 'Báo cáo & Tài liệu',
    type: 'folder',
    size: '2.3 MB',
    children: [
      {
        id: 'f-pdf',
        name: 'BaoCao_TuLuan_ChiTiet.pdf',
        type: 'pdf',
        size: '1.8 MB',
        content: 'Báo cáo chi tiết quy trình chuẩn hóa CSDL 3NF, thiết kế kiến trúc hệ thống Quản lý Đào tạo UNETI.'
      },
      {
        id: 'f-img',
        name: 'SoDoCSDL_3NF.png',
        type: 'image',
        size: '450 KB',
        content: 'Sơ đồ Entity Relationship Diagram (ERD) kết nối các bảng dữ liệu.'
      },
      {
        id: 'f-txt',
        name: 'HuongDanChayProject.txt',
        type: 'text',
        size: '4 KB',
        content: `HƯỚNG DẪN KHỞI CHẠY DỰ ÁN:\n1. Chạy npm install ở thư mục gốc.\n2. Import file database_schema.sql vào PostgreSQL / SQLite.\n3. Chạy npm run dev để chạy ứng dụng.`
      }
    ]
  }
];

interface ChamBaiProps {
  danhSachBaiNop: BaiNopSinhVien[];
  onHienThiToast: (tieuDe: string, noiDung: string, loai: 'success' | 'warning' | 'error' | 'info') => void;
  tabBanDau?: 'KHO_BAI_NOP' | 'CHAM_DIEM' | 'PHUC_KHAO';
}

const initialDonPhucKhao: DonPhucKhao[] = [
  {
    id: 'PK001',
    maSinhVien: '20210003',
    hoTenSinhVien: 'Lê Phương C',
    lop: 'DHTI15A1HN',
    tenBaiKiemTra: 'Kiểm tra Giữa kỳ - Lập trình Web',
    maPhong: 'A102',
    ngayNopDon: '25/08/2026 10:15',
    diemBanDau: 6.5,
    lyDoPhucKhao: 'Em xin phúc khảo câu 3 bài tập tự luận. Em đã viết đúng thuật toán đệ quy nhưng bị trừ 2 điểm.',
    trangThai: 'CHO_XU_LY'
  },
  {
    id: 'PK002',
    maSinhVien: '20210005',
    hoTenSinhVien: 'Phạm Ngọc E',
    lop: 'DHTI15A1HN',
    tenBaiKiemTra: 'Thi Kết thúc học phần - Cơ sở dữ liệu',
    maPhong: 'B201',
    ngayNopDon: '24/08/2026 14:30',
    diemBanDau: 7.0,
    diemSauPhucKhao: 8.5,
    lyDoPhucKhao: 'File SQL nộp của em có đủ 5 câu truy vấn chuẩn Chuẩn hóa 3NF.',
    trangThai: 'DA_CHAP_NHAN',
    phanHoiGiangVien: 'Đã duyệt lại câu 4 bổ sung +1.5 điểm.'
  },
  {
    id: 'PK003',
    maSinhVien: '20210008',
    hoTenSinhVien: 'Trần Văn K',
    lop: 'DHTI15A2HN',
    tenBaiKiemTra: 'Kiểm tra Giữa kỳ - Lập trình Web',
    maPhong: 'A102',
    ngayNopDon: '23/08/2026 16:45',
    diemBanDau: 5.0,
    lyDoPhucKhao: 'Em xin chấm lại câu 2 trắc nghiệm.',
    trangThai: 'TU_CHOI',
    phanHoiGiangVien: 'Câu 2 trắc nghiệm hệ thống chấm tự động chính xác, không thay đổi điểm.'
  }
];

export const ChamBai: React.FC<ChamBaiProps> = ({ danhSachBaiNop, onHienThiToast, tabBanDau = 'CHAM_DIEM' }) => {
  // ------------------------------------------------------------------
  // SUB-TAB CHÍNH: KHO BÀI NỘP - CHẤM ĐIỂM - PHÚC KHẢO
  // ------------------------------------------------------------------
  const [tabHienTai, setTabHienTai] = useState<'KHO_BAI_NOP' | 'CHAM_DIEM' | 'PHUC_KHAO'>(tabBanDau);

  useEffect(() => {
    if (tabBanDau) {
      setTabHienTai(tabBanDau);
      setBaiNopDangChon(null);
    }
  }, [tabBanDau]);

  // Trạng thái Lọc & Tìm kiếm
  const [maPhongChon, setMaPhongChon] = useState<string>('TAT_CA');
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [trangThaiLoc, setTrangThaiLoc] = useState<string>('TAT_CA');

  // State chọn bài nộp trong Kho bài nộp & Xem chi tiết vi phạm
  const [selectedBaiNopIds, setSelectedBaiNopIds] = useState<string[]>([]);
  const [baiNopXemViPham, setBaiNopXemViPham] = useState<BaiNopSinhVien | null>(null);

  // Menu 3 chấm thao tác trên từng dòng
  const [menuThaoTacOpenId, setMenuThaoTacOpenId] = useState<string | null>(null);

  // Sinh viên đang được chấm chi tiết (Hiển thị Cửa sổ nổi Modal Popup)
  const [baiNopDangChon, setBaiNopDangChon] = useState<BaiNopSinhVien | null>(null);
  const [fileZipDangChon, setFileZipDangChon] = useState<FileInZip>(mockZipStructure[0].children![0]);
  const [folderOpenState, setFolderOpenState] = useState<Record<string, boolean>>({ 'f-src': true, 'f-docs': true });

  const [diemInput, setDiemInput] = useState<number>(8.5);
  const [diemInputText, setDiemInputText] = useState<string>('8.5');
  const [nhanXetInput, setNhanXetInput] = useState<string>('');

  // Đơn phúc khảo
  const [danhSachPhucKhao, setDanhSachPhucKhao] = useState<DonPhucKhao[]>(initialDonPhucKhao);
  const [selectedPhucKhaoIds, setSelectedPhucKhaoIds] = useState<string[]>([]);
  const [donPhucKhaoDangChon, setDonPhucKhaoDangChon] = useState<DonPhucKhao | null>(null);
  const [khongThayDoiDiem, setKhongThayDoiDiem] = useState<boolean>(false);

  // Mở bài làm chấm lại khi bấm "Chấm lại" đơn phúc khảo
  const xuLyMoChamLaiPhucKhao = (pk: DonPhucKhao) => {
    setDonPhucKhaoDangChon(pk);
    const bnMatch: BaiNopSinhVien = danhSachBaiNop.find((b) => b.maSinhVien === pk.maSinhVien) || {
      id: pk.id,
      maSinhVien: pk.maSinhVien,
      hoTenSinhVien: pk.hoTenSinhVien,
      lop: pk.lop,
      tenBaiKiemTra: pk.tenBaiKiemTra,
      maPhong: pk.maPhong,
      phongThiId: pk.maPhong,
      monHoc: 'Cơ sở dữ liệu',
      loaiBaiThi: 'TU_LUAN',
      ngayNop: pk.ngayNopDon,
      diemSo: pk.diemBanDau,
      nhanXetGiangVien: pk.phanHoiGiangVien || '',
      trangThaiCham: 'DA_CHAM',
      nhatKyViPhamChiTiet: []
    };
    setBaiNopDangChon(bnMatch);
    const scoreVal = pk.diemSauPhucKhao || pk.diemBanDau;
    setDiemInput(scoreVal);
    setDiemInputText(scoreVal.toString());
    setKhongThayDoiDiem(pk.trangThai === 'TU_CHOI');
    setNhanXetInput(pk.phanHoiGiangVien || '');
    if (mockZipStructure[0]?.children?.[0]) {
      setFileZipDangChon(mockZipStructure[0].children[0]);
    }
  };

  // Hàm làm tròn điểm 2 chữ số thập phân (vd: 10.23 -> 10.23, 10.245 -> 10.25)
  const lamTronDiem = (val: number): number => {
    if (isNaN(val)) return 0;
    return Math.round(val * 100) / 100;
  };

  // Render Badge Tình trạng nộp (Nộp sớm & Nộp đúng giờ gom chung thành Nộp sớm, bên dưới hiển thị thời gian tính đến giây)
  const renderBadgeTinhTrangNop = (bn: BaiNopSinhVien) => {
    const info = bn.tinhTrangNop || { loai: 'DUNG_GIO', moTa: 'Nộp đúng giờ' };
    const isMuon = info.loai === 'MUON';

    let thoiGianTxt = info.thoiGianChiTiet;
    if (!thoiGianTxt) {
      const matchPhut = info.moTa.match(/\d+/);
      const phut = info.soPhut !== undefined ? info.soPhut : (matchPhut ? parseInt(matchPhut[0]) : 0);
      const phutStr = phut < 10 ? `0${phut}` : `${phut}`;
      thoiGianTxt = `${phutStr} phút 00 giây`;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
        {isMuon ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '6px', backgroundColor: 'var(--error-light, #fee2e2)', color: 'var(--error, #b91c1c)', fontWeight: 600, fontSize: '12px' }}>
            <AlertCircle size={13} /> Nộp muộn
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '6px', backgroundColor: 'var(--success-light, #dcfce7)', color: 'var(--success, #15803d)', fontWeight: 600, fontSize: '12px' }}>
            <CheckCircle2 size={13} /> Nộp sớm
          </span>
        )}
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500, paddingLeft: '2px' }}>
          {thoiGianTxt}
        </span>
      </div>
    );
  };

  // Render Số lần vi phạm hiển thị số bình thường không viền, click để mở modal chi tiết
  const renderBadgeViPhamKho = (bn: BaiNopSinhVien) => {
    const count = bn.soLanViPham || 0;
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          setBaiNopXemViPham(bn);
        }}
        title="Click để xem chi tiết nhật ký giám sát / vi phạm"
        style={{
          display: 'inline-block',
          padding: '4px 8px',
          color: count > 0 ? 'var(--warning, #f59e0b)' : 'var(--text-primary)',
          fontWeight: count > 0 ? 800 : 600,
          fontSize: '13.5px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        {count}
      </span>
    );
  };

  // Render Menu Ba chấm Thao tác
  const renderMenuThaoTac = (bn: BaiNopSinhVien) => {
    const isMenuOpen = menuThaoTacOpenId === bn.id;
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuThaoTacOpenId(isMenuOpen ? null : bn.id);
          }}
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: isMenuOpen ? 'var(--primary-light)' : 'var(--bg-surface-subtle)',
            color: isMenuOpen ? 'var(--primary)' : 'var(--text-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)'
          }}
          title="Thao tác"
        >
          <MoreVertical size={16} />
        </button>

        {isMenuOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 100 }}
              onClick={(e) => {
                e.stopPropagation();
                setMenuThaoTacOpenId(null);
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 4px)',
                width: '160px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)',
                zIndex: 101,
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                textAlign: 'left'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuThaoTacOpenId(null);
                  xuLyMoChamChiTiet(bn);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Eye size={14} style={{ color: 'var(--primary)' }} />
                Xem bài làm
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuThaoTacOpenId(null);
                  onHienThiToast('Tải file', `Đang tải bài làm của sinh viên ${bn.hoTenSinhVien}...`, 'info');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} style={{ color: 'var(--success, #10b981)' }} />
                Tải file bài nộp
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuThaoTacOpenId(null);
                  xuLyMoChamChiTiet(bn);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={14} style={{ color: 'var(--warning, #f59e0b)' }} />
                {bn.trangThaiCham === 'DA_CHAM' ? 'Sửa điểm' : 'Chấm điểm'}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Danh sách các Mã Phòng Thi độc bản
  const danhSachMaPhongDocBan = Array.from(
    new Set(danhSachBaiNop.map((b) => chuanHoaMaPhong(b.maPhong || 'A102')))
  );

  // Filter bài nộp
  const danhSachBaiNopLoc = danhSachBaiNop.filter((bn) => {
    const maP = chuanHoaMaPhong(bn.maPhong || 'A102');
    const phuHopMaPhong = maPhongChon === 'TAT_CA' || maP === maPhongChon;
    const phuHopTuKhoa =
      bn.hoTenSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      bn.maSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      bn.tenBaiKiemTra.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
    const phuHopTrangThai =
      trangThaiLoc === 'TAT_CA' || bn.trangThaiCham === trangThaiLoc;

    return phuHopMaPhong && phuHopTuKhoa && phuHopTrangThai;
  });

  // Filter phúc khảo
  const danhSachPhucKhaoLoc = danhSachPhucKhao.filter((pk) => {
    const phuHopMaPhong = maPhongChon === 'TAT_CA' || pk.maPhong === maPhongChon;
    const phuHopTuKhoa =
      pk.hoTenSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      pk.maSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      pk.tenBaiKiemTra.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
    return phuHopMaPhong && phuHopTuKhoa;
  });

  // Thống kê nhanh
  const soLuongBaiChuaCham = danhSachBaiNop.filter((b) => b.trangThaiCham === 'CHUA_CHAM').length;
  const soLuongBaiDangCham = danhSachBaiNop.filter((b) => b.trangThaiCham === 'DANG_CHAM').length;
  const soLuongBaiDaCham = danhSachBaiNop.filter((b) => b.trangThaiCham === 'DA_CHAM').length;

  // Mở màn hình chấm chi tiết
  const xuLyMoChamChiTiet = (bn: BaiNopSinhVien) => {
    setBaiNopDangChon(bn);
    const initialScore = bn.diemSo !== undefined ? lamTronDiem(bn.diemSo) : 8.5;
    setDiemInput(initialScore);
    setDiemInputText(initialScore.toString());
    setNhanXetInput(bn.nhanXetGiangVien || 'Bài làm đạt yêu cầu. Cấu trúc rõ ràng.');
    if (mockZipStructure[0]?.children?.[0]) {
      setFileZipDangChon(mockZipStructure[0].children[0]);
    }
  };

  const xuLyLuuDiem = () => {
    if (!baiNopDangChon) return;

    if (donPhucKhaoDangChon) {
      if (khongThayDoiDiem) {
        setDanhSachPhucKhao((prev) =>
          prev.map((item) =>
            item.id === donPhucKhaoDangChon.id
              ? {
                  ...item,
                  trangThai: 'TU_CHOI',
                  phanHoiGiangVien: nhanXetInput || 'Giữ nguyên điểm số ban đầu sau khi xem xét bài làm.'
                }
              : item
          )
        );
        onHienThiToast(
          'Giữ nguyên điểm',
          `Giữ nguyên điểm ${donPhucKhaoDangChon.diemBanDau} cho sinh viên ${donPhucKhaoDangChon.hoTenSinhVien}.`,
          'info'
        );
      } else {
        const scoreVal = lamTronDiem(parseFloat(diemInputText) || diemInput);
        setDanhSachPhucKhao((prev) =>
          prev.map((item) =>
            item.id === donPhucKhaoDangChon.id
              ? {
                  ...item,
                  trangThai: 'DA_CHAP_NHAN',
                  diemSauPhucKhao: scoreVal,
                  phanHoiGiangVien: nhanXetInput || 'Đã cập nhật lại điểm sau khi xem xét bài làm.'
                }
              : item
          )
        );
        onHienThiToast(
          'Cập nhật điểm mới',
          `Đã đổi điểm thành công cho sinh viên ${donPhucKhaoDangChon.hoTenSinhVien}: ${donPhucKhaoDangChon.diemBanDau} ➔ ${scoreVal}.`,
          'success'
        );
      }
      setDonPhucKhaoDangChon(null);
      setBaiNopDangChon(null);
      return;
    }

    const scoreVal = lamTronDiem(parseFloat(diemInputText) || diemInput);
    setDiemInput(scoreVal);
    setDiemInputText(scoreVal.toString());
    onHienThiToast(
      'Đã lưu bài chấm',
      `Đã lưu điểm ${scoreVal} cho sinh viên ${baiNopDangChon.hoTenSinhVien} (${baiNopDangChon.maSinhVien}).`,
      'success'
    );
    setBaiNopDangChon(null);
  };

  // Xử lý Xuất file Excel định dạng Times New Roman, cỡ 14pt, tự căn chỉnh cho toàn bộ phòng thi
  const xuLyXuatExcelPhongThi = () => {
    const maP = maPhongChon === 'TAT_CA' ? 'TẤT CẢ PHÒNG THI' : `PHÒNG THI ${maPhongChon}`;
    const danhSachXuat = danhSachBaiNopLoc;

    if (danhSachXuat.length === 0) {
      onHienThiToast('Xuất Excel', 'Không có bài thi nào phù hợp để xuất file Excel.', 'warning');
      return;
    }

    const tableHeader = `
      <tr style="background-color: #1e3a8a; color: #ffffff; font-weight: bold; height: 42px; font-size: 14pt;">
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif;">STT</th>
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif; mso-number-format: '\\@';">MÃ SINH VIÊN</th>
        <th style="border: 1px solid #000000; text-align: left; padding: 8px; font-family: 'Times New Roman', Times, serif;">HỌ VÀ TÊN</th>
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif;">LỚP</th>
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif;">MÃ PHÒNG</th>
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif;">TRẠNG THÁI NỘP</th>
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif;">THỜI GIAN NỘP BÀI</th>
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif;">SỐ LẦN VI PHẠM</th>
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif;">TRẠNG THÁI CHẤM</th>
        <th style="border: 1px solid #000000; text-align: center; padding: 8px; font-family: 'Times New Roman', Times, serif;">ĐIỂM SỐ</th>
        <th style="border: 1px solid #000000; text-align: left; padding: 8px; font-family: 'Times New Roman', Times, serif;">NHẬN XẾT GIẢNG VIÊN</th>
      </tr>
    `;

    const tableRows = danhSachXuat.map((bn, idx) => {
      const isLate = bn.tinhTrangNop?.loai === 'MUON';
      const statusText = isLate ? 'Nộp muộn' : 'Nộp sớm';
      const timeDetail = bn.tinhTrangNop?.thoiGianChiTiet || (isLate ? '04 phút 12 giây' : '15 phút 20 giây');
      const trangThaiChamText = bn.trangThaiCham === 'DA_CHAM' ? 'Đã chấm' : bn.trangThaiCham === 'DANG_CHAM' ? 'Đang chấm' : 'Chưa chấm';
      const diemText = bn.diemSo !== undefined ? bn.diemSo.toString() : '';

      return `
        <tr style="height: 36px; font-size: 14pt; font-family: 'Times New Roman', Times, serif;">
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif;">${idx + 1}</td>
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif; mso-number-format: '\\@'; font-weight: bold;">${bn.maSinhVien}</td>
          <td style="border: 1px solid #000000; text-align: left; padding: 6px; font-family: 'Times New Roman', Times, serif; font-weight: bold;">${bn.hoTenSinhVien}</td>
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif;">${bn.lop}</td>
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif; font-weight: bold;">${chuanHoaMaPhong(bn.maPhong || 'A102')}</td>
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif;">${statusText}</td>
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif;">${timeDetail}</td>
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif; font-weight: bold;">${bn.soLanViPham || 0}</td>
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif;">${trangThaiChamText}</td>
          <td style="border: 1px solid #000000; text-align: center; padding: 6px; font-family: 'Times New Roman', Times, serif; font-weight: bold;">${diemText}</td>
          <td style="border: 1px solid #000000; text-align: left; padding: 6px; font-family: 'Times New Roman', Times, serif;">${bn.nhanXetGiangVien || ''}</td>
        </tr>
      `;
    }).join('');

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>DanhSachBaiThi</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table, td, th {
            font-family: 'Times New Roman', Times, serif !important;
            font-size: 14pt !important;
          }
        </style>
      </head>
      <body style="font-family: 'Times New Roman', Times, serif; font-size: 14pt;">
        <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 16pt; text-align: center; color: #1e3a8a; margin-bottom: 16px;">
          DANH SÁCH TỔNG HỢP BÀI THI VÀ ĐIỂM SỐ - ${maP}
        </h2>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead>
            ${tableHeader}
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const tenFileClean = maPhongChon === 'TAT_CA' ? 'TatCaPhong' : maPhongChon;
    a.download = `DanhSachBaiThi_Phong_${tenFileClean}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onHienThiToast('Xuất Excel thành công', `Đã xuất danh sách phòng thi ${maP} (phông Times New Roman, cỡ 14) thành công!`, 'success');
  };



  // ------------------------------------------------------------------
  // GIAO DIỆN CHÍNH (GỒM 3 SUB-TABS: KHO BÀI NỘP - CHẤM ĐIỂM - PHÚC KHẢO)
  // ------------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------ */}
      {/* HEADER VÀ ĐIỀU HƯỚNG SUB-TAB CẤP TRÊN */}
      {/* ------------------------------------------------------------ */}
      {/* THANH LỌC VÀ TÌM KIẾM CHUNG */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          {/* Lọc theo Mã phòng thi */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Mã phòng:</span>
            <select
              value={maPhongChon}
              onChange={(e) => setMaPhongChon(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="TAT_CA">Tất cả phòng thi</option>
              {danhSachMaPhongDocBan.map((p) => (
                <option key={p} value={p}>
                  Phòng: {p}
                </option>
              ))}
            </select>
          </div>

          {/* Ô tìm kiếm */}
          <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Tìm theo Mã SV, Họ tên..."
              value={tuKhoaTimKiem}
              onChange={(e) => setTuKhoaTimKiem(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                paddingLeft: '34px',
                paddingRight: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            {tuKhoaTimKiem && (
              <X
                size={14}
                onClick={() => setTuKhoaTimKiem('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              />
            )}
          </div>
        </div>

        {tabHienTai === 'CHAM_DIEM' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Trạng thái chấm:</span>
            <select
              value={trangThaiLoc}
              onChange={(e) => setTrangThaiLoc(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="TAT_CA">Tất cả bài thi</option>
              <option value="CHUA_CHAM">Chưa chấm ({soLuongBaiChuaCham})</option>
              <option value="DANG_CHAM">Đang chấm ({soLuongBaiDangCham})</option>
              <option value="DA_CHAM">Đã chấm ({soLuongBaiDaCham})</option>
            </select>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* NỘI DUNG TỪNG SUB-TAB */}
      {/* ------------------------------------------------------------ */}

      {/* SUB-TAB 1: KHO BÀI NỘP */}
      {tabHienTai === 'KHO_BAI_NOP' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Danh sách bài làm trong kho ({danhSachBaiNopLoc.length} bài)
              </span>
              {selectedBaiNopIds.length > 0 && (
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '3px 10px', borderRadius: '6px' }}>
                  Đã chọn {selectedBaiNopIds.length} bài
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                disabled={selectedBaiNopIds.length === 0}
                onClick={() => {
                  onHienThiToast('Tải bài đã chọn', `Đang nén và tải ${selectedBaiNopIds.length} bài nộp lẻ đã chọn...`, 'info');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: selectedBaiNopIds.length > 0 ? 'var(--bg-surface)' : 'var(--bg-surface-subtle)',
                  color: selectedBaiNopIds.length > 0 ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: selectedBaiNopIds.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: selectedBaiNopIds.length > 0 ? 1 : 0.6
                }}
              >
                <Download size={14} /> Tải bài đã chọn ({selectedBaiNopIds.length})
              </button>

              <button
                type="button"
                onClick={xuLyXuatExcelPhongThi}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--success, #10b981)',
                  backgroundColor: 'var(--success-light, #dcfce7)',
                  color: 'var(--success, #15803d)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <FileSpreadsheet size={14} /> Xuất Excel phòng (.xlsx)
              </button>

              <button
                type="button"
                onClick={() => onHienThiToast('Tải hàng loạt', 'Đang nén toàn bộ bài nộp trong phòng thi dạng file zip...', 'success')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-on-primary)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} /> Tải hàng loạt toàn bộ phòng (.zip)
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '42px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                  <th style={{ padding: '0 12px', width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={danhSachBaiNopLoc.length > 0 && danhSachBaiNopLoc.every((b) => selectedBaiNopIds.includes(b.id))}
                      onChange={() => {
                        const allLocIds = danhSachBaiNopLoc.map((b) => b.id);
                        const isAllSelected = allLocIds.every((id) => selectedBaiNopIds.includes(id));
                        if (isAllSelected) {
                          setSelectedBaiNopIds((prev) => prev.filter((id) => !allLocIds.includes(id)));
                        } else {
                          setSelectedBaiNopIds((prev) => Array.from(new Set([...prev, ...allLocIds])));
                        }
                      }}
                      style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                    />
                  </th>
                  <th style={{ padding: '0 16px', width: '120px' }}>MÃ SV</th>
                  <th style={{ padding: '0 16px' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '0 16px', width: '110px' }}>LỚP</th>
                  <th style={{ padding: '0 16px', width: '90px' }}>MÃ PHÒNG</th>
                  <th style={{ padding: '0 16px', width: '160px' }}>TRẠNG THÁI NỘP</th>
                  <th style={{ padding: '0 16px', width: '90px', textAlign: 'center' }}>VI PHẠM</th>
                  <th style={{ padding: '0 16px', width: '240px' }}>THÔNG TIN TỆP NỘP</th>
                  <th style={{ padding: '0 16px', width: '90px', textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {danhSachBaiNopLoc.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                      Kho chưa có bài nộp nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  danhSachBaiNopLoc.map((bn) => {
                    const isSelected = selectedBaiNopIds.includes(bn.id);
                    const tenFile = bn.fileTuLuanNop?.tenFile || `BaiLam_${bn.maSinhVien}.zip`;
                    const dungLuong = bn.fileTuLuanNop?.kichThuoc || '3.5 MB';

                    return (
                      <tr
                        key={bn.id}
                        onClick={() => {
                          setSelectedBaiNopIds((prev) =>
                            prev.includes(bn.id) ? prev.filter((i) => i !== bn.id) : [...prev, bn.id]
                          );
                        }}
                        style={{
                          height: '56px',
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--primary-light, #eff6ff)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '0 12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedBaiNopIds((prev) =>
                                prev.includes(bn.id) ? prev.filter((i) => i !== bn.id) : [...prev, bn.id]
                              );
                            }}
                            style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                          />
                        </td>
                        <td style={{ padding: '0 16px', fontWeight: isSelected ? 800 : 700, color: 'var(--text-primary)' }}>
                          {bn.maSinhVien}
                        </td>
                        <td style={{ padding: '0 16px', fontWeight: isSelected ? 800 : 600, color: 'var(--text-primary)' }}>
                          {bn.hoTenSinhVien}
                        </td>
                        <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontWeight: isSelected ? 700 : 500 }}>
                          {bn.lop}
                        </td>
                        <td style={{ padding: '0 16px', fontWeight: isSelected ? 800 : 600, color: 'var(--text-primary)' }}>
                          {chuanHoaMaPhong(bn.maPhong || 'A102')}
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          {renderBadgeTinhTrangNop(bn)}
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          {renderBadgeViPhamKho(bn)}
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontWeight: isSelected ? 800 : 600, color: 'var(--text-primary)', fontSize: '13px', wordBreak: 'break-all' }}>
                              {tenFile}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                              Dung lượng: {dungLuong}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onHienThiToast('Tải bài nộp lẻ', `Đang tải tệp ${tenFile} của sinh viên ${bn.hoTenSinhVien}...`, 'info')}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--bg-surface-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            title="Tải bài làm lẻ"
                          >
                            <Download size={13} /> Tải về
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CHẤM ĐIỂM */}
      {tabHienTai === 'CHAM_DIEM' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Danh sách bài làm chấm điểm ({danhSachBaiNopLoc.length} bài)
              </span>
              {selectedBaiNopIds.length > 0 && (
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '3px 10px', borderRadius: '6px' }}>
                  Đã chọn {selectedBaiNopIds.length} bài
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                disabled={selectedBaiNopIds.length === 0}
                onClick={() => {
                  onHienThiToast('Trả điểm bài chọn', `Đang công bố và trả điểm cho ${selectedBaiNopIds.length} bài thi đã chọn...`, 'info');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: selectedBaiNopIds.length > 0 ? 'var(--primary)' : 'var(--bg-surface-subtle)',
                  color: selectedBaiNopIds.length > 0 ? 'var(--text-on-primary)' : 'var(--text-tertiary)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: selectedBaiNopIds.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: selectedBaiNopIds.length > 0 ? 1 : 0.6
                }}
              >
                <Send size={14} /> Trả điểm đã chọn ({selectedBaiNopIds.length})
              </button>

              <button
                type="button"
                onClick={xuLyXuatExcelPhongThi}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--success, #10b981)',
                  backgroundColor: 'var(--success-light, #dcfce7)',
                  color: 'var(--success, #15803d)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <FileSpreadsheet size={14} /> Xuất Excel phòng (.xlsx)
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '42px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                  <th style={{ padding: '0 12px', width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={danhSachBaiNopLoc.length > 0 && danhSachBaiNopLoc.every((b) => selectedBaiNopIds.includes(b.id))}
                      onChange={() => {
                        const allLocIds = danhSachBaiNopLoc.map((b) => b.id);
                        const isAllSelected = allLocIds.every((id) => selectedBaiNopIds.includes(id));
                        if (isAllSelected) {
                          setSelectedBaiNopIds((prev) => prev.filter((id) => !allLocIds.includes(id)));
                        } else {
                          setSelectedBaiNopIds((prev) => Array.from(new Set([...prev, ...allLocIds])));
                        }
                      }}
                      style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                    />
                  </th>
                  <th style={{ padding: '0 16px', width: '120px' }}>MÃ SV</th>
                  <th style={{ padding: '0 16px' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '0 16px', width: '110px' }}>LỚP</th>
                  <th style={{ padding: '0 16px', width: '90px' }}>MÃ PHÒNG</th>
                  <th style={{ padding: '0 16px', width: '160px' }}>TRẠNG THÁI NỘP</th>
                  <th style={{ padding: '0 16px', width: '90px', textAlign: 'center' }}>VI PHẠM</th>
                  <th style={{ padding: '0 16px', width: '130px' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '0 16px', width: '90px', textAlign: 'center' }}>ĐIỂM SỐ</th>
                  <th style={{ padding: '0 16px', width: '90px', textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {danhSachBaiNopLoc.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                      Không có bài nộp nào phù hợp với điều kiện lọc.
                    </td>
                  </tr>
                ) : (
                  danhSachBaiNopLoc.map((bn) => {
                    const isSelected = selectedBaiNopIds.includes(bn.id);

                    return (
                      <tr
                        key={bn.id}
                        onClick={() => {
                          setSelectedBaiNopIds((prev) =>
                            prev.includes(bn.id) ? prev.filter((i) => i !== bn.id) : [...prev, bn.id]
                          );
                        }}
                        style={{
                          height: '56px',
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--primary-light, #eff6ff)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '0 12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedBaiNopIds((prev) =>
                                prev.includes(bn.id) ? prev.filter((i) => i !== bn.id) : [...prev, bn.id]
                              );
                            }}
                            style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                          />
                        </td>
                        <td style={{ padding: '0 16px', fontWeight: isSelected ? 800 : 700, color: 'var(--text-primary)' }}>
                          {bn.maSinhVien}
                        </td>
                        <td style={{ padding: '0 16px', fontWeight: isSelected ? 800 : 600, color: 'var(--text-primary)' }}>
                          {bn.hoTenSinhVien}
                        </td>
                        <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontWeight: isSelected ? 700 : 500 }}>
                          {bn.lop}
                        </td>
                        <td style={{ padding: '0 16px', fontWeight: isSelected ? 800 : 600, color: 'var(--text-primary)' }}>
                          {chuanHoaMaPhong(bn.maPhong || 'A102')}
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          {renderBadgeTinhTrangNop(bn)}
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          {renderBadgeViPhamKho(bn)}
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          {bn.trangThaiCham === 'DA_CHAM' ? (
                            <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--success-light, #dcfce7)', color: 'var(--success, #15803d)', fontWeight: 600, fontSize: '12px' }}>
                              Đã chấm
                            </span>
                          ) : bn.trangThaiCham === 'DANG_CHAM' ? (
                            <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--warning-light, #fef3c7)', color: 'var(--warning, #b45309)', fontWeight: 600, fontSize: '12px' }}>
                              Đang chấm
                            </span>
                          ) : (
                            <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px' }}>
                              Chưa chấm
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'center', fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                          {bn.diemSo !== undefined ? bn.diemSo : '--'}
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          {renderMenuThaoTac(bn)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PHÚC KHẢO */}
      {tabHienTai === 'PHUC_KHAO' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Danh sách đơn xin phúc khảo bài thi ({danhSachPhucKhaoLoc.length} đơn)
              </span>
              {selectedPhucKhaoIds.length > 0 && (
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '3px 10px', borderRadius: '6px' }}>
                  Đã chọn {selectedPhucKhaoIds.length} đơn
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={xuLyXuatExcelPhongThi}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--success, #10b981)',
                  backgroundColor: 'var(--success-light, #dcfce7)',
                  color: 'var(--success, #15803d)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <FileSpreadsheet size={14} /> Xuất Excel phòng (.xlsx)
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-subtle)', height: '42px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                  <th style={{ padding: '0 12px', width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={danhSachPhucKhaoLoc.length > 0 && danhSachPhucKhaoLoc.every((b) => selectedPhucKhaoIds.includes(b.id))}
                      onChange={() => {
                        const allLocIds = danhSachPhucKhaoLoc.map((b) => b.id);
                        const isAllSelected = allLocIds.every((id) => selectedPhucKhaoIds.includes(id));
                        if (isAllSelected) {
                          setSelectedPhucKhaoIds((prev) => prev.filter((id) => !allLocIds.includes(id)));
                        } else {
                          setSelectedPhucKhaoIds((prev) => Array.from(new Set([...prev, ...allLocIds])));
                        }
                      }}
                      style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                    />
                  </th>
                  <th style={{ padding: '0 16px', width: '120px' }}>MÃ SV</th>
                  <th style={{ padding: '0 16px' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '0 16px', width: '110px' }}>LỚP</th>
                  <th style={{ padding: '0 16px' }}>BÀI THI PHÚC KHẢO</th>
                  <th style={{ padding: '0 16px', width: '100px', textAlign: 'center' }}>ĐIỂM GỐC</th>
                  <th style={{ padding: '0 16px', width: '100px', textAlign: 'center' }}>ĐIỂM MỚI</th>
                  <th style={{ padding: '0 16px', width: '130px' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '0 16px', width: '120px', textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {danhSachPhucKhaoLoc.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                      Không có đơn phúc khảo nào.
                    </td>
                  </tr>
                ) : (
                  danhSachPhucKhaoLoc.map((pk) => {
                    const isSelected = selectedPhucKhaoIds.includes(pk.id);

                    return (
                      <tr
                        key={pk.id}
                        onClick={() => {
                          setSelectedPhucKhaoIds((prev) =>
                            prev.includes(pk.id) ? prev.filter((i) => i !== pk.id) : [...prev, pk.id]
                          );
                        }}
                        style={{
                          height: '56px',
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--primary-light, #eff6ff)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '0 12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedPhucKhaoIds((prev) =>
                                prev.includes(pk.id) ? prev.filter((i) => i !== pk.id) : [...prev, pk.id]
                              );
                            }}
                            style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                          />
                        </td>
                        <td style={{ padding: '0 16px', fontWeight: isSelected ? 800 : 700, color: 'var(--text-primary)' }}>{pk.maSinhVien}</td>
                        <td style={{ padding: '0 16px', fontWeight: isSelected ? 800 : 600, color: 'var(--text-primary)' }}>{pk.hoTenSinhVien}</td>
                        <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontWeight: isSelected ? 700 : 500 }}>{pk.lop}</td>
                        <td style={{ padding: '0 16px', color: 'var(--text-secondary)', fontWeight: isSelected ? 700 : 500 }}>{pk.tenBaiKiemTra}</td>
                        <td style={{ padding: '0 16px', textAlign: 'center', fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>{pk.diemBanDau}</td>
                        <td style={{ padding: '0 16px', textAlign: 'center', fontWeight: 800, fontSize: '14px', color: 'var(--primary)' }}>
                          {pk.diemSauPhucKhao !== undefined ? pk.diemSauPhucKhao : '--'}
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          {pk.trangThai === 'CHO_XU_LY' ? (
                            <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px' }}>
                              Chờ xử lý
                            </span>
                          ) : pk.trangThai === 'DA_CHAP_NHAN' ? (
                            <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, fontSize: '12px' }}>
                              Đã đổi điểm
                            </span>
                          ) : (
                            <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '12px' }}>
                              Từ chối
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => xuLyMoChamLaiPhucKhao(pk)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              border: '1px solid var(--primary)',
                              backgroundColor: 'var(--primary-light, #eff6ff)',
                              color: 'var(--primary)',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <RotateCcw size={13} /> Chấm lại
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL CỬA SỔ NỔI XEM CHI TIẾT NHẬT KÝ GIÁM SÁT / VI PHẠM */}
      {baiNopXemViPham && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', width: '560px', maxWidth: '95vw', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--warning-light, #fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning, #d97706)' }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Nhật ký giám sát & Lỗi vi phạm</h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    Sinh viên: <b>{baiNopXemViPham.hoTenSinhVien}</b> ({baiNopXemViPham.maSinhVien}) | Lớp: <b>{baiNopXemViPham.lop}</b>
                  </p>
                </div>
              </div>
              <X size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setBaiNopXemViPham(null)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Tổng số lần vi phạm ghi nhận:</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, padding: '3px 12px', borderRadius: '12px', backgroundColor: (baiNopXemViPham.soLanViPham || 0) > 0 ? 'var(--error-light, #fee2e2)' : 'var(--success-light, #dcfce7)', color: (baiNopXemViPham.soLanViPham || 0) > 0 ? 'var(--error, #dc2626)' : 'var(--success, #16a34a)' }}>
                  {baiNopXemViPham.soLanViPham || 0} lần
                </span>
              </div>

              {baiNopXemViPham.nhatKyViPhamChiTiet && baiNopXemViPham.nhatKyViPhamChiTiet.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chi tiết mốc thời gian vi phạm:</span>
                  {baiNopXemViPham.nhatKyViPhamChiTiet.map((item, idx) => (
                    <div key={item.id || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '11.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {item.thoiGian}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{item.noiDung}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (baiNopXemViPham.soLanViPham || 0) > 0 ? (
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--warning-light, #fef3c7)', border: '1px solid var(--warning, #f59e0b)', color: 'var(--warning, #b45309)', fontSize: '13px', lineHeight: 1.5 }}>
                  <b>Chi tiết ghi nhận:</b> {baiNopXemViPham.chiTietViPham || `${baiNopXemViPham.soLanViPham} lần vi phạm trong thời gian làm bài.`}
                </div>
              ) : (
                <div style={{ padding: '18px', borderRadius: '10px', backgroundColor: 'var(--success-light, #dcfce7)', border: '1px solid var(--success, #10b981)', color: 'var(--success, #15803d)', fontSize: '13px', textAlign: 'center', fontWeight: 600 }}>
                  ✓ Sinh viên chấp hành tốt quy chế thi. Không ghi nhận bất kỳ sự kiện vi phạm nào.
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setBaiNopXemViPham(null)}
                style={{ padding: '9px 22px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL POPUP XEM BÀI LÀM (FILE NÉN VỚI CÂY THƯ MỤC BÊN CẠNH, NÚT LƯU ĐIỂM VÀ DẤU X ĐÓNG) */}
      {baiNopDangChon && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '18px', width: '1200px', maxWidth: '96vw', height: '90vh', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* MODAL HEADER */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileArchive size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Xem bài làm: {baiNopDangChon.hoTenSinhVien} ({baiNopDangChon.maSinhVien})
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    Lớp: <b>{baiNopDangChon.lop}</b> | Mã phòng: <b>{chuanHoaMaPhong(baiNopDangChon.maPhong || 'A102')}</b> | Tệp nộp: <b>{baiNopDangChon.fileTuLuanNop?.tenFile || `BaiLam_${baiNopDangChon.maSinhVien}.zip`}</b>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* DẤU X Ở GÓC ĐỂ ĐÓNG */}
                <button
                  type="button"
                  onClick={() => setBaiNopDangChon(null)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Đóng cửa sổ bài làm"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* MODAL BODY (3-PANE LAYOUT) */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* PANE 1: DANH SÁCH THƯ MỤC BÊN CẠNH ĐỂ CHUYỂN */}
              <div style={{ width: '260px', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-subtle)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileArchive size={14} style={{ color: 'var(--primary)' }} />
                  Cấu trúc tệp bài nộp (.zip)
                </div>
                <div style={{ padding: '10px 8px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {mockZipStructure.map((folder) => {
                    const isOpen = folderOpenState[folder.id] ?? true;
                    return (
                      <div key={folder.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div
                          onClick={() => setFolderOpenState((prev) => ({ ...prev, [folder.id]: !isOpen }))}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}
                        >
                          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          {isOpen ? <FolderOpen size={16} style={{ color: '#f59e0b' }} /> : <Folder size={16} style={{ color: '#f59e0b' }} />}
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                        </div>

                        {isOpen && folder.children && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '22px' }}>
                            {folder.children.map((file) => {
                              const isSelected = fileZipDangChon?.id === file.id;
                              return (
                                <div
                                  key={file.id}
                                  onClick={() => setFileZipDangChon(file)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? 'var(--primary-light, #eff6ff)' : 'transparent',
                                    color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                                    fontWeight: isSelected ? 700 : 500,
                                    fontSize: '12.5px',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {file.type === 'code' ? <FileCode size={14} style={{ color: 'var(--primary)' }} /> : file.type === 'image' ? <FileImage size={14} style={{ color: '#10b981' }} /> : <FileText size={14} style={{ color: '#6366f1' }} />}
                                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PANE 2: XEM NỘI DUNG TỆP DẠNG KHÁC NHAU */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {fileZipDangChon?.name || 'database_schema.sql'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                      ({fileZipDangChon?.size || '15 KB'})
                    </span>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                  {fileZipDangChon?.type === 'code' ? (
                    <pre style={{ margin: 0, fontFamily: 'Consolas, Monaco, monospace', fontSize: '13px', lineHeight: 1.5, backgroundColor: 'var(--bg-surface-subtle)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', overflowX: 'auto' }}>
                      <code>{fileZipDangChon.content}</code>
                    </pre>
                  ) : fileZipDangChon?.type === 'image' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '20px', backgroundColor: 'var(--bg-surface-subtle)' }}>
                      <FileImage size={48} style={{ color: '#10b981', marginBottom: '12px' }} />
                      <p style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>{fileZipDangChon.name}</p>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>Sơ đồ thiết kế CSDL (ERD Diagram) dạng ảnh PNG - Kích thước: {fileZipDangChon.size}</p>
                    </div>
                  ) : (
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', backgroundColor: 'var(--bg-surface-subtle)', minHeight: '300px', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                      <p style={{ fontWeight: 700, margin: '0 0 10px' }}>📄 Nội dung file: {fileZipDangChon?.name}</p>
                      <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        {fileZipDangChon?.content || 'Đã tải nội dung báo cáo tự luận của sinh viên.'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PANE 3: BẢNG LƯU ĐIỂM VÀ NHẬN XẾT */}
              <div style={{ width: '310px', borderLeft: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-subtle)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  {donPhucKhaoDangChon ? 'Chấm lại bài xin phúc khảo' : 'Chấm điểm bài làm'}
                </h4>

                {donPhucKhaoDangChon && (
                  <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Điểm ban đầu (Điểm cũ):</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 800 }}>{donPhucKhaoDangChon.diemBanDau}</span>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {donPhucKhaoDangChon ? 'ĐIỂM MỚI (THANG 10) *' : 'ĐIỂM SỐ (THANG 10) *'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step="any"
                    disabled={khongThayDoiDiem}
                    value={khongThayDoiDiem && donPhucKhaoDangChon ? donPhucKhaoDangChon.diemBanDau.toString() : diemInputText}
                    onChange={(e) => {
                      setDiemInputText(e.target.value);
                      const num = parseFloat(e.target.value);
                      if (!isNaN(num)) setDiemInput(num);
                    }}
                    onBlur={() => {
                      const num = parseFloat(diemInputText);
                      if (isNaN(num)) {
                        setDiemInput(0);
                        setDiemInputText('0');
                      } else {
                        const rounded = lamTronDiem(num);
                        setDiemInput(rounded);
                        setDiemInputText(rounded.toString());
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: khongThayDoiDiem ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                      color: khongThayDoiDiem ? 'var(--text-tertiary)' : 'var(--text-primary)',
                      fontSize: '20px',
                      fontWeight: 800,
                      textAlign: 'center',
                      outline: 'none',
                      opacity: khongThayDoiDiem ? 0.7 : 1
                    }}
                  />

                  {donPhucKhaoDangChon && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
                      <input
                        type="checkbox"
                        checked={khongThayDoiDiem}
                        onChange={(e) => {
                          setKhongThayDoiDiem(e.target.checked);
                          if (e.target.checked && donPhucKhaoDangChon) {
                            setDiemInput(donPhucKhaoDangChon.diemBanDau);
                            setDiemInputText(donPhucKhaoDangChon.diemBanDau.toString());
                          }
                        }}
                        style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                      />
                      Giữ nguyên điểm cũ (Không thay đổi)
                    </label>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {donPhucKhaoDangChon ? 'NHẬN XẾT / GIẢI TRÌNH PHÚC KHẢO' : 'NHẬN XẾT CỦA GIẢNG VIÊN'}
                  </label>
                  <textarea
                    rows={6}
                    value={nhanXetInput}
                    onChange={(e) => setNhanXetInput(e.target.value)}
                    placeholder={donPhucKhaoDangChon ? 'Nhập phản hồi kết quả phúc khảo...' : 'Nhập nhận xét bài làm...'}
                    style={{ width: '100%', flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', resize: 'none', lineHeight: 1.5 }}
                  />
                </div>

                <button
                  type="button"
                  onClick={xuLyLuuDiem}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'var(--text-on-primary)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Save size={16} /> {donPhucKhaoDangChon ? 'Lưu kết quả phúc khảo' : 'Lưu điểm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChamBai;
