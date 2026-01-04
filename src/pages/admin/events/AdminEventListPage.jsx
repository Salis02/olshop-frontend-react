import { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { eventApi } from '../../../api';
import { showToast, showConfirm } from '../../../utils/toast';
import { Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Loading } from '../../../components/common/Loading';

export const AdminEventListPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'upcoming'
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventApi.getAll();
            setEvents(response.data || []);
        } catch (error) {
            showToast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingEvent) {
                await eventApi.update(editingEvent.id, formData);
                showToast.success('Event updated successfully');
            } else {
                await eventApi.create(formData);
                showToast.success('Event created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Failed to save event');
        }
    };

    const handleDelete = async (id) => {
        showConfirm('Are you sure you want to delete this event?', async () => {
            try {
                await eventApi.delete(id);
                showToast.success('Event deleted successfully');
                fetchEvents();
            } catch (error) {
                showToast.error('Failed to delete event');
            }
        });
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            name: event.name,
            slug: event.slug,
            description: event.description || '',
            start_date: event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : '',
            end_date: event.end_date ? new Date(event.end_date).toISOString().split('T')[0] : '',
            status: event.status
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingEvent(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            start_date: '',
            end_date: '',
            status: 'upcoming'
        });
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ended': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <Layout>
                <Loading fullScreen />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
                    <Button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Event
                    </Button>
                </div>

                {/* Events List */}
                {events.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
                        <p className="mt-2 text-gray-500">Create your first promotional event</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>
                                            {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-blue-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4">
                                {editingEvent ? 'Edit Event' : 'Create Event'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setFormData({
                                                ...formData,
                                                name,
                                                slug: generateSlug(name)
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                                        required
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        rows="3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="active">Active</option>
                                        <option value="ended">Ended</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1">
                                        {editingEvent ? 'Update' : 'Create'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
