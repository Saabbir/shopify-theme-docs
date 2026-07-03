/* checklist.js — page-specific behavior for the Development Checklist page.
   Theme, mobile nav, scrollspy, search, back-to-top, print, and deep-link flash
   are all handled generically by assets/js/site.js. */
(function () {
  const STORAGE_KEY = 'checklist-state';
  const resetBtn = document.getElementById('reset-checks-btn');

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

  document.querySelectorAll('.check-list.click-list[data-sec]').forEach(list => {
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
      const navA = document.querySelector(`#sidebar .toc-nav a[data-id="${sid}"]`);
      if (sp) sp.textContent = total ? `${done}/${total}` : '';
      if (sc) sc.innerHTML = `<strong>${done}</strong> / ${total} completed`;
      if (navA) navA.classList.toggle('sec-done', done === total && total > 0);
    });

    const pct = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
    const bar = document.getElementById('global-bar');
    const lbl = document.getElementById('global-pct');
    if (bar) bar.style.width = pct + '%';
    if (lbl) lbl.textContent = pct + '%';
  }

  updateProgress();

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!window.confirm('Reset all checklist progress?')) return;
      allItems.forEach(x => {
        x.li.classList.remove('checked');
        state[x.key] = false;
      });
      saveState();
      updateProgress();
    });
  }
})();
