import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";
import { useAddresses } from "../hooks/useAddresses";
import * as authService from "../services/authService";
import AddressList from "../components/AddressList";

const TABS = ["Profile", "Addresses", "Security"];

/* ---------- Shared style tokens ---------- */

const labelClass =
    "block text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400";

const inputClass =
    "mt-2 w-full border-0 border-b border-neutral-300 bg-transparent pb-2.5 text-[14px] text-neutral-900 outline-none transition-colors duration-300 placeholder:text-neutral-300 focus:border-neutral-900";

const primaryBtn =
    "inline-flex h-11 items-center justify-center bg-neutral-900 px-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-neutral-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40";

const secondaryBtn =
    "inline-flex h-11 items-center justify-center border border-neutral-900 px-8 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-900 transition-all duration-300 hover:bg-neutral-900 hover:text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40";

/* ---------- Small presentational helpers ---------- */

function Field({ label, ...props }) {
    return (
        <label className="block">
            <span className={labelClass}>{label}</span>
            <input {...props} className={inputClass} />
        </label>
    );
}

function Section({ title, description, danger = false, children }) {
    return (
        <section
            className={`grid gap-6 py-10 first:pt-0 last:pb-0 md:grid-cols-[200px_1fr] md:gap-12 ${
                danger ? "" : ""
            }`}
        >
            <div>
                <h2
                    className={`font-serif text-[19px] leading-snug ${
                        danger ? "text-red-700" : "text-neutral-900"
                    }`}
                >
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">
                        {description}
                    </p>
                )}
            </div>
            <div className="max-w-md">{children}</div>
        </section>
    );
}

