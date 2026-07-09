/* =========================================================
   MOBILE MENU TOGGLE
========================================================= */
const menuToggle = document.getElementById('menuToggle');
const navlist = document.getElementById('navlist');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navlist.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navlist.classList.remove('open');
  });
});

/* =========================================================
   ACTIVE NAV LINK ON SCROLL
========================================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink(){
  let current = '';
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height){
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`){
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveLink);

/* =========================================================
   BACK TO TOP
========================================================= */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500){
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   TYPING EFFECT (hero terminal line)
========================================================= */
const typeTarget = document.getElementById('typeTarget');
const phrases = ['whoami', 'ping uptime.dev -t', 'connect --secure'];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = phrases[phraseIndex];

  if (!deleting){
    typeTarget.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    typeTarget.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0){
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

/* =========================================================
   COUNT-UP STATS
========================================================= */
const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

function animateStats(){
  if (statsAnimated) return;
  statsAnimated = true;
  statNums.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      count += step;
      if (count >= target){
        count = target;
        clearInterval(timer);
      }
      el.textContent = count;
    }, 25);
  });
}

/* =========================================================
   SCROLL REVEAL (about, skills, services, projects, contact)
========================================================= */
const revealEls = document.querySelectorAll('.reveal');
const skillItems = document.querySelectorAll('.skill-item');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const fill = entry.target.querySelector('.skill-fill');
      const level = entry.target.getAttribute('data-level');
      fill.style.width = level + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillItems.forEach(el => skillObserver.observe(el));

const heroStatsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      animateStats();
      heroStatsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
const heroStatsEl = document.querySelector('.hero-stats');
if (heroStatsEl) heroStatsObserver.observe(heroStatsEl);

/* =========================================================
   CERTIFICATE HOVER PREVIEW (desktop / mouse devices only)
========================================================= */
const certHoverPreview = document.getElementById('certHoverPreview');
const certHoverImg = document.getElementById('certHoverImg');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canHover){
  let hoverTimer = null;

  document.querySelectorAll('.cert-card').forEach(card => {
    const btn = card.querySelector('.cert-thumb-btn');
    if (!btn) return;
    const fullSrc = btn.getAttribute('data-full');
    const title = btn.getAttribute('data-title');

    card.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        certHoverImg.src = fullSrc;
        certHoverImg.alt = title;
        certHoverPreview.classList.add('show');
      }, 120);
    });

    card.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      certHoverPreview.classList.remove('show');
    });
  });
}

/* =========================================================
   LIGHTBOX (sijil tunggal & galeri foto projek)
========================================================= */
const certLightbox = document.getElementById('certLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let galleryImages = [];
let galleryIndex = 0;
let galleryTitle = '';

function renderLightboxImage(){
  lightboxImg.src = galleryImages[galleryIndex];
  lightboxImg.alt = galleryTitle;
  lightboxTitle.textContent = galleryTitle;

  if (galleryImages.length > 1){
    lightboxPrev.classList.remove('hidden');
    lightboxNext.classList.remove('hidden');
    lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
  } else {
    lightboxPrev.classList.add('hidden');
    lightboxNext.classList.add('hidden');
    lightboxCounter.textContent = '';
  }
}

function openLightbox(images, title, startIndex = 0){
  galleryImages = images;
  galleryTitle = title;
  galleryIndex = startIndex;
  renderLightboxImage();
  certLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  certLightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev(){
  galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
  renderLightboxImage();
}

function showNext(){
  galleryIndex = (galleryIndex + 1) % galleryImages.length;
  renderLightboxImage();
}

/* Sijil (satu gambar, atau beberapa gambar untuk event yang sama via data-images) */
document.querySelectorAll('.cert-thumb-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.getAttribute('data-title');
    const imagesAttr = btn.getAttribute('data-images');

    let images;
    if (imagesAttr) {
      images = JSON.parse(imagesAttr);
    } else {
      images = [btn.getAttribute('data-full')];
    }

    openLightbox(images, title, 0);
  });
});

