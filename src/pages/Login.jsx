import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Login() {
    const login = useAuthStore((s) => s.login);

    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const redirectTo = location.state?.from || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(form);

            toast.success("Welcome back");

            navigate(redirectTo, {
                replace: true
            });

        } catch (err) {
            toast.error(
                err.message || "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-sm px-6 py-24">

            <h1 className="text-center font-serif text-2xl">
                Log in
            </h1>

            {/* Email / Password Login */}
            <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-5"
            >
                <input
                    type="email"
                    required
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <input
                    type="password"
                    required
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value
                        })
                    }
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full bg-neutral-900 text-[13px] tracking-wide text-white disabled:opacity-40"
                >
                    {loading
                        ? "LOGGING IN..."
                        : "LOG IN"}
                </button>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-200" />

                <span className="text-[11px] text-neutral-400">
                    OR
                </span>

                <div className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* Google Login */}
            <div className="mt-6">
                <GoogleAuthButton />
            </div>

            {/* Signup Link */}
            <p className="mt-6 text-center text-[13px] text-neutral-500">
                Don't have an account?{" "}
                <Link
                    to="/signup"
                    className="border-b border-neutral-900 text-neutral-900"
                >
                    Sign up
                </Link>
            </p>

        </div>
    );
}
