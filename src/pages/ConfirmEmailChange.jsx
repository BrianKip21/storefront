import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as authService from "../services/authService";

export default function ConfirmEmailChange() {
    const { token } = useParams();
    const [status, setStatus] = useState("confirming");

    useEffect(() => {
        authService.confirmEmailChange(token)
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, [token]);

    return (
        <div className="mx-auto max-w-sm px-6 py-24 text-center">
            {status === "confirming" && <p className="text-sm text-neutral-500">Confirming...</p>}

            {status === "success" && (
                <>
                    <h1 className="font-serif text-2xl">Email updated</h1>
                    <p className="mt-3 text-sm text-neutral-500">
                        Your email has been changed.{" "}
                        <Link to="/account" className="underline">Go to your account</Link>
                    </p>
                </>
            )}

            {status === "error" && (
                <>
                    <h1 className="font-serif text-2xl">Link expired</h1>
                    <p className="mt-3 text-sm text-neutral-500">
                        This confirmation link is invalid or has expired. You can request a new one from your account page.
                    </p>
                </>
            )}
        </div>
    );
}
