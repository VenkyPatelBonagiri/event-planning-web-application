import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage } from 'react-icons/fa';
import Loader from '../components/Loader';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        category: 'Conference',
        venue: '',
        lat: '',
        lng: '',
        address: '',
        capacity: 100
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const categories = ['Conference', 'Workshop', 'Seminar', 'Concert', 'Sports', 'Cultural', 'Networking', 'Other'];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            category: 'Conference',
            venue: '',
            lat: '',
            lng: '',
            address: '',
            capacity: 100
        });
        setImageFile(null);
        setEditingEvent(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            if (editingEvent) {
                await api.put(`/events/${editingEvent._id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Event updated successfully!');
            } else {
                await api.post('/events', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Event created successfully!');
            }

            fetchEvents();
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time,
            category: event.category,
            venue: event.venue,
            lat: event.location.lat.toString(),
            lng: event.location.lng.toString(),
            address: event.location.address || '',
            capacity: event.capacity || 100
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event? This will also delete all registrations.')) {
            return;
        }

        try {
            await api.delete(`/events/${id}`);
            setEvents(events.filter(e => e._id !== id));
            alert('Event deleted successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete event');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text">Manage Events</h1>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary"
                        >
                            <FaPlus className="inline mr-2" />
                            Create Event
                        </button>
                    )}
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-slide-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Event Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="input-field"
                                        placeholder="Tech Innovation Summit 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="input-field"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Time *</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Venue *</label>
                                    <input
                                        type="text"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleInputChange}
                                        required
                                        className="input-field"
                                        placeholder="University Main Auditorium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Capacity</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Latitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="lat"
                                        value={formData.lat}
                                        onChange={handleInputChange}
                                        required
                                        className="input-field"
                                        placeholder="40.7128"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Longitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="lng"
                                        value={formData.lng}
                                        onChange={handleInputChange}
                                        required
                                        className="input-field"
                                        placeholder="-74.0060"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="123 University Ave, City, State"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    className="input-field"
                                    placeholder="Provide a detailed description of the event..."
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    <FaImage className="inline mr-2" />
                                    Event Banner Image {!editingEvent && '*'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required={!editingEvent}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {imageFile && (
                                    <p className="mt-2 text-sm text-green-600">Selected: {imageFile.name}</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    <FaSave className="inline mr-2" />
                                    {submitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Events List */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events ({events.length})</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader />
                        </div>
                    ) : events.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Venue</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <img
                                                    src={event.image.startsWith('http')
                                                        ? event.image
                                                        : `http://localhost:5000/uploads/${event.image}`}
                                                    alt={event.title}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            </td>
                                            <td className="py-3 px-4 font-medium text-gray-900">{event.title}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                    {event.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {new Date(event.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{event.venue}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event._id)}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600 mb-4">No events created yet</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-primary"
                            >
                                <FaPlus className="inline mr-2" />
                                Create First Event
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminEvents;
