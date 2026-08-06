import React, { useEffect, useState } from "react";
import axios from "axios";
import TermsAcceptance from "./TermsAcceptance";

export default function TermsAndCondition() {
    const [page, setPage] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("/api/legal-pages/3/edit")
            .then((res) => setPage(res.data))
            .catch(() => setError("Failed to load page. Please try again."));
    }, []);

    if (!page && !error) return <p>Loading...</p>;

    if (error) {
        return (
            <TermsAcceptance legalPageId={3}>
                <div className="container mt-4">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </TermsAcceptance>
        );
    }

    return (
        <TermsAcceptance legalPageId={3}>
            <div className="container mt-4">
                <h2>{page.title}</h2>

                <div
                    dangerouslySetInnerHTML={{ __html: page.description }}
                    className="mt-3"
                ></div>
            </div>
        </TermsAcceptance>
    );
}
