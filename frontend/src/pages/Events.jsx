import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import api from '../utils/api';
import { FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import Loader from '../components/Loader';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const categories = ['all', 'Conference', 'Workshop', 'Seminar', 'Concert', 'Sports', 'Cultural', 'Networking', 'Other'];

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [searchTerm, selectedCategory, dateFilter, events]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
            setFilteredEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        let filtered = [...events];

        // Search by title
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(event => event.category === selectedCategory);
        }

        // Filter by date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === 'upcoming') {
            filtered = filtered.filter(event => new Date(event.date) >= today);
        } else if (dateFilter === 'past') {
            filtered = filtered.filter(event => new Date(event.date) < today);
        } else if (dateFilter === 'thisWeek') {
            const weekFromNow = new Date();
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today && eventDate <= weekFromNow;
            });
        } else if (dateFilter === 'thisMonth') {
            const monthFromNow = new Date();
            monthFromNow.setMonth(monthFromNow.getMonth() + 1);
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today && eventDate <= monthFromNow;
            });
        }

        setFilteredEvents(filtered);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-2">All Events</h1>
                    <p className="text-xl opacity-90">Discover and register for exciting events</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                <FaSearch className="inline mr-2" />
                                Search Events
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by event name..."
                                className="input-field"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                <FaFilter className="inline mr-2" />
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input-field"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                <FaCalendarAlt className="inline mr-2" />
                                Date
                            </label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="input-field"
                            >
                                <option value="all">All Events</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="thisWeek">This Week</option>
                                <option value="thisMonth">This Month</option>
                                <option value="past">Past Events</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 text-gray-600">
                        Found <span className="font-semibold text-blue-600">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <FaCalendarAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600 mb-2">No events found</p>
                        <p className="text-gray-500">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