/* Galeri foto projek (banyak gambar) */
document.querySelectorAll('.project-gallery-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const images = JSON.parse(btn.getAttribute('data-images'));
    const title = btn.getAttribute('data-title');
    openLightbox(images, title, 0);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);
certLightbox.addEventListener('click', (e) => {
  if (e.target === certLightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!certLightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

/* =========================================================
   CASE STUDY MODAL (kisah penuh projek)
========================================================= */
const caseStudyData = {
  'net-001': {
    eyebrow: '#NET-001 — DEPLOYED',
    title: 'Redesign Rangkaian Kampus',
    tags: ['Cisco', 'VLAN', 'OSPF', 'ITT550', 'UiTM Jasin Melaka'],
    images: [
      'images/projects/net-001-photo-1.jpg',
      'images/projects/net-001-photo-2.jpg',
      'images/projects/net-001-photo-3.jpg',
      'images/projects/net-001-photo-4.jpg'
    ],
    body: [
      { type: 'p', text: 'Projek ini merupakan salah satu pengalaman yang paling bermakna sepanjang pengajian saya di Fakulti Sains Komputer dan Matematik (FSKM), UiTM Cawangan Melaka Kampus Jasin. Bersama rakan sepasukan, saya membangunkan satu cadangan reka bentuk semula infrastruktur rangkaian bagi menyokong keperluan semasa FSKM serta pembangunan bangunan baharu di Merlimau.' },

      { type: 'h4', text: 'Reka Bentuk & Pendekatan Teknikal' },
      { type: 'p', text: 'Sepanjang projek ini, saya terlibat dalam proses mereka bentuk seni bina rangkaian perusahaan yang lebih moden, stabil dan bersedia untuk dikembangkan pada masa hadapan. Cadangan kami menggunakan pendekatan rangkaian hierarki yang terdiri daripada Core, Distribution dan Access Layer, di samping penyusunan VLAN yang lebih sistematik bagi meningkatkan prestasi, kebolehskalaan dan pengurusan rangkaian.' },

      { type: 'quote', text: 'Aspek keselamatan turut diberi perhatian melalui cadangan mekanisme perlindungan bagi mengurangkan risiko seperti IP spoofing dan pencerobohan data.' },

      { type: 'h4', text: 'Persediaan & Bahan Sokongan' },
      { type: 'p', text: 'Bagi menyokong cadangan tersebut, kami menghasilkan reka bentuk rangkaian fizikal dan logikal, menjalankan analisis liputan rangkaian tanpa wayar menggunakan heatmap, serta menyediakan justifikasi teknikal dan anggaran kos pelaksanaan. Selain itu, poster projek dan model fizikal bangunan turut dibangunkan sebagai bahan visual untuk membantu panel penilai memahami keseluruhan penyelesaian yang dicadangkan.' },

      { type: 'h4', text: 'Pengajaran & Pengalaman' },
      { type: 'p', text: 'Projek ini bukan sahaja mengukuhkan pengetahuan saya dalam bidang reka bentuk dan pengurusan rangkaian perusahaan, malah meningkatkan kemahiran dalam penyelesaian masalah, komunikasi teknikal dan kerjasama berpasukan. Pengalaman ini memberi pendedahan yang lebih mendalam tentang bagaimana sesuatu infrastruktur rangkaian dirancang mengikut keperluan organisasi dengan mengambil kira aspek prestasi, keselamatan dan kebolehskalaan.' }
    ],
    team: ['Muhammad Izuddin Bin Mohd Rozi', 'Muhammad Alif Marzuki Bin Rizuan', 'Ikhwan Wafi Bin Azman', 'Mohamad Azim Irfan Firdaus Bin Mohd Azmi']
  },

  'net-002': {
    eyebrow: '#NET-002 — DEPLOYED',
    title: 'Makmal Konfigurasi Rangkaian Wayarles (BSS & ESS)',
    tags: ['Wireless', 'BSS/ESS', 'Access Point'],
    images: [
      'images/projects/net-002-photo-1.jpg',
      'images/projects/net-002-photo-2.jpg',
      'images/projects/net-002-photo-3.jpg',
      'images/projects/net-002-photo-4.jpg',
      'images/projects/net-002-photo-5.jpg',
      'images/projects/net-002-photo-6.jpg',
      'images/projects/net-002-photo-7.jpg'
    ],
    body: [
      { type: 'p', text: 'Makmal ini memberi tumpuan kepada konsep asas rangkaian wayarles enterprise iaitu Basic Service Set (BSS) dan Extended Service Set (ESS). Tujuan utama makmal ialah memahami bagaimana satu atau lebih access point boleh disusun untuk membentuk liputan wayarles yang berterusan dan boleh dipercayai untuk pengguna.' },

      { type: 'h4', text: 'Persediaan BSS' },
      { type: 'p', text: 'Fasa pertama melibatkan konfigurasi satu access point tunggal (BSS) untuk membolehkan peranti klien berhubung ke rangkaian yang sama melalui satu titik capaian. Parameter seperti SSID, kaedah pengesahan dan kod saluran (channel) dikonfigurasi secara manual untuk memastikan sambungan klien stabil.' },

      { type: 'h4', text: 'Pengembangan kepada ESS' },
      { type: 'p', text: 'Fasa seterusnya mengembangkan topologi kepada Extended Service Set dengan menambah access point kedua yang dikongsi SSID sama tetapi pada saluran berlainan bagi mengelakkan gangguan (interference). Ini membolehkan peranti klien beralih (roaming) antara access point tanpa terputus sambungan semasa bergerak dari satu kawasan liputan ke kawasan lain.' },

      { type: 'quote', text: 'Pengalaman langsung menyediakan access point dan menguji roaming klien memberi gambaran sebenar bagaimana liputan wayarles korporat direka pada skala lebih besar.' },

      { type: 'h4', text: 'Pengujian & Pengesahan' },
      { type: 'p', text: 'Sambungan klien diuji pada setiap fasa menggunakan ujian ping dan pengesanan kekuatan isyarat untuk mengesahkan liputan mencukupi dan tiada "dead zone" di antara access point. Hasil makmal ini mengukuhkan pemahaman terhadap pengoptimuman liputan rangkaian wayarles dalam persekitaran sebenar.' }
    ]
  },

  'net-003': {
    eyebrow: '#NET-003 — DEPLOYED',
    title: 'Image Steganography Detection Tool (ITT593)',
    tags: ['Python', 'Digital Forensics', 'Steganography', 'LSB Analysis', 'ITT593', 'UiTM'],
    images: [
      'images/projects/net-003-scan.png',
      'images/projects/net-003-visual.png',
      'images/projects/net-003-create.png',
      'images/projects/net-003-result.png'
    ],
    body: [
      { type: 'p', text: 'Projek ini dibangunkan untuk kursus ITT593 (Digital Forensic) di UiTM, bertujuan membangunkan satu alat forensik digital berasaskan Python yang mampu mengesan data tersembunyi dalam imej digital melalui teknik steganografi — khususnya kaedah Least Significant Bit (LSB). Alat ini dinamakan "Pro Forensic and Stego-Detector" dan mempunyai antara muka grafik gelap yang profesional menggunakan CustomTkinter.' },

      { type: 'h4', text: 'Masalah & Motivasi' },
      { type: 'p', text: 'Imej digital boleh digunakan sebagai medium untuk menyembunyikan maklumat sulit melalui steganografi — satu ancaman yang sukar dikesan menggunakan perisian forensik biasa. Perisian seperti FTK Imager hanya mampu menganalisis metadata dan header fail, bukan perubahan kecil pada peringkat bit piksel. Ini mencipta keperluan mendesak untuk alat yang boleh menjalankan analisis piksel secara automatik, berskala, dan mengekalkan integriti bukti digital.' },

      { type: 'h4', text: 'Seni Bina Alat & Reka Bentuk Modular' },
      { type: 'p', text: 'Alat ini direka bentuk secara modular terdiri daripada empat komponen utama: (1) Forensic Engine — mengendalikan penciptaan hash MD5/SHA-256, pengekstrakan metadata, dan steganalisis menggunakan LSB, Entropy, dan Chi-Square; (2) Steganography Engine — untuk menyembunyikan dan mengekstrak data tersembunyi menggunakan LSB; (3) User Interface — antara muka bertab (Scan, Visual, Create, Config) menggunakan CustomTkinter; dan (4) Reporting Module — menjana laporan PDF profesional dengan ReportLab.' },

      { type: 'h4', text: 'Teknik Pengesanan Steganografi' },
      { type: 'p', text: 'Tiga kaedah analisis digunakan secara serentak untuk mengira skor risiko (0–100): Entropy Analysis — mengukur kerawakan piksel (nilai >7.5 menunjukkan data sulit terenkripsi kemungkinan besar wujud); LSB Ratio Analysis — mengenal pasti taburan bit 0 dan 1 yang luar biasa dalam satah bit paling tidak bererti; dan Chi-Square Attack — ujian statistik untuk mengesan gangguan dalam frekuensi nilai piksel yang dijangka. Setiap imej dikategorikan sebagai CLEAN, SUSPICIOUS, atau HIGH RISK.' },

      { type: 'quote', text: 'Dalam ujian sebenar, imej yang mengandungi mesej tersembunyi berjaya dikesan dengan skor risiko sehingga 100, dan mesej tersebut berjaya diekstrak sepenuhnya oleh alat ini.' },

      { type: 'h4', text: 'Chain of Custody & Integriti Bukti' },
      { type: 'p', text: 'Alat ini beroperasi dalam mod baca-sahaja (read-only) untuk memastikan bukti asal tidak diubah. Setiap fail imej yang dianalisis diberikan cap jari kriptografi SHA-256 dan MD5 yang disimpan dalam rekod Chain of Custody (CoC). Penyiasat perlu memasukkan nama dan ID kes sebelum imbasan dimulakan, dan semua dapatan diarkibkan dalam laporan PDF rasmi yang mengandungi maklumat kes, jadual bukti, skor risiko dan pengisytiharan integriti.' },

      { type: 'h4', text: 'Keputusan & Kesimpulan' },
      { type: 'p', text: 'Alat ini berjaya membezakan imej bersih daripada imej yang telah dimanipulasi, mengekstrak mesej tersembunyi dengan tepat, dan mengesan sebarang perubahan melalui nilai hash SHA-256 yang berbeza. Projek ini membuktikan keupayaan Python dalam bidang forensik digital automatik dan menyerlahkan kepentingan analisis statistik peringkat bit untuk siasatan jenayah siber yang melibatkan penyembunyian maklumat dalam imej.' }
    ],
    team: ['Muhammad Izuddin Bin Mohd Rozi', 'Amelia Sabrina Binti Mohammed Sabri', 'Nur Asha Irdina Binti Md Heryzal']
  },

  'net-004': {
    eyebrow: '#NET-004 — DEPLOYED',
    title: 'Automasi Konfigurasi Rangkaian (ACL Automation)',
    tags: ['Python', 'Netmiko', 'ACL', 'ITT633', 'UiTM'],
    images: [
      'images/projects/net-004-topology.jpg'
    ],
    body: [
      { type: 'p', text: 'Projek ini dibangunkan bagi kursus ITT633 (Wide Area Network Technologies and Services) di UiTM, dengan objektif mengautomasikan konfigurasi Access Control List (ACL) merentasi rangkaian perusahaan berskala kecil yang terdiri daripada enam bahagian: HR, IT, Operator, Sales & Marketing, Server dan Guest — setiap satu pada subnet tersendiri.' },

      { type: 'h4', text: 'Masalah & Motivasi' },
      { type: 'p', text: 'Konfigurasi ACL secara manual terdedah kepada risiko kesilapan manusia seperti susunan rule permit/deny yang salah, wildcard mask yang tersilap taip, dan proses kemas kini yang perlu dilakukan peranti demi peranti — sesuatu yang tidak praktikal pada rangkaian besar. Automasi dipilih sebagai penyelesaian untuk memastikan dasar akses dikuatkuasakan secara konsisten dan tepat pada setiap router.' },

      { type: 'h4', text: 'Reka Bentuk Rangkaian' },
      { type: 'p', text: 'Topologi terdiri daripada tiga router Cisco (R1, R2, R3) sebagai gateway kepada enam subnet jabatan. Router1 menjadi gateway kepada HR (192.168.10.0/24) dan IT (192.168.20.0/24); Router2 menjadi router distribusi pusat yang menghubungkan Operator (192.168.30.0/24) dan Sales & Marketing (192.168.40.0/24); manakala Router3 menjadi gateway kepada Server (192.168.50.0/24) dan Guest (192.168.60.0/24).' },

      { type: 'h4', text: 'Automasi Menggunakan Python + Netmiko' },
      { type: 'p', text: 'Script Python menggunakan pustaka Netmiko dibangunkan untuk mewujudkan sambungan SSH ke setiap router dan menolak (push) konfigurasi ACL secara automatik — merangkumi ACL_HR, ACL_IT, ACL_OPERATOR, ACL_SM dan ACL_GUEST. Setiap ACL direka mengikut prinsip least-privilege: contohnya, Guest hanya dibenarkan akses ke Web Server melalui port 80/443 dan disekat sepenuhnya daripada File Server serta subnet dalaman yang lain.' },

      { type: 'quote', text: 'Pengesahan pos-automasi mengesahkan setiap ACL berjaya diterapkan dengan susunan permit/deny yang betul pada ketiga-tiga router tanpa sebarang kesilapan sintaks.' },

      { type: 'h4', text: 'Pengujian Fungsian' },
      { type: 'p', text: 'Ujian ping (ICMP) dan capaian HTTP dijalankan dari pelbagai peranti hujung untuk mengesahkan dasar akses berfungsi seperti dirancang — contohnya, Guest berjaya mengakses Web Server tetapi disekat daripada File Server, manakala staf HR disekat sepenuhnya daripada subnet Guest. Kesemua lapan senario ujian (T-1 hingga T-8) berjaya lulus mengikut hasil yang dijangka.' },

      { type: 'h4', text: 'Pengajaran & Cadangan Masa Hadapan' },
      { type: 'p', text: 'Projek ini menunjukkan automasi rangkaian mampu menguruskan konfigurasi keselamatan yang kompleks secara konsisten dan mengurangkan risiko kesilapan manusia berbanding kaedah manual. Cadangan penambahbaikan masa hadapan termasuk pengurusan inventori IP secara dinamik (baca dari fail CSV/Excel), pembangunan antara muka web mesra pengguna, serta integrasi dengan platform seperti Ansible untuk pengurusan konfigurasi yang lebih mantap.' }
    ],
    team: ['Muhammad Izuddin Bin Mohd Rozi', 'Aqief Daniel Bin Muhammad Nazir', 'Amer Hafiz Bin Azman', 'Izharris Farhan Bin Ahmad Badri']
  },

  'net-005': {
    eyebrow: '#NET-005 — DEPLOYED',
    title: 'Dashboard Monitoring Rangkaian',
    tags: ['Zabbix', 'SNMP', 'Grafana'],
    body: [
      { type: 'p', text: 'Projek ini melibatkan persediaan sistem pemantauan rangkaian secara real-time menggunakan Zabbix bagi memberi keterlihatan (visibility) berterusan terhadap kesihatan infrastruktur rangkaian merentasi seluruh cawangan organisasi.' },

      { type: 'h4', text: 'Pengumpulan Data' },
      { type: 'p', text: 'Protokol SNMP dikonfigurasi pada peranti rangkaian (router dan switch) untuk membolehkan Zabbix mengumpul metrik penting seperti status uptime, latency dan penggunaan bandwidth secara berkala tanpa gangguan kepada operasi rangkaian sedia ada.' },

      { type: 'h4', text: 'Visualisasi & Amaran' },
      { type: 'p', text: 'Data yang dikumpul dipaparkan melalui dashboard Grafana yang menyediakan graf dan trend prestasi rangkaian secara visual, membolehkan sebarang anomali seperti kejatuhan uptime atau lonjakan latency dikesan dengan lebih pantas berbanding pemeriksaan manual.' },

      { type: 'h4', text: 'Impak' },
      { type: 'p', text: 'Dashboard ini memudahkan pemantauan proaktif berbanding pendekatan reaktif, membolehkan isu rangkaian dikenal pasti dan diselesaikan sebelum menjejaskan pengguna akhir di seluruh cawangan.' }
    ]
  },

  'net-006': {
    eyebrow: '#NET-006 — ARCHIVED',
    title: 'Wireless Site Survey & Deployment',
    tags: ['NetSpot', 'Acrylic Wi-Fi', 'Site Survey'],
    images: [
      'images/projects/net-006-photo-1.jpg',
      'images/projects/net-006-photo-2.jpg',
      'images/projects/net-006-photo-3.jpg',
      'images/projects/net-006-photo-4.jpg',
      'images/projects/net-006-photo-5.jpg',
      'images/projects/net-006-photo-6.jpg',
      'images/projects/net-006-photo-7.jpg',
      'images/projects/net-006-photo-8.jpg'
    ],
    body: [
      { type: 'p', text: 'Projek ini merupakan aktiviti war-walk site survey wayarles yang dijalankan di sekitar kampus UiTM bersama rakan-rakan sekelas, bertujuan mengumpul data isyarat Wi-Fi sebenar merentasi pelbagai bangunan dan kawasan luar untuk dianalisis.' },

      { type: 'h4', text: 'Kaedah Pengumpulan Data' },
      { type: 'p', text: 'Menggunakan perisian NetSpot dan Acrylic Wi-Fi pada komputer riba, isyarat Wi-Fi direkodkan semasa berjalan (war-walk) di sekitar bangunan fakulti, koridor dan kawasan luar kampus. Data yang dikumpul merangkumi kekuatan isyarat (RSSI), nombor channel yang digunakan oleh setiap access point, dan tahap gangguan pada setiap lokasi.' },

      { type: 'h4', text: 'Analisis' },
      { type: 'p', text: 'Data mentah dianalisis untuk mengenal pasti isu congestion (terlalu ramai access point berkongsi channel yang sama), channel overlapping antara access point berdekatan, serta prestasi roaming pengguna semasa berpindah antara kawasan liputan. Heatmap liputan turut dijana untuk memvisualisasikan kawasan dengan isyarat lemah atau "dead zone".' },

      { type: 'h4', text: 'Hasil & Cadangan' },
      { type: 'p', text: 'Hasil survey digunakan untuk mencadangkan pengagihan channel Wi-Fi yang lebih optimum bagi mengurangkan overlapping dan congestion, di samping mengenal pasti lokasi tambahan yang berpotensi memerlukan access point baharu untuk memperbaiki liputan keseluruhan kampus.' }
    ]
  }
};

const caseStudyModal = document.getElementById('caseStudyModal');
const caseStudyScroll = document.getElementById('caseStudyScroll');
const caseStudyClose = document.getElementById('caseStudyClose');

function renderCaseStudy(id){
  const data = caseStudyData[id];
  if (!data) return;

  const bodyHtml = data.body.map(block => {
    if (block.type === 'h4') return `<h4>${block.text}</h4>`;
    if (block.type === 'quote') return `<p class="cs-pull-quote">${block.text}</p>`;
    return `<p>${block.text}</p>`;
  }).join('');

  const photosHtml = (data.images || []).map((src, i) => `
    <button class="cs-photo-btn" data-index="${i}">
      <img src="${src}" alt="${data.title} - foto ${i + 1}">
    </button>
  `).join('');

  const teamHtml = (data.team || []).map(name => `<span>${name}</span>`).join('');
  const tagsHtml = data.tags.map(tag => `<span>${tag}</span>`).join('');

  const photoStripBlock = photosHtml
    ? `<div class="cs-photo-strip">${photosHtml}</div>`
    : '';

  const teamBlock = teamHtml
    ? `<div class="cs-team">
      <p class="mono cs-team-label">PASUKAN PROJEK</p>
      <div class="cs-team-list">${teamHtml}</div>
    </div>`
    : '';

  caseStudyScroll.innerHTML = `
    <p class="mono cs-eyebrow">${data.eyebrow}</p>
    <h2 class="cs-title">${data.title}</h2>
    <div class="cs-tags">${tagsHtml}</div>
    ${photoStripBlock}
    <div class="cs-body">${bodyHtml}</div>
    ${teamBlock}
  `;

  /* Klik foto dalam modal buka lightbox galeri penuh */
  caseStudyScroll.querySelectorAll('.cs-photo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      openLightbox(data.images, data.title, idx);
    });
  });
}

