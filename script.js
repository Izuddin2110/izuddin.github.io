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
   LIGHTBOX (single certificate & project photo galleries)
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

/* Certificates (one image, or several images for the same event via data-images) */
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

/* Project photo galleries (multiple images) */
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
   CASE STUDY MODAL (full project story)
========================================================= */
const caseStudyData = {
  'net-001': {
    eyebrow: '#NET-001 — DEPLOYED',
    title: 'Campus Network Redesign',
    tags: ['Cisco', 'VLAN', 'OSPF', 'ITT550', 'UiTM Jasin Melaka'],
    images: [
      'images/projects/net-001-photo-1.jpg',
      'images/projects/net-001-photo-2.jpg',
      'images/projects/net-001-photo-3.jpg',
      'images/projects/net-001-photo-4.jpg'
    ],
    body: [
      { type: 'p', text: 'This project was one of the most meaningful experiences of my studies at the Faculty of Computer and Mathematical Sciences (FSKM), UiTM Melaka Branch, Jasin Campus. Together with my teammates, I developed a proposal to redesign the network infrastructure supporting FSKM&rsquo;s current needs as well as the new building development in Merlimau.' },

      { type: 'h4', text: 'Design & Technical Approach' },
      { type: 'p', text: 'Throughout the project I helped design a more modern, stable enterprise network architecture that is ready to grow in future. Our proposal used a hierarchical approach made up of Core, Distribution and Access layers, alongside a more systematic VLAN structure to improve performance, scalability and manageability.' },

      { type: 'quote', text: 'Security was addressed as well, through proposed protective mechanisms that reduce risks such as IP spoofing and data intrusion.' },

      { type: 'h4', text: 'Preparation & Supporting Materials' },
      { type: 'p', text: 'To support the proposal we produced both physical and logical network designs, carried out wireless coverage analysis using heatmaps, and prepared technical justifications together with an implementation cost estimate. A project poster and a physical building model were also built as visual aids, helping the assessment panel understand the complete proposed solution.' },

      { type: 'h4', text: 'Lessons & Experience' },
      { type: 'p', text: 'The project not only strengthened my knowledge of enterprise network design and management, it also sharpened my problem-solving, technical communication and teamwork skills. It gave me a much deeper view of how network infrastructure is planned around an organisation&rsquo;s needs while balancing performance, security and scalability.' }
    ],
    team: ['Muhammad Izuddin Bin Mohd Rozi', 'Muhammad Alif Marzuki Bin Rizuan', 'Ikhwan Wafi Bin Azman', 'Mohamad Azim Irfan Firdaus Bin Mohd Azmi']
  },

  'net-002': {
    eyebrow: '#NET-002 — DEPLOYED',
    title: 'Wireless Network Configuration Lab (BSS & ESS)',
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
      { type: 'p', text: 'This lab focused on the fundamentals of enterprise wireless networking: the Basic Service Set (BSS) and the Extended Service Set (ESS). The main aim was to understand how one or more access points can be arranged to form continuous, reliable wireless coverage for users.' },

      { type: 'h4', text: 'Setting Up the BSS' },
      { type: 'p', text: 'The first phase involved configuring a single access point (BSS) so client devices could join the same network through one point of access. Parameters such as the SSID, authentication method and channel were configured manually to keep client connections stable.' },

      { type: 'h4', text: 'Extending to an ESS' },
      { type: 'p', text: 'The next phase extended the topology into an Extended Service Set by adding a second access point sharing the same SSID but on a different channel to avoid interference. This let client devices roam between access points without dropping the connection while moving from one coverage area to another.' },

      { type: 'quote', text: 'Setting up the access points and testing client roaming first-hand gave a real sense of how corporate wireless coverage is designed at a much larger scale.' },

      { type: 'h4', text: 'Testing & Verification' },
      { type: 'p', text: 'Client connectivity was tested at every phase using ping tests and signal strength readings, confirming that coverage was sufficient and that no "dead zones" sat between the access points. The lab reinforced my understanding of optimising wireless coverage in real-world environments.' }
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
      { type: 'p', text: 'This project was built for the ITT593 (Digital Forensics) course at UiTM, with the aim of creating a Python-based digital forensics tool capable of detecting data hidden inside digital images through steganography — specifically the Least Significant Bit (LSB) method. The tool is called "Pro Forensic and Stego-Detector" and has a professional dark graphical interface built with CustomTkinter.' },

      { type: 'h4', text: 'Problem & Motivation' },
      { type: 'p', text: 'Digital images can be used as a medium for concealing confidential information through steganography — a threat that ordinary forensic software struggles to detect. Tools such as FTK Imager can only analyse metadata and file headers, not subtle changes at the pixel bit level. That creates a pressing need for a tool that can run pixel analysis automatically, at scale, while preserving the integrity of digital evidence.' },

      { type: 'h4', text: 'Tool Architecture & Modular Design' },
      { type: 'p', text: 'The tool was designed modularly around four main components: (1) Forensic Engine — handling MD5/SHA-256 hash creation, metadata extraction, and steganalysis using LSB, entropy and chi-square; (2) Steganography Engine — for hiding and extracting concealed data using LSB; (3) User Interface — a tabbed interface (Scan, Visual, Create, Config) built with CustomTkinter; and (4) Reporting Module — generating professional PDF reports with ReportLab.' },

      { type: 'h4', text: 'Steganography Detection Techniques' },
      { type: 'p', text: 'Three analysis methods run in parallel to calculate a risk score (0–100): entropy analysis — measuring pixel randomness (values above 7.5 suggest encrypted hidden data is likely present); LSB ratio analysis — identifying unusual distributions of 0 and 1 bits in the least significant bit plane; and the chi-square attack — a statistical test for disturbances in expected pixel value frequencies. Each image is classified as CLEAN, SUSPICIOUS or HIGH RISK.' },

      { type: 'quote', text: 'In live testing, images carrying hidden messages were detected with risk scores as high as 100, and those messages were extracted in full by the tool.' },

      { type: 'h4', text: 'Chain of Custody & Evidence Integrity' },
      { type: 'p', text: 'The tool operates in read-only mode so the original evidence is never altered. Every image file analysed is given SHA-256 and MD5 cryptographic fingerprints, recorded in a Chain of Custody (CoC) log. Investigators must enter their name and a case ID before a scan begins, and all findings are archived in an official PDF report containing case details, an evidence table, risk scores and an integrity declaration.' },

      { type: 'h4', text: 'Results & Conclusion' },
      { type: 'p', text: 'The tool reliably distinguished clean images from manipulated ones, extracted hidden messages accurately, and flagged any modification through a differing SHA-256 hash. The project demonstrated what Python can do in automated digital forensics and highlighted how important bit-level statistical analysis is to cybercrime investigations involving information concealed in images.' }
    ],
    team: ['Muhammad Izuddin Bin Mohd Rozi', 'Amelia Sabrina Binti Mohammed Sabri', 'Nur Asha Irdina Binti Md Heryzal']
  },

  'net-004': {
    eyebrow: '#NET-004 — DEPLOYED',
    title: 'Network Configuration Automation (ACL Automation)',
    tags: ['Python', 'Netmiko', 'ACL', 'ITT633', 'UiTM'],
    images: [
      'images/projects/net-004-topology.jpg'
    ],
    body: [
      { type: 'p', text: 'This project was developed for the ITT633 (Wide Area Network Technologies and Services) course at UiTM, with the objective of automating Access Control List (ACL) configuration across a small enterprise network made up of six departments: HR, IT, Operator, Sales & Marketing, Server and Guest — each on its own subnet.' },

      { type: 'h4', text: 'Masalah & Motivasi' },
      { type: 'p', text: 'Configuring ACLs by hand is exposed to human error: permit/deny rules in the wrong order, mistyped wildcard masks, and updates that have to be applied device by device — impractical on any large network. Automation was chosen so that access policy is enforced consistently and accurately on every router.' },

      { type: 'h4', text: 'Network Design' },
      { type: 'p', text: 'The topology consists of three Cisco routers (R1, R2, R3) acting as gateways for six departmental subnets. Router1 is the gateway for HR (192.168.10.0/24) and IT (192.168.20.0/24); Router2 is the central distribution router connecting Operator (192.168.30.0/24) and Sales & Marketing (192.168.40.0/24); while Router3 is the gateway for Server (192.168.50.0/24) and Guest (192.168.60.0/24).' },

      { type: 'h4', text: 'Automation with Python + Netmiko' },
      { type: 'p', text: 'A Python script using the Netmiko library was written to open SSH sessions to each router and push ACL configurations automatically — covering ACL_HR, ACL_IT, ACL_OPERATOR, ACL_SM and ACL_GUEST. Each ACL follows least-privilege principles: Guest, for example, may only reach the web server on ports 80/443 and is blocked entirely from the file server and the other internal subnets.' },

      { type: 'quote', text: 'Post-automation checks confirmed that every ACL had been applied with the correct permit/deny ordering on all three routers, with no syntax errors.' },

      { type: 'h4', text: 'Functional Testing' },
      { type: 'p', text: 'Ping (ICMP) and HTTP access tests were run from a range of end devices to confirm the policy behaved as designed — Guest could reach the web server but was blocked from the file server, while HR staff were blocked entirely from the Guest subnet. All eight test scenarios (T-1 to T-8) passed with the expected results.' },

      { type: 'h4', text: 'Lessons & Future Work' },
      { type: 'p', text: 'The project showed that network automation can manage complex security configurations consistently and cut the risk of human error compared with manual methods. Future improvements include dynamic IP inventory management (reading from a CSV/Excel file), a user-friendly web interface, and integration with platforms such as Ansible for more robust configuration management.' }
    ],
    team: ['Muhammad Izuddin Bin Mohd Rozi', 'Aqief Daniel Bin Muhammad Nazir', 'Amer Hafiz Bin Azman', 'Izharris Farhan Bin Ahmad Badri']
  },

  'net-005': {
    eyebrow: '#NET-005 — DEPLOYED',
    title: 'Network Monitoring Dashboard',
    tags: ['Zabbix', 'SNMP', 'Grafana'],
    body: [
      { type: 'p', text: 'This project involved setting up a real-time network monitoring system with Zabbix, giving continuous visibility of network infrastructure health across all of the organisation&rsquo;s branches.' },

      { type: 'h4', text: 'Data Collection' },
      { type: 'p', text: 'SNMP was configured on the network devices (routers and switches) so that Zabbix could poll key metrics such as uptime status, latency and bandwidth utilisation at regular intervals, without disrupting existing network operations.' },

      { type: 'h4', text: 'Visualisation & Alerting' },
      { type: 'p', text: 'The collected data is presented through Grafana dashboards showing network performance graphs and trends visually, so anomalies such as uptime drops or latency spikes are spotted far faster than by manual checking.' },

      { type: 'h4', text: 'Impact' },
      { type: 'p', text: 'The dashboard makes proactive monitoring possible instead of a reactive approach, so network issues can be identified and resolved before they affect end users across the branches.' }
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
      { type: 'p', text: 'This project was a wireless war-walk site survey carried out around the UiTM campus with classmates, aimed at collecting real Wi-Fi signal data across a range of buildings and outdoor areas for analysis.' },

      { type: 'h4', text: 'Data Collection Method' },
      { type: 'p', text: 'Using NetSpot and Acrylic Wi-Fi on laptops, Wi-Fi signals were recorded while walking (the war-walk) around faculty buildings, corridors and outdoor areas of the campus. The data gathered covered signal strength (RSSI), the channel used by each access point, and the level of interference at each location.' },

      { type: 'h4', text: 'Analysis' },
      { type: 'p', text: 'The raw data was analysed to pinpoint congestion (too many access points sharing the same channel), channel overlap between neighbouring access points, and roaming performance as users moved between coverage areas. Coverage heatmaps were also generated to visualise areas of weak signal, or "dead zones".' },

      { type: 'h4', text: 'Findings & Recommendations' },
      { type: 'p', text: 'The survey results were used to recommend a more optimal Wi-Fi channel distribution to reduce overlap and congestion, and to identify additional locations that may need new access points to improve overall campus coverage.' }
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
      <img src="${src}" alt="${data.title} - photo ${i + 1}">
    </button>
  `).join('');

  const teamHtml = (data.team || []).map(name => `<span>${name}</span>`).join('');
  const tagsHtml = data.tags.map(tag => `<span>${tag}</span>`).join('');

  const photoStripBlock = photosHtml
    ? `<div class="cs-photo-strip">${photosHtml}</div>`
    : '';

  const teamBlock = teamHtml
    ? `<div class="cs-team">
      <p class="mono cs-team-label">PROJECT TEAM</p>
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

  /* Clicking a photo in the modal opens the full gallery lightbox */
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
  formResponse.textContent = '> Sending...';

  setTimeout(() => {
    formResponse.textContent = '> Message sent successfully. Status: 200 OK. I will be in touch shortly.';
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
