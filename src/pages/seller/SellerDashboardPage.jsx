import { SellerLayout } from '../../components/layout/SellerLayout';
import { Package, Truck, DollarSign, TrendingUp } from 'lucide-react';

export const SellerDashboardPage = () => {
    // Placeholder stats
    const stats = [
        { label: 'Total Sales', value: 'Rp 45.000.000', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Total Orders', value: '156', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Active Shipments', value: '12', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100' },
        { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <SellerLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back to your seller center.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-center py-8 text-gray-500">
                    No recent activity to show.
                </div>
            </div>
        </SellerLayout>
    );
};
