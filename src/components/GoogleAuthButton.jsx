import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";

export default function GoogleAuthButton() {
    const googleLogin = useAuthStore((state) => state.googleLogin);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSuccess = async (credentialResponse) => {
        try {
            const credential = credentialResponse?.credential;

            if (!credential) {
                throw new Error("Google credential was not received");
            }

            await googleLogin(credential);

            toast.success("Welcome!");

            navigate(
                location.state?.from || "/",
                { replace: true }
            );

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Google sign-in failed"
            );
        }
    };

    const handleError = () => {
        toast.error("Google sign-in failed");
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            width="100%"
        />
    );
}