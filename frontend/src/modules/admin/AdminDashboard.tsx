import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './product/Sidebar';

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-[#f9f9f9] text-[#2c2c2c]">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}