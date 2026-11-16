/* Ken Flores, portfolio. Aucun build : ce fichier est servi tel quel par GitHub Pages. */
(function(){
  /* --- vues (onglets) : l'ancre de l'URL choisit la vue affichée ---
     #accueil, #expleo, #milan… sont des vues ; #profil, #competences… sont des ancres
     à l'intérieur d'une vue ; #contact et #top sont hors des vues (toujours visibles).
     La position de défilement et la vue sont mémorisées dans history.state pour
     que Précédent / Suivant et le rechargement retrouvent la page telle qu'on l'a laissée. */
  var root = document.documentElement;
  function route(){}
  function onHash(e){ route(e); }
  try {
    var views = Array.prototype.slice.call(document.querySelectorAll('[data-view]'));
    var home = document.getElementById('accueil');
    var navLinks = document.querySelectorAll('.bar nav a[data-nav]');
    var baseTitle = document.title, current = null;
    if('scrollRestoration' in history){ history.scrollRestoration = 'manual'; }
    var jump = function(el, y){ if(el){ el.scrollIntoView(); } else { window.scrollTo(0, y || 0); } };
    /* mise en page du héros (orbite haute ou classique) : une position mémorisée dans l'autre mise en page ne vaut plus */
    var layout = function(){ return window.kfOrbitOn ? window.kfOrbitOn() : false; };
    var saveState = function(){
      try { history.replaceState({y: window.scrollY, v: current ? current.id : null, o: layout()}, ''); } catch(err){}
    };
    var focusOn = function(el){
      if(!el){ return; }
      if(!el.matches('a[href],button,input,select,textarea,[tabindex]')){ el.setAttribute('tabindex', '-1'); }
      el.focus({preventScroll: true});
    };
    var show = function(view){
      views.forEach(function(v){
        var on = v === view;
        v.classList.toggle('on', on);
        if(!on){ v.querySelectorAll('video').forEach(function(vd){ vd.pause(); }); }
      });
      current = view;
      var lb = document.getElementById('lb');
      if(lb && lb.open){ lb.close(); }
      document.title = view.dataset.title ? view.dataset.title + ' – Ken Flores' : baseTitle;
      navLinks.forEach(function(a){
        if(a.dataset.nav === view.dataset.nav){ a.setAttribute('aria-current', 'page'); } else { a.removeAttribute('aria-current'); }
      });
    };
    route = function(e){
      var id = '';
      try { id = decodeURIComponent(location.hash.slice(1)); } catch(err){}
      var target = id ? document.getElementById(id) : null;
      var view = target ? target.closest('[data-view]') : null;
      var st = history.state || {}, y = typeof st.y === 'number' && (st.v !== 'accueil' || st.o === undefined || st.o === layout()) ? st.y : null;
      var saved = st.v ? document.getElementById(st.v) : null;
      if(target && !view){
        /* #contact, #top : on reste sur la vue d'où l'on vient */
        var keep = saved && saved.hasAttribute('data-view') ? saved : (current || home);
        if(keep !== current){ show(keep); if(e){ focusOn(keep.querySelector('h1')); } }
        if(y !== null){ jump(null, y); } else { jump(target); }
        if(e && id === 'top'){ focusOn(target); }
        return;
      }
      if(!view){ view = home; target = null; }
      var changed = view !== current;
      if(changed){ show(view); }
      if(y !== null){
        if(changed && e){ focusOn(view.querySelector('h1')); }
        jump(null, y);
        return;
      }
      if(!changed && e){ return; }
      var inner = target && target !== view;
      if(inner){ jump(target); } else { jump(null, 0); }
      if(changed && e){ focusOn(inner ? (target.querySelector('h1,h2,h3') || target) : view.querySelector('h1')); }
    };
    document.addEventListener('click', function(e){
      if(e.target.closest && e.target.closest('a[href^="#"]')){ clearTimeout(saveT); saveState(); }
    }, true);
    var saveT;
    window.addEventListener('popstate', function(){ clearTimeout(saveT); });
    window.addEventListener('scroll', function(){ clearTimeout(saveT); saveT = setTimeout(saveState, 250); }, {passive: true});
    onHash = function(e){ route(e); saveState(); };
    window.addEventListener('hashchange', onHash);
    route();
    saveState();
  } catch(err){
    /* en cas d'erreur : tout le contenu redevient visible, comme sans JavaScript */
    window.removeEventListener('hashchange', onHash);
    if('scrollRestoration' in history){ history.scrollRestoration = 'auto'; }
    root.classList.remove('js');
    if(window.console){ console.error(err); }
  }
})();

