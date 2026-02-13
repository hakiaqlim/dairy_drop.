import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/50">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-all">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Dairy<span className="text-blue-600">Drop</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Home
                        </Link>

                        <Link to="/cart" className="relative group">
                            <div className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="font-medium">Cart</span>
                            </div>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link to="/cart" className="relative group">
                            <span className="bg-gray-50 p-2 rounded-lg block">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </span>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-6 space-y-4">
                        <Link to="/" className="block text-gray-700 hover:text-blue-600 font-medium">Home</Link>
                        <div className="pt-4 border-t border-gray-50">
                            {user ? (
                                <>
                                    <Link to="/profile" className="block text-gray-700 hover:text-blue-600 font-medium py-2">My Profile</Link>
                                    <button onClick={handleLogout} className="block w-full text-left text-red-500 font-medium py-2">Logout</button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <Link to="/login" className="block text-center py-2.5 rounded-lg font-medium bg-gray-50 text-gray-700">Sign In</Link>
                                    <Link to="/register" className="block text-center py-3 rounded-lg font-medium bg-blue-600 text-white">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
