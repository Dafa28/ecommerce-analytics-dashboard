import { useMemo, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Wallet, ShoppingCart, Receipt, PackageX, TrendingUp, Lightbulb,
} from "lucide-react";
import { orders, categories, channels, namaBulan } from "./data/ecommerceData";
import KpiCard from "./components/KpiCard";
import "./App.css";

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);

const WARNA = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];
const tip = { backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 };
const kuartal = (bulan) => `Q${Math.floor(bulan / 3) + 1}`;
const top = (arr) =>
  arr.length ? arr.reduce((a, b) => (b.value > a.value ? b : a)) : null;

export default function App() {
  const [kategori, setKategori] = useState("Semua");
  const [channel, setChannel] = useState("Semua");
  const [periode, setPeriode] = useState("Semua");

  const d = useMemo(() => {
    const filtered = orders.filter(
      (o) =>
        (kategori === "Semua" || o.kategori === kategori) &&
        (channel === "Semua" || o.channel === channel) &&
        (periode === "Semua" || kuartal(o.bulan) === periode)
    );
    const selesai = filtered.filter((o) => o.status === "Selesai");
    const pendapatan = selesai.reduce((a, o) => a + o.total, 0);

    const bulanan = namaBulan
      .map((bulan, i) => {
        const s = selesai.filter((o) => o.bulan === i);
        return {
          bulan,
          q: kuartal(i),
          pendapatan: Math.round(s.reduce((a, o) => a + o.total, 0) / 1_000_000),
        };
      })
      .filter((b) => periode === "Semua" || b.q === periode);

    const group = (key) => {
      const acc = {};
      selesai.forEach((o) => { acc[o[key]] = (acc[o[key]] || 0) + o.total; });
      return Object.entries(acc).map(([name, v]) => ({
        name, value: Math.round(v / 1_000_000),
      }));
    };
    const perKategori = group("kategori");
    const perChannel = group("channel");
    const perWilayah = group("wilayah").sort((a, b) => b.value - a.value);

    const pm = {};
    selesai.forEach((o) => {
      if (!pm[o.produk]) pm[o.produk] = { nama: o.produk, kategori: o.kategori, unit: 0, omzet: 0 };
      pm[o.produk].unit += o.jumlah;
      pm[o.produk].omzet += o.total;
    });
    const topProduk = Object.values(pm).sort((a, b) => b.omzet - a.omzet).slice(0, 5);

    // Insight otomatis
    const insight = [];
    const bulanTerbaik = bulanan.reduce(
      (a, b) => (b.pendapatan > a.pendapatan ? b : a), { pendapatan: 0 }
    );
    if (bulanTerbaik.pendapatan > 0)
      insight.push(`Bulan terbaik: ${bulanTerbaik.bulan} dengan pendapatan Rp ${bulanTerbaik.pendapatan} juta.`);
    const tk = top(perKategori);
    if (tk && perKategori.length > 1)
      insight.push(`Kategori terkuat: ${tk.name} (${Math.round((tk.value / (pendapatan / 1_000_000)) * 100)}% dari total pendapatan).`);
    const tc = top(perChannel);
    if (tc && perChannel.length > 1)
      insight.push(`Channel penjualan utama: ${tc.name} dengan Rp ${tc.value} juta.`);
    const tw = top(perWilayah);
    if (tw)
      insight.push(`Wilayah dengan pendapatan tertinggi: ${tw.name}.`);
    if (topProduk[0])
      insight.push(`Produk terlaris: ${topProduk[0].nama} (${topProduk[0].unit} unit).`);

    return {
      pendapatan,
      jumlahPesanan: selesai.length,
      aov: selesai.length ? pendapatan / selesai.length : 0,
      batal: filtered.length ? ((filtered.length - selesai.length) / filtered.length) * 100 : 0,
      bulanan, perKategori, perChannel, perWilayah, topProduk, insight,
    };
  }, [kategori, channel, periode]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1><TrendingUp /> E-Commerce Analytics Dashboard</h1>
          <p>Analisis penjualan menggunakan data sintetis · Tahun 2025</p>
        </div>
        <div className="filters">
          <select value={periode} onChange={(e) => setPeriode(e.target.value)}>
            <option value="Semua">Semua Periode</option>
            <option value="Q1">Kuartal 1 (Jan–Mar)</option>
            <option value="Q2">Kuartal 2 (Apr–Jun)</option>
            <option value="Q3">Kuartal 3 (Jul–Sep)</option>
            <option value="Q4">Kuartal 4 (Okt–Des)</option>
          </select>
          <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
            <option value="Semua">Semua Kategori</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value="Semua">Semua Channel</option>
            {channels.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </header>

      <section className="kpis">
        <KpiCard icon={Wallet} label="Total Pendapatan" value={rupiah(d.pendapatan)} />
        <KpiCard icon={ShoppingCart} label="Pesanan Selesai" value={d.jumlahPesanan} />
        <KpiCard icon={Receipt} label="Rata-rata Nilai Pesanan" value={rupiah(d.aov)} />
        <KpiCard icon={PackageX} label="Tingkat Batal/Retur" value={`${d.batal.toFixed(1)}%`} />
      </section>

      <section className="grid">
        <div className="panel wide">
          <h3>Tren Pendapatan Bulanan (juta Rp)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={d.bulanan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="bulan" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={tip} formatter={(v) => `Rp ${v} jt`} />
              <Line type="monotone" dataKey="pendapatan" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Pendapatan per Kategori (juta Rp)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.perKategori}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={tip} formatter={(v) => `Rp ${v} jt`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {d.perKategori.map((_, i) => <Cell key={i} fill={WARNA[i % WARNA.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Pendapatan per Channel</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={d.perChannel} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {d.perChannel.map((_, i) => <Cell key={i} fill={WARNA[i % WARNA.length]} />)}
              </Pie>
              <Tooltip contentStyle={tip} formatter={(v) => `Rp ${v} jt`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Pendapatan per Wilayah (juta Rp)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.perWilayah} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" width={95} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tip} formatter={(v) => `Rp ${v} jt`} />
              <Bar dataKey="value" fill="#22c55e" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3 className="title-icon"><Lightbulb size={20} /> Insight Otomatis</h3>
          {d.insight.length ? (
            <ul className="insights">
              {d.insight.map((t) => <li key={t}>{t}</li>)}
            </ul>
          ) : (
            <p className="empty">Tidak ada data untuk filter ini.</p>
          )}
        </div>

        <div className="panel wide">
          <h3>5 Produk Terlaris</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Produk</th><th>Kategori</th><th>Unit Terjual</th><th>Omzet</th></tr>
              </thead>
              <tbody>
                {d.topProduk.map((p) => (
                  <tr key={p.nama}>
                    <td>{p.nama}</td><td>{p.kategori}</td><td>{p.unit}</td><td>{rupiah(p.omzet)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="footer">Data bersifat sintetis (dibuat untuk simulasi) · Dibuat oleh Dafa Syahdan Maulana</footer>
    </div>
  );
}