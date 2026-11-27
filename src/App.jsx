import { useMemo, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Wallet, ShoppingCart, Receipt, PackageX, TrendingUp } from "lucide-react";
import { orders, categories, channels, namaBulan } from "./data/ecommerceData";
import KpiCard from "./components/KpiCard";
import "./App.css";

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);

const WARNA = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];
const tip = { backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 };

export default function App() {
  const [kategori, setKategori] = useState("Semua");
  const [channel, setChannel] = useState("Semua");

  const d = useMemo(() => {
    const filtered = orders.filter(
      (o) =>
        (kategori === "Semua" || o.kategori === kategori) &&
        (channel === "Semua" || o.channel === channel)
    );
    const selesai = filtered.filter((o) => o.status === "Selesai");
    const pendapatan = selesai.reduce((a, o) => a + o.total, 0);

    const bulanan = namaBulan.map((bulan, i) => {
      const s = selesai.filter((o) => o.bulan === i);
      return {
        bulan,
        pendapatan: Math.round(s.reduce((a, o) => a + o.total, 0) / 1_000_000),
        pesanan: s.length,
      };
    });

    const group = (key) => {
      const acc = {};
      selesai.forEach((o) => { acc[o[key]] = (acc[o[key]] || 0) + o.total; });
      return Object.entries(acc).map(([name, v]) => ({
        name, value: Math.round(v / 1_000_000),
      }));
    };

    const pm = {};
    selesai.forEach((o) => {
      if (!pm[o.produk]) pm[o.produk] = { nama: o.produk, kategori: o.kategori, unit: 0, omzet: 0 };
      pm[o.produk].unit += o.jumlah;
      pm[o.produk].omzet += o.total;
    });
    const topProduk = Object.values(pm).sort((a, b) => b.omzet - a.omzet).slice(0, 5);

    return {
      pendapatan,
      jumlahPesanan: selesai.length,
      aov: selesai.length ? pendapatan / selesai.length : 0,
      batal: filtered.length ? ((filtered.length - selesai.length) / filtered.length) * 100 : 0,
      bulanan,
      perKategori: group("kategori"),
      perChannel: group("channel"),
      topProduk,
    };
  }, [kategori, channel]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1><TrendingUp /> E-Commerce Analytics Dashboard</h1>
          <p>Analisis penjualan menggunakan data sintetis · Tahun 2025</p>
        </div>
        <div className="filters">
          <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
            <option>Semua</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option>Semua</option>
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