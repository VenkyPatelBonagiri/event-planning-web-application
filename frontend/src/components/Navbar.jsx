import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <FaCalendarAlt className="text-3xl text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-2xl font-bold gradient-text">EventHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                        >
                            Home
                        </Link>
                        <Link
                            to="/events"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                        >
                            Events
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                >
                                    <FaUser />
                                    <span>{isAdmin ? 'Admin Panel' : 'My Dashboard'}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn-primary"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-700 hover:text-blue-600"
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                to="/events"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Events
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-700 hover:text-blue-600 font-medium"
                                    >
                                        {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-left text-red-500 hover:text-red-600 font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-700 hover:text-blue-600 font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
