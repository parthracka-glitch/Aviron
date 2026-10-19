const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// Header: scroll shadow & minimal mobile menu
const hdr = $('.hdr');
const burger = $('#nav-toggle') || $('.burger');

addEventListener('scroll', () => hdr.classList.toggle('sc', window.scrollY > 10));

if (burger) {
  burger.onclick = () => {
    const isOpen = hdr.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };
}

$$('.nav a').forEach(a => {
  a.addEventListener('click', () => {
    hdr.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  });
});

// Nav active link indicator on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    if (!id) return;
    const targetLink = $(`.nav a[href="#${id}"]`);
    if (targetLink) {
      $$('.nav-link').forEach(el => el.classList.remove('on'));
      targetLink.classList.add('on');
    }
  });
}, { rootMargin: '-25% 0px -55% 0px' });

$$('section[id], footer[id]').forEach(s => io.observe(s));

// =========================================
// Premium Scroll Animation & Parallax Engine
// =========================================
(function initScrollExperience() {
  // 1. Inject Top Scroll Progress Bar if missing
  let progBar = $('#scroll-progress');
  if (!progBar) {
    progBar = document.createElement('div');
    progBar.id = 'scroll-progress';
    document.body.prepend(progBar);
  }

  // 2. Inject Back-to-Top Button if missing
  let btt = $('.back-to-top');
  if (!btt) {
    btt = document.createElement('button');
    btt.className = 'back-to-top';
    btt.setAttribute('aria-label', 'Scroll back to top');
    btt.innerHTML = `<svg class="i" style="width:16px;height:16px;transform:rotate(-90deg)"><use href="#arrow"/></svg>`;
    document.body.appendChild(btt);
    btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 3. Multi-Type Reveal Observer
  const revealSelectors = '.reveal, .reveal-tilt, .reveal-scale, .reveal-slide-left, .reveal-slide-right, .reveal-flip, .reveal-spotlight';
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$(revealSelectors).forEach(el => observer.observe(el));

  // 4. Scroll Tracking: Progress, Parallax & Velocity
  let lastScrollY = window.scrollY;
  window._scrollVelocity = 0;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (currentY / maxScroll) * 100 : 0;
    progBar.style.width = `${progress}%`;

    // Toggle Back to Top
    btt.classList.toggle('show', currentY > 350);

    // Calculate scroll delta for 3D mesh interaction
    window._scrollVelocity = (currentY - lastScrollY) * 0.003;
    lastScrollY = currentY;

    // Subtle Hero Parallax for visual depth
    const lap = $('.lap');
    const phn = $('.phn');
    if (lap && currentY < 800) {
      lap.style.transform = `translateY(${currentY * 0.08}px)`;
    }
    if (phn && currentY < 800) {
      phn.style.transform = `translateY(${-currentY * 0.05}px)`;
    }
  }, { passive: true });
})();

// Currency Switcher: INR (₹) vs USD ($)
const btnInr=$('#btn-inr');
const btnUsd=$('#btn-usd');
const inrPrices=$$('.price-inr');
const usdPrices=$$('.price-usd');

function setCurrency(curr){
  if(curr==='USD'){
    btnUsd.classList.add('active');
    btnInr.classList.remove('active');
    inrPrices.forEach(el=>el.style.display='none');
    usdPrices.forEach(el=>el.style.display='block');
    // Update advance text in USD
    $('#card-starter .adv-val').textContent='$150 (50%)';
    $('#card-standard .adv-val').textContent='$250 (50%)';
    $('#card-advanced .adv-val').textContent='$360 (40%)';
    $('#card-premium .adv-val').textContent='$560 (40%)';
  } else {
    btnInr.classList.add('active');
    btnUsd.classList.remove('active');
    inrPrices.forEach(el=>el.style.display='block');
    usdPrices.forEach(el=>el.style.display='none');
    $('#card-starter .adv-val').textContent='₹4,500 (50%)';
    $('#card-standard .adv-val').textContent='₹7,500 (50%)';
    $('#card-advanced .adv-val').textContent='₹12,000 (40%)';
    $('#card-premium .adv-val').textContent='₹18,000 (40%)';
  }
}

