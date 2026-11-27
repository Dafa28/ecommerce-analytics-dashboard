import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { monthlySales, categorySales } from "../data/ecommerceData";

export default function Dashboard() {
  const totalPesanan = monthlySales.reduce((a, b) => a + b.pesanan, 0);
  const totalPenjualan = monthlySales.reduce((a, b) => a + b.penjualan, 0);

  return (
    <section id="dashboard" className="section">
      <h2>Proyek: Dashboard E-Commerce</h2>
      <p className="muted">Data sintetis untuk simulasi analisis penjualan.</p>

      <div className="stats">
        <div className="card">
          <ShoppingCart />
          <h3>{totalPesanan}</h3>
          <span>Total Pesanan</span>
        </div>
        <div className="card">
          <TrendingUp />
          <h3>Rp {totalPenjualan} jt</h3>
          <span>Total Penjualan</span>
        </div>
      </div>

      <div className="charts">
        <div className="card">
          <h3>Tren Penjualan Bulanan</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="penjualan" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Penjualan per Kategori</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categorySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kategori" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}