gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------------
     1. Cyclemon Master Polaroid Controller & Background Morphing
  ------------------------------------------------------------- */
  const photoLayers = document.querySelectorAll(".photo-layer");
  const mainPolaroid = document.getElementById("mainPolaroid");
  const mainCaption = document.getElementById("mainCaption");
  const navDots = document.querySelectorAll(".nav-dot");

  const chapterData = [
    { caption: "Happy Birthday, MY WIFE 💍", rot: -3, scale: 1 },
    { caption: "Original JB 📍", rot: 3, scale: 0.95 },
    { caption: "Always connected ✈️", rot: -2, scale: 0.92 },
    { caption: "Holy Shit She's so pretty 😭🙏", rot: 2, scale: 0.95 },
    { caption: "A few of your favorite things 🌷 (I'm your Favorite person😛)", rot: -4, scale: 0.95 },
    { caption: "Sayangi Dirimu Atau Aku yang Sayangi Kamu 😚", rot: 0, scale: 1.05 }
  ];

  // Dedicated romantic background atmosphere for each chapter
  const bgColors = [
    "#FBF7F4", // 0. Welcome (Soft Linen)
    "#F7EDE7", // 1. Origins (Peach Blush)
    "#EAEFF2", // 2. Journey (Misty Sky)
    "#F5EFEB", // 3. Letter (Antique Parchment)
    "#FCEEEF", // 4. Favorites (Rose Mist)
    "#F3E8E4"  // 5. Finale (Muted Velvet)
  ];

  function switchScene(index) {
    photoLayers.forEach((layer, i) => {
      if (i === index) layer.classList.add("active");
      else layer.classList.remove("active");
    });

    if (chapterData[index]) {
      gsap.to(mainPolaroid, {
        rotation: chapterData[index].rot,
        scale: chapterData[index].scale,
        duration: 0.6,
        ease: "power2.out"
      });
      mainCaption.textContent = chapterData[index].caption;
    }

    navDots.forEach((dot, i) => {
      if (i === index) dot.classList.add("active");
      else dot.classList.remove("active");
    });

    // Smooth background color interpolation
    gsap.to("body", { 
      backgroundColor: bgColors[index], 
      duration: 0.8, 
      ease: "power2.out" 
    });
  }

  // Bind ScrollTrigger to all 6 Chapters
  chapterData.forEach((_, idx) => {
    ScrollTrigger.create({
      trigger: `#chapter-${idx}`,
      start: "top center",
      end: "bottom center",
      onEnter: () => switchScene(idx),
      onEnterBack: () => switchScene(idx)
    });
  });

  navDots.forEach(dot => {
    dot.addEventListener("click", () => {
      const idx = dot.getAttribute("data-index");
      document.getElementById(`chapter-${idx}`).scrollIntoView({ behavior: "smooth" });
    });
  });

  /* -------------------------------------------------------------
     2. Parting Assets Animations (Adaptive for Phone/Desktop)
  ------------------------------------------------------------- */
  const isMobile = window.innerWidth <= 860;

  gsap.utils.toArray(".left-side").forEach(side => {
    gsap.from(side, {
      scrollTrigger: {
        trigger: side,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      },
      x: isMobile ? 0 : -80,
      y: isMobile ? 40 : 0,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  });

  gsap.utils.toArray(".right-side").forEach(side => {
    gsap.from(side, {
      scrollTrigger: {
        trigger: side,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      },
      x: isMobile ? 0 : 80,
      y: isMobile ? 40 : 0,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  });

  /* -------------------------------------------------------------
     3. Chapter 2 Distance Tabs & Dynamic Hanging Polaroids
  ------------------------------------------------------------- */
  const journeyBtns = document.querySelectorAll(".journey-btn");
  const geoViews = document.querySelectorAll(".geo-view");
  const miniPhoto1 = document.getElementById("miniPhoto1");
  const miniPhoto2 = document.getElementById("miniPhoto2");
  const miniLabel1 = document.getElementById("miniLabel1");
  const miniLabel2 = document.getElementById("miniLabel2");

  const tabMedia = {
    born: {
      img1: "images/hospme.png",
      lbl1: "Sg. Buloh (Me)",
      img2: "images/hospital.JPG",
      lbl2: "HSA JB (You)"
    },
    grew: {
      img1: "images/fairfax.png",
      lbl1: "Fairfax, USA (Me)",
      img2: "images/johorbaru.png",
      lbl2: "Johor Bahru (You)"
    },
    now: {
      img1: "images/UPSIi.png",
      lbl1: "UPSI Campus (Me)",
      img2: "images/UTHM.jpg",
      lbl2: "UTHM Campus (You)"
    }
  };

  journeyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-view");
      const targetView = `geo-${type}`;
      
      journeyBtns.forEach(b => b.classList.remove("active"));
      geoViews.forEach(v => v.classList.remove("active"));

      btn.classList.add("active");
      const activeEl = document.getElementById(targetView);
      if (activeEl) {
        activeEl.classList.add("active");
      }

      // Swap and animate mini hanging polaroids
      gsap.to(".hanging-polaroids", {
        scale: 0.92,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        onRepeat: () => {
          miniPhoto1.src = tabMedia[type].img1;
          miniLabel1.textContent = tabMedia[type].lbl1;
          miniPhoto2.src = tabMedia[type].img2;
          miniLabel2.textContent = tabMedia[type].lbl2;
        }
      });
    });
  });

  /* -------------------------------------------------------------
     4. Realistic Earth 3D Canvas Globe (Blue & Green Continents)
  ------------------------------------------------------------- */
  const canvas = document.getElementById("globeCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const radius = width * 0.42;

    let rotX = -0.3; // Longitude angle in radians
    let isDragging = false;
    let startX = 0;

    // Approximated Continental Polygon shapes in [Longitude Deg, Latitude Deg]
    const continents = [
      // North America
      [[-160, 70], [-100, 75], [-60, 60], [-75, 30], [-100, 20], [-120, 35], [-160, 60]],
      // South America
      [[-80, 10], [-40, -10], [-55, -40], [-70, -50], [-75, -20]],
      // Eurasia & Africa
      [[0, 60], [40, 70], [140, 70], [120, 25], [80, 10], [45, 15], [50, -30], [20, -35], [10, 5], [-10, 35]],
      // Southeast Asia & Australia
      [[95, 20], [115, 10], [120, -5], [140, -20], [150, -35], [115, -30], [100, -5]]
    ];

    function project(lngDeg, latDeg) {
      const lambda = (lngDeg * Math.PI) / 180 + rotX;
      const phi = (latDeg * Math.PI) / 180;

      // Check if back-facing
      const cosC = Math.cos(phi) * Math.cos(lambda);
      const isVisible = cosC > 0;

      const x = (width / 2) + radius * Math.cos(phi) * Math.sin(lambda);
      const y = (height / 2) - radius * Math.sin(phi);

      return { x, y, isVisible };
    }

    function renderGlobe() {
      ctx.clearRect(0, 0, width, height);

      // 1. Ocean Base (Crisp Blue)
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#6ca0dc";
      ctx.fill();

      // Atmospheric inner shadow
      const grad = ctx.createRadialGradient(width / 2 - 20, height / 2 - 20, radius * 0.4, width / 2, height / 2, radius);
      grad.addColorStop(0, "rgba(255,255,255,0.2)");
      grad.addColorStop(1, "rgba(0,35,80,0.45)");
      ctx.fillStyle = grad;
      ctx.fill();

      // 2. Continents (Natural Green)
      continents.forEach(poly => {
        ctx.beginPath();
        let started = false;

        poly.forEach(([lng, lat]) => {
          const pt = project(lng, lat);
          if (pt.isVisible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        });

        if (started) {
          ctx.closePath();
          ctx.fillStyle = "#82b471";
          ctx.fill();
        }
      });

      // 3. Pin: Fairfax Virginia USA (-77°, 38°)
      const ptVA = project(-77, 38);
      // 4. Pin: Johor Bahru Malaysia (103°, 1.5°)
      const ptMY = project(103, 1.5);

      // Flight Route Arc
      if (ptVA.isVisible || ptMY.isVisible) {
        ctx.beginPath();
        ctx.moveTo(ptVA.x, ptVA.y);
        ctx.quadraticCurveTo(width / 2, height / 2 - radius * 0.8, ptMY.x, ptMY.y);
        ctx.strokeStyle = "#6b1426";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Virginia Dot
      if (ptVA.isVisible) {
        ctx.beginPath();
        ctx.arc(ptVA.x, ptVA.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#6b1426";
        ctx.fill();
      }

      // Draw Malaysia Dot
      if (ptMY.isVisible) {
        ctx.beginPath();
        ctx.arc(ptMY.x, ptMY.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#6b1426";
        ctx.fill();
      }

      // Border Ring
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(107, 20, 38, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    renderGlobe();

    // Mouse Drag Controller
    canvas.addEventListener("mousedown", e => {
      isDragging = true;
      startX = e.clientX;
    });

    window.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      rotX += deltaX * 0.008;
      startX = e.clientX;
      renderGlobe();
    });

    window.addEventListener("mouseup", () => isDragging = false);

    // Controlled, smooth idle spin
    setInterval(() => {
      if (!isDragging) {
        rotX += 0.003;
        renderGlobe();
      }
    }, 40);
  }

  /* -------------------------------------------------------------
     
  ------------------------------------------------------------- */
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  const musicText = document.getElementById("musicText");
  let isPlaying = false;

  musicToggle.addEventListener("click", () => {
    if (!isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add("playing");
        musicText.textContent = "You're Gonna Live Forever in Me 🎵";
      }).catch(err => console.log("Audio block:", err));
    } else {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.classList.remove("playing");
      musicText.textContent = "Play Music";
    }
  });

  /* -------------------------------------------------------------
     6. Finale Shower of Love (Confetti + Emojis)
  ------------------------------------------------------------- */
  const loveBtn = document.getElementById("loveBtn");

  loveBtn.addEventListener("click", () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#6b1426', '#9e233d', '#fbf7f4', '#f7b2bd']
    });

    const scalar = 3.2;
    const tulip = confetti.shapeFromText({ text: '🌷', scalar });
    const elephant = confetti.shapeFromText({ text: '🐘', scalar });
    const lipstick = confetti.shapeFromText({ text: '💄', scalar });
    const heart = confetti.shapeFromText({ text: '💖', scalar });

    confetti({
      shapes: [tulip, elephant, lipstick, heart],
      scalar,
      particleCount: 50,
      spread: 100,
      origin: { y: 0.6 }
    });

    gsap.to(loveBtn, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
  });

  /* -------------------------------------------------------------
     7. Sephora VIP Voucher Modal & Code Copy Engine
  ------------------------------------------------------------- */
  const voucherModal = document.getElementById("voucherModal");
  const openVoucherBtn = document.getElementById("openVoucherBtn");
  const closeVoucherBtn = document.getElementById("closeVoucherBtn");
  const copyCodeBtn = document.getElementById("copyCodeBtn");
  const voucherCodeText = document.getElementById("voucherCodeText");

  if (openVoucherBtn && voucherModal) {
    openVoucherBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      voucherModal.classList.add("active");

      // Mini festive confetti burst when card opens
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#000000', '#6b1426', '#d4a373']
      });
    });

    closeVoucherBtn.addEventListener("click", () => {
      voucherModal.classList.remove("active");
    });

    voucherModal.addEventListener("click", (e) => {
      if (e.target === voucherModal) {
        voucherModal.classList.remove("active");
      }
    });


    copyCodeBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(voucherCodeText.textContent.trim()).then(() => {
        copyCodeBtn.textContent = "Copied! ✓";
        copyCodeBtn.style.background = "#2e7d32";
        setTimeout(() => {
          copyCodeBtn.textContent = "Copy";
          copyCodeBtn.style.background = "#000000";
        }, 2000);
      });
    });
  }

  // Blooming Tulip Modal Handler
