(function () {
  const STORAGE_KEY = 'checklist-state';
  const resetBtn = document.getElementById('reset-btn');

  function loadState() {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      return val ? JSON.parse(val) : {};
    } catch { return {}; }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  let state = loadState();
  const allItems = [];
  const itemCounter = {};

  document.querySelectorAll('.check-list[data-sec]').forEach(list => {
    const secId = list.getAttribute('data-sec');
    if (!itemCounter[secId]) itemCounter[secId] = 0;
    list.querySelectorAll('li').forEach(li => {
      const key = `${secId}:${itemCounter[secId]++}`;
      allItems.push({ li, secId, key });
      if (state[key]) li.classList.add('checked');
      li.addEventListener('click', () => {
        li.classList.toggle('checked');
        state[key] = li.classList.contains('checked');
        saveState();
        updateProgress();
      });
    });
  });

  function updateResetBtn() {
    const anyChecked = allItems.some(x => x.li.classList.contains('checked'));
    resetBtn.classList.toggle('visible', anyChecked);
  }

  function updateProgress() {
    const secs = ['c1','c2','c3','c4','c5','c6','c7','c8','c9','c10'];
    let totalAll = 0, doneAll = 0;

    secs.forEach(sid => {
      const items = allItems.filter(x => x.secId === sid);
      const done  = items.filter(x => x.li.classList.contains('checked')).length;
      const total = items.length;
      totalAll += total;
      doneAll  += done;

      const sp   = document.getElementById(`sp-${sid}`);
      const sc   = document.getElementById(`sc-${sid}`);
      const navA = document.querySelector(`#toc-cl a[data-id="${sid}"]`);
      if (sp) sp.textContent = total ? `${done}/${total}` : '';
      if (sc) sc.innerHTML = `<strong>${done}</strong> / ${total} completed`;
      if (navA) navA.classList.toggle('sec-done', done === total && total > 0);
    });

    const pct = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
    const bar = document.getElementById('global-bar');
    const lbl = document.getElementById('global-pct');
    if (bar) bar.style.width = pct + '%';
    if (lbl) lbl.textContent = pct + '%';

    updateResetBtn();
  }

  updateProgress();

  resetBtn.addEventListener('click', () => {
    allItems.forEach(x => {
      x.li.classList.remove('checked');
      state[x.key] = false;
    });
    saveState();
    updateProgress();
  });

  /* TOC navigation */
  document.querySelectorAll('#toc-cl a').forEach(link => {
    link.addEventListener('click', () => {
      const el = document.getElementById(link.getAttribute('data-id'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Active TOC highlight */
  const sections = document.querySelectorAll('.section');
  const links    = document.querySelectorAll('#toc-cl a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`#toc-cl a[data-id="${e.target.id}"]`);
      if (a) a.classList.add('active');
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
})();
