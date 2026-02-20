import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchProduct();

        const socket = io(import.meta.env.VITE_API_URL || 'https://dairy-drop.onrender.com');
        socket.on('productsUpdated', () => {
            fetchProduct();
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    const fetchProduct = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dairy-drop.onrender.com'}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dairy-drop.onrender.com'}/api/products/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ rating, comment }),
            });
            const data = await res.json();
            if (res.ok) {
                alert('Review Submitted!');
                setRating(0);
                setComment('');
                fetchProduct();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-8">
                <Link to="/" className="btn btn-light my-3">Go Back</Link>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                        <img src={product.image} alt={product.name} className="w-full rounded-xl shadow-lg border border-gray-200" />
                    </div>
                    <div className="md:w-1/2">
                        <h3 className="text-2xl font-bold">{product.name}</h3>
                        <div className="text-yellow-500 my-2">
                            Rating: {product.rating} ({product.numReviews} reviews)
                        </div>
                        <p className="text-2xl font-bold my-4">Rs.{product.price}</p>
                        <p className="text-gray-600 mb-6">{product.description}</p>
                        <div className="mb-6">
                            <strong>Nutritional Facts:</strong> {product.nutritionalFacts || 'N/A'}
                        </div>
                        <button
                            onClick={() => addToCart(product)}
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                    {product.reviews.length === 0 && <p className="bg-blue-50 p-4 rounded text-blue-700">No Reviews</p>}
                    {product.reviews.map((review) => (
                        <div key={review._id} className="bg-white p-4 mb-4 rounded shadow-sm border">
                            <strong>{review.name}</strong>
                            <div className="text-yellow-500 text-sm">
                                Rating: {review.rating} / 5
                            </div>
                            <p className="mt-2">{review.comment}</p>
                            <p className="text-gray-400 text-xs mt-2">{review.createdAt.substring(0, 10)}</p>
                        </div>
                    ))}

                    {user ? (
                        <div className="bg-white p-6 rounded-xl shadow-md mt-6 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Write a Customer Review</h2>
                            <form onSubmit={submitReviewHandler}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Rating</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        <option value="1">1 - Poor</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="3">3 - Good</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="5">5 - Excellent</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Comment</label>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                                    Submit
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="mt-6">
                            Please <Link to="/login" className="text-blue-500 underline">sign in</Link> to write a review.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
