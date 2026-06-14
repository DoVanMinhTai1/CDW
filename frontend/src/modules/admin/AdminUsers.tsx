import React, { useState, useEffect } from 'react';
import { apiCall } from '../../api/client';
import { useToast } from '../../hooks/useToast';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userTab, setUserTab] = useState('all');
  const { showToast } = useToast();

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiCall<any>('/api/admin/users', { 
        method: 'GET',
        raw: true 
      });
      
      const userList = data.content || data || [];
      setUsers(userList);
    } catch (error: any) {
      showToast('Lỗi tải danh sách người dùng: ' + error.message, 'error');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user status
  const handleUpdateStatus = async (userId: number, newStatus: string) => {
    try {
      const statusByte = newStatus === 'ACTIVE' ? 1 : 0;
      await apiCall(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: statusByte })
      });
      showToast('Trạng thái người dùng đã được cập nhật!', 'success');
      fetchUsers();
    } catch (error: any) {
      showToast('Lỗi cập nhật trạng thái: ' + error.message, 'error');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa người dùng này?')) return;
    
    try {
      await apiCall(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      showToast('Người dùng đã được xóa thành công!', 'success');
      fetchUsers();
    } catch (error: any) {
      showToast('Lỗi xóa người dùng: ' + error.message, 'error');
    }
  };

  // Filter users by tab
  const filteredUsers = users.filter(user => {
    if (userTab === 'customers') return user.role === 'CUSTOMER';
    if (userTab === 'admins') return user.role === 'ADMIN';
    return true;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full">

      {/* ================= TOP HEADER ================= */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">HERITAGE ADMINISTRATION</span>
          <h1 className="text-3xl font-serif text-[#4a1525]">Registered Community</h1>
        </div>
        <button className="bg-[#4a1525] hover:bg-[#360f1b] text-white text-xs tracking-wider uppercase font-semibold px-5 py-2.5 rounded shadow transition-colors flex items-center space-x-2">
          <i className="fa-solid fa-user-plus text-[10px]"></i>
          <span>INVITE MEMBER</span>
        </button>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 border border-gray-100 rounded shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">TOTAL USERS</p>
          <p className="text-2xl font-serif text-[#4a1525] mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-6 border border-gray-100 rounded shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">ACTIVE CUSTOMERS</p>
          <p className="text-2xl font-serif text-[#4a1525] mt-2">
            {users.filter(u => u.status === 'ACTIVE' && u.role === 'CUSTOMER').length}
          </p>
        </div>
        <div className="bg-white p-6 border border-gray-100 rounded shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">ADMINISTRATORS</p>
          <p className="text-2xl font-serif text-[#4a1525] mt-2">
            {users.filter(u => u.role === 'ADMIN').length}
          </p>
        </div>
        <div className="bg-white p-6 border border-gray-100 rounded shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">INQUIRY RATE</p>
          <p className="text-2xl font-serif text-[#4a1525] mt-2">
            {users.length > 0 ? ((users.filter(u => u.status === 'DEACTIVATED').length / users.length) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* ================= TAB NAVIGATION & FILTER ================= */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 mb-6 gap-4">
        {/* Tab filter */}
        <div className="flex space-x-6 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          <button
            onClick={() => setUserTab('all')}
            className={`pb-3 relative transition-colors ${userTab === 'all' ? 'text-[#4a1525] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4a1525]' : 'hover:text-gray-700'}`}
          >
            All Accounts
          </button>
          <button
            onClick={() => setUserTab('customers')}
            className={`pb-3 relative transition-colors ${userTab === 'customers' ? 'text-[#4a1525] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4a1525]' : 'hover:text-gray-700'}`}
          >
            Customers
          </button>
          <button
            onClick={() => setUserTab('admins')}
            className={`pb-3 relative transition-colors ${userTab === 'admins' ? 'text-[#4a1525] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4a1525]' : 'hover:text-gray-700'}`}
          >
            Administrators
          </button>
        </div>

        {/* Filter button */}
        <button className="flex items-center space-x-1.5 text-[10px] font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider border border-gray-200 px-3 py-1.5 rounded bg-white self-start sm:self-auto mb-2">
          <i className="fa-solid fa-sliders text-[9px]"></i>
          <span>Filter</span>
        </button>
      </div>

      {/* ================= USER DATA TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400 font-semibold bg-gray-50/50">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Date Joined</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">

                  {/* Cột Tên + Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#eadecb] text-[#4a1525] font-bold flex items-center justify-center text-[11px] font-mono shadow-sm">
                        {getInitials(user.fullName || user.username)}
                      </div>
                      <span className="font-serif font-bold text-gray-900 text-sm hover:text-[#4a1525] cursor-pointer">
                        {user.fullName || user.username}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-gray-500 font-mono text-[11px]">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6">
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-mono font-bold ${
                      user.role === 'ADMIN' ? 'bg-[#fde8e8] text-[#c53030]' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Date Joined */}
                  <td className="py-4 px-6 text-gray-500 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <select 
                        value={user.status}
                        onChange={(e) => handleUpdateStatus(user.id, e.target.value)}
                        className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-transparent border-none outline-none cursor-pointer">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DEACTIVATED">DEACTIVATED</option>
                      </select>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center text-gray-400 space-x-3">
                    <button className="hover:text-blue-600 transition-colors" title="Chỉnh sửa quyền hành"><i className="fa-regular fa-pen-to-square"></i></button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="hover:text-red-600 transition-colors" 
                      title="Khóa tài khoản">
                      <i className="fa-solid fa-ban text-[11px]"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang dưới đáy bảng */}
        {filteredUsers.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-medium bg-white">
            <span className="uppercase tracking-tight">SHOWING 1 TO {Math.min(filteredUsers.length, 20)} OF {users.length} MEMBERS</span>
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