(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- entrée du héros : jouée une seule fois. kf-done est l'animation la plus longue, posée sur .hero-txt (toujours affiché) ;
     à sa fin (ou si on quitte l'accueil avant), .kf-played retire toutes les animations d'entrée (elles ne se rejouent pas au retour sur l'accueil). --- */
  var heroFig = document.querySelector('.hero-txt');
  if(heroFig){
    var played = function(e){
      if(e.target === heroFig && e.animationName === 'kf-done'){ document.documentElement.classList.add('kf-played'); }
    };
    heroFig.addEventListener('animationend', played);
    heroFig.addEventListener('animationcancel', played);
  }

  /* --- vue éclatée --- */
  var fig = document.getElementById('xfig');
  if(fig){
  var svg = fig.querySelector('.xview'), tog = document.getElementById('xtoggle');
  function setLabel(){ tog.textContent = svg.classList.contains('assembled') ? 'Éclater la vue' : 'Assembler'; }
  if(!reduce && 'IntersectionObserver' in window){
    svg.classList.add('still','assembled');
    svg.getBoundingClientRect();
    svg.classList.remove('still');
    var xo = new IntersectionObserver(function(es){ es.forEach(function(e){
      if(e.isIntersecting){ setTimeout(function(){ svg.classList.remove('assembled'); setLabel(); }, 250); xo.disconnect(); }
    }); }, {threshold:.45});
    xo.observe(svg);
  }
  setLabel();
  tog.addEventListener('click', function(){ svg.classList.toggle('assembled'); setLabel(); });
  var btns = fig.querySelectorAll('.parts button');
  function activate(p){
    if(p){ fig.setAttribute('data-active', p); } else { fig.removeAttribute('data-active'); }
    btns.forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset.part === p)); });
  }
  btns.forEach(function(b){
    b.addEventListener('mouseenter', function(){ activate(b.dataset.part); });
    b.addEventListener('focus', function(){ activate(b.dataset.part); });
    b.addEventListener('click', function(){ activate(b.dataset.part); if(svg.classList.contains('assembled')){ svg.classList.remove('assembled'); setLabel(); } });
  });
  fig.querySelector('.parts').addEventListener('mouseleave', function(){ activate(null); });
  svg.querySelectorAll('.part').forEach(function(g){
    g.addEventListener('mouseenter', function(){ activate(g.dataset.part); });
    g.addEventListener('mouseleave', function(){ activate(null); });
    g.addEventListener('click', function(){ activate(g.dataset.part); });
  });
  }

  /* --- animation AuraFlow --- */
  document.querySelectorAll('.film').forEach(function(f){
    var v = f.querySelector('video'), b = f.querySelector('.pp');
    function sync(){ var playing = !v.paused; b.textContent = playing ? 'Pause' : 'Lire l’animation'; b.setAttribute('aria-pressed', String(playing)); }
    b.addEventListener('click', function(){ if(v.paused){ v.play(); } else { v.pause(); } });
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    if(!reduce && 'IntersectionObserver' in window){
      var started = false;
      new IntersectionObserver(function(es){ es.forEach(function(e){
        if(e.isIntersecting && !started){ started = true; var p = v.play(); if(p && p.catch) p.catch(function(){}); }
        else if(!e.isIntersecting && !v.paused){ v.pause(); started = false; }
      }); }, {threshold:.4}).observe(v);
    }
  });

  /* --- visionneuse --- */
  var lb = document.getElementById('lb'), lbImg = document.getElementById('lb-img'), lbCap = document.getElementById('lb-cap');
  var prev = document.getElementById('lb-prev'), next = document.getElementById('lb-next');
  var set = [], idx = 0;
  function show(i){
    idx = (i + set.length) % set.length;
    lbImg.src = set[idx].src; lbImg.alt = set[idx].alt; lbCap.textContent = set[idx].cap;
    prev.hidden = next.hidden = set.length < 2;
  }
  function open(items, i){ set = items; show(i); if(lb.showModal){ lb.showModal(); } }
  document.querySelectorAll('[data-gal]').forEach(function(g){
    var bs = Array.prototype.slice.call(g.querySelectorAll('figure > button:not(.pp)'));
    var items = bs.map(function(b){ var im = b.querySelector('img'), fc = b.parentElement.querySelector('figcaption'); b.setAttribute('aria-label', 'Agrandir : ' + (fc ? fc.textContent : im.alt)); return {src: im.currentSrc || im.src, alt: im.alt, cap: fc ? fc.textContent : ''}; });
    bs.forEach(function(b, i){ b.addEventListener('click', function(){ open(items, i); }); });
  });
  document.querySelectorAll('.thumb').forEach(function(b){
    b.setAttribute('aria-label', 'Agrandir : ' + b.dataset.cap);
    b.addEventListener('click', function(){ open([{src: b.dataset.src, alt: b.querySelector('img').alt, cap: b.dataset.cap}], 0); });
  });
  document.getElementById('lb-close').addEventListener('click', function(){ lb.close(); });
  prev.addEventListener('click', function(){ show(idx - 1); });
  next.addEventListener('click', function(){ show(idx + 1); });
  lb.addEventListener('click', function(e){ if(e.target === lb){ lb.close(); } });
  lb.addEventListener('keydown', function(e){ if(e.key === 'ArrowLeft'){ show(idx - 1); } else if(e.key === 'ArrowRight'){ show(idx + 1); } });

  /* --- copier l'adresse --- */
  var copy = document.getElementById('copy'), email = document.getElementById('email');
  copy.addEventListener('click', function(){
    function select(){ var r = document.createRange(); r.selectNodeContents(email); var s = getSelection(); s.removeAllRanges(); s.addRange(r); copy.textContent = 'Adresse sélectionnée'; }
    try { navigator.clipboard.writeText(email.textContent).then(function(){ copy.textContent = 'Adresse copiée'; }, select); } catch(e){ select(); }
    setTimeout(function(){ copy.textContent = 'Copier l’adresse'; }, 2400);
  });
})();
