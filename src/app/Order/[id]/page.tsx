"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Check, Clock, Book } from "lucide-react";

interface Book {
  id: number;
  ten: string;
  so_luong: number;
  don_gia: string;
  nam_xb: number;
}

interface OrderDetail {
  id: number;
  don_id: number;
  sach_id: number;
  soLuong: number;
  donGia: string;
  don: Order;
  sach: Book;
}

interface Order {
  id: number;
  ten_tk: string;
  tongTien: string;
  trangThai: string;
}

export default function OrderDetailPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const orderId = params.id;

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("http://localhost:3000/sach");
        const data: Book[] = await response.json();

        // Only fetch books that are in stock and not already in order details
        const availableBooks = data.filter(
          (book) =>
            book.so_luong > 0 &&
            !orderDetails.some((detail) => detail.sach_id === book.id)
        );

        setBooks(availableBooks);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    }

    async function fetchOrderDetails() {
      try {
        // Fetch all order details
        const detailsResponse = await fetch("http://localhost:3000/chitietdon");
        if (!detailsResponse.ok) {
          throw new Error("Failed to fetch order details");
        }
        const allDetails: OrderDetail[] = await detailsResponse.json();

        // Filter details for this specific order
        const filteredDetails = allDetails.filter(
          (detail) => detail.don_id === Number(orderId)
        );

        // Get the order information (using the first detail's order info)
        const orderInfo =
          filteredDetails.length > 0 ? filteredDetails[0].don : null;

        setOrderDetails(filteredDetails);
        setOrder(orderInfo);
        fetchBooks(); // Call fetchBooks after setting order details
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, orderDetails.length]);

  const handleAddDetail = async () => {
    if (!selectedBookId || quantity <= 0) {
      alert("Vui lòng chọn sách và nhập số lượng hợp lệ!");
      return;
    }

    const selectedBook = books.find((book) => book.id === selectedBookId);
    if (!selectedBook || quantity > selectedBook.so_luong) {
      alert("Số lượng vượt quá số lượng trong kho!");
      return;
    }

    try {
      // Post the new order detail
      const response = await fetch("http://localhost:3000/chitietdon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donId: orderId,
          sachId: selectedBookId,
          soLuong: quantity,
        }),
      });

      const newDetail = await response.json();

      // Fetch the full book details for the new order detail
      const bookResponse = await fetch(
        `http://localhost:3000/sach/${selectedBookId}`
      );
      const bookDetails = await bookResponse.json();

      // Create a complete order detail object
      const completeDetail: OrderDetail = {
        ...newDetail,
        sach: bookDetails,
        donGia: selectedBook.don_gia,
        don: order!, // Use the existing order
      };

      setOrderDetails([...orderDetails, completeDetail]);

      setSelectedBookId(null);
      setQuantity(1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const handleUpdateQuantity = async (
    detailId: number,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      alert("Số lượng phải lớn hơn 0!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/chitietdon/${detailId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donId: orderId,
            soLuong: newQuantity,
          }),
        }
      );

      if (response.ok) {
        // Update the order details in the local state
        setOrderDetails((prevDetails) =>
          prevDetails.map((detail) =>
            detail.id === detailId
              ? { ...detail, soLuong: newQuantity }
              : detail
          )
        );
      } else {
        alert("Cập nhật số lượng thất bại");
      }
    } catch {
      alert("Lỗi khi cập nhật số lượng");
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(amount));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "hoan_thanh":
        return <Check className="text-green-500" />;
      case "dang_xu_ly":
        return <Clock className="text-yellow-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!order)
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Thêm chi tiết đơn hàng</h2>
        <div className="flex items-center mb-4">
          <select
            className="border px-4 py-2 rounded mr-4"
            value={selectedBookId || ""}
            onChange={(e) => setSelectedBookId(Number(e.target.value))}
          >
            <option value="">Chọn sách</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.ten} - {formatCurrency(book.don_gia)} (Còn {book.so_luong}
                )
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max={
              selectedBookId
                ? books.find((book) => book.id === selectedBookId)?.so_luong ||
                  1
                : 1
            }
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border px-4 py-2 rounded w-20"
          />
          <button
            onClick={handleAddDetail}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-600"
          >
            Thêm
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Order Summary */}
      <div className="bg-gray-50 p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng #{order.id}
            </h1>
            <p className="text-gray-600">Tài khoản: {order.ten_tk}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(order.trangThai)}
            <span>
              {order.trangThai === "hoan_thanh" ? "Hoàn thành" : "Đang xử lý"}
            </span>
          </div>
        </div>
      </div>

      {/* Order Details Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Id</th>
            <th className="py-3 px-6 text-left">Sách</th>
            <th className="py-3 px-6 text-center">Số lượng</th>
            <th className="py-3 px-6 text-right">Đơn giá</th>
            <th className="py-3 px-6 text-right">Tổng</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {orderDetails.map((detail) => (
            <tr
              key={`order-${orderId}-detail-${detail.id}`}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <Book className="mr-2 text-blue-500" />
                  <td className="py-3 px-6">{detail.id}</td>
                  <div>
                    <span className="font-medium">{detail.sach.ten}</span>
                    <p className="text-xs text-gray-500">
                      Năm xuất bản: {detail.sach.nam_xb}
                    </p>
                  </div>
                </div>
              </td>

              <td className="py-3 px-6 text-center">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(detail.id, detail.soLuong - 1)
                    }
                    className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span className="mx-2">{detail.soLuong}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(detail.id, detail.soLuong + 1)
                    }
                    className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-3 px-6 text-right">
                {formatCurrency(detail.donGia)}
              </td>
              <td className="py-3 px-6 text-right font-bold">
                {formatCurrency(
                  (parseFloat(detail.donGia) * detail.soLuong).toString()
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td colSpan={3} className="text-right py-3 px-6 font-bold">
              Tổng cộng:
            </td>
            <td className="py-3 px-6 text-right font-bold text-blue-600">
              {formatCurrency(order.tongTien)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Thêm chi tiết đơn hàng</h2>
        <div className="flex items-center mb-4">
          <select
            className="border px-4 py-2 rounded mr-4"
            value={selectedBookId || ""}
            onChange={(e) => setSelectedBookId(Number(e.target.value))}
            disabled={order?.trangThai === "hoan_thanh"} // Disable nếu trạng thái là hoàn thành
          >
            <option value="">Chọn sách</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.ten} - {formatCurrency(book.don_gia)} (Còn {book.so_luong}
                )
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max={
              selectedBookId
                ? books.find((book) => book.id === selectedBookId)?.so_luong ||
                  1
                : 1
            }
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border px-4 py-2 rounded w-20"
            disabled={order?.trangThai === "hoan_thanh"} // Disable nếu trạng thái là hoàn thành
          />
          <button
            onClick={handleAddDetail}
            className={`px-4 py-2 rounded ml-4 ${
              order?.trangThai === "hoan_thanh"
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={order?.trangThai === "hoan_thanh"} // Disable nếu trạng thái là hoàn thành
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
