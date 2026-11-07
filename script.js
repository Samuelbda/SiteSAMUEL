// ==========================================
// 3D & Interactive Engine for Samuel Lenício
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initialize 3D Three.js Background
  initThreeJSScene();

  // Initialize 3D Card Tilt Engine
  init3DTilt();

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Portfolio Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active', 'bg-brand-600', 'text-white');
        b.classList.add('text-slate-300');
      });
      btn.classList.add('active', 'bg-brand-600', 'text-white');
      btn.classList.remove('text-slate-300');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Header scroll appearance
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-lg', 'border-white/10', 'bg-[#080b11]/95');
    } else {
      header.classList.remove('shadow-lg', 'bg-[#080b11]/95');
    }
  });
});

// ==========================================
// 1. THREE.JS 3D INTERACTIVE BACKGROUND
// ==========================================
function initThreeJSScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 85;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- PARTICLE WAVE FIELD (Vale do Jequitinhonha Wave & Digital Grid) ---
  const particleCount = 1100;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // Warm Terracotta (#ea580c) and Golden Amber (#f59e0b) palette
  const color1 = new THREE.Color('#ea580c');
  const color2 = new THREE.Color('#f59e0b');
  const color3 = new THREE.Color('#06b6d4');

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 220;
    const y = (Math.random() - 0.5) * 140;
    const z = (Math.random() - 0.5) * 120;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Gradient mixture
    const mixedColor = i % 3 === 0 ? color1 : (i % 3 === 1 ? color2 : color3);
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular soft particle texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 32;
  particleCanvas.height = 32;
  const ctx = particleCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const particleTexture = new THREE.CanvasTexture(particleCanvas);

  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // --- FLOATING 3D GEOMETRIC CONSTELLATION ---
  // 1. Glowing Icosahedron
  const icoGeometry = new THREE.IcosahedronGeometry(12, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0xea580c,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
  icosahedron.position.set(45, 15, -20);
  scene.add(icosahedron);

  // 2. Glowing Torus Knot
  const torusGeometry = new THREE.TorusKnotGeometry(8, 2.2, 80, 16);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
  torusKnot.position.set(-50, -20, -10);
  scene.add(torusKnot);

  // 3. Cyber Ring
  const ringGeometry = new THREE.RingGeometry(18, 18.4, 48);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });
  const cyberRing = new THREE.Mesh(ringGeometry, ringMaterial);
  cyberRing.position.set(-35, 25, -25);
  cyberRing.rotation.x = Math.PI / 3;
  scene.add(cyberRing);

  // Mouse & Scroll interaction variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop with clock
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerp for mouse tilt
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Particles gentle flow wave
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pos[idx + 1] += Math.sin(elapsedTime * 0.8 + pos[idx] * 0.05) * 0.06;
    }
    geometry.attributes.position.needsUpdate = true;

    // Rotate 3D Geometries
    icosahedron.rotation.x = elapsedTime * 0.15;
    icosahedron.rotation.y = elapsedTime * 0.2;

    torusKnot.rotation.x = elapsedTime * 0.12;
    torusKnot.rotation.y = elapsedTime * 0.18;

    cyberRing.rotation.z = elapsedTime * 0.25;

    // Camera responds to scroll and mouse
    camera.position.x = targetX * 12;
    camera.position.y = targetY * 10 - scrollY * 0.035;
    camera.lookAt(0, -scrollY * 0.035, 0);

    renderer.render(scene, camera);
  }

  animate();
}

// ==========================================
// 2. 3D TILT ENGINE FOR CARDS & HERO PORTRAIT
// ==========================================
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.card-3d');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
      const rotateY = ((x - centerX) / centerX) * 12;

      // Update specular sheen position
      const mouseXPercent = (x / rect.width) * 100;
      const mouseYPercent = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
      card.style.setProperty('--mouse-y', `${mouseYPercent}%`);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // Dedicated Hero 3D Card Parallax with Depth
  const heroCard = document.getElementById('hero-3d-wrapper');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      heroCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
    });
  }
}

