import React from 'react';

interface StatCardsProps {
  totalProducts?: number;
  activeListings?: number;
  lowStock?: number;
  inventoryValue?: string;
}

export default function StatCards({ 
  totalProducts = 0, 
  activeListings = 0, 
  lowStock = 0, 
  inventoryValue = '$0' 
}: StatCardsProps) {
  const stats = [
    { label: 'Total Items', value: totalProducts.toLocaleString(), isAlert: false },
    { label: 'Active Listings', value: activeListings.toLocaleString(), isAlert: false },
    { label: 'Low Stock', value: lowStock.toLocaleString(), isAlert: lowStock > 0 },
    { label: 'Inventory Value', value: inventoryValue, isAlert: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 border border-gray-100 rounded shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">{stat.label}</p>
          <p className={`text-2xl font-serif mt-2 ${stat.isAlert ? 'text-red-600' : 'text-[#4a1525]'}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}