if(btnInr && btnUsd){
  btnInr.onclick=()=>setCurrency('INR');
  btnUsd.onclick=()=>setCurrency('USD');
}

// Package Selector buttons -> Scroll to Quote form & pre-fill
$$('.select-pkg-btn').forEach(btn=>{
  btn.onclick=()=>{
    const plan=btn.dataset.plan;
    const biz=btn.dataset.biz;
    const pkgSelect=$('#client-package');
    const bizSelect=$('#client-biz-type');

    if(pkgSelect){
      for(let opt of pkgSelect.options){
        if(opt.value.toLowerCase().includes(plan.toLowerCase())){
          pkgSelect.value=opt.value;
          break;
        }
      }
    }
    if(biz && bizSelect){
      for(let opt of bizSelect.options){
        if(opt.value.toLowerCase().includes(biz.toLowerCase())){
          bizSelect.value=opt.value;
          break;
        }
      }
    }
    updateWhatsAppOutreach();
    const contactSec=$('#contact');
    if(contactSec){
      contactSec.scrollIntoView({behavior:'smooth'});
      setTimeout(()=>{
        $('#client-name')?.focus();
      },600);
    }
  };
});

// Features by Business Type Tabs
const bizTabs=$$('.biz-tab');
const bizItems=$$('.biz-item');

bizTabs.forEach(tab=>{
  tab.onclick=()=>{
    bizTabs.forEach(t=>t.classList.remove('active'));
    bizItems.forEach(i=>i.classList.remove('active'));
    tab.classList.add('active');
    const target=$(`#biz-${tab.dataset.biz}`);
    if(target) target.classList.add('active');
    // Mobile touch auto-scroll active tab into view
    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };
});

// Mobile Comparison Matrix Tier Navigation
const matrixWrap = $('.table-wrap');
const matrixTierBtns = $$('.matrix-tier-btn');
if (matrixWrap && matrixTierBtns.length) {
  matrixTierBtns.forEach(btn => {
    btn.onclick = () => {
      matrixTierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const colIdx = btn.dataset.col;

      if (colIdx === 'all') {
        matrixWrap.scrollTo({ left: 0, behavior: 'smooth' });
        $$('.comp-tbl th, .comp-tbl td').forEach(el => el.classList.remove('col-focus'));
      } else {
        const colNum = parseInt(colIdx) + 1;
        const targetHeader = $(`.comp-tbl th:nth-child(${colNum})`);
        if (targetHeader) {
          const stickyWidth = ($('.th-feat')?.offsetWidth || 135);
          const targetLeft = targetHeader.offsetLeft - stickyWidth - 8;
          matrixWrap.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
        }
        $$('.comp-tbl th, .comp-tbl td').forEach(el => el.classList.remove('col-focus'));
        $$(`.comp-tbl tr > *:nth-child(${colNum})`).forEach(el => el.classList.add('col-focus'));
      }
    };
  });

  matrixWrap.addEventListener('scroll', () => {
    if (matrixWrap.scrollLeft < 30) {
      matrixTierBtns.forEach(b => b.classList.toggle('active', b.dataset.col === 'all'));
      $$('.comp-tbl th, .comp-tbl td').forEach(el => el.classList.remove('col-focus'));
    }
  }, { passive: true });
}

// FAQ Accordion
$$('.faq-q').forEach(qBtn=>{
  qBtn.onclick=()=>{
    const item=qBtn.closest('.faq-item');
    const wasOpen=item.classList.contains('open');
    $$('.faq-item').forEach(it=>it.classList.remove('open'));
    if(!wasOpen){
      item.classList.add('open');
    }
  };
});

