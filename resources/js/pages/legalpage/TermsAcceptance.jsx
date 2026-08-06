import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TermsAcceptance({ legalPageId, children }) {
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`/api/legal-pages/${legalPageId}/check-acceptance`)
            .then((res) => {
                setAccepted(res.data.accepted);
                setLoading(false);
                if (!res.data.accepted) {
                    setShowModal(true);
                }
            })
            .catch(() => {
                setLoading(false);
                setShowModal(true);
            });
    }, [legalPageId]);

    const handleAccept = async (e) => {
        e.preventDefault();
        setError("");

        if (!agreed) {
            setError("Please check the agreement checkbox to continue.");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                legal_page_id: legalPageId,
            };

            if (name.trim() !== "") {
                payload.name = name.trim();
            }

            if (email.trim() !== "") {
                payload.email = email.trim();
            }

            await axios.post(`/api/legal-pages/${legalPageId}/accept-terms`, payload);

            setAccepted(true);
            setShowModal(false);
        } catch (error) {
            console.error("Acceptance failed:", error);
            if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors).flat();
                setError(messages.join(" "));
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong! Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!showModal) {
        return <>{children}</>;
    }

    return (
        <>
            <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Accept Terms & Conditions</h5>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger py-2">{error}</div>
                            )}
                            <form onSubmit={handleAccept}>
                                <div className="mb-3">
                                    <label className="form-label">Name (optional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email (optional)</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="agreeCheck"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="agreeCheck">
                                        I agree to the terms and conditions
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "I Agree"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
