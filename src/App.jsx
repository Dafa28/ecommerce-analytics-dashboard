import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Dashboard />
      <Experience />
      <Contact />
      <footer className="footer">© 2026 Dafa Syahdan Maulana</footer>
    </>
  );
}