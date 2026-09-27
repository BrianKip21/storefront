export default function Returns() {
    return (
        <div className="mx-auto max-w-2xl px-6 py-16">
            <p className="text-[11px] tracking-[1.5px] text-neutral-400">CUSTOMER CARE</p>
            <h1 className="mt-2 font-serif text-3xl">Returns and exchanges</h1>

            <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600">
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Return window</h2>
                    <p className="mt-2">
                        Items can be returned or exchanged within 7 days of delivery,
                        provided they're unworn, unwashed, and in their original condition.
                    </p>
                </section>
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">How to start a return</h2>
                    <p className="mt-2">
                        Message us on{" "}
                        <a
                            href="https://wa.me/254785871134"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            WhatsApp
                        </a>{" "}
                        with your order number and reason for return, and we'll guide you
                        through the next steps.
                    </p>
                </section>
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Refunds</h2>
                    <p className="mt-2">
                        Approved refunds are processed back to your M-Pesa number within
                        3–5 business days of us receiving the returned item.
                    </p>
                </section>
            </div>
        </div>
    );
}
