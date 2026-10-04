import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Signup() {
    const signup = useAuthStore((s) => s.signup);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signup(form);

            toast.success("Account created");

            navigate("/", {
                replace: true
            });

        } catch (err) {
            toast.error(
                err.message || "Signup failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-sm px-6 py-24">

            <h1 className="text-center font-serif text-2xl">
                Create an account
            </h1>

            {/* Email / Password Signup */}
            <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-5"
            >
                <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            fullName: e.target.value
                        })
                    }
                    className="w-full border-b border-neutral-300 pb-2 text-sm outline-none focus:border-neutral-900"
                />

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
                    minLength={6}
                    placeholder="Password (min. 6 characters)"
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
                        ? "CREATING ACCOUNT..."
                        : "SIGN UP"}
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

            {/* Google Signup / Login */}
            <div className="mt-6">
                <GoogleAuthButton />
            </div>

            {/* Login Link */}
            <p className="mt-6 text-center text-[13px] text-neutral-500">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="border-b border-neutral-900 text-neutral-900"
                >
                    Log in
                </Link>
            </p>

        </div>
    );
}