// Dynamic WhatsApp Message Sync based on Form selections
function updateWhatsAppOutreach(){
  const pkg=$('#client-package')?.value || 'Advanced (₹30,000)';
  const biz=$('#client-biz-type')?.value || 'Local Business';
  const name=$('#client-name')?.value.trim();

  let msg=`Hello AVIRON! I am interested in the ${pkg} website package for my ${biz}.`;
  if(name) msg+=` My name is ${name}.`;
  msg+=` May I see a sample design and discuss our project?`;

  const previewEl=$('#wa-preview-text');
  if(previewEl) previewEl.textContent=`“${msg}”`;

  const btnOutreach=$('#btn-wa-outreach');
  if(btnOutreach){
    btnOutreach.href=`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
  }
}

$('#client-package')?.addEventListener('change', updateWhatsAppOutreach);
$('#client-biz-type')?.addEventListener('change', updateWhatsAppOutreach);
$('#client-name')?.addEventListener('input', updateWhatsAppOutreach);

// Quote Form Submission
const quoteForm=$('#quote-form');
if(quoteForm){
  quoteForm.onsubmit=e=>{
    e.preventDefault();
    const name=$('#client-name').value;
    const phone=$('#client-phone').value;
    const biz=$('#client-biz-type').value;
    const pkg=$('#client-package').value;
    const notes=$('#client-notes').value;

    const formMsg=$('#form-msg');
    formMsg.style.display='block';
    formMsg.textContent=`✓ Thank you ${name}! Your consultation request for ${pkg} has been submitted. Connecting on WhatsApp...`;

    // Construct direct WhatsApp message for the user
    const waText=`Hello AVIRON! I just submitted a website quote request:\n- Name: ${name}\n- Phone: ${phone}\n- Business: ${biz}\n- Package: ${pkg}\n- Requirements: ${notes || 'Standard setup'}`;
    
    setTimeout(()=>{
      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(waText)}`, '_blank');
      quoteForm.reset();
    }, 1200);
  };
}

// Testimonials Carousel
const reviews=[
  {text:'AVIRON delivered an amazing website for our clinic. The online booking and local SEO brought us 15+ new patient appointments in our first month!',name:'Apex Dental & Implant Care'},
  {text:'Our weekend table reservations jumped 35% after launching our photo menu and reservation system with AVIRON. Fast delivery and exceptional craft.',name:'The Olive Table & Bistro'},
  {text:'The product photography and e-commerce visuals look stunning. Our customer inquiries doubled within weeks of launching our new site.',name:'Aurelle Luxury Studio'},
  {text:'We started with the ₹9,000 Starter package for our repair shop. It paid for itself within the first 10 days from new Google calls!',name:'Modern Home Services'}
];
let n=0,timer;
const dots=$('.dots');
if(dots){
  dots.innerHTML=reviews.map((_,i)=>`<span data-i="${i}"></span>`).join('');
  function showReview(i){
    n=(i+reviews.length)%reviews.length;
    const r=reviews[n];
    $('#tq').textContent=`“${r.text}”`;
    $('#tn').textContent='— '+r.name;
    $('#av').textContent=r.name[0];
    $$('.dots span').forEach((d,k)=>d.classList.toggle('on',k===n));
  }
  const goReview=i=>{showReview(i);clearInterval(timer);timer=setInterval(()=>showReview(n+1),6000)};
  $('#nx').onclick=()=>goReview(n+1);
  $('#pv').onclick=()=>goReview(n-1);
  dots.onclick=e=>e.target.dataset.i&&goReview(+e.target.dataset.i);
  goReview(0);
}

// Newsletter form
$('#nl').onsubmit=e=>{
  e.preventDefault();
  $('#nm').textContent='✓ Thank you for subscribing! We will send you our quarterly growth insights.';
  e.target.reset();
};

// Portfolio Category Filter
const pfBtns=$$('.pf-btn');
const pfItems=$$('.pf .pi');
pfBtns.forEach(btn=>{
  btn.onclick=()=>{
    pfBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter=btn.dataset.filter;
    pfItems.forEach(item=>{
      if(filter==='all' || item.dataset.cat===filter){
        item.style.display='block';
      } else {
        item.style.display='none';
      }
    });
  };
});

// Footer year
$('#yr').textContent=new Date().getFullYear();