export default function Account() {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);
    const [activeTab, setActiveTab] = useState("Profile");

    const {
        addresses,
        loading: loadingAddresses,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress
    } = useAddresses();

    // ---- Profile: full name ----
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [savingName, setSavingName] = useState(false);

    // ---- Profile: email change (verification flow) ----
    const [newEmail, setNewEmail] = useState("");
    const [requestingEmailChange, setRequestingEmailChange] = useState(false);
    const [emailChangeSent, setEmailChangeSent] = useState(false);

    // ---- Security: change password (accounts that already have one) ----
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [savingPassword, setSavingPassword] = useState(false);

    // ---- Security: set password (Google-only accounts) ----
    const [firstPasswordForm, setFirstPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
    const [settingPassword, setSettingPassword] = useState(false);

    // ---- Danger zone ----
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        setSavingName(true);
        try {
            const res = await authService.updateProfile({ fullName });
            updateUser({ ...user, fullName: res.data.fullName });
            toast.success("Name updated");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingName(false);
        }
    };

    const handleEmailChangeRequest = async (e) => {
        e.preventDefault();
        setRequestingEmailChange(true);
        try {
            const res = await authService.requestEmailChange(newEmail);
            toast.success(res.message);
            setEmailChangeSent(true);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setRequestingEmailChange(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        setSavingPassword(true);
        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            toast.success("Password updated. Other devices have been signed out.");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingPassword(false);
        }
    };

    const handleSetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (firstPasswordForm.newPassword !== firstPasswordForm.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        setSettingPassword(true);
        try {
            await authService.setPassword(firstPasswordForm.newPassword);
            updateUser({ ...user, hasPassword: true });
            toast.success("Password set. You can now also log in with your email.");
            setFirstPasswordForm({ newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSettingPassword(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleting(true);
        try {
            await authService.deleteAccount(deletePassword);
            toast.success("Account deleted");
            window.location.href = "/"; // full reload clears all client-side state cleanly
        } catch (err) {
            toast.error(err.message);
            setDeleting(false);
        }
    };

    const initials = (user?.fullName || user?.email || "?")
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const firstName = user?.fullName?.split(" ")[0];

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            <div className="mx-auto max-w-4xl px-6 pb-24 pt-14 md:pt-20">
                {/* ---------- Header ---------- */}
                <header className="flex items-center gap-5">
                    <div
                        aria-hidden="true"
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-serif text-[20px] tracking-wider text-white"
                    >
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className={labelClass}>My account</p>
                        <h1 className="mt-1.5 truncate font-serif text-[30px] leading-tight text-neutral-900 md:text-[34px]">
                            {firstName ? `Welcome back, ${firstName}` : "Your account"}
                        </h1>
                        <p className="mt-1 truncate text-[13px] text-neutral-500">{user?.email}</p>
                    </div>
                </header>

                {/* ---------- Tabs ---------- */}
                <nav
                    role="tablist"
                    className="mt-12 flex gap-10 border-b border-neutral-200"
                >
                    {TABS.map((tab) => {
                        const active = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                role="tab"
                                aria-selected={active}
                                onClick={() => setActiveTab(tab)}
                                className={`relative -mb-px pb-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                                    active
                                        ? "text-neutral-900"
                                        : "text-neutral-400 hover:text-neutral-700"
                                }`}
                            >
                                {tab}
                                <span
                                    className={`absolute inset-x-0 -bottom-px h-[2px] bg-neutral-900 transition-transform duration-300 origin-left ${
                                        active ? "scale-x-100" : "scale-x-0"
                                    }`}
                                />
                            </button>
                        );
                    })}
                </nav>

                {/* ---------- Content card ---------- */}
                <div className="mt-8 border border-neutral-200/80 bg-white px-6 py-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:px-12 md:py-12">
                    {/* ============ PROFILE ============ */}
                    {activeTab === "Profile" && (
                        <div className="divide-y divide-neutral-100">
                            <Section
                                title="Personal details"
                                description="The name we use on your orders and correspondence."
                            >
                                <form onSubmit={handleNameSubmit} className="space-y-7">
                                    <Field
                                        label="Full name"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                    <button type="submit" disabled={savingName} className={primaryBtn}>
                                        {savingName ? "Saving..." : "Save name"}
                                    </button>
                                </form>
                            </Section>

                            <Section
                                title="Email address"
                                description="We'll send a confirmation link to verify any change."
                            >
                                <p className={labelClass}>Current</p>
                                <p className="mt-2 text-[14px] text-neutral-900">{user?.email}</p>

                                {user?.hasGoogle && (
                                    <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] text-neutral-600">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Linked to Google
                                    </span>
                                )}

                                <div className="mt-8">
                                    {emailChangeSent ? (
                                        <div className="border border-neutral-200 bg-neutral-50 px-5 py-4 text-[13px] leading-relaxed text-neutral-600">
                                            Check{" "}
                                            <span className="font-medium text-neutral-900">{newEmail}</span>{" "}
                                            for a confirmation link. Your email won't change until you click it.
                                        </div>
                                    ) : (
                                        <form onSubmit={handleEmailChangeRequest} className="space-y-7">
                                            <Field
                                                label="New email address"
                                                type="email"
                                                required
                                                placeholder="name@example.com"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                disabled={requestingEmailChange}
                                                className={secondaryBtn}
                                            >
                                                {requestingEmailChange ? "Sending..." : "Change email"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </Section>

                            <Section
                                title="Orders"
                                description="Track, review and revisit your past purchases."
                            >
                                <Link
                                    to="/orders"
                                    className="group inline-flex items-center gap-3 border-b border-neutral-900 pb-1 text-[13px] text-neutral-900"
                                >
                                    View order history
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>
                            </Section>

                            <Section
                                title="Delete account"
                                description="Permanently remove your account and personal data."
                                danger
                            >
                                {!confirmingDelete ? (
                                    <button
                                        onClick={() => setConfirmingDelete(true)}
                                        className="text-[13px] text-red-600 underline underline-offset-4 transition-colors hover:text-red-800"
                                    >
                                        Delete my account
                                    </button>
                                ) : (
                                    <form
                                        onSubmit={handleDeleteAccount}
                                        className="space-y-6 border border-red-100 bg-red-50/40 p-6"
                                    >
                                        <p className="text-[13px] leading-relaxed text-neutral-600">
                                            This cannot be undone.
                                            {user?.hasPassword && " Enter your password to confirm."}
                                        </p>
                                        {user?.hasPassword && (
                                            <Field
                                                label="Password"
                                                type="password"
                                                required
                                                value={deletePassword}
                                                onChange={(e) => setDeletePassword(e.target.value)}
                                            />
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                type="submit"
                                                disabled={deleting}
                                                className="inline-flex h-11 items-center justify-center bg-red-600 px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {deleting ? "Deleting..." : "Confirm delete"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmingDelete(false)}
                                                className="inline-flex h-11 items-center justify-center border border-neutral-300 px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-700 transition-colors duration-300 hover:border-neutral-900"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Section>
                        </div>
                    )}

                    {/* ============ ADDRESSES ============ */}
                    {activeTab === "Addresses" && (
                        <Section
                            title="Saved addresses"
                            description="Manage where your orders are delivered. Your default address is pre-selected at checkout."
                        >
                            {loadingAddresses ? (
                                <div className="space-y-3" aria-busy="true">
                                    <div className="h-20 animate-pulse bg-neutral-100" />
                                    <div className="h-20 animate-pulse bg-neutral-100" />
                                </div>
                            ) : (
                                <AddressList
                                    addresses={addresses}
                                    onAdd={addAddress}
                                    onEdit={editAddress}
                                    onDelete={deleteAddress}
                                    onSetDefault={setDefaultAddress}
                                />
                            )}
                        </Section>
                    )}

                    {/* ============ SECURITY ============ */}
                    {activeTab === "Security" && (
                        <>
                            {!user?.hasPassword ? (
                                <Section
                                    title="Set a password"
                                    description="You signed up with Google. Add a password so you can also log in with your email directly."
                                >
                                    <form onSubmit={handleSetPasswordSubmit} className="space-y-7">
                                        <Field
                                            label="New password"
                                            type="password"
                                            required
                                            minLength={6}
                                            value={firstPasswordForm.newPassword}
                                            onChange={(e) =>
                                                setFirstPasswordForm({
                                                    ...firstPasswordForm,
                                                    newPassword: e.target.value
                                                })
                                            }
                                        />
                                        <Field
                                            label="Confirm password"
                                            type="password"
                                            required
                                            value={firstPasswordForm.confirmPassword}
                                            onChange={(e) =>
                                                setFirstPasswordForm({
                                                    ...firstPasswordForm,
                                                    confirmPassword: e.target.value
                                                })
                                            }
                                        />
                                        <button type="submit" disabled={settingPassword} className={primaryBtn}>
                                            {settingPassword ? "Setting..." : "Set password"}
                                        </button>
                                    </form>
                                </Section>
                            ) : (
                                <Section
                                    title="Change password"
                                    description="Use at least 6 characters. Changing your password signs you out of other devices."
                                >
                                    <form onSubmit={handlePasswordSubmit} className="space-y-7">
                                        <Field
                                            label="Current password"
                                            type="password"
                                            required
                                            value={passwordForm.currentPassword}
                                            onChange={(e) =>
                                                setPasswordForm({
                                                    ...passwordForm,
                                                    currentPassword: e.target.value
                                                })
                                            }
                                        />
                                        <Field
                                            label="New password"
                                            type="password"
                                            required
                                            minLength={6}
                                            value={passwordForm.newPassword}
                                            onChange={(e) =>
                                                setPasswordForm({
                                                    ...passwordForm,
                                                    newPassword: e.target.value
                                                })
                                            }
                                        />
                                        <Field
                                            label="Confirm new password"
                                            type="password"
                                            required
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordForm({
                                                    ...passwordForm,
                                                    confirmPassword: e.target.value
                                                })
                                            }
                                        />
                                        <button type="submit" disabled={savingPassword} className={primaryBtn}>
                                            {savingPassword ? "Updating..." : "Update password"}
                                        </button>
                                    </form>
                                </Section>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
