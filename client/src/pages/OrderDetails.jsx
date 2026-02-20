import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dairy-drop.onrender.com'}/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setOrder(data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;
    if (!order) return <div className="p-8 text-center text-lg text-red-500">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-8">
                <h1 className="text-2xl font-bold mb-4">Order {order._id}</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                        <div className="bg-white p-6 rounded-xl shadow-md mb-4 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-500">{order.user.email}</a></p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <div className="bg-green-100 text-green-700 p-2 mt-2 rounded">Delivered on {order.deliveredAt.substring(0, 10)}</div>
                            ) : (
                                <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">Not Delivered</div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md mb-4 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <p>
                                <strong>Method: </strong> {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <div className="bg-green-100 text-green-700 p-2 mt-2 rounded">Paid on {order.paidAt.substring(0, 10)}</div>
                            ) : (
                                <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">Not Paid (COD)</div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md mb-4 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            {order.orderItems.length === 0 ? (
                                <p>Order is empty</p>
                            ) : (
                                <div>
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between border-b py-2 last:border-b-0">
                                            <div className="flex items-center">
                                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                                                <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline">
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
                                <span>Rs.{order.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Shipping</span>
                                <span>Rs.{order.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tax</span>
                                <span>Rs.{order.taxPrice}</span>
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="flex justify-between mb-4 font-bold text-lg">
                                <span>Total</span>
                                <span>Rs.{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
