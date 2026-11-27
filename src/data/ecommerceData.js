// Generator angka acak dengan seed tetap, supaya data selalu sama
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

export const namaBulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
export const categories = ["Fashion", "Elektronik", "Rumah Tangga", "Kecantikan", "Olahraga"];
export const channels = ["Marketplace", "Website", "Instagram", "WhatsApp"];
const regions = ["Jawa Barat", "DKI Jakarta", "Jawa Tengah", "Jawa Timur", "Luar Jawa"];

const products = [
  { nama: "Kaos Polos Premium", kategori: "Fashion", harga: 85000 },
  { nama: "Jaket Hoodie", kategori: "Fashion", harga: 210000 },
  { nama: "Earbuds Wireless", kategori: "Elektronik", harga: 275000 },
  { nama: "Powerbank 10000mAh", kategori: "Elektronik", harga: 180000 },
  { nama: "Rak Susun Minimalis", kategori: "Rumah Tangga", harga: 150000 },
  { nama: "Set Alat Makan", kategori: "Rumah Tangga", harga: 120000 },
  { nama: "Serum Wajah", kategori: "Kecantikan", harga: 95000 },
  { nama: "Sunscreen SPF 50", kategori: "Kecantikan", harga: 70000 },
  { nama: "Matras Yoga", kategori: "Olahraga", harga: 130000 },
  { nama: "Botol Minum 1L", kategori: "Olahraga", harga: 60000 },
];

export const orders = Array.from({ length: 1500 }, (_, i) => {
  const produk = pick(products);
  const bulan = Math.min(11, Math.floor(Math.pow(rand(), 0.8) * 12)); // penjualan naik di akhir tahun
  const jumlah = 1 + Math.floor(rand() * 3);
  const r = rand();
  const status = r < 0.88 ? "Selesai" : r < 0.95 ? "Dibatalkan" : "Retur";
  return {
    id: `ORD-${1000 + i}`,
    bulan,
    produk: produk.nama,
    kategori: produk.kategori,
    channel: pick(channels),
    wilayah: pick(regions),
    jumlah,
    total: produk.harga * jumlah,
    status,
  };
});