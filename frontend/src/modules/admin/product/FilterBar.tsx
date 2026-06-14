import React from 'react';

interface FilterBarProps {
  onSearch?: (term: string) => void;
}

export default function FilterBar({ onSearch }: FilterBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-t-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <input 
        type="text" 
        placeholder="Filter by name, SKU or collection..." 
        onChange={(e) => onSearch?.(e.target.value)}
        className="border-b border-gray-300 pb-1 text-sm outline-none focus:border-[#4a1525] w-full md:w-80 bg-transparent"
      />
      <div className="flex items-center space-x-4 text-xs text-gray-600">
        <select className="bg-transparent border-none outline-none font-medium cursor-pointer">
          <option>ALL CATEGORIES</option>
        </select>
        <select className="bg-transparent border-none outline-none font-medium cursor-pointer">
          <option>STOCK STATUS</option>
        </select>
      </div>
    </div>
  );
}