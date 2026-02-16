import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Plus, Home, UserPlus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBlock, setFilterBlock] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const { user } = useAuth();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await axios.get('/api/rooms');
                setRooms(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBlock = filterBlock === 'All' || room.block === filterBlock;
        const matchesType = filterType === 'All' || room.type === filterType;
        return matchesSearch && matchesBlock && matchesType;
    });

    const blockARooms = filteredRooms.filter(r => r.block === 'A');
    const blockBRooms = filteredRooms.filter(r => r.block === 'B');

    const RoomGrid = ({ title, blockRooms }) => (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{title} ({blockRooms.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                {blockRooms.map((room) => (
                    <div
                        key={room._id}
                        className={`bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-blue-500/50 transition-all cursor-pointer group relative`}
                    >
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 group-hover:text-blue-400">{room.roomNumber}</p>
                            <div className="mt-1 flex justify-center space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${room.occupants.length >= room.seater ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-[8px] text-slate-500 uppercase font-black">{room.type}</span>
                            </div>
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-32">
                            <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-[10px] shadow-2xl">
                                <p className="text-white font-bold">Room Info</p>
                                <p>Type: {room.type}</p>
                                <p>Seats: {room.occupants.length}/{room.seater}</p>
                                <p>Rate: ₹{room.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {blockRooms.length === 0 && (
                <p className="text-slate-600 text-sm italic">No rooms matching filters in this block.</p>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Manage Rooms</h1>
                        <p className="text-slate-400">Total Capacity: {rooms.length} Rooms (Block A & B)</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 font-bold">
                            <Plus className="h-5 w-5" />
                            <span>Manage Capacity</span>
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-wrap items-center gap-6 shadow-sm">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Find a room number..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                            {['All', 'A', 'B'].map((b) => (
                                <button
                                    key={b}
                                    onClick={() => setFilterBlock(b)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterBlock === b ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {b === 'All' ? 'Both Blocks' : `Block ${b}`}
                                </button>
                            ))}
                        </div>

                        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                            {['All', 'AC', 'Non-AC'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === t ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Home className="h-10 w-10 text-slate-700 mb-4" />
                        <div className="text-slate-600 font-bold uppercase tracking-widest text-xs">Synchronizing Rooms...</div>
                    </div>
                ) : (
                    <div className="space-y-12 pb-20">
                        {filterBlock !== 'B' && <RoomGrid title="Block A (East Wing)" blockRooms={blockARooms} />}
                        {filterBlock !== 'A' && <RoomGrid title="Block B (West Wing)" blockRooms={blockBRooms} />}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Rooms;
