
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
