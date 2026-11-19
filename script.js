(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ========================================================================
     1. Pointer-Tracked Specular Spotlight on Bento Cards
     ======================================================================== */
  const cards = document.querySelectorAll(".bento-card");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });
  });

  /* ========================================================================
     2. Hero Ring Mantra Rotation & Subtle Pointer Parallax
     ======================================================================== */
  const mantraEl = document.getElementById("hero-mantra");
  const mantras = ["FOCUS", "GRIT", "CLARITY", "LEVERAGE"];
  let mantraIdx = 0;

  if (mantraEl && !reducedMotion) {
    window.setInterval(() => {
      mantraEl.classList.add("is-fading");
      window.setTimeout(() => {
        mantraIdx = (mantraIdx + 1) % mantras.length;
        mantraEl.textContent = mantras[mantraIdx];
        mantraEl.classList.remove("is-fading");
      }, 320);
    }, 4000);
  }

  const heroEl = document.querySelector(".hero");
  const ringStageEl = document.querySelector(".ring-stage");
  if (heroEl && ringStageEl && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    heroEl.addEventListener("pointermove", (e) => {
      const rect = heroEl.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      const tx = (nx * 12).toFixed(2);
      const ty = (ny * 12).toFixed(2);
      const rx = (-ny * 4).toFixed(2);
      const ry = (nx * 4).toFixed(2);
      ringStageEl.style.transform = `translate3d(${tx}px, ${ty}px, 0) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    heroEl.addEventListener("pointerleave", () => {
      ringStageEl.style.transform = "";
    });
  }

  /* ========================================================================
     3. Interactive Mental Model Reset Deck
     ======================================================================== */
  const resets = [
    {
      pillar: "PILLAR 01 // COGNITIVE MASTERY",
      title: 'The "Everything Is Easy" Mental Cheat Code',
      body: "Labeling a task as hard builds instant mental resistance. Shift the frame and move 10x faster.",
      source: "SHORT #01 · @KENSHOGRID"
    },
    {
      pillar: "PILLAR 02 // STOIC GRIT",
      title: "Why Small Dreams Trap You",
      body: "Life tests the size of your vision along the way. Set a standard that forces you to grow.",
      source: "SHORT #04 · @KENSHOGRID"
    },
    {
      pillar: "PILLAR 03 // EMOTIONAL CLARITY",
      title: "Survival Habits Aren't Your Identity",
      body: "What kept you safe in a heavy chapter does not have to define the architecture of your future.",
      source: "PILLAR 03 RESET · @KENSHOGRID"
    },
    {
      pillar: "PILLAR 04 // ASYMMETRIC LEVERAGE",
      title: "Why $1,000,000 Won't Change Your Life",
      body: "Chasing the number misses the point. Who you become on the climb is the real asset.",
      source: "SHORT #02 · @KENSHOGRID"
    }
  ];

  const deckEl = document.getElementById("reset-deck");
  const tabBtns = document.querySelectorAll(".reset-tab");
  const contentEl = document.getElementById("reset-content");
  const pillarTagEl = document.getElementById("reset-pillar-tag");
  const titleEl = document.getElementById("reset-title");
  const bodyEl = document.getElementById("reset-body");
  const sourceEl = document.getElementById("reset-source");
  const prevBtn = document.getElementById("reset-prev");
  const nextBtn = document.getElementById("reset-next");
  const progressCircle = document.getElementById("reset-progress-circle");

  const CIRCLE_CIRCUMFERENCE = 81.68;
  const CYCLE_DURATION_MS = 12000;

  let activeIndex = 0;
  let elapsedMs = 0;
  let lastTick = performance.now();
  let isPaused = false;
  let switchTimer = null;

  function renderReset(index, immediate = false) {
    const item = resets[index];
    if (!item) return;

    tabBtns.forEach((btn, i) => {
      const active = i === index;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    const applyContent = () => {
      if (pillarTagEl) pillarTagEl.textContent = item.pillar;
      if (titleEl) titleEl.textContent = item.title;
      if (bodyEl) bodyEl.textContent = item.body;
      if (sourceEl) sourceEl.textContent = item.source;
      if (contentEl) contentEl.classList.remove("is-switching");
    };

    if (immediate || reducedMotion || !contentEl) {
      applyContent();
    } else {
      window.clearTimeout(switchTimer);
      contentEl.classList.add("is-switching");
      switchTimer = window.setTimeout(applyContent, 160);
    }

    elapsedMs = 0;
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = "0";
    }
  }

  function stepReset(delta) {
    activeIndex = (activeIndex + delta + resets.length) % resets.length;
    renderReset(activeIndex);
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      if (!Number.isNaN(idx) && idx !== activeIndex) {
        activeIndex = idx;
        renderReset(activeIndex);
      }
    });
  });

  if (prevBtn) prevBtn.addEventListener("click", () => stepReset(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => stepReset(1));

  if (deckEl) {
    deckEl.addEventListener("mouseenter", () => { isPaused = true; });
    deckEl.addEventListener("mouseleave", () => {
      isPaused = false;
      lastTick = performance.now();
    });
    deckEl.addEventListener("focusin", () => { isPaused = true; });
    deckEl.addEventListener("focusout", () => {
      isPaused = false;
      lastTick = performance.now();
    });
    deckEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepReset(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepReset(-1);
      }
    });
  }

  if (!reducedMotion && progressCircle) {
    const tick = (now) => {
      const dt = now - lastTick;
      lastTick = now;
      if (!isPaused && !document.hidden) {
        elapsedMs += dt;
        if (elapsedMs >= CYCLE_DURATION_MS) {
          stepReset(1);
        } else {
          const progress = elapsedMs / CYCLE_DURATION_MS;
          progressCircle.style.strokeDashoffset = (CIRCLE_CIRCUMFERENCE * progress).toFixed(2);
        }
      }
      window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  }

  /* ========================================================================
     4. Scroll Reveal Observer
     ======================================================================== */
  const revealEls = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 80px 0px" }
    );

    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 60) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });
  }

  /* ========================================================================
     5. Copy Business Email + Minimalist Toast
     ======================================================================== */
  const copyBtn = document.getElementById("copy-email-btn");
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove("is-shown");
    }, 2400);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email || "business.kenshogrid@gmail.com";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const tmp = document.createElement("textarea");
          tmp.value = email;
          tmp.setAttribute("readonly", "");
          tmp.style.position = "absolute";
          tmp.style.left = "-9999px";
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand("copy");
          document.body.removeChild(tmp);
        }
        showToast(`Copied ${email}`);
      } catch {
        showToast(email);
      }
    });
  }
})();