// ==========================================
// 3. TOAST NOTIFICATIONS & CLIPBOARD
// ==========================================
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

function copyToClipboard(text, customMessage = 'Copiado para a área de transferência!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(customMessage);
    }).catch(() => {
      fallbackCopy(text, customMessage);
    });
  } else {
    fallbackCopy(text, customMessage);
  }
}

function fallbackCopy(text, customMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(customMessage);
  } catch (err) {
    showToast('Não foi possível copiar automaticamente.');
  }
  document.body.removeChild(textArea);
}

// ==========================================
// 4. MODAL DATA & CONTROLS
// ==========================================
const modalData = {
  jequi: {
    badge: 'Impacto Sociocultural • Vale do Jequitinhonha (2024)',
    title: 'Projeto Musical & Transformação Social no Vale',
    content: `
      <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
        <p>
          Idealizado e executado diretamente no território do Vale do Jequitinhonha, este projeto utilizou a música e a poesia como canais de acolhimento, empoderamento e voz para jovens em vulnerabilidade social.
        </p>
        <div class="grid grid-cols-2 gap-3 py-2">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-xl font-bold text-brand-400 font-display">+500.000</div>
            <div class="text-xs text-slate-400">Visualizações somadas em plataformas digitais</div>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-xl font-bold text-amberAccent-400 font-display">+7.000</div>
            <div class="text-xs text-slate-400">Acessos orgânicos na prévia do projeto</div>
          </div>
        </div>
        <h4 class="font-display font-bold text-white text-base">Atuação Completa de Samuel Lenício:</h4>
        <ul class="space-y-2 list-disc list-inside text-xs text-slate-300">
          <li><strong>Mobilização:</strong> Escuta ativa e rodas de diálogo com a juventude no território.</li>
          <li><strong>Composição & Letra:</strong> Criação conjunta de arranjos e mensagens com identidade local.</li>
          <li><strong>Produção Fonográfica:</strong> Captação em estúdio, mixagem e arranjos musicais.</li>
          <li><strong>Audiovisual:</strong> Roteiro, direção, gravação e edição completa do videoclipe oficial.</li>
          <li><strong>Divulgação Digital:</strong> Estratégia de pré-lançamento e distribuição multiplataforma.</li>
        </ul>
        <p class="text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
          <strong>Resultado Duradouro:</strong> Os jovens participantes formaram laços artísticos e passaram a se apresentar ao vivo em eventos da região.
        </p>
      </div>
    `,
    ctaLink: 'https://wa.me/5533999285190?text=Samuel,%20gostaria%20de%20conversar%20sobre%20o%20case%20do%20Vale%20do%20Jequitinhonha!',
    ctaText: 'Falar com Samuel sobre este Projeto'
  },
  obra: {
    badge: 'Comunicação Musical • Estratégia Freelance',
    title: 'Obra Digital & Atendimento a +40 Artistas',
    content: `
      <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
        <p>
          Atuação contínua com a equipe da distribuidora musical <strong>Obra Digital</strong> no planejamento de comunicação e posicionamento de carreira artística.
        </p>
        <h4 class="font-display font-bold text-white text-base">Escopo das Atividades:</h4>
        <ul class="space-y-2 list-disc list-inside text-xs text-slate-300">
          <li>Construção e refinamento de posicionamento de marca artística respeitando o gênero e estilo de cada cantor(a).</li>
          <li>Planejamento de campanhas de lançamentos de singles, EPs e álbuns completos (pré-save, teaser, lançamento e sustentação).</li>
          <li>Criação de ideias para campanhas, materiais gráficos e conteúdos estratégicos em vídeo (Reels/TikTok).</li>
          <li>Mais de 40 artistas orientados ao longo de aproximadamente 5 anos de colaboração contínua.</li>
        </ul>
      </div>
    `,
    ctaLink: 'https://wa.me/5533999285190?text=Samuel,%20vi%20seu%20trabalho%20com%20a%20Obra%20Digital%20e%20artistas!',
    ctaText: 'Solicitar Estratégia Musical'
  },
  prefeitura: {
    badge: 'Prefeitura de Minas Novas–MG • Ações Educativas (2024)',
    title: 'Mobilização Social, Ações Escolares e Combate à Dengue',
    content: `
      <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
        <p>
          Atuação de campo nas escolas municipais de Minas Novas–MG com atividades educativas lúdicas e ações diretas de conscientização e mobilização comunitária.
        </p>
        <h4 class="font-display font-bold text-white text-base">Destaques da Execução:</h4>
        <ul class="space-y-2 list-disc list-inside text-xs text-slate-300">
          <li><strong>Músicas e Jogos Educativos:</strong> Criação de composições infantis e jogos para fixação das mensagens de combate aos focos do mosquito da dengue.</li>
          <li><strong>Adaptação Pedagógica:</strong> Tradução de termos técnicos de saúde pública para uma linguagem acolhedora, divertida e eficiente para crianças e jovens.</li>
          <li><strong>Registro e Divulgação:</strong> Captação fotográfica e videográfica das ações nas escolas, gerando material de divulgação oficial para a Prefeitura e a comunidade.</li>
        </ul>
      </div>
    `,
    ctaLink: 'https://wa.me/5533999285190?text=Samuel,%20quero%20conversar%20sobre%20projetos%20de%20mobiliza%C3%A7%C3%A3o%20social/educativa!',
    ctaText: 'Conversar Sobre Ações Educativas'
  },
  pastoral: {
    badge: 'Comunicação Comunitária • Diocese de Capelinha',
    title: 'Comunicação Pastoral, Religiosa & Registro de Saberes',
    content: `
      <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
        <p>
          Extensa atuação voluntária e comunitária em movimentos como a Pastoral da Juventude, DNJ (Dia Nacional da Juventude), EAC, EJC, Semana da Família e missões juvenis no interior mineiro.
        </p>
        <h4 class="font-display font-bold text-white text-base">Impacto e Atividades:</h4>
        <ul class="space-y-2 list-disc list-inside text-xs text-slate-300">
          <li>Cobertura audiovisual e fotográfica de eventos de grande porte para centenas de jovens.</li>
          <li>Produção musical de canções religiosas e videoclipes em colaboração com padres e músicos católicos da região.</li>
          <li>Comunicação participativa e registro de histórias de fé, acolhimento e valorização da cultura do povo mineiro.</li>
        </ul>
      </div>
    `,
    ctaLink: 'https://wa.me/5533999285190?text=Samuel,%20vi%20seu%20trabalho%20de%20comunica%C3%A7%C3%A3o%20pastoral%20e%20comunit%C3%A1ria!',
    ctaText: 'Entrar em Contato'
  }
};

function openModal(key) {
  const data = modalData[key];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <span class="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
      ${data.badge}
    </span>
    <h3 class="font-display font-black text-2xl text-white">
      ${data.title}
    </h3>
    <div class="py-2">
      ${data.content}
    </div>
    <div class="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
      <button onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold">
        Fechar
      </button>
      <a href="${data.ctaLink}" target="_blank" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-amberAccent-500 text-white text-xs font-bold shadow-glow hover:scale-105 transition-all flex items-center gap-2">
        <span>${data.ctaText}</span>
      </a>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';

  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ==========================================
// 5. WHATSAPP FORM HANDLER
// ==========================================
function handleContactSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const interest = document.getElementById('interest').value;
  const message = document.getElementById('message').value.trim();

  const formattedText = `Olá, Samuel! Meu nome é ${name}.
Assunto: ${interest}
Mensagem: ${message}`;

  const encodedUrl = `https://wa.me/5533999285190?text=${encodeURIComponent(formattedText)}`;
  
  window.open(encodedUrl, '_blank');
}
