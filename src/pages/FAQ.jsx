const faqs = [
    {
        q: "How long does delivery take?",
        a: "1–2 business days within Nairobi, and 2–5 business days for other regions in Kenya."
    },
    {
        q: "Do I need an account to place an order?",
        a: "You can browse and add items to your cart as a guest, but you'll need to log in or sign up to complete checkout."
    },
    {
        q: "What payment methods do you accept?",
        a: "We currently accept M-Pesa only, via a secure STK push prompt at checkout."
    },
    {
        q: "Can I return or exchange an item?",
        a: "Yes — items can be returned within 7 days of delivery if unworn and in original condition. See our Returns and exchanges page for details."
    },
    {
        q: "How do I track my order?",
        a: "Visit your Orders page after logging in to see the current status of any order."
    }
];

export default function FAQ() {
    return (
        <div className="mx-auto max-w-2xl px-6 py-16">
            <p className="text-[11px] tracking-[1.5px] text-neutral-400">CUSTOMER CARE</p>
            <h1 className="mt-2 font-serif text-3xl">Frequently asked questions</h1>

            <div className="mt-8 divide-y divide-neutral-200">
                {faqs.map((item, i) => (
                    <div key={i} className="py-5">
                        <p className="text-[14px] font-medium text-neutral-900">{item.q}</p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
