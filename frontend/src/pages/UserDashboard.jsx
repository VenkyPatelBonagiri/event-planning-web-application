import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaUser, FaCalendarCheck, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Loader from '../components/Loader';
import EventCard from '../components/EventCard';

const UserDashboard = () => {
    const { user, updateUserProfile } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const { data } = await api.get('/registrations/user');
            setRegistrations(data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const result = await updateUserProfile(profileData);

        if (result.success) {
            alert('Profile updated successfully!');
            setIsEditing(false);
        } else {
            alert(result.message);
        }
        setUpdating(false);
    };

    const handleCancelRegistration = async (registrationId) => {
        if (!window.confirm('Are you sure you want to cancel this registration?')) {
            return;
        }

        try {
            await api.delete(`/registrations/${registrationId}`);
            setRegistrations(registrations.filter(r => r._id !== registrationId));
            alert('Registration cancelled successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel registration');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                    <p className="text-lg opacity-90">Manage your profile and view your registered events</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <FaUser className="mr-2 text-blue-600" />
                                    My Profile
                                </h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="flex-1 btn-primary disabled:opacity-50"
                                        >
                                            <FaSave className="inline mr-2" />
                                            {updating ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setProfileData({
                                                    name: user?.name || '',
                                                    email: user?.email || '',
                                                    phone: user?.phone || ''
                                                });
                                            }}
                                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                        >
                                            <FaTimes className="inline mr-2" />
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold text-gray-900">{user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Registered Events */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <FaCalendarCheck className="mr-2 text-blue-600" />
                                My Registered Events
                            </h2>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader />
                                </div>
                            ) : registrations.length > 0 ? (
                                <div className="space-y-6">
                                    {registrations.map((registration) => (
                                        <div key={registration._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <img
                                                    src={registration.event.image.startsWith('http')
                                                        ? registration.event.image
                                                        : `http://localhost:5000/uploads/${registration.event.image}`}
                                                    alt={registration.event.title}
                                                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {registration.event.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-2 line-clamp-2">
                                                        {registration.event.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <span>📅 {new Date(registration.event.date).toLocaleDateString()}</span>
                                                        <span>  🕒 {registration.event.time}</span>
                                                        <span>📍 {registration.event.venue}</span>
                                                    </div>
                                                    <div className="mt-3 flex gap-2">
                                                        <Link
                                                            to={`/events/${registration.event._id}`}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                                        >
                                                            View Details
                                                        </Link>
                                                        <button
                                                            onClick={() => handleCancelRegistration(registration._id)}
                                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaCalendarCheck className="mx-auto text-6xl text-gray-400 mb-4" />
                                    <p className="text-xl text-gray-600 mb-4">No registered events yet</p>
                                    <Link to="/events" className="btn-primary">
                                        Browse Events
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
