import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="kontak" className="section center">
      <h2>Kontak</h2>
      <p className="muted">Tertarik bekerja sama? Hubungi saya.</p>
      <a className="btn" href="mailto:syahdandafa@gmail.com">
        <Mail size={18} /> syahdandafa@gmail.com
      </a>
    </section>
  );
}