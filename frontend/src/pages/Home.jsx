import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import api from '../utils/api';
import { FaSearch, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import Loader from '../components/Loader';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            // Get upcoming events (next 6)
            const upcomingEvents = data
                .filter(event => new Date(event.date) >= new Date())
                .slice(0, 6);
            setEvents(upcomingEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('http://localhost:5000/uploads/hero-bg.jpg')`,
                        backgroundColor: '#1e40af' // Fallback color
                    }}
                >
                    <div className="absolute inset-0 hero-gradient"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow">
                        Discover Amazing Events
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-shadow">
                        Connect with your community through exciting university events
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/events" className="btn-primary text-lg">
                            Explore Events <FaArrowRight className="inline ml-2" />
                        </Link>
                        <Link to="/signup" className="btn-outline bg-white bg-opacity-20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-blue-600 text-lg">
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Animated Shapes */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            </section>

            {/* Upcoming Events Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="section-title gradient-text">Upcoming Events</h2>
                    <p className="text-xl text-gray-600">Don't miss out on these exciting opportunities</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>
                ) : events.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            {events.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                        <div className="text-center">
                            <Link to="/events" className="btn-secondary">
                                View All Events <FaArrowRight className="inline ml-2" />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <FaCalendarAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600">No upcoming events at the moment</p>
                    </div>
                )}
            </section>

            {/* Features Section */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-white rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCalendarAlt className="text-3xl text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Easy Registration</h3>
                            <p className="text-gray-600">Register for events with just one click and manage your bookings easily</p>
                        </div>

                        <div className="text-center p-8 bg-white rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaSearch className="text-3xl text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Smart Search</h3>
                            <p className="text-gray-600">Find events by category, date, or name with our powerful search tools</p>
                        </div>

                        <div className="text-center p-8 bg-white rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCalendarAlt className="text-3xl text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Event Updates</h3>
                            <p className="text-gray-600">Stay informed with real-time updates about your registered events</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
