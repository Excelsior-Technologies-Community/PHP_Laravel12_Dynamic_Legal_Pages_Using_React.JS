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
    }, [id, editor]);

    const submit = async (e) => {
        e.preventDefault();

        await axios.post(`/api/legal-pages/${id}`, {
            title,
            description: editor.getHTML(),
        });

        navigate("/legal-pages");
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

                {/* Toolbar */}
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

                {/* Editor Box */}
                <div className="border rounded p-2" style={{ minHeight: "220px" }}>
                    <EditorContent editor={editor} />
                </div>

                <button className="btn btn-primary mt-3">Update</button>
            </form>
        </div>
    );
}
