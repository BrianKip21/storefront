import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as authService from "../services/authService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            toast.error("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            await authService.forgotPassword(normalizedEmail);

            setSent(true);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Something went wrong. Please try again.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="mx-auto max-w-sm px-6 py-24 text-center">
                <h1 className="font-serif text-2xl">
                    Check your email
                </h1>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                    If an account exists for{" "}
                    <span className="font-medium text-neutral-700">
                        {email}
                    </span>
                    , we've sent you a link to reset your password.
                </p>

                <p className="mt-4 text-xs text-neutral-400">
                    The reset link will expire in 1 hour.
                </p>

                <Link
                    to="/login"
                    className="mt-8 inline-block text-[13px] underline underline-offset-4"
                >
                    Back to log in
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-sm px-6 py-24">
            <h1 className="text-center font-serif text-2xl">
                Reset your password
            </h1>

            <p className="mt-2 text-center text-sm leading-6 text-neutral-500">
                Enter your email and we'll send you a secure
                password reset link.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
            >
                <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 disabled:opacity-50"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full bg-neutral-900 text-[13px] font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {loading
                        ? "SENDING..."
                        : "SEND RESET LINK"}
                </button>
            </form>

            <p className="mt-6 text-center text-[13px] text-neutral-500">
                <Link
                    to="/login"
                    className="underline underline-offset-4 hover:text-neutral-900"
                >
                    Back to log in
                </Link>
            </p>
        </div>
    );
}