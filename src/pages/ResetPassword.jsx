import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import * as authService from "../services/authService";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid password reset link.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords don't match.");
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(
                token,
                password
            );

            toast.success(
                "Password reset successfully. Please log in."
            );

            navigate("/login", {
                replace: true
            });

        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Unable to reset your password. Please try again.";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-sm px-6 py-24">
            <h1 className="text-center font-serif text-2xl">
                Set a new password
            </h1>

            <p className="mt-2 text-center text-sm leading-6 text-neutral-500">
                Enter a new password for your Liaan Collections account.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
            >
                <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    disabled={loading}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 disabled:opacity-50"
                />

                <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                    disabled={loading}
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 disabled:opacity-50"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full bg-neutral-900 text-[13px] font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {loading
                        ? "RESETTING..."
                        : "RESET PASSWORD"}
                </button>
            </form>
        </div>
    );
}