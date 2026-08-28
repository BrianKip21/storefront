import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as orderService from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const statusColors = {
    pending: "text-neutral-500",
    processing: "text-blue-700",
    shipped: "text-amber-700",
    delivered: "text-green-700",
    cancelled: "text-red-700"
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        orderService.getMyOrders()
            .then((res) => setOrders(res.data))
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    if (orders.length === 0) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-24 text-center">
                <p className="text-neutral-400">You haven't placed any orders yet.</p>
                <Link to="/products" className="mt-4 inline-block border-b border-neutral-900 text-[13px]">
                    Start shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="font-serif text-2xl">Your orders</h1>

            <div className="mt-8 divide-y divide-base-300">
                {orders.map((order) => (
                    <Link
                        key={order._id}
                        to={`/orders/${order._id}`}
                        className="flex items-center justify-between py-5"
                    >
                        <div>
                            <p className="text-[13px]">Order #{order._id.slice(-8)}</p>
                            <p className="mt-1 text-[12px] text-neutral-400">
                                {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                                {order.items.length !== 1 && "s"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[13px]">KES {order.total.toLocaleString()}</p>
                            <p className={`mt-1 text-[12px] ${statusColors[order.status]}`}>
                                {order.status}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
