import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaUsers, FaCalendarAlt, FaClipboardCheck, FaPlus, FaChartBar } from 'react-icons/fa';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalRegistrations: 0
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch statistics
            const { data: statsData } = await api.get('/events/stats');
            setStats(statsData);

            // Fetch recent events
            const { data: eventsData } = await api.get('/events');
            setRecentEvents(eventsData.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-lg opacity-90">Manage events and view platform statistics</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 transform hover:-translate-y-1 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                            </div>
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUsers className="text-3xl text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-green-600">
                            <FaChartBar className="mr-1" />
                            <span className="text-sm">Active platform users</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 transform hover:-translate-y-1 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Events</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEvents}</p>
                            </div>
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <FaCalendarAlt className="text-3xl text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link to="/admin/events" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                Manage Events →
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 transform hover:-translate-y-1 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Registrations</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRegistrations}</p>
                            </div>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <FaClipboardCheck className="text-3xl text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-green-600">
                            <FaChartBar className="mr-1" />
                            <span className="text-sm">Total event bookings</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            to="/admin/events"
                            className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <FaPlus className="mr-2" />
                            Create New Event
                        </Link>
                        <Link
                            to="/admin/events"
                            className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <FaCalendarAlt className="mr-2" />
                            Manage Events
                        </Link>
                    </div>
                </div>

                {/* Recent Events */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Events</h2>
                    {recentEvents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Title</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Venue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentEvents.map((event) => (
                                        <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <Link to={`/events/${event._id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                                                    {event.title}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                    {event.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {new Date(event.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{event.venue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">No events created yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
