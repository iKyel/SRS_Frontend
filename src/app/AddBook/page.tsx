"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TacGia {
  id: number;
  ten: string;
}

interface TheLoai {
  id: number;
  ten: string;
}

interface NhaXuatBan {
  id: number;
  ten: string;
}

export default function AddBook() {
  const [ten, setTen] = useState("");
  const [soLuong, setSoLuong] = useState(0);
  const [donGia, setDonGia] = useState("");
  const [namXb, setNamXb] = useState(2024);
  const [tacGiaId, setTacGiaId] = useState(0);
  const [theLoaiId, setTheLoaiId] = useState(0);
  const [nhaXuatBanId, setNhaXuatBanId] = useState(0);

  const [tacGiaList, setTacGiaList] = useState<TacGia[]>([]);
  const [theLoaiList, setTheLoaiList] = useState<TheLoai[]>([]);
  const [nhaXuatBanList, setNhaXuatBanList] = useState<NhaXuatBan[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch dữ liệu tác giả, thể loại và nhà xuất bản
    const fetchData = async () => {
      try {
        const [tacGiaRes, theLoaiRes, nhaXuatBanRes] = await Promise.all([
          fetch("http://localhost:3000/tac-gia"),
          fetch("http://localhost:3000/the-loai"),
          fetch("http://localhost:3000/nhaxuatban"),
        ]);

        if (!tacGiaRes.ok || !theLoaiRes.ok || !nhaXuatBanRes.ok) {
          throw new Error("Không thể tải dữ liệu");
        }

        const [tacGiaData, theLoaiData, nhaXuatBanData] = await Promise.all([
          tacGiaRes.json(),
          theLoaiRes.json(),
          nhaXuatBanRes.json(),
        ]);

        setTacGiaList(tacGiaData);
        setTheLoaiList(theLoaiData);
        setNhaXuatBanList(nhaXuatBanData);
      } catch {
        setError("Không thể tải dữ liệu");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBook = {
      ten,
      so_luong: 0,
      don_gia: donGia,
      nam_xb: namXb,
      tacGia: { id: tacGiaId },
      theLoai: { id: theLoaiId },
      nhaXuatBan: { id: nhaXuatBanId },
    };

    try {
      const response = await fetch("http://localhost:3000/sach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        throw new Error("Không thể thêm sách");
      }

      toast.success('Sách đã được thêm thành công!', {
        position: 'top-right', // Thay 'POSITION.TOP_RIGHT' bằng 'top-right'
        autoClose: 5000,
      });

      // Reset form after success
      setTen("");
      setSoLuong(0);
      setDonGia("");
      setNamXb(2024);
      setTacGiaId(0);
      setTheLoaiId(0);
      setNhaXuatBanId(0);
    } catch {
      setError("Có lỗi xảy ra khi thêm sách");
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Thêm Sách Mới</h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="mb-4">
            <label htmlFor="ten" className="block text-gray-700">
              Tên Sách
            </label>
            <input
              id="ten"
              type="text"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              required
              className="w-full p-3 border rounded-md mt-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="donGia" className="block text-gray-700">
              Đơn Giá
            </label>
            <input
              id="donGia"
              type="number"
              value={donGia}
              onChange={(e) => setDonGia(e.target.value)}
              required
              className="w-full p-3 border rounded-md mt-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="namXb" className="block text-gray-700">
              Năm Xuất Bản
            </label>
            <input
              id="namXb"
              type="number"
              value={namXb}
              onChange={(e) => setNamXb(Number(e.target.value))}
              required
              className="w-full p-3 border rounded-md mt-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tacGia" className="block text-gray-700">
              Tác Giả
            </label>
            <select
              id="tacGia"
              value={tacGiaId}
              onChange={(e) => setTacGiaId(Number(e.target.value))}
              required
              className="w-full p-3 border rounded-md mt-2"
            >
              <option value="">Chọn Tác Giả</option>
              {tacGiaList.map((tacGia) => (
                <option key={tacGia.id} value={tacGia.id}>
                  {tacGia.ten}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="theLoai" className="block text-gray-700">
              Thể Loại
            </label>
            <select
              id="theLoai"
              value={theLoaiId}
              onChange={(e) => setTheLoaiId(Number(e.target.value))}
              required
              className="w-full p-3 border rounded-md mt-2"
            >
              <option value="">Chọn Thể Loại</option>
              {theLoaiList.map((theLoai) => (
                <option key={theLoai.id} value={theLoai.id}>
                  {theLoai.ten}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="nhaXuatBan" className="block text-gray-700">
              Nhà Xuất Bản
            </label>
            <select
              id="nhaXuatBan"
              value={nhaXuatBanId}
              onChange={(e) => setNhaXuatBanId(Number(e.target.value))}
              required
              className="w-full p-3 border rounded-md mt-2"
            >
              <option value="">Chọn Nhà Xuất Bản</option>
              {nhaXuatBanList.map((nhaXuatBan) => (
                <option key={nhaXuatBan.id} value={nhaXuatBan.id}>
                  {nhaXuatBan.ten}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Thêm Sách
          </button>
        </form>

        {/* Toast container */}
        <ToastContainer />
      </div>
    </div>
  );
}
