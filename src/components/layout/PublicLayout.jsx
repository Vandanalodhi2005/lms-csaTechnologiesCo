import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function PublicLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
