"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Clock, AlertCircle } from "lucide-react";

interface Order {
  id: number;
  ten_tk: string;
  tongTien: string;
  trangThai: string;
}

interface Account {
  id: number;
  tentk: string;
  vaitro: string;
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:3000/don");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("http://localhost:3000/taikhoan");
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const data: Account[] = await response.json();
        const filteredAccounts = data.filter((acc) => acc.vaitro === "KH");
        setAccounts(filteredAccounts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    }

    fetchAccounts();
  }, []);

  const handleCreateOrder = async () => {
    if (!selectedAccount) {
      alert("Vui lòng chọn tài khoản!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/don", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tentk: selectedAccount }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const newOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setIsCreating(false);
      setSelectedAccount("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const handleUpdateOrder = async (orderId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/don/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trangThai: "hoan_thanh" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      // Update the order state with the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, trangThai: "hoan_thanh" } : order
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "hoan_thanh":
        return <Check className="text-green-500" />;
      case "dang_xu_ly":
        return <Clock className="text-yellow-500" />;
      default:
        return <AlertCircle className="text-red-500" />;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(amount));
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Danh sách đơn hàng
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsCreating(true)}
        >
          Tạo đơn hàng mới
        </button>
      </div>

      {isCreating && (
        <div className="px-6 py-4 bg-gray-100 border-t">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Tạo đơn hàng mới
          </h2>
          <select
            className="border px-4 py-2 rounded w-full mb-4"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="">Chọn tài khoản</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.tentk}>
                {acc.tentk}
              </option>
            ))}
          </select>

          <div className="flex justify-end">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
              onClick={() => setIsCreating(false)}
            >
              Hủy
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleCreateOrder}
            >
              Tạo
            </button>
          </div>
        </div>
      )}

      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Tên tài khoản</th>
            <th className="py-3 px-6 text-right">Tổng tiền</th>
            <th className="py-3 px-6 text-center">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <Link href={`/Order/${order.id}`} className="block">
                  <div className="flex items-center">
                    <span className="font-medium">{order.id}</span>
                  </div>
                </Link>
              </td>
              <td className="py-3 px-6 text-left">
                <Link href={`/Order/${order.id}`} className="block">
                  <div className="flex items-center">
                    <span>{order.ten_tk}</span>
                  </div>
                </Link>
              </td>
              <td className="py-3 px-6 text-right">
                <Link href={`/Order/${order.id}`} className="block">
                  <div className="flex items-center justify-end">
                    <span className="font-bold">
                      {formatCurrency(order.tongTien)}
                    </span>
                  </div>
                </Link>
              </td>
              <td className="py-3 px-6 text-center">
                <Link href={`/Order/${order.id}`} className="block">
                  <div className="flex item-center justify-center">
                    {getStatusIcon(order.trangThai)}
                    <span className="ml-2">
                      {order.trangThai === "hoan_thanh"
                        ? "Hoàn thành"
                        : order.trangThai === "dang_xu_ly"
                        ? "Đang xử lý"
                        : "Lỗi"}
                    </span>
                  </div>
                </Link>
              </td>

              <td className="py-3 px-6 text-center">
                <button
                  className={`${
                    order.trangThai === "hoan_thanh"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white px-4 py-2 rounded`}
                  onClick={() =>
                    order.trangThai !== "hoan_thanh" &&
                    handleUpdateOrder(order.id)
                  }
                  disabled={order.trangThai === "hoan_thanh"}
                >
                  Cập nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          Không có đơn hàng nào
        </div>
      )}
    </div>
  );
}
