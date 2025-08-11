
(function() {

  const styleTag = document.createElement('style');
  styleTag.textContent = `
    body.dark { background: #0f0f12; color: #e6e6e6; }
    body.dark header { background: #0b0b0d; }
    body.dark .hero { background: linear-gradient(90deg, #2a275f, #1e1b4b); }
    body.dark .card { background: #16161a; box-shadow: 0 4px 12px rgba(0,0,0,.4); }
    body.dark .card h3 { color: #f3f3f3; }
    body.dark .card p { color: #bfbfbf; }
    body.dark .btn, body.dark .btn-primary { background: #4b47c4; }
    /* Barra de progresso */
    #scroll-progress { position: fixed; top: 0; left: 0; height: 4px; width: 0%; background: #6c63ff; z-index: 2000; }
    /* Campo de busca */
    #site-search { position: fixed; top: 12px; right: 12px; z-index: 2001; display: flex; gap: 8px; align-items: center; }
    #site-search input { padding: 8px 10px; border-radius: 8px; border: 1px solid #ddd; min-width: 220px; }
    #theme-toggle { padding: 8px 10px; border-radius: 8px; border: 0; cursor: pointer; background: #6c63ff; color: white; }
    /* Revelar ao rolar */
    .reveal { opacity: 0; transform: translateY(16px); transition: all .6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(styleTag);

  
  const ui = document.createElement('div');
  ui.id = 'site-search';
  ui.innerHTML = `
    <input type="search" placeholder="Buscar produtos..." aria-label="Buscar produtos" />
    <button id="theme-toggle" aria-label="Alternar tema">🌙</button>
  `;
  document.body.appendChild(ui);


  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');

 
  const themeBtn = document.getElementById('theme-toggle');
  const updateIcon = () => themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  updateIcon();
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateIcon();
  });


  const progress = document.createElement('div');
  progress.id = 'scroll-progress';
  document.body.appendChild(progress);
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  const searchInput = ui.querySelector('input[type="search"]');
  const filterCards = () => {
    const q = (searchInput.value || '').trim().toLowerCase();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
      card.style.display = title.includes(q) ? '' : 'none';
    });
  };
  searchInput.addEventListener('input', filterCards);

 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .hero, .carousel, section, .destaques, .perifericos').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();


(function() {

  const css = `
    /* Modal base */
    .ux-modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,.6);
      display: none; align-items: center; justify-content: center;
      z-index: 3000;
    }
    .ux-modal {
      background: #fff; color: #222; max-width: 720px; width: 92%;
      border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.3);
      overflow: hidden;
    }
    body.dark .ux-modal { background: #16161a; color: #eee; }
    .ux-modal header { display:flex; justify-content: space-between; align-items:center; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,.08); }
    .ux-modal header h3 { margin: 0; font-size: 1.1rem; }
    .ux-modal .ux-modal-content { padding: 16px; max-height: 70vh; overflow: auto; }
    .ux-close { background: transparent; border: 0; font-size: 1.2rem; cursor: pointer; }
    /* Botões flutuantes painéis */
    .ux-fab {
      position: fixed; bottom: 20px; right: 20px; z-index: 2500;
      background: #6c63ff; color: #fff; border: 0; border-radius: 999px;
      padding: 12px 14px; box-shadow: 0 8px 20px rgba(0,0,0,.25); cursor:pointer;
    }
    .ux-panel {
      position: fixed; bottom: 80px; right: 20px; z-index: 2500;
      background: #fff; color: #222; border-radius: 12px; width: 280px; max-height: 60vh; overflow:auto;
      box-shadow: 0 10px 24px rgba(0,0,0,.25); display: none;
    }
    body.dark .ux-panel { background:#16161a; color:#eee; }
    .ux-panel header { display:flex; justify-content: space-between; align-items:center; padding: 10px 12px; border-bottom: 1px solid rgba(0,0,0,.08); }
    .ux-panel .ux-panel-content { padding: 10px 12px; }
    .ux-list { list-style: none; margin: 0; padding: 0; }
    .ux-list li { display:flex; align-items:center; gap:10px; padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,.06); }
    .ux-list img { width: 42px; height: 42px; object-fit: cover; border-radius: 8px; }
    .ux-actions { display:flex; gap:8px; align-items:center; }
    .ux-pill { font-size:.8rem; padding: 2px 8px; background:#eee; border-radius:999px; }
    body.dark .ux-pill { background:#222; }
    /* Quick view + wishlist ícones no card */
    .ux-card-actions {
      position: absolute; top: 8px; right: 8px; display: flex; gap: 6px;
    }
    .ux-quick, .ux-heart {
      background: rgba(0,0,0,.6); color: #fff; border: 0; border-radius: 999px; width: 34px; height: 34px; cursor: pointer;
      display:flex; align-items:center; justify-content:center;
    }
    .ux-heart.active { background: #e0245e; }
    .card { position: relative; } /* para posicionar ícones */
    /* Toast */
    .ux-toast {
      position: fixed; left: 50%; transform: translateX(-50%);
      bottom: 24px; background: #111; color: #fff; padding: 10px 12px;
      border-radius: 8px; z-index: 2600; display: none;
    }
    /* Tooltips simples */
    [data-tip] { position: relative; }
    [data-tip]:hover::after {
      content: attr(data-tip);
      position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,.8); color: #fff; padding: 4px 8px; font-size: .75rem; border-radius: 6px; white-space: nowrap;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

 
  function createModal(title, html) {
    let backdrop = document.querySelector('.ux-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'ux-modal-backdrop';
      backdrop.innerHTML = `
        <div class="ux-modal" role="dialog" aria-modal="true">
          <header><h3></h3><button class="ux-close" aria-label="Fechar">✕</button></header>
          <div class="ux-modal-content"></div>
        </div>
      `;
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) hideModal(); });
      document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') hideModal(); });
      backdrop.querySelector('.ux-close').addEventListener('click', hideModal);
    }
    backdrop.querySelector('h3').textContent = title || '';
    backdrop.querySelector('.ux-modal-content').innerHTML = html || '';
    backdrop.style.display = 'flex';
  }
  function hideModal(){ const b = document.querySelector('.ux-modal-backdrop'); if (b) b.style.display='none'; }

  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea';
    if (e.key === '/' && !typing) {
      e.preventDefault();
      const input = document.querySelector('#site-search input[type="search"]');
      if (input) { input.focus(); input.select(); }
    }
    if (e.key.toLowerCase() === 't' && !typing) {
      e.preventDefault();
      document.getElementById('theme-toggle')?.click();
    }
    if (e.key === '?' && !typing) {
      e.preventDefault();
      createModal('Ajuda rápida (atalhos)', `
        <ul class="ux-list">
          <li><span class="ux-pill">/</span> Focar na busca</li>
          <li><span class="ux-pill">T</span> Alternar tema claro/escuro</li>
          <li><span class="ux-pill">ESC</span> Fechar modais</li>
          <li><span class="ux-pill">↑ / ↓</span> Voltar ao topo / rolar</li>
        </ul>
      `);
    }
  });


  const wishlistKey = 'ux_wishlist_v1';
  const getWishlist = () => JSON.parse(localStorage.getItem(wishlistKey) || '[]');
  const setWishlist = (arr) => localStorage.setItem(wishlistKey, JSON.stringify(arr));

  document.querySelectorAll('.card').forEach(card => {

    const title = card.querySelector('h3')?.textContent?.trim() || 'Produto';
    const img = card.querySelector('img')?.getAttribute('src') || '';
 
    const actions = document.createElement('div');
    actions.className = 'ux-card-actions';
    const quick = document.createElement('button'); quick.className = 'ux-quick'; quick.textContent = '👁️'; quick.title='Visualizar';
    const heart = document.createElement('button'); heart.className = 'ux-heart'; heart.textContent = '❤'; heart.title='Favoritar';
    actions.appendChild(quick); actions.appendChild(heart);
    card.appendChild(actions);


    const wl = getWishlist();
    if (wl.find(i => i.title === title)) heart.classList.add('active');


    quick.addEventListener('click', () => {
      const desc = card.querySelector('.tab-content p')?.outerHTML || '';
      const specs = card.querySelector('.tab-content ul')?.outerHTML || '';
      const btn = card.querySelector('a.btn, a.btn-primary');
      const link = btn ? `<p><a href="${btn.href}" target="_blank" rel="noopener">Abrir link de compra</a></p>` : '';
      createModal(title, `
        <div style="display:flex; gap:16px; align-items:flex-start; flex-wrap:wrap;">
          <img src="${img}" alt="${title}" style="width:220px; height:220px; object-fit:cover; border-radius:8px;" />
          <div style="flex:1; min-width:220px;">
            ${desc || ''}
            ${specs || ''}
            ${link}
          </div>
        </div>
      `);
    });


    heart.addEventListener('click', () => {
      let items = getWishlist();
      const idx = items.findIndex(i => i.title === title);
      if (idx >= 0) { items.splice(idx,1); heart.classList.remove('active'); toast('Removido dos favoritos'); }
      else { items.push({ title, img }); heart.classList.add('active'); toast('Adicionado aos favoritos'); }
      setWishlist(items);
      renderWishlist();
    });


    const registerView = () => {
      const key = 'ux_recent_v1';
      let arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr = arr.filter(i => i.title !== title);
      arr.unshift({ title, img });
      if (arr.length > 10) arr.pop();
      localStorage.setItem(key, JSON.stringify(arr));
      renderRecent();
    };
    card.querySelector('img')?.addEventListener('click', registerView);
    card.querySelector('a.btn, a.btn-primary')?.addEventListener('click', registerView);
  });


  function buildPanel(id, title) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.className = 'ux-panel';
      el.innerHTML = `<header><strong>${title}</strong><button class="ux-close" aria-label="Fechar">✕</button></header><div class="ux-panel-content"></div>`;
      document.body.appendChild(el);
      el.querySelector('.ux-close').addEventListener('click', ()=> el.style.display='none');
    }
    return el;
  }

  function renderWishlist() {
    const panel = buildPanel('ux-wishlist', 'Favoritos');
    const content = panel.querySelector('.ux-panel-content');
    const items = JSON.parse(localStorage.getItem('ux_wishlist_v1') || '[]');
    if (!items.length) { content.innerHTML = '<p>Nenhum favorito ainda.</p>'; return; }
    content.innerHTML = '<ul class="ux-list">' + items.map(i => `<li><img src="${i.img}" alt=""><span>${i.title}</span></li>`).join('') + '</ul>';
  }

  function renderRecent() {
    const panel = buildPanel('ux-recent', 'Vistos recentemente');
    const content = panel.querySelector('.ux-panel-content');
    const items = JSON.parse(localStorage.getItem('ux_recent_v1') || '[]');
    if (!items.length) { content.innerHTML = '<p>Você ainda não viu produtos.</p>'; return; }
    content.innerHTML = '<ul class="ux-list">' + items.map(i => `<li><img src="${i.img}" alt=""><span>${i.title}</span></li>`).join('') + '</ul>';
  }


  let fabWishlist = document.getElementById('ux-fab-wishlist');
  if (!fabWishlist) {
    fabWishlist = document.createElement('button');
    fabWishlist.className = 'ux-fab';
    fabWishlist.id = 'ux-fab-wishlist';
    fabWishlist.textContent = '❤';
    fabWishlist.title = 'Ver favoritos';
    document.body.appendChild(fabWishlist);
    fabWishlist.addEventListener('click', () => {
      renderWishlist();
      const p = document.getElementById('ux-wishlist'); p.style.display = (p.style.display === 'block' ? 'none':'block');
    });
  }

  let fabRecent = document.getElementById('ux-fab-recent');
  if (!fabRecent) {
    fabRecent = document.createElement('button');
    fabRecent.className = 'ux-fab';
    fabRecent.id = 'ux-fab-recent';
    fabRecent.style.right = '70px';
    fabRecent.textContent = '🕒';
    fabRecent.title = 'Vistos recentemente';
    document.body.appendChild(fabRecent);
    fabRecent.addEventListener('click', () => {
      renderRecent();
      const p = document.getElementById('ux-recent'); p.style.display = (p.style.display === 'block' ? 'none':'block');
    });
  }


  function toast(msg) {
    let t = document.querySelector('.ux-toast');
    if (!t) { t = document.createElement('div'); t.className = 'ux-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(t._id);
    t._id = setTimeout(()=> t.style.display='none', 2200);
  }

  window.addEventListener('offline', ()=> toast('Você está offline'));
  window.addEventListener('online', ()=> toast('Conexão restabelecida'));

 
  const prefetchSet = new Set();
  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || prefetchSet.has(href) || href.startsWith('#') || href.startsWith('mailto:')) return;
    prefetchSet.add(href);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    document.head.appendChild(l);
  }, { passive: true });

  
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
       
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' }) : null;
  if (io) document.querySelectorAll('img').forEach(img => io.observe(img));

})();



