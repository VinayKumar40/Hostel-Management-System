import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import {
    Mail, Send, Search, Filter, MessageSquare, Clock,
    AlertCircle, CheckCircle2, XCircle, Info, Paperclip,
    History, User, Home, Shield, ChevronRight, CornerDownRight,
    ClipboardList, PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const RMSInbox = () => { // Kept filename as RMSInbox for route compatibility
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [closingRemarks, setClosingRemarks] = useState('');

    // New Entry Form State (Warden/Admin)
    const [isEntryMode, setIsEntryMode] = useState(true); // Default to entry mode for quick logging
    const [formData, setFormData] = useState({
        studentName: '',
        roomNumber: '',
        block: 'Boys Hostel', // Standardized block name
        category: 'Room Issues',
        subcategory: '',
        description: '',
        attachments: []
    });
    const [studentSuggestions, setStudentSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const categories = [
        'Room Issues', 'Washroom', 'Electricity', 'Water Supply',
        'Cleanliness', 'Safety', 'Staff Behavior', 'Food (Non-Mess)',
        'Common Area Maintenance'
    ];

    const blocks = ['Boys Hostel']; // Standardized block names

    const fetchRequests = async () => {
        try {
            // Admin/Warden sees all requests. If student access is retained, handle logic here.
            // Assuming this module is now purely for Admin/Warden as per requirement.
            const endpoint = '/api/rms';
            const { data } = await axios.get(endpoint);
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching RMS requests:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/rms', formData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            setFormData({
                studentName: '',
                roomNumber: '',
                block: 'Boys Hostel',
                category: 'Room Issues',
                subcategory: '',
                description: '',
                attachments: []
            });
            fetchRequests();
            alert('RMS Request logged successfully.');
            setIsEntryMode(false); // Switch to list view to see the new entry
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting request');
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            const { data } = await axios.post(`/api/rms/${selectedRequest._id}/reply`, { message: replyText });
            setSelectedRequest(data);
            setReplyText('');
            fetchRequests();
        } catch (error) {
            alert('Error sending reply');
        }
    };

    const updateStatus = async (id, status, remarks = '') => {
        try {
            const { data } = await axios.put(`/api/rms/${id}/status`, { status, closingRemarks: remarks });
            setSelectedRequest(data);
            setShowResolveModal(false);
            setClosingRemarks('');
            fetchRequests();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesSearch = r.rmsId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || r.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

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
            <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col gap-6">
                {showSuccess && (
                    <div className="fixed top-24 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right-10 fade-in duration-300">
                        <div className="p-2 bg-white/20 rounded-full">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="font-black uppercase tracking-widest text-xs">Success</h4>
                            <p className="font-bold text-sm">Request Submitted Successfully!</p>
                        </div>
                    </div>
                )}
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
                            <ClipboardList className="text-blue-500" />
                            Service Desk Entry & Tracking
                        </h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Assisted Workflow Console</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => { setIsEntryMode(true); setSelectedRequest(null); }}
                            className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all ${isEntryMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            <PlusCircle size={16} />
                            New Entry
                        </button>
                        <button
                            onClick={() => setIsEntryMode(false)}
                            className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all ${!isEntryMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            <History size={16} />
                            Tracking
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Left: Interactive List (Only visible when NOT in entry mode, or side-by-side if large screen? Let's do split view) */}
                    {/* Actually, for assisted workflow, usually we want either the FORM or the TRACKING LIST. But split view is nicer for multitasking. */}

                    <div className={`w-1/3 flex flex-col gap-4 ${isEntryMode ? 'hidden md:flex opacity-50 pointer-events-none' : 'flex'}`}>
                        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] flex-1 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-800 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search Service Desk ID, Name..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {['All', 'Pending', 'In Progress', 'Resolved'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border transition-all whitespace-nowrap ${filterStatus === status ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {filteredRequests.map(r => (
                                    <div
                                        key={r._id}
                                        onClick={() => { setSelectedRequest(r); setIsEntryMode(false); }}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all group ${selectedRequest?._id === r._id ? 'bg-blue-600/10 border-blue-500/50 shadow-lg' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{r.rmsId}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(r.status)}`}>
                                                {r.status}
                                            </span>
                                        </div>
                                        <h3 className="text-white font-bold text-sm mb-1 truncate">{r.category}</h3>
                                        <p className="text-slate-500 text-xs font-bold mb-1 truncate">{r.studentName} • Room {r.roomNumber}</p>
                                        <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-tight">
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} /> {safeFormat(r.createdAt, 'MMM dd, HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {filteredRequests.length === 0 && !loading && (
                                    <div className="text-center py-20 opacity-30">
                                        <ClipboardList className="mx-auto mb-4" size={32} />
                                        <p className="text-[10px] font-black uppercase">No records found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Main Content (Form or Details) */}
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-xl overflow-hidden flex flex-col relative">
                        {isEntryMode ? (
                            <div className="flex-1 overflow-y-auto p-12">
                                <div className="max-w-3xl mx-auto">
                                    <h2 className="text-xl font-black text-white italic uppercase tracking-tight mb-8 flex items-center gap-3">
                                        <PlusCircle className="text-blue-500" />
                                        Log New Service Desk Request
                                    </h2>
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Student Details Section */}
                                        <div className="md:col-span-2 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 mb-2">
                                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Student Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2 relative">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm font-bold"
                                                        value={formData.studentName}
                                                        onChange={async (e) => {
                                                            const name = e.target.value;
                                                            setFormData({ ...formData, studentName: name });
                                                            if (name.length > 0) {
                                                                try {
                                                                    const { data } = await axios.get(`/api/users/students/search?query=${name}`);
                                                                    setStudentSuggestions(data);
                                                                    setShowSuggestions(true);
                                                                } catch (error) {
                                                                    console.error("Error searching students", error);
                                                                }
                                                            } else {
                                                                setStudentSuggestions([]);
                                                                setShowSuggestions(false);
                                                            }
                                                        }}
                                                        onFocus={() => { if (formData.studentName) setShowSuggestions(true); }}
                                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                                                        required
                                                    />
                                                    {showSuggestions && studentSuggestions.length > 0 && (
                                                        <div className="absolute z-10 w-full bg-slate-900 border border-slate-700 rounded-xl mt-1 shadow-xl max-h-48 overflow-y-auto">
                                                            {studentSuggestions.map((student) => (
                                                                <div
                                                                    key={student._id}
                                                                    className="px-4 py-2 hover:bg-slate-800 cursor-pointer text-sm text-slate-300 transition-colors"
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault();
                                                                        setFormData({
                                                                            ...formData,
                                                                            studentName: student.name,
                                                                            roomNumber: student.room ? student.room.roomNumber : '',
                                                                            block: 'Boys Hostel'
                                                                        });
                                                                        setShowSuggestions(false);
                                                                    }}
                                                                >
                                                                    <span className="font-bold text-white">{student.name}</span>
                                                                    <span className="text-xs text-slate-500 ml-2">
                                                                        ({student.room ? student.room.roomNumber : 'No Room'})
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Number</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm font-bold"
                                                        value={formData.roomNumber}
                                                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Block</label>
                                                    <select
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm font-bold"
                                                        value={formData.block}
                                                        onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                                                    >
                                                        {blocks.map(b => <option key={b}>{b}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Issue Details Section */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                                            <select
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm font-bold"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                {categories.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject / Subcategory</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Tube light not working"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm font-bold"
                                                value={formData.subcategory}
                                                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                                            <textarea
                                                rows="4"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm font-bold"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="md:col-span-2 pt-4">
                                            <button type="submit" className="w-full bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-blue-600/30 hover:scale-[1.02]">
                                                Submit Request
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            // Tracking / Details View
                            <>
                                {!selectedRequest ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                                        <ClipboardList size={64} className="mb-6" />
                                        <h2 className="text-2xl font-black text-white italic uppercase">No Issue Selected</h2>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Select an item from the list to view details or update status.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Detail Header */}
                                        <div className="p-8 border-b border-slate-800 bg-slate-950/50 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-black text-blue-500 uppercase tracking-[0.2em]">{selectedRequest.rmsId}</span>
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedRequest.status)}`}>
                                                        {selectedRequest.status}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">{selectedRequest.category}</h2>
                                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                                                    {selectedRequest.subcategory}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {['Pending', 'In Progress'].map(st => (
                                                    <button
                                                        key={st}
                                                        onClick={() => updateStatus(selectedRequest._id, st)}
                                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all ${selectedRequest.status === st ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'}`}
                                                    >
                                                        {st}
                                                    </button>
                                                ))}
                                                {selectedRequest.status !== 'Resolved' && (
                                                    <button
                                                        onClick={() => { setShowResolveModal(true); }}
                                                        className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border bg-green-600/10 text-green-500 border-green-600/20 hover:bg-green-600 hover:text-white transition-all"
                                                    >
                                                        Mark Resolved
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Student Info Bar */}
                                        <div className="px-8 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">{selectedRequest.studentName}</p>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                        Room {selectedRequest.roomNumber} • {selectedRequest.block}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reported By</p>
                                                <p className="text-white font-bold text-xs">{selectedRequest.reportedBy || 'System'}</p>
                                            </div>
                                        </div>

                                        {/* Resolved Check */}
                                        {selectedRequest.status === 'Resolved' && (
                                            <div className="px-8 py-4 bg-green-600/10 border-b border-green-600/20">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="text-green-500" size={18} />
                                                    <div>
                                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none mb-1">Closing Remarks</p>
                                                        <p className="text-sm font-medium text-slate-300 italic">"{selectedRequest.closingRemarks || 'No formal remarks provided.'}"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Thread */}
                                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-950/20">
                                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-sm shadow-black/50">
                                                <p className="text-slate-300 text-sm leading-relaxed">{selectedRequest.description}</p>
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight mt-4 block">
                                                    Original Description • {safeFormat(selectedRequest.createdAt, 'MMM dd, HH:mm')}
                                                </span>
                                            </div>

                                            {selectedRequest.replies.map((reply, i) => (
                                                <div key={i} className={`flex gap-4 ${reply.senderRole === 'student' ? '' : 'flex-row-reverse'}`}>
                                                    <div className={`flex flex-col gap-2 max-w-[80%] ${reply.senderRole === 'student' ? 'items-start' : 'items-end'}`}>
                                                        <div className={`p-5 rounded-2xl text-sm ${reply.senderRole === 'student' ? 'bg-slate-900 border border-slate-800' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'}`}>
                                                            {reply.message}
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">
                                                            {reply.senderName} • {safeFormat(reply.timestamp, 'MMM dd, HH:mm')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Reply Box */}
                                        {selectedRequest.status !== 'Resolved' && (
                                            <form onSubmit={handleReply} className="p-6 border-t border-slate-800 bg-slate-950/50">
                                                <div className="flex gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Add an internal note or update..."
                                                        className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                    />
                                                    <button className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
                                                        <Send size={20} />
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Resolve Modal */}
                {showResolveModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setShowResolveModal(false)}></div>
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-lg relative shadow-2xl">
                            <h3 className="text-xl font-black text-white italic uppercase mb-2 tracking-tight flex items-center gap-3">
                                <CheckCircle2 className="text-green-500" />
                                Resolve Request
                            </h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Provide final closing remarks.</p>

                            <textarea
                                rows="3"
                                placeholder="Explain what was done to resolve this issue..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-green-500 transition-all text-sm font-bold mb-6"
                                value={closingRemarks}
                                onChange={(e) => setClosingRemarks(e.target.value)}
                            ></textarea>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => updateStatus(selectedRequest._id, 'Resolved', closingRemarks)}
                                    className="flex-1 bg-green-600 text-white font-black uppercase tracking-widest py-4 rounded-xl text-xs shadow-xl shadow-green-600/20"
                                >
                                    Confirm Resolution
                                </button>
                                <button
                                    onClick={() => setShowResolveModal(false)}
                                    className="px-6 bg-slate-800 text-slate-400 font-black uppercase tracking-widest py-4 rounded-xl text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default RMSInbox;
