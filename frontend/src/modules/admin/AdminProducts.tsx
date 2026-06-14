import React, { useState, useEffect } from 'react';
import StatCards from './product/StatCards';
import FilterBar from './product/FilterBar';
import ProductTable from './product/ProductTable';
import ProductModal from './product/ProductModal';
import { apiCall } from '../../api/client';
import { useToast } from '../../hooks/useToast';

interface Product {
  id: number;
  name: string;
  collectionName: string;
  price: number;
  thumbnailUrl: string;
  sku?: string;
  stock?: number;
  category?: string;
  img?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiCall<any>('/api/products', { 
        method: 'GET',
        raw: true 
      });
      
      const productList = data.content || data || [];
      const mappedProducts = Array.isArray(productList) ? productList.map((p: any) => ({
        id: p.id,
        name: p.name,
        collectionName: p.collectionName,
        price: p.price,
        thumbnailUrl: p.thumbnailUrl,
        img: p.thumbnailUrl,
        sku: p.sku || `SKU-${p.id}`,
        stock: p.stock || 0,
        category: p.category || 'Uncategorized',
        status: p.stock <= 5 ? 'low-stock' : p.stock === 0 ? 'out-of-stock' : 'in-stock'
      })) : [];
      
      setProducts(mappedProducts);
    } catch (error: any) {
      showToast('Lỗi tải danh sách sản phẩm: ' + error.message, 'error');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product
  const handleAddProduct = async (formData: any) => {
    try {
      await apiCall('/api/products', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      showToast('Sản phẩm đã được thêm thành công!', 'success');
      fetchProducts();
      setShowModal(false);
    } catch (error: any) {
      showToast('Lỗi thêm sản phẩm: ' + error.message, 'error');
    }
  };

  // Update product
  const handleUpdateProduct = async (formData: any) => {
    if (!editingProduct) return;
    try {
      await apiCall(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      showToast('Sản phẩm đã được cập nhật thành công!', 'success');
      fetchProducts();
      setShowModal(false);
      setEditingProduct(null);
    } catch (error: any) {
      showToast('Lỗi cập nhật sản phẩm: ' + error.message, 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      await apiCall(`/api/products/${id}`, {
        method: 'DELETE'
      });
      showToast('Sản phẩm đã được xóa thành công!', 'success');
      fetchProducts();
    } catch (error: any) {
      showToast('Lỗi xóa sản phẩm: ' + error.message, 'error');
    }
  };

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalProducts = products.length;
  const activeListings = products.filter(p => (p.stock || 0) > 0).length;
  const lowStockCount = products.filter(p => (p.stock || 0) <= 5 && (p.stock || 0) > 0).length;
  const inventoryValue = `$${(products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0) / 1000000).toFixed(1)}M`;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#2c2c2c]">Quản lý Sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh sách sản phẩm trong kho</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="bg-[#4a1525] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#360f1b] transition-colors"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm sản phẩm
        </button>
      </div>

      <StatCards 
        totalProducts={totalProducts}
        activeListings={activeListings}
        lowStock={lowStockCount}
        inventoryValue={inventoryValue}
      />

      <FilterBar onSearch={setSearchTerm} />

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={(product) => {
            setEditingProduct(product);
            setShowModal(true);
          }}
          onDelete={handleDeleteProduct}
        />
      )}

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        />
      )}
    </div>
  );
}
