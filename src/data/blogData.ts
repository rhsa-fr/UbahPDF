export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  readTime: string;
  publishedDate: string;
  datePublishedISO: string;
  author: string;
  relatedToolId: string;
  summary: string;
  content: {
    intro: string;
    sections: {
      h2: string;
      paragraphs: string[];
      bullets?: string[];
    }[];
    ctaText: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'cara-kompres-pdf-200kb-cpns-bumn',
    title: 'Cara Kompres PDF 200KB / 300KB Untuk CPNS & BUMN (100% Gratis & Aman)',
    metaDescription: 'Panduan lengkap cara mengecilkan ukuran file PDF menjadi 200KB atau 300KB untuk pendaftaran CPNS, BUMN, dan lamaran kerja tanpa merusak kualitas teks.',
    keywords: ['kompres pdf 200kb', 'kompres pdf cpns', 'kecilkan pdf bumn', 'kompres pdf 300kb online', 'cara mengecilkan pdf'],
    category: 'Pendaftaran & Lamaran',
    readTime: '3 menit baca',
    publishedDate: '6 Agustus 2026',
    datePublishedISO: '2026-08-06',
    author: 'Tim UbahPDF',
    relatedToolId: 'compress-pdf',
    summary: 'Syarat ukuran dokumen PDF pada portal SSCASN CPNS dan Rekrutmen Bersama BUMN sangat ketat. Pelajari cara mengecilkan file PDF hingga di bawah 200KB tanpa buram.',
    content: {
      intro: 'Setiap kali pembukaan seleksi CPNS (SSCASN) maupun Rekrutmen Bersama BUMN dibuka, salah satu kendala utama yang sering dialami pelamar adalah ukuran dokumen PDF yang terlalu besar. Dokumen seperti e-KTP, Ijazah, Transkrip Nilai, dan Surat Lamaran sering kali melebihi batas 200KB atau 300KB yang ditentukan portal pendaftaran.',
      sections: [
        {
          h2: 'Mengapa Dokumen CPNS & BUMN Dibatasi Ukurannya?',
          paragraphs: [
            'Server pendaftaran nasional menerima jutaan berkas pendaftaran secara bersamaan. Untuk menjaga server tetap cepat dan mencegah crash, instansi menetapkan batas maksimal ukuran berkas (biasanya 200KB, 300KB, atau 500KB per file).',
            'Tangan pertama penyeleksi administrasi adalah sistem verifikasi otomatis. Jika ukuran file Anda melebihi limit meski hanya 1KB, sistem akan otomatis menolak unggahan berkas Anda.'
          ]
        },
        {
          h2: 'Langkah Mudah Kompres PDF ke 200KB di UbahPDF',
          paragraphs: [
            'Di UbahPDF, Anda tidak perlu mengunduh aplikasi tambahan atau khawatir dokumen rahasia Anda bocor ke internet. Seluruh proses kompresi dilakukan secara lokal di browser Anda.'
          ],
          bullets: [
            'Buka alat Kompres PDF di UbahPDF.',
            'Pilih atau seret berkas PDF ijazah/transkrip yang ingin dikecilkan.',
            'Sistem akan otomatis mengompresi struktur internal PDF tanpa buram.',
            'Klik tombol Unduh dan cek ukuran file yang baru.'
          ]
        },
        {
          h2: 'Tips Agar PDF Hasil Kompres Tetap Jelas & Tidak Buram',
          paragraphs: [
            'Pastikan dokumen asli hasil scan awal tidak terlalu buram. Gunakan pemindai (scanner) dengan resolusi minimal 200 DPI.',
            'Jangan melakukan screenshot berulang kali karena screenshot akan menambah bintik noise yang memperbesar ukuran file gambar.'
          ]
        }
      ],
      ctaText: 'Kecilkan Ukuran Dokumen CPNS Anda Sekarang di Tool Compress PDF UbahPDF'
    }
  },
  {
    id: '2',
    slug: 'cara-gabung-ijazah-transkrip-pdf',
    title: 'Cara Menggabungkan Ijazah dan Transkrip Nilai Jadi Satu File PDF',
    metaDescription: 'Cara praktis menyatukan berkas Ijazah, Transkrip Nilai, dan SKCK menjadi satu file PDF utuh dengan urutan rapi secara online dan gratis.',
    keywords: ['gabung ijazah dan transkrip pdf', 'cara menggabungkan pdf', 'merge ijazah transkrip', 'satukan pdf online'],
    category: 'Panduan Dokumen',
    readTime: '2 menit baca',
    publishedDate: '6 Agustus 2026',
    datePublishedISO: '2026-08-06',
    author: 'Tim UbahPDF',
    relatedToolId: 'merge-pdf',
    summary: 'Banyak syarat lamaran kerja mengharuskan Ijazah dan Transkrip Nilai digabung dalam satu lembar PDF. Simak langkah cepat menggabungkannya.',
    content: {
      intro: 'Saat melamar pekerjaan di perusahaan swasta maupun instansi pemerintah, form lamaran sering kali hanya menyediakan satu kolom unggahan untuk "Ijazah & Transkrip Nilai". Jika Anda mengunggahnya secara terpisah, berkas sebelumnya akan tertimpa.',
      sections: [
        {
          h2: 'Urutan Standar Penggabungan Berkas Pendidikan',
          paragraphs: [
            'Agar berkas Anda terlihat profesional di mata HRD, susun dokumen dengan urutan berikut:'
          ],
          bullets: [
            'Halaman 1: Ijazah Asli / Surat Keterangan Lulus (SKL)',
            'Halaman 2: Transkrip Nilai Lembar 1',
            'Halaman 3: Transkrip Nilai Lembar 2 (jika ada)',
            'Halaman 4: Sertifikat Akreditasi Jurusan/Kampus (opsional)'
          ]
        },
        {
          h2: 'Cara Menggabungkan PDF di UbahPDF',
          paragraphs: [
            'Menggabungkan file PDF di UbahPDF sangat mudah dan instan.'
          ],
          bullets: [
            'Buka tool Merge PDF di UbahPDF.',
            'Pilih file Ijazah dan Transkrip dari perangkat Anda.',
            'Geser dan susun urutan halaman sesuai keinginan.',
            'Klik Gabung PDF dan unduh hasilnya.'
          ]
        }
      ],
      ctaText: 'Gabungkan Ijazah & Transkrip Anda Sekarang di Tool Merge PDF UbahPDF'
    }
  },
  {
    id: '3',
    slug: 'cara-ubah-foto-ktp-ke-pdf',
    title: 'Cara Mengubah Foto KTP & Pas Foto HP Menjadi File PDF Rapi',
    metaDescription: 'Panduan ubah gambar JPG, PNG, atau hasil foto HP menjadi file PDF berkualitas tinggi tanpa aplikasi tambahan dan bebas watermark.',
    keywords: ['ubah foto ktp ke pdf', 'jpg to pdf hp', 'foto ke pdf gratis', 'cara membuat pdf dari gambar'],
    category: 'Tips & Trik',
    readTime: '2 menit baca',
    publishedDate: '6 Agustus 2026',
    datePublishedISO: '2026-08-06',
    author: 'Tim UbahPDF',
    relatedToolId: 'image-to-pdf',
    summary: 'Punya foto KTP atau Pas Foto di galeri HP dan perlu diubah jadi PDF? Ikuti panduan cepat mengubah gambar JPG/PNG ke PDF rapi.',
    content: {
      intro: 'Mengambil foto dokumen menggunakan kamera HP adalah cara tersimpel saat ini. Namun, sebagian besar form pendaftaran mewajibkan berkas diunggah dalam format dokumen PDF, bukan format gambar JPG atau PNG.',
      sections: [
        {
          h2: 'Kelebihan Mengonversi Gambar ke PDF',
          paragraphs: [
            'Format PDF menjaga rasio dan dimensi gambar agar saat dibuka oleh penyeleksi di komputer, tampilan foto tidak terdistorsi atau terpotong.',
            'Selain itu, berkas PDF menjamin kerahasiaan dokumen karena tidak mudah tersimpan tidak sengaja di galeri publik.'
          ]
        },
        {
          h2: 'Langkah Mengubah Foto ke PDF di HP & Komputer',
          paragraphs: [
            'Tanpa perlu mengunduh aplikasi converter yang penuh iklan, Anda bisa langsung membukanya di UbahPDF:'
          ],
          bullets: [
            'Masuk ke alat JPG/PNG to PDF di UbahPDF.',
            'Pilih foto KTP atau pas foto dari galeri HP / file laptop.',
            'Atur orientasi halaman (Portrait atau Landscape).',
            'Klik Konversi ke PDF dan simpan hasilnya.'
          ]
        }
      ],
      ctaText: 'Ubah Foto Gambar Anda Jadi PDF Sekarang di Tool JPG to PDF UbahPDF'
    }
  },
  {
    id: '4',
    slug: 'cara-konversi-pdf-ke-word-gratis',
    title: 'Cara Mengubah PDF ke Word (.docx) Tanpa Aplikasi & Bebas Berantakan',
    metaDescription: 'Cara mudah mengonversi file dokumen PDF menjadi file Word docx yang bisa diedit ulang tanpa merusak susunan paragraf.',
    keywords: ['pdf to word gratis', 'ubah pdf ke word', 'konversi pdf ke docx', 'cara edit pdf di word'],
    category: 'Panduan Dokumen',
    readTime: '3 menit baca',
    publishedDate: '6 Agustus 2026',
    datePublishedISO: '2026-08-06',
    author: 'Tim UbahPDF',
    relatedToolId: 'pdf-to-word',
    summary: 'Perlu mengedit teks dari file PDF yang terkunci? Pelajari cara mengonversi PDF ke Microsoft Word (.docx) dengan cepat dan akurat.',
    content: {
      intro: 'Sering kali kita menerima dokumen PDF seperti draft surat, tugas kuliah, atau materi rapat yang perlu direvisi. Karena PDF dirancang untuk dibaca dan dicetak, mengeditnya langsung di PDF cukup sulit.',
      sections: [
        {
          h2: 'Solusi Terbaik: Ekstrak PDF ke Word (.docx)',
          paragraphs: [
            'Dengan mengonversi berkas PDF menjadi format Word (.docx), Anda dapat bebas menambah teks, merapikan font, serta mengedit paragraf di Microsoft Word atau Google Docs.'
          ]
        },
        {
          h2: 'Cara Konversi PDF ke Word di UbahPDF',
          paragraphs: [
            'Proses ekstraksi dilakukan secara otomatis oleh algoritma pintar UbahPDF:'
          ],
          bullets: [
            'Buka fitur PDF to Word di UbahPDF.',
            'Unggah berkas PDF yang ingin diubah.',
            'Klik Mulai Konversi dan tunggu beberapa detik.',
            'Unduh berkas .docx dan buka di Microsoft Word.'
          ]
        }
      ],
      ctaText: 'Konversi Berkas PDF Anda ke Word Sekarang di Tool PDF to Word UbahPDF'
    }
  }
];
