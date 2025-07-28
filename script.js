// Ambil referensi elemen
const form = document.querySelector("form");
const tabel = document.getElementById("tabel_pengeluaran");
const tombolTotal = document.getElementById("tombol_total");
const pilihBulan = document.getElementById("pilih_bulan");
const outputTotal = document.getElementById("total_output");

// Ambil data dari localStorage saat halaman dibuka
let dataPengeluaran = JSON.parse(localStorage.getItem("pengeluaran")) || [];
tampilkanDataKeTabel();

// Format rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

// Fungsi tampilkan data ke tabel
function tampilkanDataKeTabel() {
  tabel.innerHTML = "";
  dataPengeluaran.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.deskripsi}</td>
      <td>${formatRupiah(item.nominal)}</td>
      <td><button onclick="hapusData(${index})">❌</button></td>
    `;

    tabel.appendChild(tr);
  });
}

// Fungsi simpan ke localStorage
function simpanKeLocalStorage() {
  localStorage.setItem("pengeluaran", JSON.stringify(dataPengeluaran));
}

// Fungsi hapus data
function hapusData(index) {
  dataPengeluaran.splice(index, 1);
  simpanKeLocalStorage();
  tampilkanDataKeTabel();
}

// Fungsi saat tombol submit ditekan
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const tanggal = document.getElementById("waktu").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const nominal = parseInt(document.getElementById("nominal").value);

  // Simpan ke array dan localStorage
  dataPengeluaran.push({ tanggal, deskripsi, nominal });
  simpanKeLocalStorage();
  tampilkanDataKeTabel();

  // Reset form
  form.reset();
});

// Fungsi hitung total berdasarkan bulan yang dipilih
tombolTotal.addEventListener("click", () => {
  const bulanDipilih = parseInt(pilihBulan.value);
  if (!bulanDipilih) {
    alert("Pilih bulan terlebih dahulu!");
    return;
  }

  const total = dataPengeluaran
    .filter((item) => {
      const tanggalObj = new Date(item.tanggal);
      return tanggalObj.getMonth() + 1 === bulanDipilih;
    })
    .reduce((sum, item) => sum + item.nominal, 0);

  outputTotal.textContent = formatRupiah(total);
});
