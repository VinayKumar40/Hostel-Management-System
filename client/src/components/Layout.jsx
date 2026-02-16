import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Home,
    Users,
    Utensils,
    ShoppingCart,
    Settings,
    LogOut,
    Shield,
    FileText
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`
        }
    >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{children}</span>
    </NavLink>
);

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-900 font-sans text-slate-100">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col">
                <div className="flex items-center space-x-3 px-4 py-6 mb-8 border-b border-slate-700/50">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight text-white uppercase italic">CampusNest</span>
                        <p className="text-[7px] uppercase tracking-widest text-blue-500 font-bold leading-tight">Where Campus Life Feels Like Home</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                    <SidebarLink to="/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>
                    <SidebarLink to="/rooms" icon={Home}>Rooms</SidebarLink>
                    <SidebarLink to="/users" icon={Users}>Users</SidebarLink>
                    <SidebarLink to="/mess" icon={Utensils}>Mess</SidebarLink>
                    <SidebarLink to="/shop" icon={ShoppingCart}>Hostel Shop</SidebarLink>
                    <SidebarLink to="/leaves" icon={Shield}>Leave Manager</SidebarLink>
                </nav>

                <div className="pt-4 mt-4 border-t border-slate-700/50 space-y-2">
                    <SidebarLink to="/rms" icon={Shield}>Service Desk</SidebarLink>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-medium"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>

                    <div className="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold border border-blue-500/30">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 uppercase font-bold">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
