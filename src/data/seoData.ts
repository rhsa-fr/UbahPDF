export interface ToolSEOInfo {
  toolId: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  h1: string;
  subheading: string;
  steps: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export const SEO_DATA: Record<string, ToolSEOInfo> = {
  'merge-pdf': {
    toolId: 'merge-pdf',
    seoTitle: 'Gabung PDF Online Gratis - UbahPDF',
    seoDescription: 'Gabungkan beberapa file PDF menjadi satu dokumen utuh secara gratis, cepat, dan 100% aman langsung di browser tanpa upload ke server.',
    keywords: ['gabung pdf', 'merge pdf', 'cara menggabungkan pdf', 'gabungkan pdf online', 'merge pdf gratis'],
    h1: 'Gabungkan File PDF Secara Instan & Gratis',
    subheading: 'Kombinasikan beberapa dokumen PDF menjadi satu file rapi tanpa batasan jumlah file dan tanpa mengurangi kualitas.',
    steps: [
      { title: 'Pilih File PDF', desc: 'Klik tombol pilih file atau seret beberapa dokumen PDF yang ingin Anda gabungkan.' },
      { title: 'Atur Urutan', desc: 'Tarik dan posisikan urutan file sesuai keinginan Anda.' },
      { title: 'Gabungkan & Unduh', desc: 'Klik "Gabung PDF" dan unduh file hasil akhir secara instan.' }
    ],
    faqs: [
      { question: 'Apakah aman menggabungkan PDF di UbahPDF?', answer: 'Sangat aman! Seluruh pemrosesan dilakukan 100% di browser perangkat Anda. File tidak pernah diunggah ke server kami.' },
      { question: 'Apakah ada batasan jumlah file yang bisa digabung?', answer: 'Tidak ada batasan! Anda bisa menggabungkan berapa pun file PDF sesuai kemampuan browser Anda.' }
    ]
  },
  'compress-pdf': {
    toolId: 'compress-pdf',
    seoTitle: 'Kompres PDF Online Gratis 200KB / 100KB - UbahPDF',
    seoDescription: 'Kecilkan ukuran file PDF tanpa merusak kualitas teks dan gambar. Gratis, cepat, dan 100% aman langsung di browser.',
    keywords: ['kompres pdf', 'compress pdf', 'kecilkan ukuran pdf', 'kompres pdf 200kb', 'kompres pdf gratis'],
    h1: 'Kecilkan Ukuran File PDF Tanpa Merusak Kualitas',
    subheading: 'Kurangi ukuran dokumen PDF agar mudah dikirim via email atau diunggah ke portal pendaftaran.',
    steps: [
      { title: 'Unggah File PDF', desc: 'Pilih dokumen PDF yang ukurannya ingin Anda perkecil.' },
      { title: 'Pilih Tingkat Kompresi', desc: 'Sesuaikan tingkat kompresi sesuai kebutuhan Anda.' },
      { title: 'Unduh Hasil', desc: 'Unduh file PDF yang sudah terkompresi secara langsung.' }
    ],
    faqs: [
      { question: 'Apakah kualitas tulisan akan kabur saat dikompres?', answer: 'UbahPDF mengoptimalkan struktur dokumen tanpa merusak ketajaman teks.' },
      { question: 'Berapa persen ukuran file bisa berkurang?', answer: 'Bergantung pada konten dokumen (gambar/teks), file dapat berkurang hingga 50-80%.' }
    ]
  },
  'page-numbers': {
    toolId: 'page-numbers',
    seoTitle: 'Tambah Nomor Halaman PDF Online - UbahPDF',
    seoDescription: 'Tambahkan nomor halaman otomatis (angka Arab, Romawi, atau kustom) pada posisi mana pun di dokumen PDF Anda.',
    keywords: ['nomor halaman pdf', 'page number pdf', 'tambah penomoran pdf', 'nomor romawi pdf'],
    h1: 'Tambahkan Nomor Halaman pada Dokumen PDF',
    subheading: 'Beri nomor halaman otomatis pada makalah, skripsi, atau laporan dalam hitungan detik.',
    steps: [
      { title: 'Upload Dokumen', desc: 'Pilih file PDF yang ingin diberi penomoran.' },
      { title: 'Atur Format & Posisi', desc: 'Pilih format angka (1, 2, 3 atau i, ii, iii) serta letak nomor.' },
      { title: 'Terapkan & Simpan', desc: 'Simpan dokumen PDF yang sudah dilengkapi nomor halaman.' }
    ],
    faqs: [
      { question: 'Bisa pilih nomor halaman Romawi?', answer: 'Bisa! UbahPDF mendukung format penomoran Arab (1, 2, 3) dan Romawi (i, ii, iii / I, II, III).' }
    ]
  },
  'split-pdf': {
    toolId: 'split-pdf',
    seoTitle: 'Pisah PDF Online Gratis / Split PDF - UbahPDF',
    seoDescription: 'Pisahkan halaman PDF atau ekstrak rentang halaman tertentu secara gratis dan cepat langsung di browser.',
    keywords: ['pisah pdf', 'split pdf', 'potong pdf', 'ekstrak halaman pdf'],
    h1: 'Pisahkan Dokumen PDF Menjadi Beberapa Bagian',
    subheading: 'Potong file PDF berhalaman banyak atau ambil halaman tertentu saja secara fleksibel.',
    steps: [
      { title: 'Pilih File', desc: 'Unggah file PDF yang hendak dipisah.' },
      { title: 'Tentukan Halaman', desc: 'Masukkan rentang halaman yang ingin dipisahkan.' },
      { title: 'Proses & Download', desc: 'Dapatkan file PDF hasil pemisahan secara instan.' }
    ],
    faqs: [
      { question: 'Bisakah memisahkan halaman satu per satu?', answer: 'Ya, Anda dapat mengestrak setiap halaman menjadi file PDF terpisah.' }
    ]
  },
  'image-to-pdf': {
    toolId: 'image-to-pdf',
    seoTitle: 'Ubah JPG/PNG ke PDF Online Gratis - UbahPDF',
    seoDescription: 'Konversi foto JPG, PNG, atau WebP menjadi file dokumen PDF secara instan dan gratis tanpa watermark.',
    keywords: ['jpg to pdf', 'ubah foto ke pdf', 'png to pdf', 'gambar ke pdf', 'ubah jpg ke pdf online'],
    h1: 'Konversi Gambar (JPG, PNG) Menjadi File PDF',
    subheading: 'Ubah scan foto ijazah, KTP, atau dokumen gambar menjadi PDF siap kirim.',
    steps: [
      { title: 'Pilih Gambar', desc: 'Upload satu atau beberapa foto gambar sekaligus.' },
      { title: 'Urutkan Gambar', desc: 'Atur tata letak urutan halaman gambar.' },
      { title: 'Konversi ke PDF', desc: 'Klik konversi dan unduh dokumen PDF Anda.' }
    ],
    faqs: [
      { question: 'Apakah aman mengonversi foto KTP/Ijazah di sini?', answer: 'Sangat aman! Foto Anda diproses 100% lokal di browser, tidak diunggah ke server mana pun.' }
    ]
  },
  'pdf-to-image': {
    toolId: 'pdf-to-image',
    seoTitle: 'Konversi PDF ke JPG / PNG Online - UbahPDF',
    seoDescription: 'Ekstrak halaman dokumen PDF menjadi gambar resolusi tinggi (JPG/PNG) secara gratis dan aman.',
    keywords: ['pdf to jpg', 'pdf to png', 'ubah pdf ke gambar', 'ekstrak gambar pdf'],
    h1: 'Ubah Setiap Halaman PDF Menjadi Gambar',
    subheading: 'Simpan halaman PDF sebagai gambar foto JPG/PNG dengan resolusi tajam.',
    steps: [
      { title: 'Pilih File PDF', desc: 'Unggah dokumen PDF yang ingin diubah menjadi gambar.' },
      { title: 'Ekstrak Halaman', desc: 'Pilih format gambar output (JPG atau PNG).' },
      { title: 'Unduh Hasil', desc: 'Simpan hasil gambar ke perangkat Anda.' }
    ],
    faqs: [
      { question: 'Berapa kualitas gambar yang dihasilkan?', answer: 'Gambar diekstrak dalam resolusi HD sesuai dengan dokumen aslinya.' }
    ]
  },
  'pdf-to-word': {
    toolId: 'pdf-to-word',
    seoTitle: 'Konversi PDF ke Word (.docx) Gratis - UbahPDF',
    seoDescription: 'Ubah dokumen PDF menjadi file Word (.docx) atau Text (.txt) yang bisa diedit secara gratis dan instan.',
    keywords: ['pdf to word', 'konversi pdf ke word', 'ubah pdf ke docx', 'pdf to word gratis'],
    h1: 'Konversi PDF ke Word (.docx) Agar Mudah Diedit',
    subheading: 'Ekstrak isi teks dari file PDF menjadi dokumen Word secara cepat dan tepat.',
    steps: [
      { title: 'Pilih File PDF', desc: 'Unggah file PDF yang ingin dikonversi ke Word.' },
      { title: 'Mulai Konversi', desc: 'Proses ekstraksi teks akan berjalan otomatis.' },
      { title: 'Unduh File .docx', desc: 'Buka dan edit dokumen di Microsoft Word Anda.' }
    ],
    faqs: [
      { question: 'Apakah teks di Word bisa diedit?', answer: 'Ya, teks hasil ekstraksi dapat langsung diedit di Microsoft Word atau Google Docs.' }
    ]
  },
  'word-to-pdf': {
    toolId: 'word-to-pdf',
    seoTitle: 'Konversi Word (.docx) ke PDF Online - UbahPDF',
    seoDescription: 'Ubah dokumen Microsoft Word (.docx) menjadi file PDF rapi secara gratis dan instan di browser.',
    keywords: ['word to pdf', 'ubah word ke pdf', 'docx to pdf', 'konversi word ke pdf'],
    h1: 'Ubah Dokumen Word (.docx) Menjadi File PDF',
    subheading: 'Jadikan dokumen Word Anda berformat PDF agar tata letak dan font tidak berubah saat dibuka orang lain.',
    steps: [
      { title: 'Upload File Word', desc: 'Pilih file .docx dari perangkat Anda.' },
      { title: 'Konversi Instan', desc: 'Sistem merender dokumen Word menjadi PDF.' },
      { title: 'Unduh PDF', desc: 'Simpan file PDF siap cetak atau siap kirim.' }
    ],
    faqs: [
      { question: 'Apakah format dan margin tetap rapi?', answer: 'Ya, tata letak teks dan susunan paragraf akan dipertahankan presisi.' }
    ]
  },
  'rotate-pdf': {
    toolId: 'rotate-pdf',
    seoTitle: 'Putar Halaman PDF Online (Rotate PDF) - UbahPDF',
    seoDescription: 'Putar orientasi halaman PDF 90, 180, atau 270 derajat sesuai kebutuhan secara gratis.',
    keywords: ['rotate pdf', 'putar pdf', 'Ubah orientasi pdf', 'miringkan pdf'],
    h1: 'Putar Orientasi Halaman PDF Sesuai Keinginan',
    subheading: 'Perbaiki posisi halaman PDF yang terbalik atau miring dalam sekali klik.',
    steps: [
      { title: 'Pilih File PDF', desc: 'Upload file PDF yang orientasinya ingin diputar.' },
      { title: 'Rotasi Halaman', desc: 'Klik tombol putar ke kiri atau ke kanan.' },
      { title: 'Simpan PDF', desc: 'Unduh PDF dengan posisi halaman yang sudah benar.' }
    ],
    faqs: [
      { question: 'Bisakah memutar halaman tertentu saja?', answer: 'Bisa! Anda dapat memutar seluruh halaman atau halaman spesifik saja.' }
    ]
  },
  'watermark-pdf': {
    toolId: 'watermark-pdf',
    seoTitle: 'Tambah Watermark PDF Online Gratis - UbahPDF',
    seoDescription: 'Tambahkan cap atau teks watermark kustom pada dokumen PDF untuk melindungi hak cipta.',
    keywords: ['watermark pdf', 'tambah watermark pdf', 'cap pdf', 'protect copyright pdf'],
    h1: 'Beri Teks Watermark & Cap Pada Dokumen PDF',
    subheading: 'Lindungi dokumen penting Anda dari penyalahgunaan dengan stempel teks transparan.',
    steps: [
      { title: 'Upload PDF', desc: 'Pilih file PDF yang akan diberi cap.' },
      { title: 'Tulis Teks Watermark', desc: 'Masukkan kata-kata (misal: RAHASIA, DRAFT, milik Fulan).' },
      { title: 'Terapkan & Unduh', desc: 'Simpan dokumen PDF bertanda watermark.' }
    ],
    faqs: [
      { question: 'Apakah posisi watermark bisa disesuaikan?', answer: 'Ya, Anda dapat mengatur transparansi, ukuran font, dan posisi watermark.' }
    ]
  },
  'reorder-pdf': {
    toolId: 'reorder-pdf',
    seoTitle: 'Urutkan Halaman PDF Online / Rearrange - UbahPDF',
    seoDescription: 'Atur ulang posisi dan urutan halaman dokumen PDF secara visual dengan mudah dan cepat.',
    keywords: ['urutkan halaman pdf', 'reorder pdf', 'rearrange pdf pages', 'susun urutan pdf'],
    h1: 'Atur & Susun Ulang Urutan Halaman PDF',
    subheading: 'Pindahkan halaman PDF yang tertukar ke posisi yang benar secara visual.',
    steps: [
      { title: 'Upload File', desc: 'Buka dokumen PDF di UbahPDF.' },
      { title: 'Geser Halaman', desc: 'Drag dan drop halaman ke urutan baru.' },
      { title: 'Simpan PDF Baru', desc: 'Unduh hasil susunan halaman yang baru.' }
    ],
    faqs: [
      { question: 'Apakah mendukung drag and drop?', answer: 'Ya, Anda cukup menggeser thumbnail halaman ke posisi yang diinginkan.' }
    ]
  },
  'sign-pdf': {
    toolId: 'sign-pdf',
    seoTitle: 'Tanda Tangani PDF Online Gratis (Sign PDF) - UbahPDF',
    seoDescription: 'Buat atau upload tanda tangan digital dan tempelkan langsung di dokumen PDF secara 100% rahasia.',
    keywords: ['tanda tangan pdf', 'sign pdf', 'ttd pdf online', 'digital signature pdf'],
    h1: 'Tanda Tangani Dokumen PDF Secara Digital',
    subheading: 'Gambar tanda tangan Anda atau unggah gambar ttd lalu posisikan di lembar PDF.',
    steps: [
      { title: 'Buka Dokumen PDF', desc: 'Pilih file PDF yang butuh tanda tangan.' },
      { title: 'Buat Tanda Tangan', desc: 'Coret/gambar tanda tangan Anda di layar atau upload foto ttd.' },
      { title: 'Tempel & Simpan', desc: 'Posisikan ttd di tempat yang tepat lalu unduh.' }
    ],
    faqs: [
      { question: 'Apakah tanda tangan saya akan tersimpan di server?', answer: 'TIDAK! Tanda tangan diproses murni di perangkat Anda saja dan tidak dikirim ke mana pun.' }
    ]
  },
  'delete-pages': {
    toolId: 'delete-pages',
    seoTitle: 'Hapus Halaman PDF Online Gratis - UbahPDF',
    seoDescription: 'Hapus halaman lembar PDF yang tidak diinginkan dengan mudah dan cepat tanpa merusak sisa halaman.',
    keywords: ['hapus halaman pdf', 'delete pdf pages', 'buang halaman pdf'],
    h1: 'Hapus Lembar Halaman PDF yang Tidak Diperlukan',
    subheading: 'Hilangkan halaman kosong atau lembar yang salah dari dokumen PDF Anda.',
    steps: [
      { title: 'Unggah File PDF', desc: 'Pilih dokumen PDF yang ingin dibersihkan.' },
      { title: 'Pilih Halaman yang Dihapus', desc: 'Klik halaman-halaman yang hendak dibuang.' },
      { title: 'Simpan PDF Terbaru', desc: 'Unduh dokumen PDF bersih tanpa halaman yang dihapus.' }
    ],
    faqs: [
      { question: 'Bisakah menghapus beberapa halaman sekaligus?', answer: 'Tentu bisa, Anda cukup mengeklik semua halaman yang ingin dihapus.' }
    ]
  },
  'protect-pdf': {
    toolId: 'protect-pdf',
    seoTitle: 'Kunci & Lindungi PDF Dengan Password - UbahPDF',
    seoDescription: 'Beri kata sandi (password) pada dokumen PDF penting agar tidak bisa dibuka oleh orang sembarangan.',
    keywords: ['kunci pdf', 'protect pdf', 'password pdf', 'beri kata sandi pdf'],
    h1: 'Lindungi Dokumen PDF Dengan Kata Sandi',
    subheading: 'Amankan laporan keuangan, ijazah, atau dokumen rahasia Anda dengan enkripsi password.',
    steps: [
      { title: 'Pilih Dokumen PDF', desc: 'Upload file PDF yang akan dikunci.' },
      { title: 'Masukkan Password', desc: 'Ketik kata sandi perlindungan dokumen.' },
      { title: 'Enkripsi & Download', desc: 'Unduh file PDF yang sudah terenkripsi aman.' }
    ],
    faqs: [
      { question: 'Apakah enkripsi ini aman?', answer: 'Ya, enkripsi diproses secara standar keamanan dokumen tinggi langsung di browser Anda.' }
    ]
  }
};
