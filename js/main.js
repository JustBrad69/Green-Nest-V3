const scrollBar = document.getElementById('scrollBar');
  function updateScrollBar(){
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollBar, {passive:true});
  updateScrollBar();

  const bgs = document.querySelectorAll('.chapter-bg');
  let ticking = false;
  function parallax(){
    bgs.forEach(bg=>{
      const speed = parseFloat(bg.dataset.speed || 0.2);
      const rect = bg.parentElement.getBoundingClientRect();
      const offset = rect.top * speed;
      bg.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }
  function onScroll(){ if(!ticking){ requestAnimationFrame(parallax); ticking = true; } }
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener('scroll', onScroll, {passive:true});
    parallax();
  }

  const fadeEls = document.querySelectorAll('.cfade');
  const fadeIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); } });
  }, {threshold:.3});
  fadeEls.forEach(el=> fadeIO.observe(el));

  const chapters = document.querySelectorAll('.chapter[id]');
  const rail = document.getElementById('progressRail');
  const dots = [];
  chapters.forEach(ch=>{
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    const label = document.createElement('span');
    label.className = 'dot-label';
    label.textContent = ch.dataset.label || ch.id;
    dot.appendChild(label);
    dot.addEventListener('click', ()=> ch.scrollIntoView({behavior:'smooth'}));
    rail.appendChild(dot);
    dots.push({dot, ch});
  });
  const chapterIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ dots.forEach(d=> d.dot.classList.toggle('active', d.ch === en.target)); }
    });
  }, {threshold:.5});
  chapters.forEach(ch=> chapterIO.observe(ch));
