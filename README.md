# Laboratorium Bilangan Bulat

Aplikasi pembelajaran interaktif mobile-first untuk penjumlahan, pengurangan, perkalian, dan pembagian bilangan bulat.

## Pendekatan
- Penjumlahan: gabungkan kartu, buat pasangan nol, amati sisa.
- Pengurangan: ambil kartu, tambahkan pasangan nol bila kartu yang diperlukan belum tersedia.
- Perkalian: kelompok/penjumlahan berulang lalu pola tanda.
- Pembagian: hubungan invers dengan perkalian (fact family).

## Menjalankan
Buka `index.html` melalui local web server atau GitHub Pages. Tidak memerlukan backend.

## GitHub Pages
1. Upload seluruh isi folder ini ke repository.
2. Commit dan push ke branch `main`.
3. Repository Settings > Pages.
4. Source: Deploy from a branch.
5. Branch: `main`, folder `/ (root)`.

## Mengubah konten
- Teks umum/judul: `js/content.js`
- Penjumlahan: `js/addition.js`
- Pengurangan: `js/subtraction.js`
- Perkalian: `js/multiplication.js`
- Pembagian: `js/division.js`
- Evaluasi aktif/fallback: `js/quiz.js`
- Bank soal untuk pengembangan: `data/questions.json`
- Kartu bilangan: `js/integer-cards.js`
- Tampilan: `css/style.css`

## Progress
Disimpan di `localStorage` dengan namespace `integerLearning_progress_v1`. Tombol Reset Progress tersedia pada menu Progress.

## Catatan
`js/quiz.js` memuat bank soal fallback agar aplikasi tetap berfungsi ketika `questions.json` tidak dapat dimuat, misalnya saat file dibuka secara langsung. Untuk pengembangan berikutnya, bank soal dapat dipindahkan sepenuhnya ke JSON dan dimuat via `fetch` saat dijalankan di web server/GitHub Pages.

## Revisi pictorial dan drag-and-drop
Versi ini meniru pola visual aplikasi KPK/FPB rujukan: kartu pembelajaran, masalah kontekstual, progressive reveal, feedback langsung, dan aktivitas manipulatif. Penjumlahan/pengurangan tetap memakai kartu bilangan: positif biru dan negatif merah, ditata vertikal dengan area pasangan nol di tengah. Desktop mendukung drag-and-drop; HP juga memiliki fallback tap agar tetap nyaman.

Perkalian menggunakan konteks perubahan skor permainan. Pembagian menggunakan konteks pembagian perubahan saldo selama beberapa hari. Keduanya memakai objek pictorial yang dapat diseret.

## Pembaruan v9

- Tampilan diperbarui menjadi lebih modern dengan tipografi lebih jelas, kartu materi lebih rapi, dan feedback visual yang lebih kuat.
- Setelah jawaban eksplorasi benar, aplikasi menampilkan kalimat kesimpulan operasi, misalnya: `Jadi hasil dari 3 + 2 adalah 5.`
- Setelah Penjumlahan tersedia 5 latihan acak sebelum masuk ke Pengurangan.
- Setelah Pengurangan tersedia 5 latihan acak sebelum masuk ke Perkalian.
- Setelah Perkalian tersedia 5 contoh soal acak berbasis situasi sehari-hari sebelum masuk ke Pembagian.
- Setelah Pembagian tersedia 5 contoh soal acak berbasis situasi sehari-hari sebelum Evaluasi Akhir.
- Latihan menggunakan pilihan kartu/angka dan tidak memerlukan input keyboard.
- Pembagian acak selalu menghasilkan hasil bilangan bulat dan tidak menggunakan pembagi nol.

## Pembaruan v12
- Model matematika perkalian dan pembagian ditampilkan langsung pada contoh kontekstual.
- Pola perkalian menggunakan faktor 4, 3, 2, 1, 0, −1, −2 dengan faktor kedua −2 untuk menemukan negatif × negatif.
- Pola pembagian menggunakan pembagi −2 dan bergerak dari bilangan positif, 0, ke bilangan negatif untuk menemukan negatif ÷ negatif.
- Ditambahkan ringkasan visual aturan tanda dan trik tanda sama/tanda berbeda sebelum latihan.