const openTulipBtn = document.getElementById('openTulipBtn');
  const closeTulipBtn = document.getElementById('closeTulipBtn');
  const tulipModal = document.getElementById('tulipModal');

  if (openTulipBtn && tulipModal) {
    openTulipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      tulipModal.classList.add('active');
    });

    if (closeTulipBtn) {
      closeTulipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        tulipModal.classList.remove('active');
      });
    }

    tulipModal.addEventListener('click', (e) => {
      if (e.target === tulipModal) {
        tulipModal.classList.remove('active');
      }
    });
  }

  /* -------------------------------------------------------------
     9. Urgent Love Letter Scrollable Modal Handler
  ------------------------------------------------------------- */
  const openUrgentBtn = document.getElementById('openUrgentLetterBtn');
  const closeUrgentBtn = document.getElementById('closeUrgentLetterBtn');
  const urgentModal = document.getElementById('urgentLetterModal');

  if (openUrgentBtn && urgentModal) {
    openUrgentBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      urgentModal.classList.add('active');
    });

    if (closeUrgentBtn) {
      closeUrgentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        urgentModal.classList.remove('active');
      });
    }

    urgentModal.addEventListener('click', (e) => {
      if (e.target === urgentModal) {
        urgentModal.classList.remove('active');
      }
    });
  }

});
