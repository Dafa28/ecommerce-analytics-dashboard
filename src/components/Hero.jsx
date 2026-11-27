import { ArrowDown, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero">
      <p className="tag">Portfolio</p>
      <h1>Dafa Syahdan Maulana</h1>
      <p className="subtitle">
        Lulusan SMK TKJT dengan pengalaman Admin E-Commerce, Front Office,
        dan kini belajar membangun website dengan React.
      </p>
      <div className="buttons">
        <a href="#dashboard" className="btn">
          Lihat Proyek <ArrowDown size={18} />
        </a>
        <a href="#kontak" className="btn outline">
          <Mail size={18} /> Hubungi Saya
        </a>
      </div>
    </section>
  );
}