(function() {
  const routes = {
    '0': 'index.html',
    '1': 'placav.html',
    '2': 'perif.html',
    '3': 'Proc.html',
    '4': 'placa-mae.html',
    '5': 'memoria.html'
  };
  function toastNav(label) {
    try {
      if (typeof toast === 'function') toast('Indo para: ' + label);
    } catch(e) {}
  }
  const labels = {
    '0': 'Home',
    '1': 'Placas de Vídeo',
    '2': 'Periféricos',
    '3': 'Processadores',
    '4': 'Placas-mãe',
    '5': 'Memória RAM'
  };
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea';
    if (typing) return;
    if (routes[e.key]) {
      e.preventDefault();
      toastNav(labels[e.key] || '');
      window.location.href = routes[e.key];
    }
  });

  
  document.addEventListener('keydown', (ev) => {
    const tag = (ev.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea';
    if (ev.key === '?' && !typing) {
      setTimeout(() => {
        const content = document.querySelector('.ux-modal-content');
        if (content && !content.querySelector('.ux-num-keys')) {
          const block = document.createElement('div');
          block.className = 'ux-num-keys';
          block.innerHTML = `
            <h4>Atalhos de navegação:</h4>
            <ul class="ux-list">
              <li><span class="ux-pill">0</span> Home</li>
              <li><span class="ux-pill">1</span> Placas de Vídeo</li>
              <li><span class="ux-pill">2</span> Periféricos</li>
              <li><span class="ux-pill">3</span> Processadores</li>
              <li><span class="ux-pill">4</span> Placas-mãe</li>
              <li><span class="ux-pill">5</span> Memória RAM</li>
            </ul>
          `;
          content.appendChild(block);
        }
      }, 10);
    }
  });
})();



