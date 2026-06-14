import React, { useState, useEffect } from 'react';
import { apiCall } from '../../api/client';
import { useToast } from '../../hooks/useToast';

interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  totalPrice: string;
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const { showToast } = useToast();

  // Fetch orders
  const fetchOrders = async (status: string = '') => {
    try {
      setLoading(true);
      const url = status ? `/api/admin/orders?status=${status}` : '/api/admin/orders';
      const data = await apiCall<any>(url, { 
        method: 'GET',
        raw: true 
      });
      
      const orderList = data.content || data || [];
      setOrders(orderList);
    } catch (error: any) {
      showToast('Lỗi tải danh sách đơn hàng: ' + error.message, 'error');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiCall(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      showToast('Trạng thái đơn hàng đã được cập nhật!', 'success');
      fetchOrders(statusFilter);
    } catch (error: any) {
      showToast('Lỗi cập nhật trạng thái: ' + error.message, 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-[#fdf6e2] text-[#b7791f]';
      case 'CONFIRMED':
        return 'bg-[#fde8e8] text-[#c53030]';
      case 'SHIPPED':
        return 'bg-[#ebf8ff] text-[#2b6cb0]';
      case 'DELIVERED':
        return 'bg-[#e6fffa] text-[#234e52]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full">

      {/* ================= TOP TITLE ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-[#4a1525]">Orders</h1>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm mb-6 flex flex-col lg:flex-row items-end gap-6 text-xs">

        {/* Lọc Trạng thái */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="uppercase tracking-wider text-gray-400 font-semibold mb-2 text-[10px]">STATUS FILTER</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-b border-gray-300 pb-1.5 outline-none bg-transparent font-medium text-gray-700 focus:border-[#4a1525] cursor-pointer">
            <option value="">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Nút refresh */}
        <div className="w-full lg:w-1/4">
          <button 
            onClick={() => fetchOrders(statusFilter)}
            className="w-full bg-[#1a1a1a] hover:bg-[#2b2b2b] text-white font-semibold uppercase tracking-widest py-2.5 px-4 rounded text-[10px] transition-colors">
            REFRESH
          </button>
        </div>
      </div>

      {/* ================= BẢNG DANH SÁCH ĐƠN HÀNG ================= */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400 font-semibold bg-gray-50/50">
              <th className="py-4 px-6 w-32">ORDER ID</th>
              <th className="py-4 px-6">CUSTOMER</th>
              <th className="py-4 px-6">DATE</th>
              <th className="py-4 px-6">TOTAL AMOUNT</th>
              <th className="py-4 px-6">STATUS</th>
              <th className="py-4 px-6 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-5 px-6 font-bold text-[#4a1525] font-mono tracking-tight">
                    {order.orderCode}
                  </td>

                  <td className="py-5 px-6">
                    <p className="font-serif font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{order.customerEmail}</p>
                  </td>

                  <td className="py-5 px-6 text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>

                  <td className="py-5 px-6 font-serif font-bold text-gray-800 text-base">
                    €{parseFloat(order.totalPrice).toFixed(2)}
                  </td>

                  <td className="py-5 px-6">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold inline-block border-none cursor-pointer outline-none ${getStatusColor(order.status)}`}>
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>

                  <td className="py-5 px-6 text-center text-gray-400 space-x-3">
                    <button className="hover:text-gray-900 transition-colors" title="Xem chi tiết đơn hàng">
                      <i className="fa-regular fa-eye"></i>
                    </button>
                    <button className="hover:text-gray-900 transition-colors" title="In hóa đơn">
                      <i className="fa-solid fa-print"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang dưới đáy bảng */}
        {orders.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-medium bg-white">
            <span className="uppercase tracking-tight">SHOWING 1 TO {Math.min(orders.length, 20)} OF {orders.length} ORDERS</span>
            <div className="flex items-center space-x-1">
              <button className="p-1 px-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-400"><i className="fa-solid fa-chevron-left text-[9px]"></i></button>
              <button className="p-1 px-2.5 border border-[#4a1525] bg-white text-[#4a1525] rounded font-bold">1</button>
              <button className="p-1 px-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-400"><i className="fa-solid fa-chevron-right text-[9px]"></i></button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}