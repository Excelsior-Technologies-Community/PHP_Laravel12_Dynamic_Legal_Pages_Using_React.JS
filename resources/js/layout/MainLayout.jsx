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
