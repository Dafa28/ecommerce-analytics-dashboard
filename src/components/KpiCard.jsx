export default function KpiCard({ icon: Icon, label, value }) {
  return (
    <div className="kpi">
      <div className="kpi-icon"><Icon size={22} /></div>
      <div>
        <span>{label}</span>
        <h3>{value}</h3>
      </div>
    </div>
  );
}