(function() {
  const priceKey = 'ux_prices_v1';
  const watchKey = 'ux_price_watches_v1';

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(e){ return fallback; }
  }
  function saveJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  const css = `
    .ux-bell {
      background: rgba(0,0,0,.6); color: #fff; border: 0; border-radius: 999px;
      width: 34px; height: 34px; cursor: pointer; display:flex; align-items:center; justify-content:center;
    }
    .ux-bell.active { background: #ffb020; color: #111; }
    .ux-price-tag {
      position: absolute; left: 8px; top: 8px; background: #111; color: #fff;
      padding: 4px 8px; border-radius: 8px; font-size: .85rem; opacity: .92;
    }
    body.dark .ux-price-tag { background: #222; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function fmtBRL(v) {
    try { return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }); }
    catch(e){ return 'R$ ' + (Math.round(v*100)/100); }
  }


  function getOrInitPrice(title) {
    const prices = loadJSON(priceKey, {});
    if (typeof prices[title] === 'number') return prices[title];
  
    const base = Math.floor(500 + Math.random()*3500);
    prices[title] = base;
    saveJSON(priceKey, prices);
    return base;
  }
  function setPrice(title, value) {
    const prices = loadJSON(priceKey, {});
    prices[title] = value;
    saveJSON(priceKey, prices);
  }

  
  document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('h3')?.textContent?.trim();
    if (!title) return;


    let tag = card.querySelector('.ux-price-tag');
    if (!tag) {
      tag = document.createElement('div');
      tag.className = 'ux-price-tag';
      card.appendChild(tag);
    }
    tag.setAttribute('data-tip', 'Preço simulado (mock)');
    const current = getOrInitPrice(title);
    tag.textContent = fmtBRL(current);

    let actions = card.querySelector('.ux-card-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'ux-card-actions';
      actions.style.top = '8px';
      actions.style.right = '8px';
      card.appendChild(actions);
    }
    let bell = actions.querySelector('.ux-bell');
    if (!bell) {
      bell = document.createElement('button');
      bell.className = 'ux-bell';
      bell.textContent = '🔔';
      bell.title = 'Avisar queda de preço';
      actions.appendChild(bell);
    }


    const watches = loadJSON(watchKey, []);
    const hasWatch = watches.find(w => w.title === title);
    if (hasWatch) bell.classList.add('active');

  
    bell.addEventListener('click', () => {
      const cur = getOrInitPrice(title);
      const alvo = prompt('Informe o preço desejado para receber alerta (R$):', String(cur - Math.floor(cur*0.1)));
      if (!alvo) return;
      const alvoNum = parseFloat(String(alvo).replace(',', '.'));
      if (isNaN(alvoNum) || alvoNum <= 0) { if (typeof toast==='function') toast('Valor inválido.'); return; }

      let arr = loadJSON(watchKey, []);
      const idx = arr.findIndex(w => w.title === title);
      if (idx >= 0) arr[idx] = { title, target: alvoNum, last: 0 };
      else arr.push({ title, target: alvoNum, last: 0 });
      saveJSON(watchKey, arr);
      bell.classList.add('active');
      if (typeof toast==='function') toast('Alerta cadastrado para ' + title + ' em ' + fmtBRL(alvoNum));
    });
  });

 
  setInterval(() => {
    const cards = Array.from(document.querySelectorAll('.card'));
    if (!cards.length) return;
    const watches = loadJSON(watchKey, []);
    if (!watches.length) return;

    const now = Date.now();
    const NOTIFY_COOLDOWN = 1000 * 60 * 60; // 1h

    watches.forEach(w => {
    
      const cur = getOrInitPrice(w.title);
      const delta = Math.floor((Math.random()*40) - 20); // +/- R$20
      const newPrice = Math.max(200, cur + delta);
      setPrice(w.title, newPrice);

      const card = cards.find(c => (c.querySelector('h3')?.textContent?.trim()) === w.title);
      if (card) {
        const tag = card.querySelector('.ux-price-tag');
        if (tag) tag.textContent = fmtBRL(newPrice);
      }

   
      if (newPrice <= w.target && (!w.last || now - w.last > NOTIFY_COOLDOWN)) {
        if (typeof toast === 'function') toast(`Preço caiu! ${w.title}: ${fmtBRL(newPrice)} (alvo: ${fmtBRL(w.target)})`);
      
        const arr = loadJSON(watchKey, []);
        const idx = arr.findIndex(x => x.title === w.title);
        if (idx >= 0) { arr[idx].last = now; saveJSON(watchKey, arr); }
      }
    });
  }, 15000);
})();

