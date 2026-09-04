
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("mainNav");
  const top = document.getElementById("backTop");

  const page = location.pathname.split("/").pop() || "index.html";
  const key = page === "index.html" ? "home" : page.replace(".html","");

  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.toggle("active", a.dataset.page === key);
    a.addEventListener("click", () => {
      const menu = document.getElementById("navMenu");
      if (menu && menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });

  function scrollUI(){
    nav?.classList.toggle("scrolled", scrollY > 25);
    top?.classList.toggle("show", scrollY > 400);
  }
  addEventListener("scroll", scrollUI);
  scrollUI();

  top?.addEventListener("click", () => scrollTo({top:0,behavior:"smooth"}));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add("visible"); observer.unobserve(e.target); }
    });
  }, {threshold:.1});
  document.querySelectorAll(".reveal,.service-card,.value-card,.leader-card,.post-card,.case-card").forEach(el => {
    if(!el.classList.contains("reveal")) el.classList.add("reveal");
    observer.observe(el);
  });

  // Home counters
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = Number(el.dataset.count);
    const suffix = el.textContent.includes("%") ? "%" : "+";
    let current = 0, started = false;
    const io = new IntersectionObserver(es => {
      if(!es[0].isIntersecting || started) return;
      started = true;
      const start = performance.now();
      const duration = 900;
      function tick(t){
        const p = Math.min((t-start)/duration,1);
        current = Math.floor(target * (1-Math.pow(1-p,3)));
        el.textContent = current + suffix;
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.disconnect();
    });
    io.observe(el);
  });

  // Newsletter
  document.querySelector(".newsletter-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    if(!input.value) return;
    alert("Thanks! You are subscribed to the EtechEdge newsletter.");
    e.currentTarget.reset();
  });

  // Contact form
  document.querySelector("#contactForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const msg = document.querySelector("#formMessage");
    msg.textContent = "Thanks! Your message has been received. We'll get back to you within 24 hours.";
    e.currentTarget.reset();
  });

  // Generic demo forms
  document.querySelectorAll(".quick-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("Thank you! Our team will contact you shortly.");
      form.reset();
    });
  });

  // Blog category filter
  document.querySelectorAll(".blog-filters button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".blog-filters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

// ===== Services Carousel (3 visible + center highlight + auto-scroll) =====
(function initServicesCarousel() {
  const track = document.getElementById("servicesTrack");
  const prevBtn = document.getElementById("servicesPrev");
  const nextBtn = document.getElementById("servicesNext");
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll(".service-card"));
  if (cards.length === 0) return;

  let currentIndex = 0;
  let cardsPerView = 3;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 4000; // 4 seconds

  function updateCardsPerView() {
    if (window.innerWidth <= 767) cardsPerView = 1;
    else if (window.innerWidth <= 991) cardsPerView = 2;
    else cardsPerView = 3;
  }

  function updateCarousel() {
    updateCardsPerView();

    const maxIndex = Math.max(0, cards.length - cardsPerView);
    currentIndex = Math.min(Math.max(0, currentIndex), maxIndex);

    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 20;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Highlight center card
    cards.forEach(c => c.classList.remove("is-center"));

    if (cardsPerView === 3) {
      const centerIdx = currentIndex + 1;
      if (cards[centerIdx]) cards[centerIdx].classList.add("is-center");
    } else if (cardsPerView === 2) {
      if (cards[currentIndex]) cards[currentIndex].classList.add("is-center");
    } else {
      if (cards[currentIndex]) cards[currentIndex].classList.add("is-center");
    }

    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  function goNext() {
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    if (currentIndex >= maxIndex) {
      currentIndex = 0; // loop back to start
    } else {
      currentIndex++;
    }
    updateCarousel();
  }

  function goPrev() {
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    if (currentIndex <= 0) {
      currentIndex = maxIndex; // loop to end
    } else {
      currentIndex--;
    }
    updateCarousel();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(goNext, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Buttons
  prevBtn.addEventListener("click", () => {
    goPrev();
    startAutoplay(); // restart timer after manual click
  });

  nextBtn.addEventListener("click", () => {
    goNext();
    startAutoplay();
  });

  // Pause on hover (nice UX)
  const wrapper = track.closest(".services-carousel-wrapper");
  if (wrapper) {
    wrapper.addEventListener("mouseenter", stopAutoplay);
    wrapper.addEventListener("mouseleave", startAutoplay);
  }

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      goPrev();
      startAutoplay();
    }
    if (e.key === "ArrowRight") {
      goNext();
      startAutoplay();
    }
  });

  // Resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel();
      startAutoplay();
    }, 150);
  });

  // Init
  updateCarousel();
  startAutoplay();
})();