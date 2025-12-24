import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TermsAndCondition() {
    const [page, setPage] = useState(null);

    useEffect(() => {
        axios.get("/api/legal-pages/3/edit").then((res) => {
            setPage(res.data);
        });
    }, []);

    if (!page) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>{page.title}</h2>

            <div
                dangerouslySetInnerHTML={{ __html: page.description }}
                className="mt-3"
            ></div>
        </div>
    );
}
