# PHP_Laravel12_Dynamic_Legal_Pages_Using_React.JS

# STEP 1: Create & Install Laravel 12 Project
# Create a new Laravel 12 project using Composer:
```php
composer create-project laravel/laravel your folder name
```  
Explanation:
This command downloads the latest Laravel 12 framework
It creates a fresh project folder named
All core Laravel files and folders are installed automatically

# STEP 2: Go to Project Directory
```php
cd your folder
``` 
# STEP 3: Database Configuration (.env)
```php
Open the .env file and update database settings:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your database
DB_USERNAME=root
DB_PASSWORD=
``` 
Explanation:
This connects Laravel with MySQL database
Make sure the database laravel_cart exists in phpMyAdmin

# STEP 4: Install Node & React Packages
```php
Install required React packages:
npm install react react-dom
npm install react-router-dom
npm install axios
Install Vite React plugin:
npm install @vitejs/plugin-react --save-dev
``` 
# STEP 5: Configure Vite for React
Open vite.config.js
```php
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
``` 
Explanation:
Vite is used for fast React build
React plugin allows JSX support

# STEP 6: Create React Entry File
# Create file:
resources/js/app.jsx
```php
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProductIndex from "./pages/products/index";
import ProductCreate from "./pages/products/create";
import ProductEdit from "./pages/products/edit";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProductIndex />} />
                <Route path="/create" element={<ProductCreate />} />
                <Route path="/edit/:id" element={<ProductEdit />} />
            </Routes>
        </BrowserRouter>
    );
}
``` 
createRoot(document.getElementById("app")).render(<App />);

# STEP 7: Update Welcome Blade File
Open:
resources/views/welcome.blade.php
```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Laravel 12 React</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>
<body>
    <div id="app"></div>
</body>
</html>
``` 
Explanation:
This blade file loads React SPA
All pages are controlled by React Router



# Now Create legalpages crud operation and adding three pages for About-us , Privacy-policy, Terms & condition please followed :
# . Migration (legal_pages table)

```php
Run this:
php artisan make:migration create_legal_pages_table

``` 
Then migration file and code

```php
public function up()
{
    Schema::create('legal_pages', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->longText('description');
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('legal_pages');
}

``` 
Then run:

```php
php artisan migrate

``` 

# . Model (LegalPage.php)

```php
php artisan make:model LegalPage

``` 
Model code

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalPage extends Model
{
    protected $fillable = [
        'title',
        'description',
    ];
}

``` 
# . Controller (LegalPageController.php)

```php
Create controller:
php artisan make:controller LegalPageController

```

```php

<?php

namespace App\Http\Controllers;

use App\Models\LegalPage;
use Illuminate\Http\Request;

class LegalPageController extends Controller
{
    // 🔹 List all legal pages
    public function index()
    {
        return LegalPage::latest()->get();
    }

