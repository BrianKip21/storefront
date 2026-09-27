export default function Terms() {
    return (
        <div className="mx-auto max-w-2xl px-6 py-16">
            <p className="text-[11px] tracking-[1.5px] text-neutral-400">LEGAL</p>
            <h1 className="mt-2 font-serif text-3xl">Terms and conditions</h1>
            <p className="mt-2 text-[12px] text-neutral-400">Last updated: August 2026</p>

            <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600">
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Orders</h2>
                    <p className="mt-2">
                        By placing an order, you confirm the details provided are accurate.
                        Orders are confirmed once payment via M-Pesa is successfully
                        received.
                    </p>
                </section>
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Pricing</h2>
                    <p className="mt-2">
                        All prices are listed in Kenyan Shillings (KES) and include
                        applicable taxes. Shipping fees are calculated at checkout.
                    </p>
                </section>
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Returns</h2>
                    <p className="mt-2">
                        See our <a href="/returns" className="underline">Returns and exchanges</a>{" "}
                        page for details on eligibility and process.
                    </p>
                </section>
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Changes to these terms</h2>
                    <p className="mt-2">
                        We may update these terms from time to time. Continued use of the
                        site after changes constitutes acceptance of the updated terms.
                    </p>
                </section>
            </div>
        </div>
    );
}
