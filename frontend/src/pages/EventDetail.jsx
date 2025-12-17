import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaTag, FaUsers, FaDirections, FaCheckCircle } from 'react-icons/fa';
import Loader from '../components/Loader';

const EventDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        fetchEvent();
        if (user) {
            checkRegistration();
        }
    }, [id, user]);

    const fetchEvent = async () => {
        try {
            const { data } = await api.get(`/events/${id}`);
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async () => {
        try {
            const { data } = await api.get(`/registrations/check/${id}`);
            setIsRegistered(data.isRegistered);
            if (data.registration) {
                setRegistrationId(data.registration._id);
            }
        } catch (error) {
            console.error('Error checking registration:', error);
        }
    };

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(true);
        try {
            await api.post('/registrations', { eventId: id });
            setIsRegistered(true);
            alert('Successfully registered for the event!');
            checkRegistration();
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!registrationId) return;

        if (!window.confirm('Are you sure you want to cancel your registration?')) {
            return;
        }

        try {
            await api.delete(`/registrations/${registrationId}`);
            setIsRegistered(false);
            setRegistrationId(null);
            alert('Registration cancelled successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel registration');
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
        borderRadius: '12px'
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
                    <button onClick={() => navigate('/events')} className="btn-primary">
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Event Banner */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={event.image.startsWith('http') ? event.image : `http://localhost:5000/uploads/${event.image}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-7xl mx-auto">
                        <span className="px-4 py-2 bg-blue-600 rounded-full text-sm font-semibold mb-4 inline-block">
                            {event.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-shadow">{event.title}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Details Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">Event Details</h2>
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>

                        {/* Map Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">Event Location</h2>
                            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={{ lat: event.location.lat, lng: event.location.lng }}
                                    zoom={15}
                                >
                                    <Marker position={{ lat: event.location.lat, lng: event.location.lng }} />
                                </GoogleMap>
                            </LoadScript>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${event.location.lat},${event.location.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center btn-outline"
                            >
                                <FaDirections className="mr-2" />
                                Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start">
                                    <FaCalendar className="text-blue-600 text-xl mr-3 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Date</p>
                                        <p className="text-gray-600">{formatDate(event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <FaClock className="text-blue-600 text-xl mr-3 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Time</p>
                                        <p className="text-gray-600">{event.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="text-blue-600 text-xl mr-3 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Venue</p>
                                        <p className="text-gray-600">{event.venue}</p>
                                        {event.location.address && (
                                            <p className="text-gray-500 text-sm">{event.location.address}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <FaTag className="text-blue-600 text-xl mr-3 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Category</p>
                                        <p className="text-gray-600">{event.category}</p>
                                    </div>
                                </div>

                                {event.capacity && (
                                    <div className="flex items-start">
                                        <FaUsers className="text-blue-600 text-xl mr-3 mt-1" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Capacity</p>
                                            <p className="text-gray-600">{event.capacity} attendees</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Registration Button */}
                            {user && (
                                <div>
                                    {isRegistered ? (
                                        <div>
                                            <div className="flex items-center justify-center bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-3">
                                                <FaCheckCircle className="mr-2" />
                                                <span className="font-semibold">You're registered!</span>
                                            </div>
                                            <button
                                                onClick={handleCancelRegistration}
                                                className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200"
                                            >
                                                Cancel Registration
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleRegister}
                                            disabled={registering}
                                            className="w-full btn-primary disabled:opacity-50"
                                        >
                                            {registering ? 'Registering...' : 'Register for Event'}
                                        </button>
                                    )}
                                </div>
                            )}

                            {!user && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full btn-primary"
                                >
                                    Login to Register
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
