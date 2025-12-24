import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LegalPageIndex() {
    const [pages, setPages] = useState([]);

    const fetchPages = async () => {
        const res = await axios.get("/api/legal-pages");
        setPages(res.data);
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const deletePage = async (id) => {
        if (!confirm("Delete this page?")) return;

        await axios.delete(`/api/legal-pages/${id}`);
        fetchPages();
    };

    return (
        <div className="container mt-4">
            <h3>Legal Pages</h3>

            <Link to="/legal-pages/create" className="btn btn-success mb-3">
                + Create Page
            </Link>

            <table className="table table-bordered align-middle">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th width="150">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {pages.map((p) => (
                        <tr key={p.id}>
                            <td>{p.title}</td>

                            {/* Render HTML safely */}
                            <td style={{ maxWidth: "450px" }}>
                                <div
                                    dangerouslySetInnerHTML={{ __html: p.description }}
                                    style={{
                                        whiteSpace: "normal",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}
                                ></div>
                            </td>

                            <td>
                                <Link
                                    to={`/legal-pages/edit/${p.id}`}
                                    className="btn btn-primary btn-sm me-2"
                                >
                                    Edit
                                </Link>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deletePage(p.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
