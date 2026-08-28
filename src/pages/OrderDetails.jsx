import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as orderService from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        orderService.getOrderById(id).then((res) => setOrder(res.data)).catch((err) => toast.error(err.message));
    }, [id]);

    if (!order) return <LoadingSpinner />;

    return (
        <div className="mx-auto max-w-2xl px-6 py-12">
            <h1 className="font-serif text-2xl">Order #{order._id.slice(-8)}</h1>
            <p className="mt-1 text-[13px] text-neutral-400">
                Placed on {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-4 flex gap-4 text-[12px] text-neutral-500">
                <span>Status: {order.status}</span>
                <span>Payment: {order.paymentStatus}</span>
            </div>

            <div className="mt-8 divide-y divide-base-300 border-y border-base-300">
                {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4 py-4">
                        <div className="h-20 w-16 shrink-0 overflow-hidden bg-base-200">
                            {item.image && <img src={item.image} alt={item.title} className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px]">{item.title}</p>
                            <p className="mt-1 text-[12px] text-neutral-400">
                                {item.color} / {item.size} · Qty {item.quantity}
                            </p>
                        </div>
                        <p className="text-[13px]">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 space-y-1 text-[13px]">
                <div className="flex justify-between">
                    <span className="text-neutral-500">Subtotal</span>
                    <span>KES {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping</span>
                    <span>{order.shippingFee === 0 ? "Free" : `KES ${order.shippingFee.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between border-t border-base-300 pt-2">
                    <span>Total</span>
                    <span>KES {order.total.toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-8 border-t border-base-300 pt-6 text-[13px]">
                <p className="text-[11px] tracking-[1.5px] text-neutral-400">SHIPPING TO</p>
                <p className="mt-2 leading-relaxed text-neutral-600">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                    {order.shippingAddress.country}<br />
                    {order.shippingAddress.phone}
                </p>
            </div>
        </div>
    );
}
