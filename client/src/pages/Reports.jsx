import React from 'react';
import Layout from '../components/Layout';
import { FileText, Download, TrendingUp, Users, Home, ShoppingBag } from 'lucide-react';

const Reports = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">System Reports</h1>
                        <p className="text-slate-400">View and download hostel usage and financial reports.</p>
                    </div>
                    <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 font-bold">
                        <Download className="h-5 w-5" />
                        <span>Download Full Report</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm border-t-4 border-t-blue-500">
                        <div className="flex items-center space-x-3 mb-4">
                            <TrendingUp className="text-blue-500" />
                            <h3 className="text-white font-bold">Monthly Revenue</h3>
                        </div>
                        <p className="text-3xl font-black text-white">₹45,000</p>
                        <p className="text-xs text-green-500 mt-2">+12.5% from last month</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm border-t-4 border-t-green-500">
                        <div className="flex items-center space-x-3 mb-4">
                            <Users className="text-green-500" />
                            <h3 className="text-white font-bold">Registration Trend</h3>
                        </div>
                        <p className="text-3xl font-black text-white">24</p>
                        <p className="text-xs text-slate-400 mt-2">New students this month</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm border-t-4 border-t-purple-500">
                        <div className="flex items-center space-x-3 mb-4">
                            <ShoppingBag className="text-purple-500" />
                            <h3 className="text-white font-bold">Shop Sales</h3>
                        </div>
                        <p className="text-3xl font-black text-white">₹8,240</p>
                        <p className="text-xs text-slate-400 mt-2">Best selling: Snacks</p>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                            <FileText size={20} className="text-blue-500" />
                            <span>Recent Operational Logs</span>
                        </h2>
                    </div>
                    <div className="p-8 text-center py-20">
                        <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Detailed log analytics will appear here after more system activity.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Reports;
