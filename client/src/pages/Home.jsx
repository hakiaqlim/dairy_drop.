import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Home = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(new Set());

    useEffect(() => {
        fetchProducts();

        const socket = io(import.meta.env.VITE_API_URL || 'https://dairy-drop.onrender.com');
        socket.on('productsUpdated', () => {
            fetchProducts();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dairy-drop.onrender.com'}/api/products`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (productId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

    // Split products into categories
    const featuredProducts = products.filter(p => !p.category?.toLowerCase().includes('cheese')).slice(0, 4);
    const cheeseProducts = products.filter(p => p.category?.toLowerCase().includes('cheese')).slice(0, 4);

    // Aggregate all reviews from products
    const allReviews = products.reduce((acc, product) => {
        const productReviews = product.reviews.map(review => ({
            ...review,
            productName: product.name,
            productId: product._id
        }));
        return [...acc, ...productReviews];
    }, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

    const ProductCard = ({ product }) => (
        <div className="bg-white p-4 relative group border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl">
            {/* Product Image Wrapper */}
            <Link to={`/product/${product._id}`} className="block relative mb-4 overflow-hidden bg-white aspect-[4/3] border border-gray-50">
                <div className="w-full h-full flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-500">
                    <img
                        src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                        alt={product.name}
                        className="max-h-full w-auto object-contain"
                    />
                </div>
            </Link>

            {/* Product Info */}
            <div className="text-center pb-4">
                <div className="mb-1 text-[#DE4844] font-bold text-lg">
                    {product.price.toFixed(2).replace('.', ',')} Rs. <span className="text-xs text-gray-400 font-normal italic">each</span>
                </div>
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-gray-600 italic font-medium text-sm mb-4 line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <button
                    onClick={() => addToCart(product)}
                    disabled={product.countInStock === 0}
                    className="bg-[#DE4844] text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#c93d39] transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );

    const ReviewCard = ({ review }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <p className="text-gray-600 italic mb-4 line-clamp-3 text-sm">"{review.comment}"</p>
            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <div>
                    <p className="font-bold text-gray-900 text-xs uppercase tracking-wider">{review.name}</p>
                    <Link to={`/product/${review.productId}`} className="text-[10px] text-teal-600 hover:text-teal-700 transition-colors font-medium">
                        on {review.productName}
                    </Link>
                </div>
                <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-500 font-inter">
            {/* Modern Hero Section - Reverted */}
            <div className="relative overflow-hidden bg-[#F0F7FF] pt-16 pb-24 lg:pt-24 lg:pb-32">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="container-custom relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-2xl px-4 md:px-0">
                            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100 shadow-sm mb-6 animate-fadeIn">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                                <span className="text-sm font-semibold text-blue-900 uppercase tracking-wider">100% Fresh Daily</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-[#1A202C] mb-6 leading-tight">
                                Pure Dairy <br />
                                <span className="text-blue-600 italic">Delivered</span> to You
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                                Experience the finest, farm-fresh dairy products delivered straight to your doorstep within hours of production.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5">
                                <a href="#products" className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95">
                                    Start Shopping
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="relative p-4 md:p-0">
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700 aspect-video">
                                <img
                                    src="https://images.unsplash.com/photo-1550583724-125581f7783f?q=80&w=2670&auto=format&fit=crop"
                                    alt="Fresh Dairy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Favorite Food Section - Corrected Product Titles */}
            {!loading && featuredProducts.length > 0 && (
                <div id="products" className="container mx-auto py-24 px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em] inline-block border-b-4 border-gray-100 pb-4">Our Favorites</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* Cheese Selection - Additional Grid */}
            {!loading && cheeseProducts.length > 0 && (
                <div className="bg-gray-100 py-24 px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em] inline-block border-b-4 border-gray-200 pb-4">Premium Cheese</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            {cheeseProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            {!loading && allReviews.length > 0 && (
                <div className="bg-gray-100 py-24 px-4 border-t border-gray-100">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em] inline-block border-b-4 border-gray-200 pb-4">Customer Reviews</h2>
                        </div>
                        <div className="max-w-7xl mx-auto">
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                spaceBetween={30}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 3500,
                                    disableOnInteraction: false,
                                }}
                                pagination={{ clickable: true }}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                    },
                                }}
                                className="reviews-swiper pb-16"
                            >
                                {allReviews.map((review, index) => (
                                    <SwiperSlide key={review._id || index}>
                                        <ReviewCard review={review} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Dairy Drop Footer */}
            <footer className="bg-[#1a1a1a] text-white py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Company Info */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold tracking-tighter">Dairy<span className="text-blue-500">Drop</span></h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Bringing the freshest farm-to-door dairy experience. We believe in quality, sustainability, and supporting our local farmers.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Shop Categories */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Health & Nutrition</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link to="/category/milk" className="hover:text-blue-500 transition-colors">Pure Farm Milk</Link></li>
                                <li><Link to="/category/cheese" className="hover:text-blue-500 transition-colors">Artisan Cheese</Link></li>
                                <li><Link to="/category/butter" className="hover:text-blue-500 transition-colors">Natural Butter</Link></li>
                                <li><Link to="/category/yogurt" className="hover:text-blue-500 transition-colors">Greek Yogurt</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Customer Care</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link to="/shipping" className="hover:text-blue-500 transition-colors">Shipping Policy</Link></li>
                                <li><Link to="/returns" className="hover:text-blue-500 transition-colors">Returns & Refunds</Link></li>
                                <li><Link to="/faq" className="hover:text-blue-500 transition-colors">General FAQs</Link></li>
                                <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact Support</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
                            <p className="text-gray-400 text-sm mb-4">Get the latest updates on fresh arrivals.</p>
                            <div className="flex bg-white/5 p-1 rounded-xl">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-transparent px-4 py-2 text-sm focus:outline-none w-full"
                                />
                                <button className="bg-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">Join</button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/5 mt-16 pt-8 text-center text-xs text-gray-500">
                        <p>© 2026 Dairy Drop. All rights reserved. 🐄</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
