const container = document.getElementById('button-row');
const navbar = document.getElementById('mainNav');
const fireworksButton = document.getElementById('fireworksButton');
let lastScrollTop = 0;

/* ✅ Vytvoření tlačítek */
const buttonsData = [
  { id: 'historie', label: 'Historie', icon: 'historie-icon.png' },
  { id: 'mapa', label: 'Mapa', icon: 'mapa-icon.png' },
  { id: 'tutorial', label: 'Tutoriál', icon: 'tutorial-icon.png' },
  { id: 'strom', label: 'Strom dovedností', icon: 'strom-icon.png' },
  { id: 'runy', label: 'Runy', icon: 'krystal-icon.png' },
  { id: 'nepratele', label: 'Nepřátelé', icon: 'nepratele-icon.png' }
];

buttonsData.forEach(btn => {
  const button = document.createElement('a');
  button.classList.add('circle-button');
  button.href = `#${btn.id}`;

  const img = document.createElement('img');
  img.src = `img/${btn.icon}`;

  const overlay = document.createElement('div');
  overlay.classList.add('circle-overlay');

  const label = document.createElement('span');
  label.textContent = btn.label;

  button.append(img, overlay, label);
  container.appendChild(button);
});

/* ✅ Skrývání a zobrazování horní lišty */
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll <= 0) {
    navbar.classList.remove('hidden');
  } else if (currentScroll > lastScrollTop) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

/* ✅ Domov – scroll nahoru */
document.getElementById('homeButton').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* 🎆 Ohňostroj po kliknutí na "Svět Titán" */
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let particles = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createFirework() {
  const x = random(100, canvas.width - 100);
  const y = random(100, canvas.height / 2);
  const colors = ['#ff4d4d', '#ffcc00', '#66ff66', '#66ccff', '#ff66ff', '#ffffff'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = Math.floor(random(30, 70));
  const size = random(2, 4);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = random(1, 6);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color,
      size,
    });
  }
}

function updateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02; // gravitace
    p.alpha -= 0.015;
    if (p.alpha <= 0) particles.splice(i, 1);
    ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
}

function animate() {
  updateParticles();
  requestAnimationFrame(animate);
}

animate();

fireworksButton.addEventListener('click', (e) => {
  e.preventDefault();
  createFirework();
});

/* ✅ LIGHTBOX GALERIE */
const galleryImages = document.querySelectorAll('.map-gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-image');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'block';
    lightboxImg.src = img.src;
    currentIndex = index;
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
});

// Zavření kliknutím mimo obrázek
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});

// Zavření ESC klávesou
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    lightbox.style.display = 'none';
  }
});
