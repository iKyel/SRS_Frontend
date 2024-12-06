"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import {
  Book,
  PlusCircle,
  BarChart2,
  ShoppingCart,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu
interface TacGia {
  id: number;
  ten: string;
  tieu_su?: string;
}

interface TheLoai {
  id: number;
  ten: string;
}

interface NhaXuatBan {
  id: number;
  ten: string;
  dia_chi: string;
  so_dien_thoai: string;
}

interface Sach {
  id: number;
  ten: string;
  so_luong: number;
  don_gia: string;
  nam_xb: number;
  tacGia: TacGia;
  theLoai: TheLoai;
  nhaXuatBan: NhaXuatBan;
}

export default function BookDashboard() {
  const [sach, setSach] = useState<Sach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSach() {
      try {
        const response = await fetch("http://localhost:3000/sach");
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu sách");
        }
        const data = await response.json();
        setSach(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi không xác định");
        setLoading(false);
      }
    }

    fetchSach();
  }, []);

  // Tính toán thống kê
  const tongSach = sach.length;
  const tongSoLuong = sach.reduce((total, book) => total + book.so_luong, 0);
  const tongDoanhThu = sach.reduce(
    (total, book) => total + parseInt(book.don_gia) * book.so_luong,
    0
  );

  const handleXoaSach = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      try {
        const response = await fetch(`http://localhost:3000/sach/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Không thể xóa sách");
        }

        // Cập nhật danh sách sách sau khi xóa
        setSach(sach.filter((book) => book.id !== id));
      } catch (err) {
        alert(
          err instanceof Error ? err.message : "Lỗi không xác định khi xóa sách"
        );
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Book className="mr-3 text-blue-600" size={36} />
            Quản Lý Sách
          </h1>
          <Link
            href="/AddBook" // Dùng Link thay vì router.push
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          >
            <PlusCircle className="mr-2" size={20} />
            Thêm Sách Mới
          </Link>
        </header>

        {/* Thống kê */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <Book className="text-blue-500 mr-4" size={40} />
            <div>
              <p className="text-gray-500">Tổng Sách</p>
              <p className="text-2xl font-bold">{tongSach}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <ShoppingCart className="text-green-500 mr-4" size={40} />
            <div>
              <p className="text-gray-500">Tổng Số Lượng</p>
              <p className="text-2xl font-bold">{tongSoLuong}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <DollarSign className="text-purple-500 mr-4" size={40} />
            <div>
              <p className="text-gray-500">Tổng Doanh Thu</p>
              <p className="text-2xl font-bold">
                {tongDoanhThu.toLocaleString()} đ
              </p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <BarChart2 className="text-red-500 mr-4" size={40} />
            <div>
              <p className="text-gray-500">Năm XB Trung Bình</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  sach.reduce((sum, book) => sum + book.nam_xb, 0) / sach.length
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách sách */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Danh Sách Sách
            </h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">Tên Sách</th>
                <th className="p-3 text-left">Tác Giả</th>
                <th className="p-3 text-left">Thể Loại</th>
                <th className="p-3 text-right">Số Lượng</th>
                <th className="p-3 text-right">Đơn Giá</th>
                <th className="p-3 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {sach.map((book) => (
                <tr
                  key={book.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{book.ten}</td>
                  <td className="p-3 text-gray-600">{book.tacGia.ten}</td>
                  <td className="p-3 text-gray-600">{book.theLoai.ten}</td>
                  <td className="p-3 text-right">{book.so_luong}</td>
                  <td className="p-3 text-right">
                    {parseInt(book.don_gia).toLocaleString()} đ
                  </td>
                  <td className="p-3 text-center flex justify-center space-x-2">
                    <button
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded transition"
                      title="Chỉnh sửa"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-100 p-2 rounded transition"
                      title="Xóa"
                      onClick={() => handleXoaSach(book.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
