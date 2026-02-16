import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import {
    ShoppingBag, Plus, Package, Search, Trash2, AlertCircle, TrendingUp, BarChart2,
    Filter, IndianRupee, PieChart, ArrowUpRight, CheckCircle2, X, Info, Save, Edit3,
    Calendar, Clock, LayoutGrid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const Shop = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [insights, setInsights] = useState(null);
    const [showInsights, setShowInsights] = useState(false);
    const [insightRange, setInsightRange] = useState('all');
    const [editingItem, setEditingItem] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const { user } = useAuth();

    const categories = [
        'All',
        'Packed Snacks',
        'Ready-to-Eat',
        'Ice Creams',
        'Beverages',
        'Dairy Products',
        'Daily-Use Essentials',
        'Stationery',
        'Chocolates'
    ];

    const fetchItems = async () => {
        try {
            const { data } = await axios.get('/api/shop');
            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching items:', error);
            setLoading(false);
        }
    };

    const fetchInsights = async () => {
        try {
            const { data } = await axios.get(`/api/shop/insights?range=${insightRange}`);
            setInsights(data);
        } catch (error) {
            console.error('Error fetching insights:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'warden') {
            fetchInsights();
        }
    }, [user, insightRange]);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const getStockStatus = (quantity, threshold) => {
        if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: AlertCircle };
        if (quantity < threshold) return { label: 'Low Stock', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: TrendingUp };
        return { label: 'Available', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 };
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this item from the catalog?')) {
            try {
                await axios.delete(`/api/shop/${id}`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/shop/${editingItem._id}`, {
                quantity: editingItem.quantity,
                threshold: editingItem.threshold,
                price: editingItem.price
            });
            setShowUpdateModal(false);
            setEditingItem(null);
            fetchItems();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const UpdateModal = () => (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                            <Edit3 size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white uppercase tracking-tight">Update Stock</h2>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">{editingItem?.itemName}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowUpdateModal(false)} className="text-slate-500 hover:text-white transition-colors p-2"><X size={20} /></button>
                </div>
                <form onSubmit={handleUpdateStock} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Price (₹)</label>
                            <input
                                type="number"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                                value={editingItem?.price || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Current Quantity</label>
                            <input
                                type="number"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                                value={editingItem?.quantity || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Restock Threshold</label>
                            <input
                                type="number"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                                value={editingItem?.threshold || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, threshold: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2">
                        <Save size={18} />
                        <span>Apply Changes</span>
                    </button>
                </form>
            </div>
        </div>
    );

    const SalesInsightsModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-8 duration-500">
                <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center space-x-6">
                        <div className="p-4 bg-indigo-600/10 text-indigo-500 rounded-3xl border border-indigo-500/20 shadow-2xl">
                            <BarChart2 size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Advanced Sales Analytics</h2>
                            <div className="flex items-center space-x-4 mt-1">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Performance Dashboard</p>
                                <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                                    {['day', 'week', 'month', 'all'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setInsightRange(r)}
                                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${insightRange === r ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowInsights(false)} className="text-slate-500 hover:text-white transition-colors p-3 bg-slate-800 rounded-2xl border border-slate-700"><X size={28} /></button>
                </div>
                <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[350px]">
                        <div className="bg-slate-800/20 border border-slate-700/50 rounded-[2.5rem] p-8 flex flex-col">
                            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center space-x-3">
                                <Calendar size={14} className="text-blue-500" />
                                <span>Revenue Trends</span>
                            </h3>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={insights?.dailyTrends}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="_id" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-slate-800/20 border border-slate-700/50 rounded-[2.5rem] p-8 flex flex-col">
                            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center space-x-3">
                                <PieChart size={14} className="text-indigo-500" />
                                <span>Category Contributions</span>
                            </h3>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={insights?.insights}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="_id" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="totalSales" radius={[8, 8, 0, 0]}>
                                            {insights?.insights.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#3b82f6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {insights?.insights.slice(0, 4).map((insight, idx) => (
                            <div key={idx} className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{insight._id}</p>
                                <h3 className="text-2xl font-black text-white">₹{insight.totalSales.toLocaleString()}</h3>
                                <div className="flex items-center space-x-2 mt-4 text-green-400">
                                    <ArrowUpRight size={14} />
                                    <span className="text-xs font-bold uppercase tracking-tighter">{insight.itemCount} Units Sold</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Top Moving Items */}
                    <div className="bg-slate-800/30 rounded-[2.5rem] border border-slate-700/50 p-10">
                        <h3 className="text-white font-black uppercase tracking-tight text-sm mb-8 flex items-center space-x-3">
                            <TrendingUp size={18} className="text-blue-500" />
                            <span>Fastest Moving Products</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {insights?.itemMovement.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-slate-900/50 rounded-3xl border border-slate-800/50 group hover:border-blue-500/20 transition-all">
                                    <div className="flex items-center space-x-5">
                                        <span className="text-slate-600 font-black text-sm italic w-6">#{idx + 1}</span>
                                        <span className="text-white font-bold text-sm uppercase tracking-tight">{item._id}</span>
                                    </div>
                                    <div className="flex items-center space-x-10">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Quantity</p>
                                            <p className="text-white font-black">{item.totalQuantity}</p>
                                        </div>
                                        <div className="text-right min-w-[100px]">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Revenue</p>
                                            <p className="text-blue-400 font-black">₹{item.revenue.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Container */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 italic">WH Smith Style</span>
                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">• Boys Hostel Store</span>
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">WH Smith</h1>
                            <p className="text-slate-400 mt-2 max-w-xl text-sm font-medium leading-relaxed italic">Premium selection of Indian veg snacks, dairy, and daily essentials — {` `}
                                <span className="text-blue-500 font-black uppercase tracking-tighter not-italic">Where Campus Life Feels Like Home</span>
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            {(user?.role === 'admin' || user?.role === 'warden') && (
                                <button
                                    onClick={() => setShowInsights(true)}
                                    className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 px-6 py-3 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] outline-none"
                                >
                                    <BarChart2 size={16} />
                                    <span>Sales Insights</span>
                                </button>
                            )}
                            {(user?.role === 'admin' || user?.role === 'warden') && (
                                <button className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all shadow-xl shadow-blue-600/20 font-black uppercase tracking-widest text-[10px] outline-none">
                                    <Plus size={16} />
                                    <span>Manage Catalog</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters & Categories */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search inventory items..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-16 pr-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all shadow-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Inventory Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Synchronizing Inventory...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item) => {
                            const status = getStockStatus(item.quantity, item.threshold);
                            return (
                                <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 group hover:border-blue-500/30 transition-all duration-300 shadow-xl flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[40px] rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
                                        {item.isVeg && <span className="w-5 h-5 flex items-center justify-center bg-white border-2 border-green-600 rounded p-0.5 shadow-sm"><div className="w-full h-full bg-green-600 rounded-full"></div></span>}
                                    </div>

                                    <div className="flex-grow space-y-8 relative z-10">
                                        <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl w-fit">
                                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{item.category}</span>
                                        </div>

                                        <div className="min-h-[60px]">
                                            <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-tight">{item.itemName}</h3>
                                            <div className="flex items-center space-x-2 mt-2">
                                                {item.isIndianBrand && <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter italic">Indian Heritage Brand</span>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pb-2">
                                            <div className="p-4 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center"><Clock size={10} className="mr-1 opacity-50" /> Price</p>
                                                <p className="text-lg font-black text-white flex items-center">
                                                    <IndianRupee size={14} className="text-slate-500 mr-0.5" />
                                                    {item.price}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center"><Package size={10} className="mr-1 opacity-50" /> In Stock</p>
                                                <p className={`text-lg font-black ${item.quantity < item.threshold ? 'text-red-500' : 'text-green-500'}`}>
                                                    {item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border ${status.color}`}>
                                            <status.icon size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                                        </div>
                                    </div>

                                    {(user?.role === 'admin' || user?.role === 'warden') && (
                                        <div className="mt-8 flex gap-3 relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setShowUpdateModal(true);
                                                }}
                                                className="flex-1 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-600/20 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-600/20 outline-none"
                                            >
                                                Stock Update
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 p-4 rounded-2xl transition-all shadow-lg hover:shadow-red-500/20 outline-none"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {filteredItems.length === 0 && (
                            <div className="md:col-span-2 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[3rem] p-32 text-center border-dashed">
                                <ShoppingBag className="h-24 w-24 text-slate-800 mx-auto mb-8 opacity-50" />
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Inventory Empty</h3>
                                <p className="text-slate-500 mt-2 font-medium italic">No products match your current filters. Try refining your search.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Notice Footer */}
                <div className="bg-blue-600/5 border border-blue-600/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-8">
                        <div className="p-5 bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-600/40"><Info size={36} /></div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-tight text-xl leading-tight">Automated Stock Monitoring</h4>
                            <p className="text-slate-400 text-sm font-medium mt-1">Stock thresholds are actively monitored to ensure critical items never run out of supplies.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-slate-900 px-8 py-5 rounded-3xl border border-slate-800 shadow-xl">
                        <span className="w-3.5 h-3.5 bg-red-500 rounded-full animate-ping"></span>
                        <span className="text-white font-black uppercase tracking-widest text-[10px]">Real-time Tracking Enabled</span>
                    </div>
                </div>

                {showInsights && <SalesInsightsModal />}
                {showUpdateModal && <UpdateModal />}
            </div>
        </Layout>
    );
};

export default Shop;
