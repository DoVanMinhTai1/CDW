import React from 'react';

interface Product {
  id: number;
  name: string;
  collection?: string;
  collectionName?: string;
  sku?: string;
  category?: string;
  price: number;
  stock?: number;
  img?: string;
  thumbnailUrl?: string;
  status?: string;
}

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400 font-semibold bg-gray-50">
            <th className="py-3 px-6 w-20">Image</th>
            <th className="py-3 px-6">Product Name</th>
            <th className="py-3 px-6">SKU</th>
            <th className="py-3 px-6">Category</th>
            <th className="py-3 px-6">Price</th>
            <th className="py-3 px-6">Stock</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {products.map((prod) => (
            <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6">
                <img src={prod.img || prod.thumbnailUrl || 'https://via.placeholder.com/48'} alt={prod.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
              </td>
              <td className="py-4 px-6">
                <p className="font-medium text-gray-900">{prod.name}</p>
                <p className="text-xs text-gray-400 uppercase tracking-tight mt-0.5">{prod.collection || prod.collectionName || '-'}</p>
              </td>
              <td className="py-4 px-6 text-xs text-gray-500 font-mono">{prod.sku || '-'}</td>
              <td className="py-4 px-6">
                <span className="text-[11px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                  {prod.category || '-'}
                </span>
              </td>
              <td className="py-4 px-6 font-medium text-gray-800">${prod.price?.toLocaleString()}</td>
              <td className="py-4 px-6">
                <span className={`text-xs font-medium ${
                  prod.status === 'out-of-stock' ? 'text-gray-400 line-through' : 
                  prod.status === 'low-stock' ? 'text-red-500 font-semibold' : 'text-gray-600'
                }`}>
                  {prod.stock || 0}
                </span>
              </td>
              <td className="py-4 px-6 text-center text-gray-400 space-x-3">
                <button 
                  onClick={() => onEdit?.(prod)}
                  className="hover:text-blue-600 transition-colors"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button 
                  onClick={() => onDelete?.(prod.id)}
                  className="hover:text-red-600 transition-colors"
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy sản phẩm nào
        </div>
      )}
    </div>
  );
}