import React from 'react';

// Define the type for the data structure
interface NhanBan {
  id: number;
  sachId: number;
  trang_thai: string;
  ISBN: string;
  sach: {
    id: number;
    ten: string;
    so_luong: number;
    don_gia: string;
    nam_xb: number;
  } | null;
  chitietpnk: {
    id: number;
    sachId: number;
    phieuNhapKhoId: number;
    so_luong: number;
  } | null;
  chitietdon: {
    id: number;
    don_id: number;
    sach_id: number;
    soLuong: number;
    donGia: string;
  } | null;
}

async function fetchNhanBan() {
  try {
    const response = await fetch('http://localhost:3000/nhanban');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default async function NhanBanPage() {
  const nhanBanList: NhanBan[] = await fetchNhanBan();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nhân Bản Danh Sách</h1>
      {nhanBanList.length === 0 ? (
        <p>Không có dữ liệu</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Trạng Thái</th>
              <th className="border p-2">ISBN</th>
              <th className="border p-2">Sách ID</th>
              <th className="border p-2">Sách Tên</th>
              <th className="border p-2">Chi Tiết PNK ID</th>
              <th className="border p-2">Chi Tiết Đơn ID</th>
            </tr>
          </thead>
          <tbody>
            {nhanBanList.map((nhanBan) => (
              <tr key={nhanBan.id} className="hover:bg-gray-100">
                <td className="border p-2">{nhanBan.id}</td>
                <td className="border p-2">{nhanBan.trang_thai}</td>
                <td className="border p-2">{nhanBan.ISBN}</td>
                <td className="border p-2">{nhanBan.sach?.id ?? 'N/A'}</td>
                <td className="border p-2">{nhanBan.sach?.ten ?? 'N/A'}</td>
                <td className="border p-2">{nhanBan.chitietpnk?.id ?? 'N/A'}</td>
                <td className="border p-2">{nhanBan.chitietdon?.id ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}