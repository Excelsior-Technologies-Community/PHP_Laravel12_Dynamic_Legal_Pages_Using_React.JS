import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

export default function LegalPageEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [versions, setVersions] = useState([]);
    const [showVersions, setShowVersions] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            LinkExtension.configure({ openOnClick: false }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: "",
    });

    useEffect(() => {
        axios.get(`/api/legal-pages/${id}/edit`).then((res) => {
            setTitle(res.data.title);
            editor.commands.setContent(res.data.description);
        });

        axios.get(`/api/legal-pages/${id}/versions`).then((res) => {
            setVersions(res.data);
        });
    }, [id, editor]);

    const submit = async (e) => {
        e.preventDefault();

        await axios.post(`/api/legal-pages/${id}`, {
            title,
            description: editor.getHTML(),
        });

        navigate("/legal-pages");
    };

    const rollback = async (versionNumber) => {
        if (!window.confirm(`Rollback to version ${versionNumber}? Current content will be saved as a new version.`)) return;

        await axios.post(`/api/legal-pages/${id}/rollback`, {
            version_number: versionNumber,
        });

        const res = await axios.get(`/api/legal-pages/${id}/edit`);
        setTitle(res.data.title);
        editor.commands.setContent(res.data.description);

        const versionRes = await axios.get(`/api/legal-pages/${id}/versions`);
        setVersions(versionRes.data);

        alert("Rolled back successfully!");
    };

    return (
        <div className="container mt-4">
            <h3>Edit Legal Page</h3>

            <Link to="/legal-pages" className="btn btn-secondary mb-3">
                Back
            </Link>

            <form onSubmit={submit}>
                <input
                    className="form-control mb-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="mb-2 d-flex gap-2">
                    <button type="button" className="btn btn-light"
                        onClick={() => editor.chain().focus().toggleBold().run()}>
                        B
                    </button>

                    <button type="button" className="btn btn-light"
                        onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <i>I</i>
                    </button>

                    <button type="button" className="btn btn-light"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}>
                        U
                    </button>

                    <button type="button" className="btn btn-light"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}>
                        • List
                    </button>

                    <button type="button" className="btn btn-light"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                        1. List
                    </button>
                </div>

                <div className="border rounded p-2" style={{ minHeight: "220px" }}>
                    <EditorContent editor={editor} />
                </div>

                <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-primary" type="submit">Update</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowVersions(!showVersions)}>
                        Version History ({versions.length})
                    </button>
                </div>
            </form>

            {showVersions && (
                <div className="mt-4">
                    <h5>Version History</h5>
                    <div className="list-group">
                        {versions.length === 0 ? (
                            <p className="text-muted">No previous versions</p>
                        ) : (
                            versions.map((v) => (
                                <div key={v.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Version {v.version_number}</strong>
                                        <br />
                                        <small className="text-muted">{new Date(v.created_at).toLocaleString()}</small>
                                        <p className="mb-0 mt-1 small" style={{ maxWidth: "600px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {v.title}
                                        </p>
                                    </div>
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => rollback(v.version_number)}>
                                        Rollback
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

