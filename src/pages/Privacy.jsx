export default function Privacy() {
    return (
        <div className="mx-auto max-w-2xl px-6 py-16">
            <p className="text-[11px] tracking-[1.5px] text-neutral-400">LEGAL</p>
            <h1 className="mt-2 font-serif text-3xl">Privacy Policy</h1>
            <p className="mt-2 text-[12px] text-neutral-400">Last updated: August 2026</p>

            <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600">
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Information we collect</h2>
                    <p className="mt-2">
                        When you create an account or place an order, we collect your name,
                        email address, phone number, and delivery address. This information
                        is used solely to process and fulfill your orders.
                    </p>
                </section>
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">How we use your information</h2>
                    <p className="mt-2">
                        We use your details to process payments, communicate about your
                        orders, and improve our service. We never sell your personal
                        information to third parties.
                    </p>
                </section>
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Payment information</h2>
                    <p className="mt-2">
                        Payments are processed securely via M-Pesa. We do not store your
                        M-Pesa PIN or full payment credentials on our servers.
                    </p>
                </section>
                <section>
                    <h2 className="text-[14px] font-medium text-neutral-900">Contact us</h2>
                    <p className="mt-2">
                        If you have questions about this policy, reach out via our{" "}
                        <a href="/contact" className="underline">Contact page</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
