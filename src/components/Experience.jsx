import { Briefcase, GraduationCap } from "lucide-react";

const items = [
  { icon: Briefcase, title: "Admin E-Commerce", place: "PT. Algipin Indonesia MFX" },
  { icon: Briefcase, title: "Front Office", place: "Hotel Parahyangan" },
  { icon: Briefcase, title: "Magang", place: "Pusat Zakat Umat" },
  { icon: GraduationCap, title: "Teknik Komputer dan Jaringan Telekomunikasi", place: "SMK Persis 02 Kota Bandung (2021–2024)" },
];

export default function Experience() {
  return (
    <section id="pengalaman" className="section">
      <h2>Pengalaman & Pendidikan</h2>
      <div className="timeline">
        {items.map(({ icon: Icon, title, place }) => (
          <div className="card row" key={title}>
            <Icon />
            <div>
              <h3>{title}</h3>
              <span>{place}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}