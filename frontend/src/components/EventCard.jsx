import { Link } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';

const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="card card-hover animate-fade-in">
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.image.startsWith('http') ? event.image : `http://localhost:5000/uploads/${event.image}`}
                    alt={event.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg">
                        {event.category}
                    </span>
                </div>
            </div>

            {/* Event Details */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                    {event.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                        <FaCalendar className="mr-2 text-blue-600" />
                        <span className="text-sm">{formatDate(event.date)} at {event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        <span className="text-sm">{event.venue}</span>
                    </div>
                </div>

                <Link
                    to={`/events/${event._id}`}
                    className="block w-full text-center btn-primary"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default EventCard;
