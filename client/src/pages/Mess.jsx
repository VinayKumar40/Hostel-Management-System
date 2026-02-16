import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Utensils, Clock, MapPin, Users as UsersIcon, ChevronRight, Home, Sun, Coffee, Moon, Star, X, Search, Info, UserMinus, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Mess = () => {
    const [mess, setMess] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState('Monday');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showUnenrollModal, setShowUnenrollModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { user } = useAuth();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const fetchMess = async () => {
        try {
            const { data } = await axios.get('/api/mess');
            setMess(data[0]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching mess:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMess();
    }, []);

    if (loading) return <Layout><div className="flex items-center justify-center min-h-[60vh] text-slate-400">Loading Central Mess System...</div></Layout>;
    if (!mess) return <Layout><div className="text-center py-20 text-slate-500">No mess system found. Please seed the database.</div></Layout>;

    const currentMenu = mess.weeklyMenu?.[activeDay] || mess.weeklyMenu?.get?.(activeDay);

    const MealCard = ({ type, time, north, south, icon: Icon, color }) => (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl overflow-hidden group hover:border-blue-500/30 transition-all duration-500 shadow-xl">
            <div className={`p-4 ${color} flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-xl"><Icon size={20} className="text-white" /></div>
                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-[10px]">{type}</h3>
                        <p className="text-white/80 text-[10px] font-bold">{time}</p>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4">
                {north && (
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">North Indian</span>
                        </div>
                        <p className="text-slate-200 text-sm font-medium leading-relaxed">{north}</p>
                    </div>
                )}
                {south && (
                    <div className="space-y-1 pt-3 border-t border-slate-700/50">
                        <div className="flex items-center space-x-2">
                            <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-tighter">South Indian</span>
                        </div>
                        <p className="text-slate-200 text-sm font-medium leading-relaxed">{south}</p>
                    </div>
                )}
                {!north && !south && type === 'Tea Break' && (
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">Snacks Menu</span>
                        </div>
                        <p className="text-slate-200 text-sm font-medium leading-relaxed">{currentMenu.tea?.menu}</p>
                    </div>
                )}
            </div>
        </div>
    );

    const ActiveStudentsModal = ({ students, onClose }) => {
        const [q, setQ] = useState('');
        const filtered = students.filter(s =>
            s.name.toLowerCase().includes(q.toLowerCase()) ||
            s.studentId.includes(q)
        );

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                    <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                                <UsersIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Active Subscribers</h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">{students.length} Students Enrolled</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {(user?.role === 'admin' || user?.role === 'warden') && (
                                <button
                                    onClick={() => setShowEnrollModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                                >
                                    New Enrollment
                                </button>
                            )}
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2"><X size={24} /></button>
                        </div>
                    </div>
                    <div className="p-8 space-y-6 flex-grow flex flex-col min-h-0">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search subscribers by name or reg no..."
                                className="w-full bg-slate-800/80 border border-slate-700/50 rounded-[1.5rem] pl-16 pr-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                onChange={e => setQ(e.target.value)}
                            />
                        </div>
                        <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {filtered.length > 0 ? filtered.map(s => (
                                <div key={s._id} className="flex items-center justify-between p-5 bg-slate-800/30 rounded-2xl border border-slate-800/50 group hover:border-blue-500/20 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm uppercase">{s.name}</p>
                                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{s.studentId} • {s.course} {s.branch}</p>
                                        </div>
                                    </div>
                                    {(user?.role === 'admin' || user?.role === 'warden') && (
                                        <button
                                            onClick={() => { setSelectedStudent(s); setShowUnenrollModal(true); }}
                                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove from Mess"
                                        >
                                            <UserMinus size={16} />
                                        </button>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-20">
                                    <p className="text-slate-500 text-sm italic font-medium">No matching subscribers found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const MessEnrollModal = ({ onClose, onSuccess }) => {
        const [regNo, setRegNo] = useState('');
        const [feePaid, setFeePaid] = useState(false);
        const [verifying, setVerifying] = useState(false);

        const handleEnroll = async () => {
            if (!feePaid) {
                alert('Warning: Mess enrollment blocked. Verified fee of ₹36,000 is required.');
                return;
            }
            setVerifying(true);
            try {
                await axios.post('/api/mess/enroll', { studentId: regNo, feePaid: 36000 });
                alert('Success: Student added to active mess list.');
                onSuccess();
            } catch (error) {
                alert(error.response?.data?.message || 'Error enrolling student');
            } finally {
                setVerifying(false);
            }
        };

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Utensils size={24} /></div>
                            <h2 className="text-white font-black uppercase tracking-tight">Add Student to Mess</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Registration Number</label>
                            <input
                                autoFocus
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500"
                                placeholder="e.g. 1232027"
                                onChange={e => setRegNo(e.target.value)}
                            />
                        </div>
                        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-amber-500 font-bold uppercase tracking-tighter text-[11px]">Mess Fee (₹36,000) PAID?</span>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                                    onChange={e => setFeePaid(e.target.checked)}
                                />
                            </div>
                            <p className="text-[9px] text-slate-500 italic">Only mark if payment is verified in accountant logs.</p>
                        </div>
                        <button
                            disabled={verifying}
                            onClick={handleEnroll}
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${feePaid ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {verifying ? 'Verifying...' : 'Confirm Enrollment'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const MessUnenrollModal = ({ student, onClose, onSuccess }) => {
        const [removing, setRemoving] = useState(false);

        const handleUnenroll = async () => {
            setRemoving(true);
            try {
                await axios.post('/api/mess/unenroll', { studentId: student.studentId });
                onSuccess();
            } catch (error) {
                alert(error.response?.data?.message || 'Error removing student');
            } finally {
                setRemoving(false);
            }
        };

        if (!student) return null;
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 bg-red-500/5">
                        <h2 className="text-white font-black uppercase text-center tracking-tight">Confirm Removal</h2>
                    </div>
                    <div className="p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 mx-auto rounded-full flex items-center justify-center">
                            <AlertTriangle size={32} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-300 font-medium italic text-sm">Remove <span className="text-white font-black uppercase not-italic">{student.name}</span>?</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">Mess access will be revoked immediately.</p>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={onClose} className="flex-1 px-4 py-3 bg-slate-800 text-slate-400 font-black uppercase text-[10px] rounded-xl">Cancel</button>
                            <button
                                disabled={removing}
                                onClick={handleUnenroll}
                                className="flex-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] rounded-xl transition-all"
                            >
                                {removing ? 'Revoking...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6">
                            <div className="p-5 bg-blue-600/10 rounded-3xl border border-blue-500/20 text-blue-500">
                                <Utensils size={40} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tight uppercase">{mess.name}</h1>
                                <p className="text-slate-400 mt-1 max-w-xl text-sm font-medium leading-relaxed">{mess.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8 px-8 py-4 bg-slate-800/30 rounded-3xl border border-slate-700/30 backdrop-blur-sm">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Capacity</p>
                                <p className="text-2xl font-black text-white">400+</p>
                            </div>
                            <div className="w-px h-8 bg-slate-700"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Subs</p>
                                <div className="flex flex-col items-center">
                                    <p className="text-2xl font-black text-blue-500">{mess.students?.length}</p>
                                    <button
                                        onClick={() => setShowDetailsModal(true)}
                                        className="text-[9px] font-black text-slate-400 hover:text-blue-400 uppercase tracking-tighter mt-1 transition-colors flex items-center space-x-1"
                                    >
                                        <Info size={10} />
                                        <span>Get Details</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Day Navigation */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 ${activeDay === day
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                }`}
                        >
                            {day === 'Sunday' && <Star size={14} className={activeDay === day ? 'text-white' : 'text-amber-500'} />}
                            <span>{day}</span>
                        </button>
                    ))}
                </div>

                {/* Menu Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MealCard
                        type="Breakfast"
                        time={mess.timings.breakfast}
                        north={currentMenu?.breakfast?.north}
                        south={currentMenu?.breakfast?.south}
                        icon={Coffee}
                        color="bg-gradient-to-r from-blue-600 to-indigo-600"
                    />
                    <MealCard
                        type="Lunch"
                        time={mess.timings.lunch}
                        north={currentMenu?.lunch?.north}
                        south={currentMenu?.lunch?.south}
                        icon={Sun}
                        color="bg-gradient-to-r from-amber-500 to-orange-600"
                    />
                    <MealCard
                        type="Tea Break"
                        time={mess.timings.tea}
                        icon={Coffee}
                        color="bg-gradient-to-r from-teal-500 to-emerald-600"
                    />
                    <MealCard
                        type="Dinner"
                        time={mess.timings.dinner}
                        north={currentMenu?.dinner?.north}
                        south={currentMenu?.dinner?.south}
                        icon={Moon}
                        color="bg-gradient-to-r from-violet-600 to-purple-700"
                    />
                </div>

                {/* Notice Section */}
                <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">< Star size={24} /></div>
                        <div>
                            <h4 className="text-white font-bold text-sm">Special Sunday Menu</h4>
                            <p className="text-slate-500 text-xs">Extra special dishes and sweet treats are served every Sunday!</p>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {showDetailsModal && (
                    <ActiveStudentsModal
                        students={mess.students || []}
                        onClose={() => setShowDetailsModal(false)}
                    />
                )}
                {showEnrollModal && (
                    <MessEnrollModal
                        onClose={() => setShowEnrollModal(false)}
                        onSuccess={() => {
                            setShowEnrollModal(false);
                            fetchMess();
                        }}
                    />
                )}
                {showUnenrollModal && (
                    <MessUnenrollModal
                        student={selectedStudent}
                        onClose={() => setShowUnenrollModal(false)}
                        onSuccess={() => {
                            setShowUnenrollModal(false);
                            fetchMess();
                        }}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Mess;