function openCaseStudy(id){
  renderCaseStudy(id);
  caseStudyModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  caseStudyScroll.scrollTop = 0;
}

function closeCaseStudy(){
  caseStudyModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.case-study-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-case');
    openCaseStudy(id);
  });
});

caseStudyClose.addEventListener('click', closeCaseStudy);
caseStudyModal.addEventListener('click', (e) => {
  if (e.target === caseStudyModal) closeCaseStudy();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && caseStudyModal.classList.contains('open')) closeCaseStudy();
});

/* =========================================================
   CONTACT FORM (front-end only, no backend)
========================================================= */
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formResponse.textContent = '> Menghantar...';

  setTimeout(() => {
    formResponse.textContent = '> Mesej berjaya dihantar. Status: 200 OK. Saya akan hubungi anda tidak lama lagi.';
    contactForm.reset();
  }, 900);
});

/* =========================================================
   CANVAS NETWORK ANIMATION (hero background)
========================================================= */
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
let nodes = [];
let animationFrame;

function resizeCanvas(){
  const hero = document.querySelector('.hero');
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
  initNodes();
}

function initNodes(){
  const count = Math.max(24, Math.floor((canvas.width * canvas.height) / 28000));
  nodes = [];
  for (let i = 0; i < count; i++){
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1
    });
  }
}

