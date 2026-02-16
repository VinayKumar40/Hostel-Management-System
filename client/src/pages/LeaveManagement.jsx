import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import {
    Calendar, Clock, MapPin, FileText, Send, CheckCircle2, XCircle,
    AlertCircle, History, LayoutGrid, User, Landmark, ShieldCheck,
    ArrowRightLeft, BadgeCheck, LogOut, LogIn, Trash2, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const LeaveManagement = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        term: 'Term-II (January-May)',
        leaveType: 'Day Leave',
        visitPlace: '',
        reason: '',
        startDate: '',
        endDate: ''
    });

    const fetchLeaves = async () => {
        try {
            const endpoint = user.role === 'student' ? '/api/leaves/student' : '/api/leaves';
            console.log('Fetching leaves from:', endpoint);
            const { data } = await axios.get(endpoint);
            console.log('Fetched leaves:', data);
            setLeaves(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leaves:', error);
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('/api/auth/profile');
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchLeaves();
        fetchProfile();
    }, []);

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/leaves', formData);
            setFormData({
                ...formData,
                visitPlace: '',
                reason: '',
                startDate: '',
                endDate: ''
            });
            fetchLeaves();
            fetchProfile();
            alert('Leave application submitted successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Error applying for leave');
        }
    };

    const handleAction = async (id, status) => {
        if (window.confirm(`Are you sure you want to set this leave to ${status}?`)) {
            try {
                await axios.put(`/api/leaves/${id}/status`, { status });
                fetchLeaves();
            } catch (error) {
                alert('Error updating leave status');
            }
        }
    };

    const handleGateEntry = async (id, type) => {
        try {
            await axios.put(`/api/leaves/${id}/gate`, { type });
            fetchLeaves();
        } catch (error) {
            alert('Error recording gate entry');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Cancelled': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const filteredLeaves = leaves.filter(l =>
        l.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.student?.studentId?.includes(searchTerm) ||
        l.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const safeFormat = (dateString, formatStr) => {
        try {
            if (!dateString) return '--:--';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return format(date, formatStr);
        } catch (error) {
            return 'Date Error';
        }
    };

    return (
        <Layout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
                            <ShieldCheck className="text-blue-500" size={32} />
                            Leave Management System
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium italic">Digital workflow for hostel exit and entry permissions.</p>
                    </div>
                </div>

                {user.role === 'student' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Balance Summary */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
                                <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <BadgeCheck size={18} className="text-blue-500" />
                                    Leave Balance Summary
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50 group hover:border-blue-500/30 transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-tight">Day Leave</span>
                                            <span className="text-2xl font-black text-white">{profile?.dayLeaveBalance || 0}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-600 h-full" style={{ width: `${(profile?.dayLeaveBalance / 75) * 100}%` }}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Available out of 75</p>
                                    </div>

                                    <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50 group hover:border-indigo-500/30 transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-tight">Night Leave</span>
                                            <span className="text-2xl font-black text-white">{profile?.nightLeaveBalance || 0}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-indigo-600 h-full" style={{ width: `${(profile?.nightLeaveBalance / 60) * 100}%` }}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Available out of 60</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-600/5 border border-blue-600/10 p-6 rounded-[2rem]">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-600/20">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase tracking-tight text-sm">Late Return Policy</h4>
                                        <p className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">Ensure check-in before the deadline to avoid disciplinary flags on your record.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Apply Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
                                <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Send size={18} className="text-blue-500" />
                                    Application for Hostel Leave
                                </h2>
                                <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Term</label>
                                        <select
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                                            value={formData.term}
                                            onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                        >
                                            <option>Term-II (January-May)</option>
                                            <option>Term-I (August-December)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Leave Type</label>
                                        <select
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                                            value={formData.leaveType}
                                            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                        >
                                            <option>Day Leave</option>
                                            <option>Night Leave</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Place of Visit</label>
                                        <input
                                            type="text"
                                            placeholder="Enter destination address..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                                            value={formData.visitPlace}
                                            onChange={(e) => setFormData({ ...formData, visitPlace: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reason for Leave</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Why are you applying for leave?"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3">
                                        <Send size={20} />
                                        Submit Leave Application
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Warden Search Bar */}
                {user.role !== 'student' && (
                    <div className="relative max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Find student leave requests..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all shadow-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {/* History Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                        <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <History size={18} className="text-blue-500" />
                            {user.role === 'student' ? 'Your Leave History' : 'All Leave Requests'}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/30">
                                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Application Info</th>
                                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Visit & Purpose</th>
                                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Date & Duration</th>
                                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Status</th>
                                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Gate Entry</th>
                                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-all group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-500 font-black">
                                                    {user.role === 'student' ? 'L' : leave.student?.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">{user.role === 'student' ? leave.leaveType : leave.student?.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight">#{leave._id.slice(-6)} {user.role !== 'student' && `• ${leave.student?.studentId}`}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-white text-sm font-medium flex items-center gap-1.5 capitalize">
                                                    <MapPin size={12} className="text-blue-500" />
                                                    {leave.visitPlace}
                                                </p>
                                                <p className="text-xs text-slate-500 italic truncate max-w-[150px]">{leave.reason}</p>
                                            </div>
                                        </td>
                                        <td className="p-6 text-sm">
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-slate-300 font-bold flex items-center gap-1.5">
                                                    <LogIn size={12} className="text-green-500" />
                                                    {safeFormat(leave.startDate, 'MMM dd, HH:mm')}
                                                </p>
                                                <p className="text-slate-300 font-bold flex items-center gap-1.5">
                                                    <LogOut size={12} className="text-red-500" />
                                                    {safeFormat(leave.endDate, 'MMM dd, HH:mm')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(leave.status)}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight">Out: {safeFormat(leave.checkOutTime, 'HH:mm')}</p>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight">In: {safeFormat(leave.checkInTime, 'HH:mm')}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                {user.role !== 'student' && leave.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(leave._id, 'Approved')}
                                                            className="p-2 bg-green-600/10 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-600/20"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(leave._id, 'Rejected')}
                                                            className="p-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-600/20"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {user.role !== 'student' && leave.status === 'Approved' && (
                                                    <div className="flex gap-2">
                                                        {!leave.checkOutTime && (
                                                            <button
                                                                onClick={() => handleGateEntry(leave._id, 'check-out')}
                                                                className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg"
                                                            >
                                                                Out
                                                            </button>
                                                        )}
                                                        {leave.checkOutTime && !leave.checkInTime && (
                                                            <button
                                                                onClick={() => handleGateEntry(leave._id, 'check-in')}
                                                                className="px-3 py-1.5 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg"
                                                            >
                                                                In
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {user.role === 'student' && leave.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleAction(leave._id, 'Cancelled')}
                                                        className="p-2 bg-slate-600/10 text-slate-400 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-slate-600/20"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeaves.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-20 text-center">
                                            <History className="h-12 w-12 text-slate-800 mx-auto mb-4 opacity-50" />
                                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">No Leave Records</h3>
                                            <p className="text-slate-500 mt-1 font-medium italic">Apply for your first leave or refine your search filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LeaveManagement;
