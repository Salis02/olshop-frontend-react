import { useState, useEffect } from 'react';
import { SellerLayout } from '../../../components/layout/SellerLayout';
import { Loading } from '../../../components/common/Loading';
import { shipmentApi } from '../../../api';
import { showToast } from '../../../utils/toast';
import { Truck, MapPin, Clock } from 'lucide-react';

export const SellerShipmentListPage = () => {
    const [shipments, setShipments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            setIsLoading(true);
            const response = await shipmentApi.getAll();
            setShipments(response.data || []);
        } catch (error) {
            console.error('Failed to fetch shipments:', error);
            showToast.error('Failed to load shipments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await shipmentApi.updateStatus(id, newStatus);
            showToast.success(`Shipment status updated to ${newStatus}`);
            fetchShipments();
        } catch (error) {
            showToast.error(error.message || 'Failed to update status');
        }
    };

    if (isLoading) {
        return (
            <SellerLayout>
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
                <p className="text-gray-600">Manage delivery and tracking</p>
            </div>

            <div className="space-y-4">
                {shipments.length > 0 ? (
                    shipments.map((shipment) => (
                        <div key={shipment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between md:items-center">
                                <div className="mb-4 md:mb-0">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Truck className="w-5 h-5 text-primary" />
                                        <span className="font-semibold text-lg">Order #{shipment.order_id}</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                shipment.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {shipment.status}
                                        </span>
                                    </div>
                                    <div className="flex items-start spaces-x-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
                                        <span>
                                            {shipment.tracking_number ? `Tracking: ${shipment.tracking_number}` : 'No tracking number'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Updated: {new Date(shipment.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <select
                                        value={shipment.status}
                                        onChange={(e) => handleStatusUpdate(shipment.id, e.target.value)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No shipments found</p>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
};