// ==========================================
// Interactive 3D Luxury Element (Three.js & Fallback)
// ==========================================
(function init3DElement(){
  const canvas = document.getElementById('canvas-3d');
  const wrap = document.getElementById('canvas-3d-wrap');
  if(!canvas || !wrap) return;

  const width = 170;
  const height = 170;

  if(typeof THREE !== 'undefined'){
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 3.6;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Group to rotate
      const group = new THREE.Group();
      scene.add(group);

      // Gold Dodecahedron Core
      const coreGeo = new THREE.DodecahedronGeometry(1.05, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xd4a85a,
        roughness: 0.28,
        metalness: 0.88,
        wireframe: false,
        flatShading: true
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      // Outer Wireframe Luxury Cage
      const wireGeo = new THREE.IcosahedronGeometry(1.28, 1);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x8a6321,
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      group.add(wireMesh);

      // Ambient & Directional Lights
      const ambLight = new THREE.AmbientLight(0xfdf9f3, 1.2);
      scene.add(ambLight);

      const dirLight = new THREE.DirectionalLight(0xfffae6, 2.0);
      dirLight.position.set(2, 4, 3);
      scene.add(dirLight);

      const goldBackLight = new THREE.PointLight(0xa97b2f, 2.5, 10);
      goldBackLight.position.set(-2, -2, 2);
      scene.add(goldBackLight);

      // Interactive Drag Controls
      let isDragging = false;
      let prevX = 0, prevY = 0;
      let velX = 0.005, velY = 0.008;

      wrap.addEventListener('mousedown', e => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
      });

      window.addEventListener('mouseup', () => { isDragging = false; });

      window.addEventListener('mousemove', e => {
        if(!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        group.rotation.y += dx * 0.015;
        group.rotation.x += dy * 0.015;
        velX = dy * 0.003;
        velY = dx * 0.003;
        prevX = e.clientX;
        prevY = e.clientY;
      });

      // Touch support for mobile
      wrap.addEventListener('touchstart', e => {
        if(e.touches.length === 1){
          isDragging = true;
          prevX = e.touches[0].clientX;
          prevY = e.touches[0].clientY;
        }
      }, {passive:true});

      window.addEventListener('touchend', () => { isDragging = false; }, {passive:true});

      window.addEventListener('touchmove', e => {
        if(!isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - prevX;
        const dy = e.touches[0].clientY - prevY;
        group.rotation.y += dx * 0.015;
        group.rotation.x += dy * 0.015;
        velX = dy * 0.003;
        velY = dx * 0.003;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }, {passive:true});

      let clock = 0;
      function animate(){
        requestAnimationFrame(animate);
        clock += 0.02;

        if(!isDragging){
          const scrollBoost = window._scrollVelocity || 0;
          group.rotation.y += 0.008 + velY + scrollBoost * 0.5;
          group.rotation.x += 0.004 + velX;
          velX *= 0.95;
          velY *= 0.95;
          if (window._scrollVelocity) window._scrollVelocity *= 0.88;
        }

        // Gentle floating bounce
        group.position.y = Math.sin(clock) * 0.08;
        wireMesh.rotation.y -= 0.004;

        renderer.render(scene, camera);
      }
      animate();
      return;
    } catch(err){
      console.warn("Three.js setup encountered an issue; falling back to Canvas2D 3D renderer", err);
    }
  }

  // Graceful Canvas 2D fallback for 3D Polyhedron
  const ctx = canvas.getContext('2d');
  canvas.width = width * 2;
  canvas.height = height * 2;
  ctx.scale(2, 2);

  let angleX = 0, angleY = 0;
  const nodes = [
    [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
    [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]
  ];
  const edges = [
    [0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],
    [0,4],[1,5],[2,6],[3,7]
  ];

  function draw2DPoly(){
    ctx.clearRect(0,0,width,height);
    angleX += 0.012;
    angleY += 0.018;

    const projected = nodes.map(([x,y,z]) => {
      // Rotate around X
      let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
      let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
      // Rotate around Y
      let x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
      let z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);
      // Project
      const dist = 3.5;
      const fov = 110;
      const px = (x2 * fov) / (z2 + dist) + width / 2;
      const py = (y1 * fov) / (z2 + dist) + height / 2;
      return [px, py];
    });

    // Outer glow
    ctx.strokeStyle = '#a97b2f';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    edges.forEach(([i, j]) => {
      ctx.moveTo(projected[i][0], projected[i][1]);
      ctx.lineTo(projected[j][0], projected[j][1]);
    });
    ctx.stroke();

    projected.forEach(([px, py]) => {
      ctx.fillStyle = '#d4a85a';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw2DPoly);
  }
  draw2DPoly();
})();

// ==========================================
// Brandkit Interactive Tools & Hex Copy Toast
// ==========================================
function showToast(msg) {
  let toast = $('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<svg class="i" style="width:14px;height:14px"><use href="#check"/></svg><span class="toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// Click to copy color swatches
$$('.swatch').forEach(swatch => {
  swatch.onclick = () => {
    const hex = swatch.dataset.hex;
    if (hex && navigator.clipboard) {
      navigator.clipboard.writeText(hex).then(() => {
        showToast(`Copied ${hex} to clipboard!`);
      }).catch(() => {
        showToast(`Selected ${hex}`);
      });
    }
  };
});

// Copy SVG Mark Button
const copyLogoBtn = $('#copy-logo-btn');
if (copyLogoBtn) {
  copyLogoBtn.onclick = () => {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><defs><linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4a85a"/><stop offset="1" stop-color="#946a24"/></linearGradient></defs><path d="M20 3 3 37h7l10-22 10 22h7z" fill="url(#gd)" stroke="none"/><path d="M14 28h12" stroke="#fcfaf6" stroke-width="2.4"/></svg>`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(svgCode).then(() => {
        showToast('AVIRON Logo SVG copied to clipboard!');
      });
    }
  };
}

// Copy Brand Guidelines Overview
const copyBrandBtn = $('#copy-brand-guidelines-btn');
if (copyBrandBtn) {
  copyBrandBtn.onclick = () => {
    const specs = `AVIRON Brand Tokens:
- Primary Color: #141210 (AVIRON Noir)
- Accent Metallic: #B28334 (Champagne Gold)
- Highlight: #D9AD5C (Gold Glow)
- Canvas: #FDFBF7 (Warm Alabaster)
- Surface: #F4EEE4 (Oatmeal Sand)
- Typography: Display: Plus Jakarta Sans / Editorial: Cormorant Garamond / UI: Inter / Mono: JetBrains Mono
- Delivery: 3–7 Day Turnaround / 100% Code & Domain Ownership`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(specs).then(() => {
        showToast('Brandkit Specs copied to clipboard!');
      });
    }
  };
}

