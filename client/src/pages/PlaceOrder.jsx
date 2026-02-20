import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PlaceOrder = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=shipping');
        }
    }, [user, navigate]);

    if (!shippingAddress) {
        navigate('/shipping');
        return null; // Return null to avoid rendering while redirecting
    }

    // Calculate Prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10); // Free shipping over $100
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    const placeOrderHandler = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dairy-drop.onrender.com'}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    orderItems: cartItems.map(item => ({
                        ...item,
                        product: item._id
                    })),
                    shippingAddress,
                    paymentMethod: 'COD',
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                clearCart();
                navigate(`/order/${data._id}`); // Redirect to order details (to be implemented)
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Place Order</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                        <div className="bg-white p-6 rounded-xl shadow-md mb-4 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Shipping</h2>
                            <p className="text-gray-600">
                                <strong>Address: </strong>
                                {shippingAddress.address}, {shippingAddress.city},{' '}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md mb-4 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <p className="text-gray-600">
                                <strong>Method: </strong>Cash on Delivery (COD)
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md mb-4 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            {cartItems.length === 0 ? (
                                <p>Your cart is empty</p>
                            ) : (
                                <div>
                                    {cartItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between border-b py-2 last:border-b-0"
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded mr-4"
                                                />
                                                <Link
                                                    to={`/product/${item._id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {item.name}
                                                </Link>
                                            </div>
                                            <div>
                                                {item.qty} x Rs.{item.price} = Rs.{item.qty * item.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:w-1/3">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-8">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2">
                                <span>Items</span>
                                <span>Rs.{itemsPrice}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Shipping</span>
                                <span>Rs.{shippingPrice}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tax</span>
                                <span>Rs.{taxPrice}</span>
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="flex justify-between mb-4 font-bold text-lg">
                                <span>Total</span>
                                <span>Rs.{totalPrice}</span>
                            </div>
                            <button
                                onClick={placeOrderHandler}
                                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
                                disabled={cartItems.length === 0}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
