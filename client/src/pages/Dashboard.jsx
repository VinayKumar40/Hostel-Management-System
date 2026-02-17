import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Users, Home, ClipboardList, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="space-y-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}</h1>
                        <p className="text-slate-400">Here's what's happening in Boys Hostel today.</p> // Standardized block name
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Cards */}
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:border-blue-500/50 transition-all group cursor-default">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-all">
                                <Home className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Total Rooms</h3>
                        <p className="text-2xl font-bold text-white">100</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:border-green-500/50 transition-all group cursor-default">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-all">
                                <Users className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Occupancy</h3>
                        <p className="text-2xl font-bold text-white">42%</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:border-amber-500/50 transition-all group cursor-default">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-all">
                                <ClipboardList className="h-6 w-6 text-amber-500" />
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Active Mess</h3>
                        <p className="text-2xl font-bold text-white">1 Mess</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:border-purple-500/50 transition-all group cursor-default">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-all">
                                <ShoppingBag className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Shop Items</h3>
                        <p className="text-2xl font-bold text-white">12 Categories</p>
                    </div>
                </div>

                {/* Role Specific Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/users')}
                                className="p-5 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-blue-500/50 transition-all text-slate-300 text-sm font-bold text-left group"
                            >
                                <span className="block text-white mb-1 group-hover:text-blue-400">Allocate New Student</span>
                                <span className="text-xs text-slate-500 font-normal">Add student to a room</span>
                            </button>
                            <button
                                onClick={() => navigate('/mess')}
                                className="p-5 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-green-500/50 transition-all text-slate-300 text-sm font-bold text-left group"
                            >
                                <span className="block text-white mb-1 group-hover:text-green-400">Update Mess Menu</span>
                                <span className="text-xs text-slate-500 font-normal">Change daily food menu</span>
                            </button>
                            <button
                                onClick={() => navigate('/shop')}
                                className="p-5 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-purple-500/50 transition-all text-slate-300 text-sm font-bold text-left group"
                            >
                                <span className="block text-white mb-1 group-hover:text-purple-400">Manage Shop Inventory</span>
                                <span className="text-xs text-slate-500 font-normal">Track snacks and drinks</span>
                            </button>
                            <button
                                onClick={() => navigate('/rms')}
                                className="p-5 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-amber-500/50 transition-all text-slate-300 text-sm font-bold text-left group"
                            >
                                <span className="block text-white mb-1 group-hover:text-amber-400">Service Desk</span>
                                <span className="text-xs text-slate-500 font-normal">Manage requests & issues</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
