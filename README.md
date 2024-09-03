<p align="center">
   <img  src="./public/icon-192x192.png" />
   <h1 align="center">UNJ Timetable</h1>
</p>

Sesuai namanya, web ini adalah web yang dapat melakukan konversi data mentah Kartu Rencana Studi dari Web SIAKAD di Universitas Negeri Jakarta menjadi data yang lebih rapih dan dapat di konsumsi oleh mahasiswa.

Dibuat dengan tiga komponen utama yaitu astro, react, dan tailwind.

Projek ini merupakan sequel dari [jadwal-ssg](https://github.com/reacto11mecha/jadwal-ssg) yang memiliki goals yang sama, hanya saja pada lingkup SMA.

Untuk cara penggunaan bagi end user, silahkan kunjungi https://timetable.rmecha.my.id/, sudah dijelaskan fitur dan cara penggunannya.

## Kesini karena webnya bang

Sesuai yang tercantum, web ini mengolah data secara lokal pada perangkat pengunjung dan disimpan pada penyimpanan mereka. Semua pekerjaan berat terletak pada file [`submit-handler.ts`](./src/utils/submit-handler.ts), file yang akan berjalan ketika tombol `Tambah File` di tekan.

Runtutan teknis pembacaan file KRS kurang lebih seperti ini.

1. File yang di pilih akan dibaca konten teksnya, dilakukan serangkaian pengecekan, apakah file itu merupakan file `mhtml` atau bukan, apakah file itu berasal dari link `https://siakad.unj.ac.id/index.php/krs` atau bukan.

2. Dilakukan proses ekstraksi data (scraping) pada konten identitas mahasiswa pada konten `html` dari file `mhtml` yang sudah dicantumkan.

3. Membaca tabel dengan selector `table#dynamic-table` yang menyimpan informasi lengkap seputar jadwal perkuliahan. Tentu dilakukan serangkaian validasi kondisi supaya data konsisten dan mudah dalam pengembangan kedepannya.

4. Semua informasi yang sudah dibaca dari tabel akan di tampung ke array `tempGreedArray` sebagai tempat penampungan sementara sebelum data di restrukturisasi.

5. Pada proses restrukturisasi, semua data yang masih berantakan akan dirapihkan dan di sortir sesuai hari dan urutan jam yang runtut. Pengecekan data terakhir terjadi pada proses ini juga.

6. Jika semua sesuai, fungsi callback `successCallback` akan di eksekusi dan akan menyimpan data ke _Local Storage_ melalui fungsi `setKrsData` di dalam `onSubmit` pada file [`NoData.tsx`](./src/components/IndexPage/NoData.tsx).

## Ada ide?

Kalo punya usulan, kritik, atau, saran bisa open issue atau reach saya lewat kontak yang ada di https://rmecha.my.id, scroll ke paling bawah.

## Mau ikutan ngoding?

Projek ini pake Node.js sama PNPM sebagai package managernya.

Pertama-tama, fork dan clone repo ini dulu yaa.

```sh
# HTTPS
git clone https://github.com/{username}/{nama_repositori}.git

# SSH
git clone git@github.com:{username}/{nama_repositori}.git
```

Setelahnya, install semua dependencies yang dibutuhkan sama projek ini.

```sh
pnpm install
```

Untuk mode development, build, dan ingin melihat preview hasil build, berikut adalah perintahnya.

```sh
# Untuk masuk mode development
pnpm dev

# Untuk build project yang siap untuk digunakan
pnpm build

# Untuk pratinjau kondisi web sebelum naik ke production
pnpm preview
```

### Lisensi

Project ini bernaung di bawah lisensi [MIT](LICENSE).
