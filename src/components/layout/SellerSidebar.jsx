import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Truck } from 'lucide-react';

export const SellerSidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const navItems = [
        {
            path: '/seller',
            icon: LayoutDashboard,
            label: 'Dashboard',
            exact: true
        },
        {
            path: '/seller/products',
            icon: Package,
            label: 'Products'
        },
        {
            path: '/seller/shipments',
            icon: Truck,
            label: 'Shipments'
        },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] hidden md:block">
            <div className="p-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Seller Center
                </h2>
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${(item.exact ? location.pathname === item.path : isActive(item.path))
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
};
