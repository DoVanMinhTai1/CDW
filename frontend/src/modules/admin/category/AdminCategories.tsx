import React, { useState, useEffect } from 'react';
import CategoryModal from './CategoryModal';
import { apiCall } from '../../../api/client';
import { useToast } from '../../../hooks/useToast';

interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subTab, setSubTab] = useState('all');
  const { showToast } = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiCall<any>('/api/categories', { 
        method: 'GET',
        raw: true 
      });
      
      const categoryList = Array.isArray(data) ? data : (data.content || []);
      setCategories(categoryList);
    } catch (error: any) {
      showToast('Lỗi tải danh sách danh mục: ' + error.message, 'error');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async (formData: any) => {
    try {
      await apiCall('/api/categories', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      showToast('Danh mục đã được thêm thành công!', 'success');
      fetchCategories();
      setShowModal(false);
    } catch (error: any) {
      showToast('Lỗi thêm danh mục: ' + error.message, 'error');
    }
  };

  // Update category
  const handleUpdateCategory = async (formData: any) => {
    if (!editingCategory) return;
    try {
      await apiCall(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      showToast('Danh mục đã được cập nhật thành công!', 'success');
      fetchCategories();
      setShowModal(false);
      setEditingCategory(null);
    } catch (error: any) {
      showToast('Lỗi cập nhật danh mục: ' + error.message, 'error');
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa danh mục này?')) return;
    
    try {
      await apiCall(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      showToast('Danh mục đã được xóa thành công!', 'success');
      fetchCategories();
    } catch (error: any) {
      showToast('Lỗi xóa danh mục: ' + error.message, 'error');
    }
  };

  // Filter categories
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full justify-between">

      {/* ================= PHẦN TRÊN: TIÊU ĐỀ & BẢNG DỮ LIỆU ================= */}
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">CURATED COLLECTIONS</span>
            <h1 className="text-3xl font-serif text-[#4a1525]">Category Management</h1>
            <p className="text-xs text-gray-400 mt-2 max-w-xl leading-relaxed">
              Organize your brand legacy by defining the aesthetic and thematic network of your boutique. Managing high jewelry lineages and model silhouette groupings.
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
            className="bg-[#4a1525] text-white text-xs tracking-wider uppercase font-semibold px-5 py-2.5 rounded shadow hover:bg-[#360f1b] transition-colors whitespace-nowrap">
            + ADD CATEGORY
          </button>
        </div>

        {/* Thanh Điều Hướng Phụ & Ô Tìm Kiếm Danh Mục */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 mb-4 mt-8 gap-4">
          {/* Sub Tabs */}
          <div className="flex space-x-6 text-xs font-semibold tracking-wide text-gray-400">
            <button
              onClick={() => setSubTab('all')}
              className={`pb-3 relative transition-colors ${subTab === 'all' ? 'text-[#4a1525] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#4a1525]' : 'hover:text-gray-700'}`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSubTab('published')}
              className={`pb-3 relative transition-colors ${subTab === 'published' ? 'text-[#4a1525] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#4a1525]' : 'hover:text-gray-700'}`}
            >
              Published
            </button>
            <button
              onClick={() => setSubTab('archived')}
              className={`pb-3 relative transition-colors ${subTab === 'archived' ? 'text-[#4a1525] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#4a1525]' : 'hover:text-gray-700'}`}
            >
              Archived
            </button>
          </div>

          {/* Ô Tìm Kiếm nhỏ bên phải */}
          <div className="relative mb-2 sm:mb-0">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
            <input
              type="text"
              placeholder="Filter Categories..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-[#4a1525] bg-white w-full sm:w-48"
            />
          </div>
        </div>

        {/* Bảng Danh Mục */}
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400 font-semibold bg-gray-50">
                <th className="py-3 px-6">Category Name</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Products</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-6 w-1/4">
                      <div>
                        <p className="font-serif font-bold text-sm text-gray-900">{cat.name}</p>
                      </div>
                    </td>

                    {/* Mô tả ngắn */}
                    <td className="py-5 px-6 text-gray-500 max-w-sm leading-relaxed">
                      {cat.description || '-'}
                    </td>

                    {/* Số lượng sản phẩm */}
                    <td className="py-5 px-6 font-serif font-bold text-gray-800">
                      {cat.productCount} Pieces
                    </td>

                    {/* Hành động (Sửa / Xóa) */}
                    <td className="py-5 px-6 text-center text-gray-400 space-x-3">
                      <button 
                        onClick={() => {
                          setEditingCategory(cat);
                          setShowModal(true);
                        }}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Phân trang dưới bảng */}
          {filteredCategories.length > 0 && (
            <div className="p-4 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-medium">
              <span>SHOWING 1 TO {Math.min(filteredCategories.length, 12)} OF {categories.length} CATEGORIES</span>
              <div className="flex items-center space-x-1">
                <button className="p-1 px-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-400"><i className="fa-solid fa-chevron-left text-[9px]"></i></button>
                <button className="p-1 px-2.5 border border-[#4a1525] bg-white text-[#4a1525] rounded font-bold">1</button>
                <button className="p-1 px-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-400"><i className="fa-solid fa-chevron-right text-[9px]"></i></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= PHẦN DƯỚI: THÔNG SỐ THỐNG KÊ (BOTTOM STATS) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-6 border-t border-gray-100">
        <div className="bg-white p-6 border border-gray-100 rounded shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Inventory Depth</p>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-serif text-[#4a1525]">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()}
            </span>
            <span className="text-[10px] uppercase text-gray-400 font-bold font-sans">SKUs</span>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-100 rounded shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Active Categorizations</p>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-serif text-[#4a1525]">{categories.length}</span>
            <span className="text-[10px] uppercase text-gray-400 font-bold font-sans">Collections</span>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-100 rounded shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Curated Lineages</p>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-serif text-[#4a1525]">{Math.ceil(categories.length / 3).toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase text-gray-400 font-bold font-sans">Vaults</span>
          </div>
        </div>
      </div>

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
        />
      )}

    </div>
  );
}