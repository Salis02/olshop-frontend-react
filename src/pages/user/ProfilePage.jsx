import { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth";
import { useAddress } from "../../hooks/useAddress";
import { showConfirm, showToast } from "../../utils/toast";
import { AddressForm } from "../../components/address/AddressForm";
import { User, MapPin, Edit, Plus, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";

export const ProfilePage = () => {
    const { user, updateProfile, changePassword } = useAuth();
    const { addresses, fetchAddresses, deleteAddress } = useAddress();

    // UI State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [loading, setLoading] = useState(false);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const toastId = showToast.loading('Updating profile...');
        const result = await updateProfile(profileData);
        showToast.dismiss(toastId);

        if (result.success) {
            showToast('success', 'Profile updated successfully');
            setIsEditingProfile(false);
        } else {
            showToast('error', result.message || 'Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast.error('New password and confirm password do not match');
            return;
        }
        const toastId = showToast.loading('Changing password...');

        const result = await changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });
        showToast.dismiss(toastId);

        if (result.success) {
            showToast('success', 'Password changed successfully');
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            showToast('error', result.message);
        }
    };

    const handleDeleteAddress = async (id) => {
        showConfirm('Are you sure you want to delete this address?', async () => {
            const toastId = showToast.loading('Deleting address...');
            const result = await deleteAddress(id);
            showToast.dismiss(toastId);

            if (result.success) {
                showToast('success', 'Address deleted successfully');
            } else {
                showToast('error', result.message || 'Failed to delete address');
            }
        })
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                {message.text && (
                    <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                        <button onClick={() => setMessage({ type: '', text: '' })} className="float-right font-bold ml-2">×</button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Profile & Password */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <User className="w-5 h-5 mr-2" /> Profile
                                </h2>
                                {!isEditingProfile && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="text-primary hover:text-primary-dark text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditingProfile ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="mt-1 w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            disabled
                                            className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="mt-1 w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(false)}
                                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-2">
                                    <p><span className="font-medium">Name:</span> {user?.name}</p>
                                    <p><span className="font-medium">Email:</span> {user?.email}</p>
                                    <p><span className="font-medium">Phone:</span> {user?.phone || '-'}</p>
                                </div>
                            )}
                        </div>

                        {/* Password Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Security</h2>
                            {isChangingPassword ? (
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="mt-1 w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="mt-1 w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="mt-1 w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                                        >
                                            Update Password
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsChangingPassword(false)}
                                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 w-full"
                                >
                                    Change Password
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Addresses & Orders Link */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Quick Link to Orders */}
                        <div className="bg-primary bg-opacity-10 border border-primary text-primary rounded-lg p-4 flex justify-between items-center">
                            <div className="flex items-center">
                                <Package className="w-6 h-6 mr-3" />
                                <div>
                                    <h3 className="font-semibold">My Orders</h3>
                                    <p className="text-sm">View and track your order history</p>
                                </div>
                            </div>
                            <Link to="/orders" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                                View Orders
                            </Link>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" /> Address Book
                                </h2>
                                <button
                                    onClick={() => { setEditingAddress(null); setShowAddressForm(true); }}
                                    className="flex items-center text-primary hover:text-primary-dark font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add New
                                </button>
                            </div>

                            <div className="space-y-4">
                                {addresses.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No addresses saved yet.</p>
                                ) : (
                                    addresses.map(address => (
                                        <div key={address.uuid} className="border rounded-lg p-4 flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{address.name} <span className="font-normal text-gray-500">({address.phone})</span></p>
                                                <p className="text-gray-600 mt-1">{address.street}</p>
                                                <p className="text-gray-600">{address.city}, {address.state} {address.zip_code}</p>
                                                <p className="text-gray-600">{address.country}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => { setEditingAddress(address); setShowAddressForm(true); }}
                                                    className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-gray-50"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(address.uuid)}
                                                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {showAddressForm && (
                    <AddressForm
                        address={editingAddress}
                        onClose={() => { setShowAddressForm(false); setEditingAddress(null); }}
                    />
                )}
            </div>
        </Layout>
    );
};