function drawNetwork(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maxDist = 150;

  for (let i = 0; i < nodes.length; i++){
    const n = nodes[i];
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    for (let j = i + 1; j < nodes.length; j++){
      const m = nodes[j];
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist){
        const opacity = 1 - dist / maxDist;
        ctx.strokeStyle = `rgba(0, 224, 184, ${opacity * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      }
    }
  }

  for (const n of nodes){
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 224, 184, 0.85)';
    ctx.fill();
  }

  animationFrame = requestAnimationFrame(drawNetwork);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

resizeCanvas();
if (!prefersReducedMotion){
  drawNetwork();
}
window.addEventListener('resize', () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  if (!prefersReducedMotion) drawNetwork();
});

/* run once on load in case sections are already in view */
setActiveLink();

/* =========================================================
   FIBER SERVICE LOOP — draw-in on scroll + travelling light pulses
========================================================= */
const fiberCoil = document.getElementById('fiberCoil');

if (fiberCoil){
  let fiberTriggered = false;

  const fiberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fiberTriggered){
        fiberTriggered = true;
        fiberCoil.classList.add('in-view');

        if (!prefersReducedMotion){
          const pulseIds = ['pulseAnim1', 'pulseAnim2', 'pulseAnim3'];
          const staggers = [0, 900, 1800];

          pulseIds.forEach((id, i) => {
            const anim = document.getElementById(id);
            if (!anim) return;
            setTimeout(() => {
              try { anim.beginElement(); } catch (e) { /* SMIL unsupported, fail quietly */ }
            }, 1900 + staggers[i]);
          });
        }

        fiberObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });

  fiberObserver.observe(fiberCoil);
}