// Portfolio Filter buttons
$$('.pf-btn').forEach(btn => {
  btn.onclick = () => {
    $$('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.work-track .pi, .tiles .pi').forEach(item => {
      const cat = item.dataset.cat;
      if (filter === 'all' || cat === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
});

// CSS Scroll-Reveal Observer for .reveal, .reveal-tilt, .reveal-scale, etc.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  $$('.reveal, .reveal-scale, .reveal-tilt, .reveal-slide-left, .reveal-slide-right, .reveal-flip, .reveal-spotlight').forEach(el => {
    revealObserver.observe(el);
  });
} else {
  $$('.reveal, .reveal-scale, .reveal-tilt, .reveal-slide-left, .reveal-slide-right, .reveal-flip, .reveal-spotlight').forEach(el => {
    el.classList.add('visible');
  });
}

// =========================================
// GSAP & ScrollTrigger Animation Controller
// =========================================
(function initGSAPSystem() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fallback: If GSAP is not present or user prefers reduced motion, reveal everything immediately
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll("[data-reveal]").forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll(".reveal, .reveal-scale, .reveal-tilt, .reveal-slide-left, .reveal-slide-right, .reveal-flip, .reveal-spotlight").forEach(el => {
      el.classList.add("visible");
    });
    document.querySelectorAll(".mask-heading > *").forEach(el => {
      el.style.transform = "none";
    });
    document.querySelectorAll(".service-progress-line").forEach(el => {
      el.style.strokeDashoffset = "0";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("gsap-loaded");

  // 1. Hero Content Entrance Stagger
  const heroReveal = gsap.utils.toArray("#home [data-reveal]");
  if (heroReveal.length > 0) {
    gsap.fromTo(
      heroReveal,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform",
        delay: 0.15
      }
    );
  }

  // 2. Scroll-Linked Hero Visual Exit (Scale & Translate down)
  const heroVisual = document.querySelector(".hero__visual, [data-tilt]");
  if (heroVisual) {
    gsap.to(heroVisual, {
      y: 45,
      scale: 0.96,
      autoAlpha: 0.75,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 0.6
      }
    });
  }

  // 3. Section-by-Section Data-Reveal
  gsap.utils.toArray("section:not(#home) [data-reveal]").forEach(element => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      }
    );
  });

  // 4. Pinned Horizontal Project Gallery (Selected Work) on Desktop
  const workWrap = document.querySelector(".work-pin-wrap");
  const track = document.querySelector(".work-track");
  if (workWrap && track && window.matchMedia("(min-width: 900px)").matches) {
    const getScrollDist = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
    
    gsap.to(track, {
      x: () => -getScrollDist(),
      ease: "none",
      scrollTrigger: {
        trigger: workWrap,
        start: "top 12%",
        end: () => `+=${getScrollDist()}`,
        pin: true,
        scrub: 0.7,
        invalidateOnRefresh: true
      }
    });
  }

  // 5. Kinetic Stat Counter Animation
  gsap.utils.toArray(".stat-num").forEach(numEl => {
    const rawText = numEl.textContent.trim();
    const numMatch = rawText.match(/\d+/);
    if (!numMatch) return;
    const targetVal = parseInt(numMatch[0], 10);
    const prefix = rawText.startsWith("₹") ? "₹" : "";
    const suffix = rawText.replace(prefix, "").replace(targetVal.toString(), "");

    gsap.fromTo(
      { val: 0 },
      { val: targetVal },
      {
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: numEl,
          start: "top 85%",
          once: true
        },
        onUpdate: function () {
          numEl.textContent = `${prefix}${Math.round(this.targets()[0].val)}${suffix}`;
        }
      }
    );
  });

  // 6. Magnetic CTA Buttons
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.25,
          ease: "power2.out"
        });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)"
        });
      });
    });

    // 7. Hero Bounded 3D Pointer Tilt
    document.querySelectorAll("[data-tilt]").forEach(element => {
      element.addEventListener("pointermove", event => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `perspective(1100px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      element.addEventListener("pointerleave", () => {
        element.style.transform = "perspective(1100px) rotateY(0deg) rotateX(0deg)";
      });
    });

    // 7.1 Dynamic Ambient Pointer Spotlight
    const spotlightTargets = document.querySelectorAll(".reveal-spotlight, .spotlight-card, .bento-card, .pkg-card, .card");
    spotlightTargets.forEach(card => {
      card.addEventListener("pointermove", e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    });
  }

  // 8. Masked Editorial Typography Reveals
  gsap.utils.toArray(".mask-heading > *").forEach(headingEl => {
    gsap.fromTo(
      headingEl,
      { yPercent: 105 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingEl.parentElement,
          start: "top 90%",
          once: true
        }
      }
    );
  });

  // 9. Bronze SVG Progress Line Draw
  document.querySelectorAll(".service-progress-line").forEach(linePath => {
    const length = linePath.getTotalLength ? linePath.getTotalLength() : 1000;
    linePath.style.strokeDasharray = length;
    linePath.style.strokeDashoffset = length;

    const triggerElem = linePath.closest(".timeline-track-wrap") || linePath.closest("section");
    if (triggerElem) {
      gsap.to(linePath, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: triggerElem,
          start: "top 75%",
          end: "bottom 75%",
          scrub: 0.6
        }
      });
    }
  });

  // 10. Active Step Glow on Scroll
  document.querySelectorAll(".active-step-glow").forEach(stepCard => {
    ScrollTrigger.create({
      trigger: stepCard,
      start: "top 72%",
      end: "bottom 28%",
      onEnter: () => stepCard.classList.add("in-view-active"),
      onEnterBack: () => stepCard.classList.add("in-view-active"),
      onLeave: () => stepCard.classList.remove("in-view-active"),
      onLeaveBack: () => stepCard.classList.remove("in-view-active")
    });
  });
})();


