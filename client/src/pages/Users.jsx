import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { UserPlus, UserMinus, Search, GraduationCap, Shield, X, MapPin, Phone, Mail, Award, AlertTriangle, CheckCircle, CreditCard, Repeat, Utensils, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Users = () => {
    const [students, setStudents] = useState([]);
    const [wardens, setWardens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('students');
    const [selectedUser, setSelectedUser] = useState(null); // For View Profile
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showShiftModal, setShowShiftModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [shiftingUser, setShiftingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeTab === 'students') {
                    const { data } = await axios.get('/api/users/students');
                    setStudents(data);
                } else if (user?.role === 'admin') {
                    const { data } = await axios.get('/api/users/wardens');
                    setWardens(data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, user?.role]);

    const ProfileModal = ({ user, onClose }) => {
        if (!user) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="relative h-24 bg-gradient-to-r from-blue-600 to-indigo-700">
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>
                        <div className="absolute -bottom-12 left-8 p-1 bg-slate-900 rounded-2xl border-4 border-slate-900">
                            <div className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center text-blue-500 shadow-xl">
                                {activeTab === 'students' ? <GraduationCap size={48} /> : <Shield size={48} />}
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 px-8 pb-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{user.name}</h2>
                                <p className="text-blue-500 font-bold text-sm tracking-widest uppercase">
                                    {activeTab === 'students' ? `${user.course} - ${user.branch}` : 'Hostel Warden'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">Room Number</p>
                                <p className="text-white font-black text-xl">
                                    {activeTab === 'students' ? `${user.room?.roomNumber || 'N/A'}-${user.bedLetter}` : user.roomNumber}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                            <div className="space-y-4">
                                <h4 className="text-slate-500 text-[11px] font-black uppercase tracking-widest flex items-center space-x-2">
                                    <MapPin size={14} /> <span>Personal Details</span>
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-400">Registry ID: <span className="text-slate-200 font-bold">{user.studentId || user.userId}</span></p>
                                    <p className="text-xs text-slate-400">Current Year: <span className="text-slate-200 font-bold">{user.year || 'N/A'}</span></p>
                                    <p className="text-xs text-slate-400">City/State: <span className="text-slate-200 font-bold">{user.city}, {user.state}</span></p>
                                    <p className="text-xs text-slate-400">Address: <span className="text-slate-200 font-medium italic">{user.address}</span></p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-slate-500 text-[11px] font-black uppercase tracking-widest flex items-center space-x-2">
                                    <Phone size={14} /> <span>Family Details</span>
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-400">Father's Name: <span className="text-slate-200 font-bold">{user.fatherName}</span></p>
                                    <p className="text-xs text-slate-400">Mother's Name: <span className="text-slate-200 font-bold">{user.motherName}</span></p>
                                    <p className="text-xs text-slate-400">Emergency Contact: <span className="text-blue-400 font-bold tracking-widest">{user.parentPhone}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <div className="flex items-center space-x-2">
                                    <Award size={16} className="text-amber-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disciplinary Records</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hostel Fees</span>
                                    {user.feesPaid ?
                                        <div className="flex items-center text-green-500 space-x-1"><CheckCircle size={12} /> <span className="text-[9px] font-bold">PAID</span></div> :
                                        <div className="flex items-center text-red-500 space-x-1"><AlertTriangle size={12} /> <span className="text-[9px] font-bold">DUE</span></div>
                                    }
                                </div>
                            </div>
                            {user.disciplinaryRecord?.length > 0 ? (
                                user.disciplinaryRecord.map((record, i) => (
                                    <div key={i} className="flex items-start space-x-3 text-xs bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                                        <AlertTriangle size={14} className="text-red-500 mt-0.5" />
                                        <div>
                                            <p className="text-red-400 font-black uppercase text-[10px] tracking-widest">{record.caseType} CASE</p>
                                            <p className="text-slate-300 italic">{record.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-[10px] font-medium text-center italic py-2">No disciplinary records found. Good behavioral standing.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const RecentActivityModal = ({ onClose }) => {
        const [fetching, setFetching] = useState(true);
        const [recentActivity, setRecentActivity] = useState([]);

        const fetchActivity = async () => {
            try {
                const { data } = await axios.get('/api/leaves/activity');
                setRecentActivity(data);
                setFetching(false);
            } catch (error) {
                console.error('Error fetching activity:', error);
                setFetching(false);
            }
        };

        useEffect(() => {
            fetchActivity();
            const interval = setInterval(fetchActivity, 30000); // 30s polling
            return () => clearInterval(interval);
        }, []);

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                    <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><Clock size={24} /></div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Recent Gate Activity</h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Last 24 Hours • Live Updates</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 text-3xl font-light">&times;</button>
                    </div>
                    <div className="p-8 overflow-y-auto space-y-4 custom-scrollbar">
                        {fetching ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                                <p className="text-slate-500 italic text-sm">Syncing gate records...</p>
                            </div>
                        ) : recentActivity.length > 0 ? (
                            recentActivity.map(l => (
                                <div key={l._id} className="p-6 bg-slate-950/40 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-blue-500/30 transition-all shadow-xl">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 text-xl font-black shadow-inner border border-blue-500/5">
                                            {l.student?.name?.[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-black text-base uppercase tracking-tight">{l.student?.name}</h3>
                                            <div className="flex items-center font-black text-[10px] tracking-widest text-slate-500 uppercase mt-0.5">
                                                <span>REG: {l.student?.studentId}</span>
                                                <span className="mx-2 opacity-30">•</span>
                                                <span className="text-blue-400">{l.leaveType}</span>
                                            </div>
                                            <p className="text-slate-400 text-xs mt-2 italic line-clamp-1 max-w-[200px]">
                                                <span className="text-[10px] font-black uppercase text-slate-600 not-italic mr-1">Reason:</span>
                                                {l.reason}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-800/50">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Time Out</span>
                                            {l.checkOutTime ? (
                                                <div className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20 text-[11px] font-black flex items-center gap-2">
                                                    <Clock size={12} /> {new Date(l.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 font-bold text-[11px] px-2 italic">---</span>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Time In</span>
                                            {l.checkInTime ? (
                                                <div className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-xl border border-green-500/20 text-[11px] font-black flex items-center gap-2">
                                                    <Clock size={12} /> {new Date(l.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </div>
                                            ) : (
                                                <div className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl border border-amber-500/20 text-[9px] font-black uppercase italic animate-pulse">
                                                    STILL OUTSIDE
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                                    <Clock size={32} />
                                </div>
                                <p className="text-slate-500 font-medium italic">No gate activity recorded in the last 24 hours.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ShiftModal = ({ student, onClose, onSuccess }) => {
        const [shiftData, setShiftData] = useState({ newRoomId: '', bedLetter: 'A', reason: 'Mutual exchange with friend', feePaid: false });
        const [rooms, setRooms] = useState([]);

        useEffect(() => {
            const fetchRooms = async () => {
                const { data } = await axios.get('/api/rooms');
                setRooms(data);
            };
            fetchRooms();
        }, []);

        const handleShift = async () => {
            if (!shiftData.newRoomId || !shiftData.feePaid) {
                alert('Please select a room and confirm fee payment.');
                return;
            }
            try {
                await axios.put(`/api/users/students/${student._id}/shift`, shiftData);
                onSuccess();
            } catch (error) {
                alert(error.response?.data?.message || 'Error shifting student');
            }
        };

        if (!student) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Repeat size={20} /></div>
                            <h2 className="text-white font-black uppercase tracking-tight">Mutual Shifting</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Current Placement</p>
                            <p className="text-white font-bold uppercase">{student.name}</p>
                            <p className="text-blue-500 font-black text-xs">{student.room?.roomNumber || 'Awaiting'}-{student.bedLetter}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-slate-400 text-xs font-bold uppercase mb-2 block tracking-widest text-[10px]">Reason for Shifting</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    onChange={e => setShiftData({ ...shiftData, reason: e.target.value })}
                                >
                                    <option>Mutual exchange with friend</option>
                                    <option>Floor/Block preference</option>
                                    <option>Medical reasons</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-400 text-xs font-bold uppercase mb-2 block tracking-widest text-[10px]">New Room Allotment</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                    onChange={e => setShiftData({ ...shiftData, newRoomId: e.target.value })}
                                >
                                    <option value="">Select Target Room</option>
                                    {rooms.map(r => (
                                        <option key={r._id} value={r._id}>{r.roomNumber} - {r.seater - r.occupants.length} free</option>
                                    ))}
                                </select>
                                <select
                                    className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                    onChange={e => setShiftData({ ...shiftData, bedLetter: e.target.value })}
                                >
                                    <option>A</option><option>B</option><option>C</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                            <div className="flex items-center space-x-3 text-amber-500 font-bold uppercase tracking-tighter text-[11px]">
                                <CreditCard size={20} />
                                <span>Shifting Fee (1000 INR) Paid?</span>
                            </div>
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded-lg accent-amber-500 cursor-pointer"
                                onChange={e => setShiftData({ ...shiftData, feePaid: e.target.checked })}
                            />
                        </div>
                        <button
                            onClick={handleShift}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest text-sm"
                        >
                            Process Shifting
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const AddStudentModal = ({ onClose, onSuccess }) => {
        const [formData, setFormData] = useState({
            name: '', studentId: '', email: '', phone: '', room: '', bedLetter: 'A',
            city: '', state: '', address: '', motherName: '', fatherName: '', parentPhone: '',
            course: 'B.Tech', branch: '', year: 1, feesPaid: false
        });
        const [rooms, setRooms] = useState([]);

        useEffect(() => {
            const fetchRooms = async () => {
                const { data } = await axios.get('/api/rooms');
                setRooms(data);
            };
            fetchRooms();
        }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await axios.post('/api/users/students', formData);
                onSuccess();
            } catch (error) {
                alert(error.response?.data?.message || 'Error creating student');
            }
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><UserPlus size={24} /></div>
                            <h2 className="text-white font-black uppercase tracking-tight">Add New Student</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Academic */}
                            <div className="space-y-4">
                                <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-widest border-l-2 border-blue-500 pl-2">Academic Info</h3>
                                <div className="space-y-3">
                                    <input required placeholder="Student Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <input required placeholder="Registration Number" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, studentId: e.target.value })} />
                                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, course: e.target.value })}>
                                        <option>B.Tech</option><option>MBA</option><option>B.Sc</option><option>BBA</option><option>B.Des</option><option>LL.B</option><option>M.Tech</option>
                                    </select>
                                    <input placeholder="Branch (e.g. CSE)" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, branch: e.target.value })} />
                                </div>
                            </div>
                            {/* Contact & Room */}
                            <div className="space-y-4">
                                <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-widest border-l-2 border-amber-500 pl-2">Allocation & Contact</h3>
                                <div className="space-y-3">
                                    <select required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, room: e.target.value })}>
                                        <option value="">Select Room</option>
                                        {rooms.map(r => <option key={r._id} value={r._id}>{r.roomNumber} ({r.seater - r.occupants.length} free)</option>)}
                                    </select>
                                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, bedLetter: e.target.value })}>
                                        <option>A</option><option>B</option><option>C</option>
                                    </select>
                                    <input required placeholder="Student Phone" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    <input type="email" placeholder="Email Address" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>
                            {/* Family */}
                            <div className="space-y-4">
                                <h3 className="text-indigo-500 text-[10px] font-black uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Family & Home</h3>
                                <div className="space-y-3">
                                    <input placeholder="Father's Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />
                                    <input placeholder="Parent Contact" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, parentPhone: e.target.value })} />
                                    <input placeholder="City" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                    <textarea placeholder="Full Home Address" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm h-20" onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                            <div className="flex items-center space-x-3">
                                <CreditCard className="text-green-500" />
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirm Hostel Fees Payment?</span>
                            </div>
                            <input type="checkbox" className="w-6 h-6 rounded-lg accent-green-500" onChange={e => setFormData({ ...formData, feesPaid: e.target.checked })} />
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest">
                            Register Student & Handover Keys
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const RemoveStudentModal = ({ onClose, onSuccess }) => {
        const [q, setQ] = useState('');
        const filtered = students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.studentId.includes(q) || s.room?.roomNumber?.includes(q));

        const handleDelete = async (id) => {
            if (window.confirm('Are you sure you want to remove this student?')) {
                await axios.delete(`/api/users/students/${id}`);
                onSuccess();
            }
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><UserMinus size={24} /></div>
                            <h2 className="text-white font-black uppercase tracking-tight">Remove Student</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input autoFocus type="text" placeholder="Search by Name, Reg No or Room..." className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:outline-none focus:border-red-500 transition-all" onChange={e => setQ(e.target.value)} />
                        </div>
                        <div className="overflow-y-auto space-y-2 max-h-[400px] pr-2 custom-scrollbar">
                            {filtered.map(s => (
                                <div key={s._id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-800 group hover:border-red-500/30 transition-all">
                                    <div>
                                        <p className="text-white font-bold text-sm uppercase">{s.name}</p>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.studentId} • Room {s.room?.roomNumber}</p>
                                    </div>
                                    <button onClick={() => handleDelete(s._id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all">
                                        <UserMinus size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">People Management</h1>
                        <p className="text-slate-400">Manage all students and wardens in Boys Hostel.</p>
                    </div>
                    <div className="flex items-center space-x-3">

                        {(user?.role === 'admin' || user?.role === 'warden') && (
                            <>
                                <button
                                    onClick={() => setShowActivityModal(true)}
                                    className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 px-4 py-2 rounded-xl transition-all font-medium"
                                >
                                    <Clock className="h-5 w-5" />
                                    <span>Recent Activity</span>
                                </button>
                                <button
                                    onClick={() => setShowRemoveModal(true)}
                                    className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-red-400 px-4 py-2 rounded-xl transition-all font-medium"
                                >
                                    <UserMinus className="h-5 w-5" />
                                    <span>Remove Student</span>
                                </button>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/20 font-medium"
                                >
                                    <UserPlus className="h-5 w-5" />
                                    <span>Add Student</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-6 py-3 font-medium transition-all border-b-2 flex items-center space-x-2 ${activeTab === 'students'
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <span>Students</span>
                        <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">{students.length}</span>
                    </button>
                    {(user?.role === 'admin' || user?.role === 'warden') && (
                        <button
                            onClick={() => setActiveTab('wardens')}
                            className={`px-6 py-3 font-medium transition-all border-b-2 flex items-center space-x-2 ${activeTab === 'wardens'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <span>Wardens</span>
                            <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">{wardens.length}</span>
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading {activeTab}...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(activeTab === 'students' ? students : wardens).map((u) => (
                            <div key={u._id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all group shadow-lg flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl ${activeTab === 'students' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {activeTab === 'students' ? <GraduationCap size={24} /> : <Shield size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors uppercase tracking-tight">{u.name}</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                {activeTab === 'students' ? `Reg No: ${u.studentId}` : `Warden ID: ${u.userId}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 px-3 py-1 rounded-full border border-slate-700 min-w-[60px] text-center">
                                        <span className="text-blue-400 text-[10px] font-black uppercase tracking-tighter">
                                            {activeTab === 'students' ? `${u.room?.roomNumber || '---'}-${u.bedLetter}` : (u.roomNumber || 'Admin')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-700/50 flex-grow">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-xs font-medium italic">Contact Number</span>
                                        <span className="text-slate-200 text-sm font-mono font-bold tracking-widest underline decoration-blue-500/30">
                                            {u.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-xs font-medium italic">Mess Status</span>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${u.messStatus === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} border`}>
                                            {u.messStatus || 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => { setSelectedUser(u); setShowProfileModal(true); }}
                                        className="bg-slate-900 border border-slate-700 hover:border-blue-500/50 py-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all shadow-sm"
                                    >
                                        View Profile
                                    </button>
                                    {activeTab === 'students' ? (
                                        <button
                                            onClick={() => { setShiftingUser(u); setShowShiftModal(true); }}
                                            className="bg-slate-900 border border-slate-700 hover:border-amber-500/50 py-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center space-x-1"
                                        >
                                            <Repeat size={10} />
                                            <span>Shift Room</span>
                                        </button>
                                    ) : (
                                        <button className="bg-slate-900 border border-slate-700 hover:border-amber-500/50 py-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                                            Admin Logs
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {showActivityModal && <RecentActivityModal onClose={() => setShowActivityModal(false)} />}
                {showProfileModal && <ProfileModal user={selectedUser} onClose={() => setShowProfileModal(false)} />}
                {showShiftModal && <ShiftModal student={shiftingUser} onClose={() => setShowShiftModal(false)} />}
                {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); window.location.reload(); }} />}
                {showRemoveModal && <RemoveStudentModal onClose={() => setShowRemoveModal(false)} onSuccess={() => { setShowRemoveModal(false); window.location.reload(); }} />}
            </div>
        </Layout >
    );
};

export default Users;