    // 🔹 Store legal page
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        LegalPage::create([
            'title'       => $request->title,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Legal page created successfully'], 201);
    }

    // 🔹 Edit (get single)
    public function edit($id)
    {
        return LegalPage::findOrFail($id);
    }

    // 🔹 Update
    public function update(Request $request, $id)
    {
        $legal = LegalPage::findOrFail($id);

        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $legal->update([
            'title'       => $request->title,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Legal page updated successfully']);
    }

    // 🔹 Delete
    public function destroy($id)
    {
        LegalPage::findOrFail($id)->delete();

        return response()->json(['message' => 'Legal page deleted successfully']);
    }
}

``` 
# Routes (web.php) added this route 

```php
use App\Http\Controllers\LegalPageController;
Route::prefix('api')->group(function () {
    Route::get('/legal-pages', [LegalPageController::class, 'index']);
    Route::post('/legal-pages', [LegalPageController::class, 'store']);
    Route::get('/legal-pages/{id}/edit', [LegalPageController::class, 'edit']);
    Route::post('/legal-pages/{id}', [LegalPageController::class, 'update']);
    Route::delete('/legal-pages/{id}', [LegalPageController::class, 'destroy']);
});

``` 
# Now install for TipTap Editor:
# Install TipTap dependencies:

```php
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-text-align

``` 
# Now Create legalpage folder into resource/js/pages/legalpage:
# Now Create Index.jsx , edit.jsx and create.jsx file into legalpage folder 
 
# resource/js/pages/legalpage/index.jsx

```php
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

``` 
# resource/js/pages/legalpage/create.jsx

```php
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

export default function LegalPageCreate() {
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

    const submit = async (e) => {
        e.preventDefault();

        await axios.post("/api/legal-pages", {
            title,
            description: editor.getHTML(),
        });

        navigate("/legal-pages"); // frontend route
    };

    return (
        <div className="container mt-4">
            <h3>Create Legal Page</h3>

            <Link to="/legal-pages" className="btn btn-secondary mb-3">
                Back
            </Link>

            <form onSubmit={submit}>
                <input
                    className="form-control mb-3"
                    placeholder="Title"
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

                <button className="btn btn-success mt-3">Save</button>
            </form>
        </div>
    );
}

``` 
# resource/js/pages/legalpage/edit.jsx

```php

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

``` 
# Now update app.jsx file and legalpage all route added that:

```php
import LegalPageIndex from "./pages/legalpage/index";
import LegalPageCreate from "./pages/legalpage/create";
import LegalPageEdit from "./pages/legalpage/edit";

<Route path="/legal-pages" element={<LegalPageIndex />} />
<Route path="/legal-pages/create" element={<LegalPageCreate />} />
<Route path="/legal-pages/edit/:id" element={<LegalPageEdit />} />

``` 
# Now run serve and open th browser and paste this url http://localhost:8000/legal-pages

<img width="628" height="108" alt="image" src="https://github.com/user-attachments/assets/464b6e3a-3370-4e3b-b6bf-40df26148e3e" />
<img width="979" height="397" alt="image" src="https://github.com/user-attachments/assets/91b0f091-2144-483c-95c8-ce3598ce90f8" />
<img width="628" height="287" alt="image" src="https://github.com/user-attachments/assets/86149df7-6d21-47a3-9e80-9197cd9ede54" />



# Now I created three pages for this index page and created separate jsx files for these three pages and made them show in the browser.
# Create   AboutUs.jsx , PrivacyPolicy.jsx ,TermsAndCondition.jsx  pages for 
# resource / js/pages/legalpage/ AboutUs.jsx

```php
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PrivacyPolicy() {
    const [page, setPage] = useState(null);

    useEffect(() => {
        axios.get("/api/legal-pages/1/edit").then((res) => {
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

``` 

# resource / js/pages/legalpage/ PrivacyPolicy.jsx

```php
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AboutUs() {
    const [page, setPage] = useState(null);

    useEffect(() => {
        axios.get("/api/legal-pages/2/edit").then((res) => {
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

``` 

# resource / js/pages/legalpage/ TermsAndCondition.jsx  

```php
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

``` 
# Add These Routes in app.jsx

```php
import AboutUs from "./pages/legalpage/AboutUs";
import PrivacyPolicy from "./pages/legalpage/PrivacyPolicy";
import TermsAndCondition from "./pages/legalpage/TermsAndCondition";

<Route path="/about-us" element={<AboutUs />} />
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms-and-condition" element={<TermsAndCondition />} />

``` 
# Now run this page from browser
# http://127.0.0.1:8000/about-us
<img width="978" height="351" alt="image" src="https://github.com/user-attachments/assets/e36fc112-47ac-48ee-bf52-f51d23a46320" />

# http://127.0.0.1:8000/privacy-policy
<img width="979" height="296" alt="image" src="https://github.com/user-attachments/assets/8a663574-6f80-46b6-8a39-24c98d53de2d" />

# http://127.0.0.1:8000/terms-and-condition

<img width="979" height="260" alt="image" src="https://github.com/user-attachments/assets/52fae803-7098-4e6c-a66b-10bd7ee549c7" />


# Now Create Header.jsx and Footer.jsx file into resource/js/layout folder:
# resource/js/layout/Header.jsx

```php
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header
            style={{
                position: "fixed",            // 🔥 ALWAYS FIXED
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 999,
                padding: "15px 25px",
                background: "#0d6efd",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
        >
            {/* Left Logo */}
            <h2 style={{ margin: 0 }}>MyStore</h2>

            {/* Navigation */}
            <nav style={{ display: "flex", gap: "25px" }}>
                <Link to="/shop" style={{ color: "white", textDecoration: "none" }}>Shop</Link>
                <Link to="/about-us" style={{ color: "white", textDecoration: "none" }}>About Us</Link>
                <Link to="/privacy-policy" style={{ color: "white", textDecoration: "none" }}>Privacy Policy</Link>
                <Link to="/terms-and-condition" style={{ color: "white", textDecoration: "none" }}>Terms</Link>
            </nav>
        </header>
    );
}

``` 
# resource/js/layout/Footer.jsx

```php
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer
            style={{
                marginTop: "40px",
                padding: "50px 25px",     // 🔥 footer height increased
                background: "#00000006",
                textAlign: "center",
                borderTop: "1px solid #ddd",
                fontSize: "18px", 
                height: "400px",         // 🔥 bigger text
            }}
        >
            <p style={{ marginBottom: "20px", fontSize: "20px" }}>
                © {new Date().getFullYear()} MyStore. All Rights Reserved.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "30px", fontSize: "18px" }}>
                <Link to="/about-us">About Us</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-and-condition">Terms & Conditions</Link>
            </div>
        </footer>
    );
}

``` 
# Now Create Adminlayout.jsx file into resource/js/layout/   folder:
# resource/js/layout/Adminlayout.jsx

```php
export default function AdminLayout({ children }) {
    return (
        <div>
            {children}
        </div>
    );
}

``` 


# Now Create Mainlayout.jsx file into resource/js/layout/   folder:

# resource/js/layout/Mainlayout.jsx

```php
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }) {
    return (
        <>
            <Header />

            <div style={{ minHeight: "80vh", paddingTop: "90px" }}>
                {children}
            </div>

            <Footer />
        </>
    );
}

``` 
# UPDATE app.jsx (MOST IMPORTANT)

```php
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

import ProductIndex from "./pages/products/index";
import ProductCreate from "./pages/products/create";
import ProductEdit from "./pages/products/edit";

import LegalPageIndex from "./pages/legalpage/index";
import LegalPageCreate from "./pages/legalpage/create";
import LegalPageEdit from "./pages/legalpage/edit";

import AboutUs from "./pages/legalpage/AboutUs";
import PrivacyPolicy from "./pages/legalpage/PrivacyPolicy";
import TermsAndCondition from "./pages/legalpage/TermsAndCondition";

import CustomerHome from "./pages/customer/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ---------------- ADMIN (NO HEADER/FOOTER) ---------------- */}
                <Route path="/" element={<AdminLayout><ProductIndex /></AdminLayout>} />
                <Route path="/create" element={<AdminLayout><ProductCreate /></AdminLayout>} />
                <Route path="/edit/:id" element={<AdminLayout><ProductEdit /></AdminLayout>} />

                {/* ---------------- LEGAL CRUD (NO HEADER/FOOTER) ---------------- */}
                <Route path="/legal-pages" element={<AdminLayout><LegalPageIndex /></AdminLayout>} />
                <Route path="/legal-pages/create" element={<AdminLayout><LegalPageCreate /></AdminLayout>} />
                <Route path="/legal-pages/edit/:id" element={<AdminLayout><LegalPageEdit /></AdminLayout>} />

                {/* ---------------- CUSTOMER PAGES (WITH HEADER/FOOTER) ---------------- */}
                <Route path="/shop" element={<MainLayout><CustomerHome /></MainLayout>} />

                <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} />
                <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
                <Route path="/terms-and-condition" element={<MainLayout><TermsAndCondition /></MainLayout>} />

                {/* ---------------- FALLBACK ---------------- */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("app")).render(<App />);
``` 
# Now Run server in terminal 
```php
npm run build
mpn run dev
php artisan serve
``` 
# And paste this url http://127.0.0.1:8000/about-us and show the header and footer part from all pages.
<img width="1894" height="859" alt="image" src="https://github.com/user-attachments/assets/3f93f1c0-218f-4622-8e6b-0226ae397a96" />

