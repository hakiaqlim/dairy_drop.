import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();
    const navigate = useNavigate();

    const { user } = useAuth();

    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems
        .reduce((acc, item) => acc + item.qty * item.price, 0)
        .toFixed(2);

    const checkoutHandler = () => {
        if (user) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=/shipping');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-blue-100 p-4 rounded text-blue-700">
                        Your cart is empty. <Link to="/" className="underline font-bold">Go Back</Link>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-2/3">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between bg-white p-6 mb-4 rounded-xl shadow-md border border-gray-100"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1 ml-4">
                                        <Link
                                            to={`/product/${item._id}`}
                                            className="text-lg font-semibold hover:underline"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-gray-500">Rs.{item.price}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <select
                                            className="border rounded p-1 mr-4"
                                            value={item.qty}
                                            onChange={(e) =>
                                                addToCart(item, Number(e.target.value) - item.qty)
                                            }
                                        >
                                            {[...Array(item.countInStock > 0 ? item.countInStock : 10).keys()].map((x) => ( // Fallback to 10 if stock not managed yet
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="md:w-1/3">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-8">
                                <h2 className="text-xl font-bold mb-4">
                                    Subtotal ({totalItems}) items
                                </h2>
                                <p className="text-2xl font-bold mb-6">Rs.{totalPrice}</p>
                                <button
                                    onClick={checkoutHandler}
                                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
                                    disabled={cartItems.length === 0}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
