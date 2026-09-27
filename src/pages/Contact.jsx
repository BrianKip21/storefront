import { MessageCircle, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "254785871134";
const SUPPORT_EMAIL = "lindaemmy695@gmail.com";

export default function Contact() {
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hi liaan, I have a question about "
    )}`;

    return (
        <div className="mx-auto max-w-md px-6 py-16 text-center">
            <p className="text-[11px] tracking-[1.5px] text-neutral-400">GET IN TOUCH</p>
            <h1 className="mt-2 font-serif text-3xl">We're here to help</h1>
            <p className="mt-3 text-sm text-neutral-500">
                The fastest way to reach us is on WhatsApp — we usually reply within a
                few hours.
            </p>

            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex h-14 items-center justify-center gap-2.5 bg-neutral-900 text-[13px] font-medium tracking-wide text-white"
            >
                <MessageCircle size={17} strokeWidth={1.75} />
                CHAT ON WHATSAPP
            </a>

            <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[11px] text-neutral-400">OR</span>
                <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-6 flex items-center justify-center gap-2 text-[13px] text-neutral-600 hover:text-neutral-900"
            >
                <Mail size={15} strokeWidth={1.75} />
                {SUPPORT_EMAIL}
            </a>

            <p className="mt-10 text-[12px] text-neutral-400">
                For order-specific questions, have your order number ready — you can
                find it on your{" "}
                <a href="/orders" className="underline">Orders</a> page.
            </p>
        </div>
    );
}
